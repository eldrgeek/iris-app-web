import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!config.supabase.enabled || !config.clerk.enabled) {
    return NextResponse.json(
      {
        error:
          "Service not configured. Add Supabase and Clerk credentials to create courses.",
        id: "demo",
      },
      { status: 200 } // return 200 so demo mode redirects to /dashboard/courses/demo
    );
  }

  try {
    const body = await req.json();
    const { title, description, forWho } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // In production, get userId from Clerk auth() here
    // const { userId } = auth();
    // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // TODO: replace 'demo_user' with actual userId from Clerk
    const userId = "demo_user";

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
        user_id: userId,
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
