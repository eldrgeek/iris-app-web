export const config = {
  clerk: {
    enabled:
      !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !!process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  supabase: {
    enabled:
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
  stripe: {
    enabled:
      !!process.env.STRIPE_SECRET_KEY &&
      !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    prices: {
      practitionerMonthly:
        process.env.STRIPE_PRICE_PRACTITIONER_MONTHLY ?? "",
      practitionerAnnual: process.env.STRIPE_PRICE_PRACTITIONER_ANNUAL ?? "",
      scholarMonthly: process.env.STRIPE_PRICE_SCHOLAR_MONTHLY ?? "",
      scholarAnnual: process.env.STRIPE_PRICE_SCHOLAR_ANNUAL ?? "",
    },
  },
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL ?? "https://iris-app.netlify.app",
  elevenLabs: {
    agentId: "agent_3001ks381kjsf8xsr9a61940gt7d",
  },
};
