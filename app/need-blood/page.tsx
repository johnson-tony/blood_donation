import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";

export default async function NeedBloodPage() {
  await requireUser();
  redirect("/dashboard?needBlood=1");
}
