// VENUE PARTNER — disabled (venue onboarding flow)
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  redirect("/");
}

/*
  Full multi-step venue partner onboarding UI was removed from this route.
  Restore from git history if re-enabling /onboarding.
*/
