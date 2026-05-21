import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!config.stripe.enabled) {
    return NextResponse.json(
      { error: "Payments not configured." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  try {
    // In production, get userId from Clerk auth()
    const userId = "demo_user"; // TODO: replace with auth().userId

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user" },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${config.appUrl}/dashboard`,
    });

    return NextResponse.redirect(portalSession.url, 303);
  } catch (err) {
    console.error("POST /api/portal error:", err);
    return NextResponse.json({ error: "Portal creation failed" }, { status: 500 });
  }
}
