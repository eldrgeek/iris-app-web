import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { config } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!config.stripe.enabled || !config.stripe.webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });

  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Get Clerk user_id from Supabase users table via stripe_customer_id
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) {
          console.warn(`No user found for Stripe customer ${customerId}`);
          break;
        }

        // Determine tier from metadata or price lookup
        const tier = (sub.metadata?.tier as string) ?? "listener";

        await supabase.from("user_subscriptions").upsert({
          user_id: user.id,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id ?? null,
          status: sub.status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        }, { onConflict: "stripe_subscription_id" });

        // Also update user tier
        await supabase
          .from("users")
          .update({ tier, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("user_subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);

        // Downgrade user to listener
        const customerId = sub.customer as string;
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
        if (user) {
          await supabase
            .from("users")
            .update({ tier: "listener", updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
