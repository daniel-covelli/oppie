import { HydrateClient } from "~/trpc/server";
import BrandText from "../_components/brand-text";
import { HomeButton, SignOutButton } from "./client-components";
import Button from "../_components/button";
import { hasClaudeSessionBeenEstablished } from "~/server/ssr-utils";
import Chevron from "../_components/svgs/chevron";
import Folders from "./_client-components.tsx/folders";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isSessionEstablished = await hasClaudeSessionBeenEstablished();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-750 shadow-xl">
        <div className="flex flex-col p-4">
          <BrandText className="pb-8 text-3xl">Oppie</BrandText>
          <Folders />
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-750">
          <div className="flex flex-row items-center justify-between px-6 py-3">
            <div className="flex flex-row items-center gap-1">
              <HomeButton disabled={!isSessionEstablished} />
              {isSessionEstablished && (
                <>
                  <Chevron className="h-2 rotate-180" />
                  <Button disabled={true} size="sm" icon variant="transparent">
                    Generate
                  </Button>
                </>
              )}
            </div>

            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <HydrateClient>{children}</HydrateClient>
          </div>
        </main>
      </div>
    </div>
  );
}
