import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { config } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

interface ClerkUserCreatedEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export async function POST(req: Request) {
  if (!config.clerk.enabled) {
    return NextResponse.json({ error: "Clerk not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await req.text();
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  let event: ClerkUserCreatedEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    );
    const email = primaryEmail?.email_address ?? "";
    const displayName =
      [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    await supabase.from("users").upsert(
      {
        id: data.id,
        email,
        display_name: displayName,
        tier: "listener",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id", ignoreDuplicates: false }
    );
  }

  if (type === "user.deleted") {
    // Cascade delete via FK constraints in schema.sql (ON DELETE CASCADE)
    await supabase.from("users").delete().eq("id", data.id);
  }

  return NextResponse.json({ received: true });
}
