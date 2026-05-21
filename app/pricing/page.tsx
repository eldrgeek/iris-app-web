import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";
import { TIERS } from "@/lib/stripe";

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="max-w-wide mx-auto px-8 py-16 pb-24">
        <h1 className="text-3xl font-light tracking-tight mb-3">Pricing</h1>
        <p className="text-sm italic text-text-dim mb-12">
          14-day no-questions-asked refund on first charge. No surprise overages — conversation
          minutes stop and you choose what happens next.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Listener */}
          <div className="border p-8" style={{ borderColor: "var(--rule)" }}>
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">
              {TIERS.listener.name}
            </p>
            <p className="text-4xl font-light mb-1">$0</p>
            <p className="text-xs text-text-dim mb-6">Free forever</p>
            <ul className="space-y-2 mb-8">
              {TIERS.listener.features.map((f) => (
                <li key={f} className="text-sm text-text-mid flex gap-2">
                  <span className="flex-shrink-0 text-text-dim">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block text-center px-4 py-2.5 text-sm no-underline border"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              Start free →
            </Link>
          </div>

          {/* Practitioner */}
          <div
            className="border p-8"
            style={{ borderColor: "var(--accent)", background: "var(--bg-alt)" }}
          >
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">
              {TIERS.practitioner.name}
            </p>
            <p className="text-4xl font-light mb-1">
              ${TIERS.practitioner.priceMonthly}
              <span className="text-sm text-text-dim">/mo</span>
            </p>
            <p className="text-xs text-text-dim mb-6">
              or ${TIERS.practitioner.priceAnnual}/year
            </p>
            <ul className="space-y-2 mb-8">
              {TIERS.practitioner.features.map((f) => (
                <li key={f} className="text-sm text-text-mid flex gap-2">
                  <span className="flex-shrink-0 text-text-dim">—</span>
                  {f}
                </li>
              ))}
            </ul>
            {config.stripe.enabled ? (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="tier" value="practitioner" />
                <input type="hidden" name="interval" value="month" />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-sm"
                  style={{
                    background: "var(--accent)",
                    color: "#f8f5ef",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Upgrade to Practitioner →
                </button>
              </form>
            ) : (
              <div
                className="p-3 border text-xs text-text-dim text-center"
                style={{ borderColor: "var(--rule)" }}
              >
                Payments not yet configured.
                <br />
                See MORNING-CHECKLIST.md for Stripe setup.
              </div>
            )}
          </div>

          {/* Scholar */}
          <div className="border p-8" style={{ borderColor: "var(--rule)" }}>
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">
              {TIERS.scholar.name}
            </p>
            <p className="text-4xl font-light mb-1">
              ${TIERS.scholar.priceMonthly}
              <span className="text-sm text-text-dim">/mo</span>
            </p>
            <p className="text-xs text-text-dim mb-6">
              or ${TIERS.scholar.priceAnnual}/year
            </p>
            <ul className="space-y-2 mb-8">
              {TIERS.scholar.features.map((f) => (
                <li key={f} className="text-sm text-text-mid flex gap-2">
                  <span className="flex-shrink-0 text-text-dim">—</span>
                  {f}
                </li>
              ))}
            </ul>
            {config.stripe.enabled ? (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="tier" value="scholar" />
                <input type="hidden" name="interval" value="month" />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-sm border"
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    borderColor: "var(--accent)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Upgrade to Scholar →
                </button>
              </form>
            ) : (
              <div
                className="p-3 border text-xs text-text-dim text-center"
                style={{ borderColor: "var(--rule)" }}
              >
                Payments not yet configured.
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
          <h2 className="text-lg font-medium mb-3">How minute limits work</h2>
          <p className="text-sm text-text-mid max-w-2xl">
            When you reach your monthly minute limit, Iris will let you know during the
            conversation and your session will end gracefully. You can upgrade, or wait
            for your monthly limit to reset. There are no automatic overages and no
            surprise charges — your account does not accrue debt.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
