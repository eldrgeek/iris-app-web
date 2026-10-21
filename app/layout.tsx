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

const HEAD_COMMENT_STRIP =
  "(function(){var h=document.head;if(!h)return;for(var n=h.firstChild;n;){var x=n.nextSibling;if(n.nodeType===8)h.removeChild(n);n=x}})();";

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
        {/* es-w1b: on the production domain Netlify inserts an HTML comment
            ("This site is hosted on Netlify...") into <head> after the server
            render. React 18 then sees a node it did not render, throws #418/#423,
            and re-renders the whole document on the client, which also wipes
            the feedback chip. This runs at parse time, before hydration, and
            removes comment nodes that sit directly in <head>. React never
            renders comments there, so nothing React owns is touched. */}
        <script
          dangerouslySetInnerHTML={{ __html: HEAD_COMMENT_STRIP }}
        />
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
