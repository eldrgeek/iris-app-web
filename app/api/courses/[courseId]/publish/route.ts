import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { config } from "@/lib/config";
import { requireCourseOwner, requireUser } from "@/lib/api-auth";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function POST(_req: Request, { params }: Props) {
  // Auth before anything else: demo mode -> 403, signed out -> 401.
  const user = await requireUser();
  if (!user.ok) return user.response;

  if (!config.supabase.enabled) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { courseId } = await params;

  // The service-role client bypasses RLS, so ownership is checked here.
  const owned = await requireCourseOwner(supabase, courseId, user.value);
  if (!owned.ok) return owned.response;

  const { error } = await supabase
    .from("courses")
    .update({
      published_to_gallery: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .eq("user_id", user.value);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(
    `${config.appUrl}/dashboard/courses/${courseId}?published=1`,
    303
  );
}
