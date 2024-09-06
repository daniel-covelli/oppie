import { api, HydrateClient } from "~/trpc/server";
import BrandText from "../_components/brand-text";
import { HomeButton, SignOutButton } from "./client-components";
import Button from "../_components/button";
import { hasClaudeSessionBeenEstablished } from "~/server/ssr-utils";
import Chevron from "../_components/svgs/chevron";

import Link from "next/link";
import Folders from "./_client-components/folders";
// import dynamic from "next/dynamic";
// import Folders from "./_client-components/folders";

// const Folders = dynamic(() => import("./_client-components/folders"), {
//   // loading: () => <p>Loading...</p>,
//   ssr: false,
// });
export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isSessionEstablished = await hasClaudeSessionBeenEstablished();

  const folders = await api.folder.getFolders();
  void (await api.folder.getFolders.prefetch());

  return (
    <HydrateClient>
      <div className="flex h-screen">
        <aside className="w-64 bg-slate-750 shadow-xl">
          <div className="px-3.5 py-4">
            <BrandText as={Link} href={"/"} className="text-3xl">
              Oppie
            </BrandText>
          </div>
          <Folders initialFolders={folders} />
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b border-slate-750">
            <div className="flex flex-row items-center justify-between px-6 py-3">
              <div className="flex flex-row items-center gap-1">
                <HomeButton disabled={!isSessionEstablished} />
                {isSessionEstablished && (
                  <>
                    <Chevron className="h-2 rotate-180" />
                    <Button
                      disabled={true}
                      size="sm"
                      icon
                      variant="transparent"
                    >
                      Generate
                    </Button>
                  </>
                )}
              </div>

              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-800">
            <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </HydrateClient>
  );
}
