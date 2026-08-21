import { redirect } from "next/navigation";
import { signInDiscordAction } from "@/lib/domain/actions/auth.actions";
import { getSession } from "@/lib/domain/services/auth.service";
import { AuthShell } from "@/components/organisms/AuthShell/AuthShell";
import { DiscordButton } from "@/components/atoms/DiscordButton/DiscordButton";

type SignInFormProps = {
  searchParams: Promise<{ error?: string; callbackURL?: string }>;
};

export async function SignInForm({ searchParams }: SignInFormProps) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect(params.callbackURL || "/");
  }

  const callbackURL = params.callbackURL || "/";
  const error = params.error;

  return (
    <AuthShell title="Sign in" description="Sign in with your Discord account to play Wordle PRO.">
      {error ? (
        <p className="mb-6 rounded-xl bg-secondary-container px-4 py-3 text-sm text-secondary">
          {error}
        </p>
      ) : null}

      <div className="space-y-6">
        <form action={signInDiscordAction}>
          <input type="hidden" name="callbackURL" value={callbackURL} />
          <DiscordButton className="py-3.5 text-base font-semibold shadow-md hover:shadow-lg">
            Sign in with Discord
          </DiscordButton>
        </form>

        <p className="text-center text-xs text-on-surface-muted">
          By continuing, you agree to sign in using your Discord account.
        </p>
      </div>
    </AuthShell>
  );
}


