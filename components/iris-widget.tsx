"use client";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";

interface IrisWidgetProps {
  userId: string;
  courseId: string;
  remainingMinutes?: number;
}

// ElevenLabs ConvAI web component type declaration (React 19 types
// moved JSX under the "react" module, so augment it there)
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          "dynamic-variables"?: string;
        },
        HTMLElement
      >;
    }
  }
}

type VoiceStatus = "checking" | "ready" | "offline";

const WIDGET_SCRIPT = "https://elevenlabs.io/convai-widget/index.js";

// The widget fetches this same config URL on load and, if the agent is gone,
// renders a broken button and logs an error. Probing it first lets us show a
// quiet "offline" notice instead (bead es-hk5).
function agentConfigUrl(agentId: string) {
  return `https://api.elevenlabs.io/v1/convai/agents/${encodeURIComponent(agentId)}/widget`;
}

export function IrisWidget({
  userId,
  courseId,
  remainingMinutes = 30,
}: IrisWidgetProps) {
  const agentId = config.elevenLabs.agentId;
  const [status, setStatus] = useState<VoiceStatus>(agentId ? "checking" : "offline");

  useEffect(() => {
    if (!agentId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(agentConfigUrl(agentId));
        if (!res.ok) throw new Error(`agent config ${res.status}`);
        await loadWidgetScript();
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [agentId]);

  if (status === "offline") {
    return <IrisWidgetPlaceholder reason="Voice is offline right now." />;
  }
  if (status === "checking") {
    return <IrisWidgetPlaceholder reason="Connecting…" />;
  }

  const dynamicVariables = JSON.stringify({
    user_id: userId,
    course_id: courseId,
    remaining_minutes: remainingMinutes,
  });

  return (
    <div className="iris-widget-container">
      <elevenlabs-convai
        agent-id={agentId}
        dynamic-variables={dynamicVariables}
      />
      <style>{`
        .iris-widget-container elevenlabs-convai {
          --el-color-primary: #5c4a2a;
          --el-color-primary-hover: #8b6e3e;
        }
      `}</style>
    </div>
  );
}

// Load the ElevenLabs ConvAI script once; reject if it fails to load.
function loadWidgetScript(): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(
    "script[data-elevenlabs-widget]"
  );
  if (existing) {
    if (existing.dataset.loaded === "true") return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("widget script")), {
        once: true,
      });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT;
    script.async = true;
    script.setAttribute("data-elevenlabs-widget", "true");
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error("widget script")));
    document.head.appendChild(script);
  });
}

export function IrisWidgetPlaceholder({ reason }: { reason: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 border text-center"
      style={{ borderColor: "var(--rule)", minHeight: "180px" }}
      data-testid="iris-voice-placeholder"
    >
      <p className="text-sm font-medium text-text mb-1">Iris voice interface</p>
      <p className="text-xs text-text-dim">{reason}</p>
    </div>
  );
}
