import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/sign-in-form";
import { safeCallbackUrl } from "@/lib/utils/redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your blood donation account.",
};

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl, "/dashboard");

  return <SignInForm callbackUrl={callbackUrl} />;
}