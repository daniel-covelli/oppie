import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

import Link from "next/link";
import BrandText from "../_components/brand-text";
import { LoginButton, Typing } from "./client-components";

export default async function Login() {
  const providers = await getNextAuthProviders();

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-12">
      <div className="grid items-center justify-center gap-8 pt-8 md:min-h-screen md:grid-cols-2 md:pt-0">
        <div className="flex flex-col items-center gap-8 md:items-start">
          <BrandText className="text-7xl">Oppie</BrandText>
          <Typing />

          <h2 className="text-sm text-slate-300">
            Created by{" "}
            <Link
              className="text-cyan-400"
              href="https://github.com/daniel-covelli"
              target="_blank"
            >
              Daniel Covelli
            </Link>{" "}
            in SF
          </h2>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-10 rounded-lg bg-slate-700 p-8 shadow">
            <h2 className="text-3xl">Login </h2>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <LoginButton provider={provider} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

async function getNextAuthProviders() {
  const session = await getServerAuthSession();

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  return providers ?? [];
}
