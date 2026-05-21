import Stripe from "stripe";
import { config } from "./config";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!config.stripe.enabled) return null;
  if (!_stripe) {
    _stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}

export const TIERS = {
  listener: {
    name: "Listener",
    price: 0,
    description: "Free — one course, 30 min/month",
    features: [
      "1 course",
      "30 conversation minutes/month",
      "Iris remembers last 3 sessions",
      "Read-only community access",
      'Artifacts watermarked "Built with Iris at SCU"',
    ],
  },
  practitioner: {
    name: "Practitioner",
    priceMonthly: 19,
    priceAnnual: 190,
    description: "For educators building real courses",
    features: [
      "Unlimited courses",
      "200 conversation minutes/month",
      "Full KB accumulation",
      "Full community access — post, gallery, disagreement log",
      "Stripe Customer Portal for self-service",
      "Priority email support",
    ],
  },
  scholar: {
    name: "Scholar",
    priceMonthly: 39,
    priceAnnual: 390,
    description: "For committed course builders",
    features: [
      "Everything in Practitioner",
      "Unlimited conversation minutes",
      "1 Mark Lesser office hours slot/month (add'l at $25/slot)",
      "Early access to new SCU tools",
      "Optional highlight in community gallery",
    ],
  },
} as const;
