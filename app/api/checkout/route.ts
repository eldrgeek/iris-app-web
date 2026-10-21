import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { requireUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  // Auth before anything else: demo mode -> 403, signed out -> 401.
  // A checkout must belong to a known user, or the Stripe webhook cannot
  // link the resulting subscription back to anyone.
  const user = await requireUser();
  if (!user.ok) return user.response;
  const userId = user.value;

  if (!config.stripe.enabled) {
    return NextResponse.json(
      { error: "Payments not configured. See MORNING-CHECKLIST.md for Stripe setup." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const tier = formData.get("tier") as string;
    const interval = formData.get("interval") as "month" | "year";

    const priceMap: Record<string, string> = {
      "practitioner-month": config.stripe.prices.practitionerMonthly,
      "practitioner-year": config.stripe.prices.practitionerAnnual,
      "scholar-month": config.stripe.prices.scholarMonthly,
      "scholar-year": config.stripe.prices.scholarAnnual,
    };

    const priceId = priceMap[`${tier}-${interval}`];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid tier or interval" }, { status: 400 });
    }

    // Reuse the Stripe customer the Clerk webhook created at signup, so the
    // subscription webhook (which looks users up by stripe_customer_id)
    // can find this user.
    let customerId: string | undefined;
    const supabase = createServiceClient();
    if (supabase) {
      const { data: row } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .maybeSingle();
      customerId = row?.stripe_customer_id ?? undefined;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,
      ...(customerId ? { customer: customerId } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.appUrl}/dashboard?upgraded=1`,
      cancel_url: `${config.appUrl}/pricing`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
        metadata: { tier, user_id: userId },
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("POST /api/checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
