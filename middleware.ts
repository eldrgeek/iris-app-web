import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher(["/dashboard(.*)"]);

// If Clerk keys are absent (demo mode), allow all routes through
const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const demoMiddleware = (_req: any) => NextResponse.next();

export default clerkEnabled
  ? clerkMiddleware(
      async (auth, req) => {
        if (isProtected(req)) await auth.protect();
      },
      // Send signed-out visitors to this app's own /sign-in page, not the
      // Clerk-hosted Account Portal (the ClerkProvider props are client-only).
      { signInUrl: "/sign-in", signUpUrl: "/sign-up" }
    )
  : demoMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
