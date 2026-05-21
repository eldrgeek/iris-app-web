"use client";
import { useEffect, useRef } from "react";
import { config } from "@/lib/config";

interface IrisWidgetProps {
  userId: string;
  courseId: string;
  remainingMinutes?: number;
}

// ElevenLabs ConvAI web component type declaration
declare global {
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

export function IrisWidget({
  userId,
  courseId,
  remainingMinutes = 30,
}: IrisWidgetProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load ElevenLabs ConvAI script once
    if (!document.querySelector('script[data-elevenlabs-widget]')) {
      const script = document.createElement("script");
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.setAttribute("data-elevenlabs-widget", "true");
      document.head.appendChild(script);
      scriptRef.current = script;
    }
    return () => {
      // Do not remove the script on unmount — widget manages its own lifecycle
    };
  }, []);

  const dynamicVariables = JSON.stringify({
    user_id: userId,
    course_id: courseId,
    remaining_minutes: remainingMinutes,
  });

  return (
    <div className="iris-widget-container">
      <elevenlabs-convai
        agent-id={config.elevenLabs.agentId}
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

export function IrisWidgetPlaceholder({ reason }: { reason: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 border text-center"
      style={{ borderColor: "var(--rule)", minHeight: "180px" }}
    >
      <p className="text-sm font-medium text-text mb-1">Iris voice interface</p>
      <p className="text-xs text-text-dim">{reason}</p>
    </div>
  );
}
