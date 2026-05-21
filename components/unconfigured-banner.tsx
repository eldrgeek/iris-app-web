interface Props {
  service: "auth" | "database" | "payments";
  children?: React.ReactNode;
}

const messages: Record<Props["service"], { title: string; detail: string }> = {
  auth: {
    title: "Auth not configured",
    detail:
      "Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable sign-in. See MORNING-CHECKLIST.md for setup steps.",
  },
  database: {
    title: "Database not configured",
    detail:
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to connect to Supabase. See MORNING-CHECKLIST.md for setup steps.",
  },
  payments: {
    title: "Payments not configured",
    detail:
      "Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable subscriptions. See MORNING-CHECKLIST.md for setup steps.",
  },
};

export function UnconfiguredBanner({ service, children }: Props) {
  const msg = messages[service];
  return (
    <div className="bg-bg-alt border border-rule p-6 rounded-none">
      <p className="text-sm font-medium text-text mb-1">{msg.title}</p>
      <p className="text-xs text-text-dim leading-relaxed">{msg.detail}</p>
      {children}
    </div>
  );
}
