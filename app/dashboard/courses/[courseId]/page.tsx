import Link from "next/link";
import { IrisWidget, IrisWidgetPlaceholder } from "@/components/iris-widget";
import { config } from "@/lib/config";
import { createServiceClient, type Course, type CurriculumArtifact } from "@/lib/supabase";

// Demo data shown when DB is not configured
const DEMO_COURSE: Course = {
  id: "demo",
  user_id: "demo",
  title: "Demo Course — Bioelectric Signaling",
  description: "How Michael Levin's work on bioelectricity is reframing our understanding of cognition and life.",
  seed_context: null,
  status: "active",
  published_to_gallery: false,
  published_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_ARTIFACTS: CurriculumArtifact[] = [
  {
    id: "a1",
    user_id: "demo",
    course_id: "demo",
    session_id: null,
    artifact_type: "outline",
    title: "Course outline (draft)",
    content_md:
      "## Week 1: What is bioelectricity?\n\nBioelectric signaling as a field. Key concepts: membrane potential, ion channels, body electric.\n\n## Week 2: Levin's framework\n\nMorphogenetic fields, planaria experiments, cancer as loss of bioelectric identity.\n\n## Week 3: Applications\n\nRegenerative medicine, xenobots, implications for AI.",
    status: "draft",
    rejected_reason: null,
    logged_to_disagreement_feed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface Props {
  params: { courseId: string };
}

export default async function CourseWorkspacePage({ params }: Props) {
  const { courseId } = params;
  const isDemo = courseId === "demo" || !config.supabase.enabled || !config.clerk.enabled;

  let course: Course = DEMO_COURSE;
  let artifacts: CurriculumArtifact[] = DEMO_ARTIFACTS;

  if (!isDemo) {
    const supabase = createServiceClient();
    if (supabase) {
      const [{ data: courseData }, { data: artifactData }] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase
          .from("curriculum_artifacts")
          .select("*")
          .eq("course_id", courseId)
          .order("created_at", { ascending: false }),
      ]);
      if (courseData) course = courseData as Course;
      if (artifactData) artifacts = artifactData as CurriculumArtifact[];
    }
  }

  const userId = isDemo ? "demo_user" : "user_placeholder";
  const remainingMinutes = 30;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-text-dim no-underline hover:text-accent"
        >
          &larr; My Courses
        </Link>
      </div>

      {/* Course header */}
      <div className="flex justify-between items-start gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-1">{course.title}</h1>
          {course.description && (
            <p className="text-sm text-text-dim">{course.description}</p>
          )}
        </div>
        {!isDemo && (
          <div className="flex gap-3 flex-shrink-0">
            {!course.published_to_gallery && (
              <form action={`/api/courses/${courseId}/publish`} method="POST">
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 border text-text-dim hover:text-accent"
                  style={{ borderColor: "var(--rule)", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Publish to gallery
                </button>
              </form>
            )}
            {course.published_to_gallery && (
              <span className="text-xs italic text-text-dim">Public in gallery</span>
            )}
          </div>
        )}
      </div>

      {/* Demo mode notice */}
      {isDemo && (
        <div
          className="mb-8 p-4 text-sm border"
          style={{ borderColor: "var(--rule)", background: "var(--bg-alt)", color: "var(--text-mid)" }}
        >
          <strong>Demo mode.</strong> This is a sample workspace showing the course workspace
          structure. The Iris widget below is live — you can talk to Iris. With Clerk + Supabase
          configured, sessions will persist and artifacts will accumulate here.
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* LEFT: Iris talk widget */}
        <div>
          <h2 className="text-lg font-medium mb-4">Talk with Iris</h2>
          <p className="text-xs text-text-dim mb-4">
            {remainingMinutes} conversation minutes remaining this month.
          </p>
          <IrisWidget
            userId={userId}
            courseId={courseId}
            remainingMinutes={remainingMinutes}
          />
          <p className="text-xs text-text-dim mt-3 leading-relaxed">
            Iris will ask about your course and help you develop it. After each session,
            artifacts (outline, reading list, session summary) appear on the right.
          </p>
        </div>

        {/* RIGHT: Artifacts */}
        <div>
          <h2 className="text-lg font-medium mb-4">Curriculum artifacts</h2>
          {artifacts.length === 0 ? (
            <div
              className="border p-8 text-center"
              style={{ borderColor: "var(--rule)" }}
            >
              <p className="text-sm text-text-dim">
                No artifacts yet. Have your first conversation with Iris — she&rsquo;ll
                build the first outline from what you tell her.
              </p>
            </div>
          ) : (
            <ul className="space-y-0">
              {artifacts.map((a) => (
                <li key={a.id} className="border-t py-5" style={{ borderColor: "var(--rule)" }}>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <span className="text-xs px-2 py-0.5 border mr-2 uppercase tracking-wide"
                        style={{ borderColor: "var(--rule)", color: "var(--text-dim)" }}>
                        {a.artifact_type.replace("_", " ")}
                      </span>
                      {a.title && (
                        <span className="text-sm font-medium text-text">{a.title}</span>
                      )}
                    </div>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{
                        color:
                          a.status === "accepted"
                            ? "#15803d"
                            : a.status === "rejected"
                            ? "#b91c1c"
                            : "var(--text-dim)",
                      }}
                    >
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs text-text-mid leading-relaxed whitespace-pre-wrap">
                    {a.content_md.slice(0, 400)}
                    {a.content_md.length > 400 && "…"}
                  </div>
                  {a.status === "draft" && !isDemo && (
                    <div className="flex gap-3 mt-3">
                      <form action={`/api/courses/${courseId}/artifacts/${a.id}/accept`} method="POST">
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 border hover:border-accent"
                          style={{ borderColor: "var(--rule)", cursor: "pointer", background: "transparent", fontFamily: "inherit", color: "var(--text)" }}
                        >
                          Accept
                        </button>
                      </form>
                      <form action={`/api/courses/${courseId}/artifacts/${a.id}/reject`} method="POST">
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 border hover:border-red-400"
                          style={{ borderColor: "var(--rule)", cursor: "pointer", background: "transparent", fontFamily: "inherit", color: "var(--text-dim)" }}
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
              <li className="border-t" style={{ borderColor: "var(--rule)" }} />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
