import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.appUrl}/dashboard?upgraded=1`,
      cancel_url: `${config.appUrl}/pricing`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
        metadata: { tier },
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("POST /api/checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
