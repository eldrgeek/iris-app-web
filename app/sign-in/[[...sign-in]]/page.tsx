import { SignIn } from "@clerk/nextjs";
import { Nav } from "@/components/nav";
import { UnconfiguredBanner } from "@/components/unconfigured-banner";
import { config } from "@/lib/config";

export default function SignInPage() {
  return (
    <>
      <Nav showAuth={false} />
      <main className="max-w-content mx-auto px-8 py-16 flex flex-col items-center">
        <h1 className="text-3xl font-light tracking-tight mb-8">Sign in to Iris</h1>
        {config.clerk.enabled ? (
          <SignIn />
        ) : (
          <div className="w-full max-w-sm">
            <UnconfiguredBanner service="auth" />
          </div>
        )}
      </main>
    </>
  );
}
