import { Suspense } from "react";
import ThankYouPage from "./ThankYouPage";

export default function ThankYouWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ThankYouPage />
    </Suspense>
  );
}