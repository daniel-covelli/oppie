import { redirect } from "next/navigation";
import { getServerAuthSession } from "./auth";

export async function hasClaudeSessionBeenEstablished() {
  const session = await getServerAuthSession();

  return (
    !!session?.user.language &&
    !!session?.user.framework &&
    !!session.user.stylingLibrary
  );
}

export async function getSessionOrRedirect() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }
}
