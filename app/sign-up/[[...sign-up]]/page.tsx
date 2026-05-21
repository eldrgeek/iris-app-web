import { SignUp } from "@clerk/nextjs";
import { Nav } from "@/components/nav";
import { UnconfiguredBanner } from "@/components/unconfigured-banner";
import { config } from "@/lib/config";

export default function SignUpPage() {
  return (
    <>
      <Nav showAuth={false} />
      <main className="max-w-content mx-auto px-8 py-16 flex flex-col items-center">
        <h1 className="text-3xl font-light tracking-tight mb-3">Adopt Iris</h1>
        <p className="text-sm italic text-text-dim mb-8">
          Create your account to start building your course.
        </p>
        {config.clerk.enabled ? (
          <SignUp />
        ) : (
          <div className="w-full max-w-sm">
            <UnconfiguredBanner service="auth" />
          </div>
        )}
      </main>
    </>
  );
}
