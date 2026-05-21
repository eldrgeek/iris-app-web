import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule px-8 py-8 mt-16 text-center">
      <p className="text-xs text-text-dim">
        Iris &mdash; a department of{" "}
        <a
          href="https://siliconchildren.org"
          className="text-text-dim hover:text-accent"
        >
          Silicon Children University
        </a>{" "}
        &mdash; directed by{" "}
        <Link href="/about" className="text-text-dim hover:text-accent">
          Mark Lesser
        </Link>{" "}
        &amp; Mike Wolf
      </p>
    </footer>
  );
}
