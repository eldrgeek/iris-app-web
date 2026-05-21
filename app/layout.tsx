import type { Metadata } from "next";
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
      <body>
        <ClerkProviderWrapper>{children}</ClerkProviderWrapper>
      </body>
    </html>
  );
}
