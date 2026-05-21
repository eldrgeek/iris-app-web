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
  ? clerkMiddleware((auth, req) => {
      if (isProtected(req)) auth().protect();
    })
  : demoMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
