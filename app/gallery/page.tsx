import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";
import { createServiceClient, type Course } from "@/lib/supabase";

const DEMO_COURSES: Course[] = [
  {
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
  },
];

export default async function GalleryPage() {
  let courses: Course[] = DEMO_COURSES;

  if (config.supabase.enabled) {
    const supabase = createServiceClient();
    if (supabase) {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("published_to_gallery", true)
        .order("published_at", { ascending: false });
      if (data && data.length > 0) courses = data as Course[];
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-wide mx-auto px-8 py-16 pb-24">
        <div className="flex justify-between items-baseline mb-3">
          <h1 className="text-3xl font-light tracking-tight">Curriculum gallery</h1>
          <span className="text-sm text-text-dim">{courses.length} published</span>
        </div>
        <p className="text-sm italic text-text-dim mb-12 max-w-2xl">
          Courses built with Iris, published by their instructors. Browse to see what the
          curriculum-building practice looks like across subjects.
        </p>

        {!config.supabase.enabled && (
          <div
            className="mb-8 p-4 border text-sm"
            style={{ borderColor: "var(--rule)", background: "var(--bg-alt)", color: "var(--text-mid)" }}
          >
            <strong>Demo mode</strong> — showing sample curriculum. Configure Supabase to show
            real published courses.
          </div>
        )}

        {courses.length === 0 ? (
          <div className="border p-12 text-center" style={{ borderColor: "var(--rule)" }}>
            <p className="text-text-mid mb-2">No curricula published yet.</p>
            <p className="text-sm text-text-dim mb-6">
              Build a course with Iris and publish it here when you&rsquo;re ready to share.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-6 py-2.5 text-sm no-underline"
              style={{ background: "var(--accent)", color: "#f8f5ef" }}
            >
              Adopt Iris &rarr;
            </Link>
          </div>
        ) : (
          <ul className="space-y-0">
            {courses.map((course) => (
              <li key={course.id} className="border-t py-6" style={{ borderColor: "var(--rule)" }}>
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <Link
                      href={`/gallery/${course.id}`}
                      className="text-lg font-medium text-text no-underline hover:text-accent"
                    >
                      {course.title}
                    </Link>
                    {course.description && (
                      <p className="text-sm text-text-mid mt-2 max-w-2xl leading-relaxed">
                        {course.description}
                      </p>
                    )}
                    {course.published_at && (
                      <p className="text-xs text-text-dim mt-3">
                        Published {new Date(course.published_at).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/gallery/${course.id}`}
                    className="text-sm no-underline flex-shrink-0 hover:text-accent"
                    style={{ color: "var(--accent)" }}
                  >
                    View &rarr;
                  </Link>
                </div>
              </li>
            ))}
            <li className="border-t" style={{ borderColor: "var(--rule)" }} />
          </ul>
        )}

        <div className="mt-12 border-t pt-8 text-center" style={{ borderColor: "var(--rule)" }}>
          <p className="text-sm text-text-dim mb-4">
            Want your curriculum in this gallery?
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-6 py-2.5 text-sm no-underline"
            style={{ background: "var(--accent)", color: "#f8f5ef" }}
          >
            Adopt Iris →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
