import { Suspense } from "react";
import { getSession } from "@/lib/domain/services/auth.service";
import {
  WordleLanding,
  WordleLandingFallback,
} from "@/components/organisms/WordleLanding/WordleLanding";

async function HomeContent() {
  const session = await getSession();
  return <WordleLanding session={session} />;
}

export default function Home() {
  return (
    <Suspense fallback={<WordleLandingFallback />}>
      <HomeContent />
    </Suspense>
  );
}

