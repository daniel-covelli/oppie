import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  await redirectIfNotLoggedIn();
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen justify-center bg-slate-800 py-16 text-white">
        <div>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}

async function redirectIfNotLoggedIn() {
  const session = await getServerAuthSession();

  // If the user is authenticated, continue as normal
  if (!session) {
    redirect("/login");
  }
}
