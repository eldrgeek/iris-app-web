import Link from "next/link";
import { UnconfiguredBanner } from "@/components/unconfigured-banner";
import { config } from "@/lib/config";
import { createServiceClient, type Course } from "@/lib/supabase";

async function getCoursesForDemo(): Promise<Course[]> {
  // Demo mode: return empty list so the empty state renders cleanly
  return [];
}

export default async function DashboardPage() {
  const dbEnabled = config.supabase.enabled;
  const authEnabled = config.clerk.enabled;

  let courses: Course[] = [];
  // In production, courses would be fetched using the authenticated user_id.
  // In demo mode we show empty state so users understand the structure.
  if (dbEnabled && authEnabled) {
    // Real fetch would go here after auth integration:
    // const { userId } = auth();
    // const supabase = createServiceClient();
    // const { data } = await supabase.from('courses').select('*').eq('user_id', userId);
    // courses = data ?? [];
    courses = await getCoursesForDemo();
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-8">
        <h1 className="text-3xl font-light tracking-tight">My Courses</h1>
        <Link
          href="/dashboard/courses/new"
          className="inline-block px-5 py-2 text-sm no-underline"
          style={{ background: "var(--accent)", color: "#f8f5ef" }}
        >
          + New course
        </Link>
      </div>

      {!authEnabled && (
        <div className="mb-6">
          <UnconfiguredBanner service="auth" />
        </div>
      )}

      {!dbEnabled && (
        <div className="mb-6">
          <UnconfiguredBanner service="database" />
        </div>
      )}

      {dbEnabled && authEnabled && courses.length === 0 && (
        <div className="border border-rule p-12 text-center">
          <p className="text-text-mid mb-2">No courses yet.</p>
          <p className="text-sm text-text-dim mb-6">
            Start by telling Iris what you want to teach.
          </p>
          <Link
            href="/dashboard/courses/new"
            className="inline-block px-6 py-2.5 text-sm no-underline"
            style={{ background: "var(--accent)", color: "#f8f5ef" }}
          >
            Start your first course &rarr;
          </Link>
        </div>
      )}

      {(!dbEnabled || !authEnabled) && (
        <div className="border border-rule p-12 text-center">
          <p className="text-text-mid mb-2">Demo mode — no live data.</p>
          <p className="text-sm text-text-dim mb-6 max-w-md mx-auto">
            Once Clerk and Supabase are configured, your courses will appear here.
            Each course becomes a curriculum workspace where you talk with Iris and
            review the artifacts she builds.
          </p>
          <Link
            href="/dashboard/courses/new"
            className="inline-block px-6 py-2.5 text-sm no-underline"
            style={{ background: "var(--accent)", color: "#f8f5ef" }}
          >
            Try the course workspace &rarr;
          </Link>
        </div>
      )}

      {courses.length > 0 && (
        <ul className="space-y-0">
          {courses.map((course) => (
            <li key={course.id} className="border-t border-rule py-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="font-medium text-text no-underline hover:text-accent"
                  >
                    {course.title}
                  </Link>
                  {course.description && (
                    <p className="text-sm text-text-dim mt-1">{course.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {course.published_to_gallery && (
                    <span className="text-xs text-text-dim italic">public</span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 border"
                    style={{
                      borderColor: "var(--rule)",
                      color: "var(--text-dim)",
                    }}
                  >
                    {course.status}
                  </span>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="text-sm no-underline hover:text-accent"
                    style={{ color: "var(--accent)" }}
                  >
                    Open &rarr;
                  </Link>
                </div>
              </div>
            </li>
          ))}
          <li className="border-t border-rule" />
        </ul>
      )}
    </div>
  );
}
