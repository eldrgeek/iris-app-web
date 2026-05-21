import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { config } from "@/lib/config";

interface Props {
  params: { courseId: string };
}

export async function POST(_req: Request, { params }: Props) {
  if (!config.supabase.enabled) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { courseId } = params;

  const { error } = await supabase
    .from("courses")
    .update({
      published_to_gallery: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(
    `${config.appUrl}/dashboard/courses/${courseId}?published=1`,
    303
  );
}
