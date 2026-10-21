import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

// Shared guards for mutating API routes (bead es-hk5, 2026-10-21).
//
// Rules every mutating route follows:
//   1. Auth runs FIRST, before any config check, so an unauthenticated
//      request is refused the same way whatever is configured.
//   2. Demo mode (no Clerk keys) refuses with 403. There is no caller
//      identity in demo mode, so nothing may be written on anyone's behalf.
//   3. Clerk enabled but no session -> 401.
//   4. Routes that act on a course also require course.user_id === caller.
//
// Webhook routes (/api/webhooks/*) are authenticated by signature instead
// (svix for Clerk, stripe-signature for Stripe) and do not use these guards.

export type Guard<T> = { ok: true; value: T } | { ok: false; response: NextResponse };

export async function requireUser(): Promise<Guard<string>> {
  if (!config.clerk.enabled) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Sign-in is not configured (demo mode), so this action is disabled.",
          demo: true,
        },
        { status: 403 }
      ),
    };
  }
  const { userId } = await auth();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, value: userId };
}

export async function requireCourseOwner(
  supabase: SupabaseClient,
  courseId: string,
  userId: string
): Promise<Guard<{ id: string; user_id: string }>> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, user_id")
    .eq("id", courseId)
    .maybeSingle();
  if (error) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Database error" }, { status: 500 }),
    };
  }
  if (!data) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Course not found" }, { status: 404 }),
    };
  }
  if (data.user_id !== userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, value: data };
}
