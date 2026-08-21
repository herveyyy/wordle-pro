import { headers } from "next/headers";
import { auth } from "@/auth";
import type { AuthResult, SocialSignInInput, SocialSignInResponse } from "@/lib/entities/auth.type";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Social sign-in failed. Please try again.";
}

export async function signInSocial(input: SocialSignInInput): Promise<AuthResult<SocialSignInResponse>> {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: input.provider,
        callbackURL: input.callbackURL || "/",
      },
      headers: await headers(),
    });

    if (result && typeof result === "object" && "url" in result && result.url) {
      return {
        ok: true,
        data: {
          url: result.url,
        },
      };
    }

    return {
      ok: false,
      error: "No authorization URL returned from auth provider.",
    };
  } catch (error) {
    console.error("signInSocial error:", error);
    return { ok: false, error: getErrorMessage(error) };
  }
}
