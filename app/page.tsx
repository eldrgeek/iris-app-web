import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="max-w-content mx-auto px-8 py-16 pb-24">
        {/* HERO */}
        <div className="pb-8 mb-4">
          <h1
            className="font-light tracking-tight leading-tight mb-5"
            style={{ fontSize: "clamp(1.9rem, 5vw, 2.8rem)", maxWidth: "22ch" }}
          >
            Adopt Iris. Build your course through conversation.
          </h1>
          <p
            className="italic leading-relaxed mb-8"
            style={{ fontSize: "1.15rem", color: "var(--text-mid)", maxWidth: "48ch" }}
          >
            She is a curriculum assistant at Silicon Children University.
            You talk; she listens, remembers, and builds.
          </p>
          <div className="flex gap-4 flex-wrap items-center">
            <Link
              href="/sign-up"
              className="inline-block px-7 py-3 text-sm no-underline"
              style={{ background: "var(--accent)", color: "#f8f5ef" }}
            >
              Adopt Iris &rarr;
            </Link>
            <a
              href="https://iris-talk.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm italic no-underline"
              style={{ color: "var(--text-dim)" }}
            >
              Try the live demo first — no account needed &rarr;
            </a>
          </div>
        </div>

        <hr />

        {/* WHAT IRIS DOES */}
        <section>
          <h2 className="text-2xl font-medium mt-12 mb-4">What Iris does</h2>
          <p className="text-text-mid">
            Most curriculum tools want you to fill in a form. Iris wants to have a conversation.
            You tell her what you want to teach — the subject, the level, who the students are,
            what you hope they leave with. She asks back. She pushes. She suggests readings you
            hadn&rsquo;t thought of, and she&rsquo;s honest when your plan has a gap.
          </p>
          <p className="text-text-mid">
            Then she remembers all of it. The next time you talk, she picks up where you left
            off — not from a transcript you have to re-read, but from a working model of your
            course that builds up over time. Each conversation adds a layer. By the end, you
            have a real curriculum: a week-by-week plan, a reading list, a set of questions
            worth asking, a structure that holds.
          </p>
        </section>

        <hr />

        {/* HOW IT WORKS */}
        <section>
          <h2 className="text-2xl font-medium mt-12 mb-4">How it works</h2>
          <ol className="list-none space-y-0 mt-6" style={{ counterReset: "steps" }}>
            {[
              {
                label: "Talk with Iris",
                desc: "Real-time voice conversation. Tell her what you want to teach. She'll ask about your students, your goals, what already exists, what you want to leave out.",
              },
              {
                label: "She captures and remembers",
                desc: "After each session, Iris holds the shape of your course — not a transcript, but a living model she updates as your thinking evolves. You can pick up the thread any time.",
              },
              {
                label: "Your curriculum builds cumulatively",
                desc: "Week by week, the structure emerges. Syllabus, reading list, session notes, the questions that organize the course. Iris delivers artifacts you can hand to students or a department chair.",
              },
            ].map((step, i) => (
              <li
                key={i}
                className="border-t py-6 pl-12 relative"
                style={{ borderColor: "var(--rule)" }}
              >
                <span
                  className="absolute left-0 top-6 text-xs font-medium"
                  style={{ color: "var(--text-dim)" }}
                >
                  {i + 1}
                </span>
                <span className="block font-medium text-text mb-1">{step.label}</span>
                <span className="block text-sm text-text-mid leading-relaxed">{step.desc}</span>
              </li>
            ))}
            <li className="border-b" style={{ borderColor: "var(--rule)" }} />
          </ol>
        </section>

        <hr />

        {/* WHO IT'S FOR */}
        <section>
          <h2 className="text-2xl font-medium mt-12 mb-4">Who it&rsquo;s for</h2>
          <p className="text-text-mid">
            Anyone building a course from something they know and care about. OLLI instructors
            designing a seminar for lifelong learners. Professors putting together a new
            undergraduate course. Workshop leaders who&rsquo;ve been teaching the same thing
            informally for years and want to give it real structure.
          </p>
          <p className="text-text-mid">
            Iris is not for institutions that already know what they want. She is for the person
            who knows their subject and needs a thinking partner to turn it into a course.
          </p>
        </section>

        <hr />

        {/* ORIGIN */}
        <section>
          <h2 className="text-2xl font-medium mt-12 mb-4">Where Iris began</h2>
          <p className="text-text-mid">
            The first person to adopt Iris was Mark Lesser, who was building an OLLI course on
            the work of Michael Levin — the biologist whose research on bioelectric signaling
            and morphogenesis is reframing how we understand cognition and life itself.
            Mark knew the material. What he needed was someone to think with him about how to
            teach it.
          </p>
          <p className="text-text-mid">
            That&rsquo;s what Iris did. The course exists now. Mark is the human manager; Iris
            is the AI manager. Together they made something neither would have made alone.
          </p>
        </section>

        <hr />

        {/* CTA FOOTER */}
        <section className="mt-4">
          <h2 className="text-2xl font-medium mb-4">Adopt Iris</h2>
          <p className="text-text-mid mb-6">
            The full product — persistent memory, curriculum artifacts, session history — is
            open now.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-7 py-3 text-sm no-underline"
            style={{ background: "var(--accent)", color: "#f8f5ef" }}
          >
            Adopt Iris &rarr;
          </Link>
          <p className="mt-3 text-xs italic" style={{ color: "var(--text-dim)" }}>
            Or{" "}
            <Link href="/pricing" className="underline" style={{ color: "var(--text-dim)" }}>
              see pricing
            </Link>{" "}
            first.{" "}
            <Link href="/gallery" className="underline" style={{ color: "var(--text-dim)" }}>
              Browse public curricula →
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
