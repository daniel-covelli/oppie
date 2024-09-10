import { api, HydrateClient } from "~/trpc/server";
import BrandText from "../components/brand-text";
import { BreadCrumbs, SignOutButton } from "./client-components";

import Link from "next/link";
import Folders from "./_client-components/folders";
import { getSessionOrRedirect } from "~/server/ssr-utils";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await getSessionOrRedirect();
  const folders = await api.folder.getFolders();
  void (await api.folder.getFolders.prefetch());

  return (
    <HydrateClient>
      <div className="flex min-h-screen">
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
              <div className="flex flex-row items-center gap-3">
                <BreadCrumbs folders={folders} />
              </div>

              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-800">
            <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </HydrateClient>
  );
}
