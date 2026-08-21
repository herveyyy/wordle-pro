"use server";

import { redirect } from "next/navigation";
import {
  signIn,
  signInSocial,
  signOut,
  signUp,
} from "@/lib/domain/services/auth.service";


function readField(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function signInDiscordAction(formData?: FormData) {
  const callbackURL = formData ? readField(formData, "callbackURL") || "/" : "/";
  const result = await signInSocial({ provider: "discord", callbackURL });

  if (!result.ok || !result.data?.url) {
    redirect(`/sign-in?error=${encodeURIComponent(result.ok ? "Failed to redirect" : result.error)}`);
  }

  redirect(result.data.url);
}

export async function signInAction(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const callbackURL = readField(formData, "callbackURL") || "/";

  const result = await signIn({ email, password, callbackURL, rememberMe: true });

  if (!result.ok) {
    redirect(`/sign-in?error=${encodeURIComponent(result.error)}`);
  }

  redirect(callbackURL);
}

export async function signUpAction(formData: FormData) {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const callbackURL = readField(formData, "callbackURL") || "/";

  const result = await signUp({ name, email, password, callbackURL });

  if (!result.ok) {
    redirect(`/sign-up?error=${encodeURIComponent(result.error)}`);
  }

  redirect(callbackURL);
}

export async function signOutAction() {
  const result = await signOut();

  if (!result.ok) {
    redirect(`/?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/sign-in");
}
