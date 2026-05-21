import Link from "next/link";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";

function DashboardNav() {
  return (
    <nav className="border-b border-rule px-8 py-4">
      <div className="max-w-wide mx-auto flex justify-between items-baseline flex-wrap gap-3">
        <Link
          href="/"
          className="text-sm font-medium tracking-widest uppercase text-text no-underline hover:text-accent"
        >
          Iris
        </Link>
        <div className="flex items-baseline gap-6 text-sm">
          <Link href="/dashboard" className="text-text-mid no-underline hover:text-accent">
            My Courses
          </Link>
          <Link href="/gallery" className="text-text-dim no-underline hover:text-accent">
            Gallery
          </Link>
          <Link href="/pricing" className="text-text-dim no-underline hover:text-accent">
            Pricing
          </Link>
          {config.clerk.enabled ? (
            <Link href="/sign-in" className="text-text-dim no-underline hover:text-accent text-xs">
              Account
            </Link>
          ) : (
            <span className="text-xs italic text-text-dim">demo mode</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNav />
      <main className="max-w-wide mx-auto px-8 py-10 pb-20">{children}</main>
      <Footer />
    </>
  );
}
