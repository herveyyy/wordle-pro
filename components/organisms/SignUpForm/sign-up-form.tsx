import { redirect } from "next/navigation";
import { signInDiscordAction, signUpAction } from "@/lib/domain/actions/auth.actions";
import { getSession } from "@/lib/domain/services/auth.service";
import { AuthShell } from "@/components/organisms/AuthShell/AuthShell";
import { LabelInput } from "@/components/molecules/LabelInput/LabelInput";
import { Button } from "@/components/atoms/Button/Button";
import { DiscordButton } from "@/components/atoms/DiscordButton/DiscordButton";
import { getSignUpFormState } from "./signUpForm.hooks";
import { useAuthFormSubmitStyles } from "@/components/atoms/Button/button.hooks";

type SignUpFormProps = {
  searchParams: Promise<{ error?: string; callbackURL?: string }>;
};

export async function SignUpForm({ searchParams }: SignUpFormProps) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect(params.callbackURL || "/");
  }

  const { callbackURL, error, fields } = getSignUpFormState(params);
  const submitClassName = useAuthFormSubmitStyles();

  return (
    <AuthShell title="Create account" description="Sign up to start playing Wordle Pro.">
      {error ? (
        <p className="mb-6 rounded-xl bg-secondary-container px-4 py-3 text-sm text-secondary">
          {error}
        </p>
      ) : null}

      <form action={signInDiscordAction} className="mb-5">
        <input type="hidden" name="callbackURL" value={callbackURL} />
        <DiscordButton>Sign up with Discord</DiscordButton>
      </form>

      <div className="relative mb-5 flex items-center justify-center">
        <div className="border-border w-full border-t" />
        <span className="bg-surface px-3 text-xs uppercase tracking-wider text-on-surface-muted">
          Or register with email
        </span>
        <div className="border-border w-full border-t" />
      </div>

      <form action={signUpAction} className="space-y-5">
        <input type="hidden" name="callbackURL" value={callbackURL} />

        {fields.map((field) => (
          <LabelInput key={field.name} {...field} />
        ))}

        <Button type="submit" className={submitClassName}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-muted">
        Already have an account?{" "}
        <a href="/sign-in" className="font-medium text-primary underline">
          Sign in
        </a>
      </p>
    </AuthShell>
  );
}

