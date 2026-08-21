import { Suspense } from "react";
import { redirect } from "next/navigation";

type SignUpPageProps = {
  searchParams: Promise<{ error?: string; callbackURL?: string }>;
};

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const url = new URL("/sign-in", "http://localhost");
  if (params.callbackURL) url.searchParams.set("callbackURL", params.callbackURL);
  if (params.error) url.searchParams.set("error", params.error);
  redirect(url.pathname + url.search);
  return null;
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return (
    <Suspense fallback={null}>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}



