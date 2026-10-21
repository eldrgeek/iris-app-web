import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase";
import { requireUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  // Auth before anything else: demo mode -> 403 (body carries demo: true so
  // the new-course page can send the visitor to the demo workspace),
  // signed out -> 401.
  const user = await requireUser();
  if (!user.ok) return user.response;

  if (!config.supabase.enabled) {
    return NextResponse.json(
      { error: "Database not configured. Add Supabase credentials to create courses." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { title, description, forWho } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const seedContext = [
      description ? `About: ${description}` : null,
      forWho ? `Audience: ${forWho}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await supabase
      .from("courses")
      .insert({
        user_id: user.value,
        title: title.trim(),
        description: description?.trim() || null,
        seed_context: seedContext || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("POST /api/courses error:", err);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
