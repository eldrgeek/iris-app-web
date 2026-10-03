import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";

export const metadata: Metadata = {
  title: "Iris — Build your course through conversation",
  description:
    "Iris is a curriculum assistant at Silicon Children University. Talk with her, and she helps you build a course — syllabus, week-by-week plans, reading lists — cumulatively, conversation by conversation.",
  openGraph: {
    siteName: "Iris — Silicon Children University",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* SOMA feedback chip, same-origin (SOMA/standards/soma-feedback-proxy):
            assets in public/vendor/soma-feedback/, submissions through
            netlify/functions/soma-feedback.js. */}
        <link rel="stylesheet" href="/vendor/soma-feedback/soma-feedback.css" />
      </head>
      <body>
        <ClerkProviderWrapper>{children}</ClerkProviderWrapper>
        <Script
          src="/vendor/soma-feedback/soma-feedback.js"
          data-endpoint="/.netlify/functions/soma-feedback"
          data-site="iris-app-web"
          data-no-google=""
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
