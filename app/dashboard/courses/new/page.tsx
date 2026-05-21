"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [forWho, setForWho] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, forWho }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create course");
      router.push(`/dashboard/courses/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-content">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-text-dim no-underline hover:text-accent"
        >
          &larr; My Courses
        </Link>
      </div>

      <h1 className="text-3xl font-light tracking-tight mb-2">
        What course are you building?
      </h1>
      <p className="text-sm italic text-text-dim mb-10">
        Iris will use this as your starting context — you can refine everything through conversation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Course title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to Bioelectric Signaling"
            required
            className="w-full px-4 py-3 text-sm border font-serif"
            style={{
              borderColor: "var(--rule)",
              background: "var(--bg-alt)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            What is this course about?{" "}
            <span className="font-normal text-text-dim">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A broad description — Iris will help you refine it."
            rows={3}
            className="w-full px-4 py-3 text-sm border font-serif resize-none"
            style={{
              borderColor: "var(--rule)",
              background: "var(--bg-alt)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Who is this course for?{" "}
            <span className="font-normal text-text-dim">(optional)</span>
          </label>
          <input
            type="text"
            value={forWho}
            onChange={(e) => setForWho(e.target.value)}
            placeholder="e.g. Lifelong learners with no biology background"
            className="w-full px-4 py-3 text-sm border font-serif"
            style={{
              borderColor: "var(--rule)",
              background: "var(--bg-alt)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="px-7 py-3 text-sm disabled:opacity-50"
            style={{
              background: "var(--accent)",
              color: "#f8f5ef",
              cursor: loading || !title.trim() ? "not-allowed" : "pointer",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Creating…" : "Create course & talk to Iris →"}
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-text-dim no-underline hover:text-accent"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
