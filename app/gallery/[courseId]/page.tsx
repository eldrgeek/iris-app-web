import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";
import {
  createServiceClient,
  type Course,
  type CurriculumArtifact,
} from "@/lib/supabase";

// Demo data
const DEMO_COURSE: Course = {
  id: "demo-1",
  user_id: "user_mark_lesser_seed",
  title: "The Biology of Mind: Levin and Bioelectric Intelligence",
  description:
    "An OLLI seminar exploring Michael Levin's research on how bioelectric fields orchestrate morphogenesis, memory, and cognition in non-neural systems.",
  seed_context: null,
  status: "active",
  published_to_gallery: true,
  published_at: new Date("2026-05-15").toISOString(),
  created_at: new Date("2026-04-01").toISOString(),
  updated_at: new Date("2026-05-15").toISOString(),
};

const DEMO_ARTIFACTS: CurriculumArtifact[] = [
  {
    id: "a1",
    user_id: "demo",
    course_id: "demo-1",
    session_id: null,
    artifact_type: "outline",
    title: "Course outline",
    content_md:
      "## Week 1: What is bioelectricity?\n\nBioelectric signaling as a field. Key concepts: membrane potential, ion channels, body electric.\n\n## Week 2: Levin's framework\n\nMorphogenetic fields, planaria experiments, cancer as loss of bioelectric identity.\n\n## Week 3: The cognitive lens\n\nWhat does it mean for a non-neural system to \"remember\"? Goal-directedness in biology.\n\n## Week 4: Applications and implications\n\nRegenerative medicine, xenobots, AI analogies. What should we do with this knowledge?",
    status: "accepted",
    rejected_reason: null,
    logged_to_disagreement_feed: false,
    created_at: new Date("2026-04-20").toISOString(),
    updated_at: new Date("2026-04-20").toISOString(),
  },
  {
    id: "a2",
    user_id: "demo",
    course_id: "demo-1",
    session_id: null,
    artifact_type: "reading_list",
    title: "Recommended readings",
    content_md:
      "- Levin, M. (2023). *Darwin's agentive organisms*. Cognitive Science.\n- Fields, C. & Levin, M. (2022). *Competency in navigating arbitrary spaces.* Entropy.\n- Rosen, R. (1991). *Life Itself.* Columbia University Press. (background)\n- Shapiro, J. (2011). *Evolution: A View from the 21st Century.* FT Press.",
    status: "accepted",
    rejected_reason: null,
    logged_to_disagreement_feed: false,
    created_at: new Date("2026-04-25").toISOString(),
    updated_at: new Date("2026-04-25").toISOString(),
  },
];

interface Props {
  params: { courseId: string };
}

export default async function GalleryCourseViewPage({ params }: Props) {
  const { courseId } = params;
  const isDemo = courseId === "demo-1" || !config.supabase.enabled;

  let course: Course | null = isDemo ? DEMO_COURSE : null;
  let artifacts: CurriculumArtifact[] = isDemo ? DEMO_ARTIFACTS : [];

  if (!isDemo && config.supabase.enabled) {
    const supabase = createServiceClient();
    if (supabase) {
      const [{ data: courseData }, { data: artifactData }] = await Promise.all([
        supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .eq("published_to_gallery", true)
          .single(),
        supabase
          .from("curriculum_artifacts")
          .select("*")
          .eq("course_id", courseId)
          .eq("status", "published")
          .order("created_at"),
      ]);
      course = (courseData as Course) ?? null;
      artifacts = (artifactData as CurriculumArtifact[]) ?? [];
    }
  }

  if (!course) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-content mx-auto px-8 py-16 pb-24">
        <div className="mb-8">
          <Link
            href="/gallery"
            className="text-sm text-text-dim no-underline hover:text-accent"
          >
            &larr; Gallery
          </Link>
        </div>

        <h1
          className="font-light tracking-tight mb-3"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.2 }}
        >
          {course.title}
        </h1>
        {course.description && (
          <p className="text-text-mid italic mb-6">{course.description}</p>
        )}
        {course.published_at && (
          <p className="text-xs text-text-dim mb-10">
            Published{" "}
            {new Date(course.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {artifacts.length === 0 ? (
          <p className="text-sm text-text-dim">
            No artifacts published yet for this course.
          </p>
        ) : (
          <ul className="space-y-0">
            {artifacts.map((a) => (
              <li
                key={a.id}
                className="border-t py-8"
                style={{ borderColor: "var(--rule)" }}
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="text-xs uppercase tracking-wide border px-2 py-0.5"
                    style={{ borderColor: "var(--rule)", color: "var(--text-dim)" }}
                  >
                    {a.artifact_type.replace("_", " ")}
                  </span>
                  {a.title && (
                    <span className="text-base font-medium text-text">
                      {a.title}
                    </span>
                  )}
                </div>
                <div className="text-sm text-text-mid leading-relaxed whitespace-pre-wrap">
                  {a.content_md}
                </div>
              </li>
            ))}
            <li className="border-t" style={{ borderColor: "var(--rule)" }} />
          </ul>
        )}

        <div
          className="mt-10 pt-8 border-t text-center"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="text-sm text-text-dim mb-4">
            Want to build a curriculum like this?
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-6 py-2.5 text-sm no-underline"
            style={{ background: "var(--accent)", color: "#f8f5ef" }}
          >
            Adopt Iris &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
