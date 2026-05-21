import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

// Browser / RSC client (anon key, RLS enforced)
export function createBrowserClient() {
  if (!config.supabase.enabled) return null;
  return createClient(config.supabase.url, config.supabase.anonKey);
}

// Server-only client (service role, bypasses RLS — use only in API routes/webhooks)
export function createServiceClient() {
  if (!config.supabase.enabled || !config.supabase.serviceRoleKey) return null;
  return createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// Types matching the Phase 1 schema
export type Tier = "listener" | "practitioner" | "scholar";
export type CourseStatus = "active" | "paused" | "archived";
export type ArtifactType =
  | "outline"
  | "syllabus"
  | "reading_list"
  | "session_summary"
  | "decision_log"
  | "week_plan"
  | "open_questions"
  | "other";
export type ArtifactStatus = "draft" | "accepted" | "rejected" | "published";

export interface IrisUser {
  id: string;
  email: string;
  display_name: string | null;
  tier: Tier;
  stripe_customer_id: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  seed_context: string | null;
  status: CourseStatus;
  published_to_gallery: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  course_id: string;
  elevenlabs_conversation_id: string;
  title: string | null;
  duration_mins: number | null;
  turn_count: number | null;
  transcript_md: string | null;
  started_at: string | null;
  captured_at: string;
  synthesized_at: string | null;
  created_at: string;
}

export interface CurriculumArtifact {
  id: string;
  user_id: string;
  course_id: string;
  session_id: string | null;
  artifact_type: ArtifactType;
  title: string | null;
  content_md: string;
  status: ArtifactStatus;
  rejected_reason: string | null;
  logged_to_disagreement_feed: boolean;
  created_at: string;
  updated_at: string;
}
