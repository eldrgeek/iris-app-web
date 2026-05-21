import Link from "next/link";

interface NavProps {
  showAuth?: boolean;
}

export function Nav({ showAuth = true }: NavProps) {
  return (
    <nav className="border-b border-rule px-8 py-5">
      <div className="max-w-content mx-auto flex justify-between items-baseline flex-wrap gap-3">
        <Link
          href="/"
          className="text-sm font-medium tracking-widest uppercase text-text no-underline hover:text-accent"
        >
          Iris
        </Link>
        <div className="flex items-baseline gap-6 text-sm text-text-dim">
          <span className="text-xs tracking-wide">
            a department of{" "}
            <a
              href="https://siliconchildren.org"
              className="text-text-dim hover:text-accent"
            >
              Silicon Children University
            </a>
          </span>
          {showAuth && (
            <div className="flex gap-4">
              <Link href="/gallery" className="hover:text-accent text-text-dim no-underline">
                Gallery
              </Link>
              <Link href="/pricing" className="hover:text-accent text-text-dim no-underline">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-accent text-text-dim no-underline">
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
