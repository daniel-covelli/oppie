import { getServerAuthSession } from "./auth";

export async function hasClaudeSessionBeenEstablished() {
  const session = await getServerAuthSession();

  return (
    !!session?.user.language &&
    !!session?.user.framework &&
    !!session.user.stylingLibrary
  );
}
