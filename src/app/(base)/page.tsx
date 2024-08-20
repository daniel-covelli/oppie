import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import Button from "../_components/button";
import { RemoveSessionButton, SelectReactButton } from "./client-components";

export default async function Home() {
  const session = await getSessionOrRedirect();
  if (
    !session.user.language ||
    !session.user.framework ||
    !session.user.stylingLibrary
  ) {
    return (
      <div>
        <p className="text-5xl">Welcome to Oppie 👋</p>
        <p className="pt-4 text-xl tracking-tighter text-slate-200">
          Please select a code output type for your purposes today
        </p>
        <div className="grid grid-cols-3 gap-8 pt-12">
          <div className="flex flex-col rounded-lg border border-slate-700 bg-slate-750 p-4">
            <p className="text-2xl font-bold">Typescript, React, Tailwind</p>
            <p className="pb-8 pt-4 tracking-tighter text-slate-200">
              Use Oppie to generate Typescript / React / Tailwind components
            </p>
            <SelectReactButton />
          </div>
          <div className="flex flex-col rounded-lg border border-slate-700 bg-slate-750 p-4">
            <p className="text-2xl font-bold text-slate-400">More to come</p>
            <p className="pb-8 pt-4 tracking-tighter text-slate-400">
              Working on more coding paradigms right now!
            </p>
            <div className="flex-1" />
            <Button disabled color="secondary">
              Select
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-5xl">Get building</p>
      <RemoveSessionButton />
    </div>
  );
}

async function getSessionOrRedirect() {
  const session = await getServerAuthSession();
  console.log("session", JSON.stringify(session, null, 2));

  // If the user is authenticated, continue as normal
  if (!session) {
    redirect("/login");
  }

  return session;
}
