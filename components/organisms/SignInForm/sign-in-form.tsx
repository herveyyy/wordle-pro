import { redirect } from "next/navigation";
import { signInAction, signInDiscordAction } from "@/lib/domain/actions/auth.actions";
import { getSession } from "@/lib/domain/services/auth.service";
import { AuthShell } from "@/components/organisms/AuthShell/AuthShell";
import { LabelInput } from "@/components/molecules/LabelInput/LabelInput";
import { Button } from "@/components/atoms/Button/Button";
import { DiscordButton } from "@/components/atoms/DiscordButton/DiscordButton";
import { getSignInFormState } from "./signInForm.hooks";
import { useAuthFormSubmitStyles } from "@/components/atoms/Button/button.hooks";

type SignInFormProps = {
  searchParams: Promise<{ error?: string; callbackURL?: string }>;
};

export async function SignInForm({ searchParams }: SignInFormProps) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect(params.callbackURL || "/");
  }

  const { callbackURL, error, fields } = getSignInFormState(params);
  const submitClassName = useAuthFormSubmitStyles();

  return (
    <AuthShell title="Sign in" description="Sign in to your Wordle Pro account.">
      {error ? (
        <p className="mb-6 rounded-xl bg-secondary-container px-4 py-3 text-sm text-secondary">
          {error}
        </p>
      ) : null}

      <form action={signInDiscordAction} className="mb-5">
        <input type="hidden" name="callbackURL" value={callbackURL} />
        <DiscordButton>Sign in with Discord</DiscordButton>
      </form>

      <div className="relative mb-5 flex items-center justify-center">
        <div className="border-border w-full border-t" />
        <span className="bg-surface px-3 text-xs uppercase tracking-wider text-on-surface-muted">
          Or continue with email
        </span>
        <div className="border-border w-full border-t" />
      </div>

      <form action={signInAction} className="space-y-5">
        <input type="hidden" name="callbackURL" value={callbackURL} />

        {fields.map((field) => (
          <LabelInput key={field.name} {...field} />
        ))}

        <Button type="submit" className={submitClassName}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-muted">
        No account yet?{" "}
        <a href="/sign-up" className="font-medium text-primary underline">
          Create one
        </a>
      </p>
    </AuthShell>
  );
}

