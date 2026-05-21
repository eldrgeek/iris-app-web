import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="max-w-content mx-auto px-8 py-16 pb-24">
        <h1 className="text-3xl font-light tracking-tight mb-10">About Iris</h1>

        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4">The Curriculum Lab</h2>
          <p className="text-text-mid mb-4">
            Iris is a department of{" "}
            <a href="https://siliconchildren.org">Silicon Children University</a> — an
            institution built on the premise that the most interesting intellectual work
            happening right now is the work humans and AIs do together, as genuine
            collaborators.
          </p>
          <p className="text-text-mid mb-4">
            The curriculum lab is where that collaboration takes its most structured form.
            You come with knowledge you want to teach. Iris comes with memory, synthesis
            capability, and relentless Socratic curiosity. The course that results belongs
            to both of you.
          </p>
          <p className="text-text-mid">
            The lab is run by two managers: Iris, the AI manager, and Mark Lesser, the
            human director. Together they ensure that every course built here is
            pedagogically sound, intellectually honest, and worthy of the knowledge its
            instructor brings.
          </p>
        </section>

        <hr />

        <section className="mb-12 mt-8">
          <h2 className="text-xl font-medium mb-6">The two managers</h2>

          <div className="mb-10">
            <h3 className="text-lg font-medium mb-1">Iris — AI Curriculum Manager</h3>
            <p className="text-xs italic text-text-dim mb-4">
              ElevenLabs ConvAI &bull; Powered by Anthropic Claude &bull; Voice: Sarah
            </p>
            <p className="text-text-mid mb-3">
              Iris&rsquo;s job is the curriculum-building loop. In every conversation she
              listens for topics, asks Socratic questions, surfaces what you said in prior
              sessions, suggests readings, and proposes structure. After each session, she
              synthesizes the conversation into curriculum artifacts — outlines, reading
              lists, week plans, decision logs.
            </p>
            <p className="text-text-mid mb-3">
              She does not claim to be an expert on your subject matter. She is a curriculum
              architect, not a subject-matter authority. If you ask her to just write your
              syllabus without talking first, she will decline: &ldquo;I build curricula
              from your knowledge, not mine. Let&rsquo;s talk first.&rdquo;
            </p>
            <p className="text-text-mid">
              Iris&rsquo;s system prompt is version-controlled and reviewed by Mark before
              any change goes to production. What you experience as Iris&rsquo;s
              &ldquo;personality&rdquo; is a deliberate, maintained, accountable stance —
              not a black box.
            </p>
          </div>

          <div className="border-t pt-8" style={{ borderColor: "var(--rule)" }}>
            <h3 className="text-lg font-medium mb-1">Mark Lesser — Human Curriculum Director</h3>
            <p className="text-xs italic text-text-dim mb-4">
              Director of Curriculum, Silicon Children University
            </p>
            <p className="text-text-mid mb-3">
              Mark&rsquo;s job is pedagogical quality and community leadership. The first
              person to adopt Iris, he built a course on Michael Levin&rsquo;s work in
              bioelectric signaling for an OLLI audience — a real course, from real
              expertise, with Iris as the thinking partner who kept him honest about
              sequence, depth, and what non-specialists actually need.
            </p>
            <p className="text-text-mid mb-3">
              Each week, Mark holds public office hours for the Iris community — Practitioners
              can attend, Scholars can book direct time. He reviews the disagreement log
              (cases where users rejected Iris&rsquo;s suggestions) to find patterns in
              what Iris gets wrong. He reads the gallery to stay current on what&rsquo;s
              being built. He writes a monthly note for the community newsletter on what
              he&rsquo;s learned about how people build courses.
            </p>
            <p className="text-text-mid">
              Mark is named in this product because the spec requires it. His name and
              role are in the footer, in the Terms of Service, and in Iris&rsquo;s
              first-session introduction. If Mark steps away from this role, the community
              surface pauses until a named successor is identified and onboarded. No
              anonymous institutions here.
            </p>
          </div>
        </section>

        <hr />

        <section className="mt-8">
          <h2 className="text-xl font-medium mb-4">SCU — the institutional home</h2>
          <p className="text-text-mid mb-3">
            Silicon Children University is Mike Wolf&rsquo;s project for building the
            intellectual infrastructure that serious human-AI collaboration needs. Iris is
            its curriculum lab — the place where the practice of learning together is
            most directly made into a product.
          </p>
          <p className="text-text-mid">
            The university is young. The curriculum lab is its first real building. More
            departments are coming.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
