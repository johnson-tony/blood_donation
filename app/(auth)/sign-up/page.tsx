import type { Metadata } from "next";

import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create an account to request blood or donate to someone nearby.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
