"use client";
import { ClerkProvider } from "@clerk/nextjs";

const clerkEnabled =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!clerkEnabled) {
    return <>{children}</>;
  }
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
