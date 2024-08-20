import { HydrateClient } from "~/trpc/server";
import BrandText from "../_components/brand-text";
import { SignOutButton } from "./client-components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-750 shadow-xl">
        <div className="p-4">
          <BrandText className="text-3xl">Oppie</BrandText>
        </div>
        {/* <nav className="mt-6">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-700">
            Home
          </Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-700">
            About
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700">
            Contact
          </Link>
        </nav> */}
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-slate-750">
          <div className="flex flex-row items-center justify-between px-6 py-3">
            <h2 className="text-2xl text-slate-200">Dashboard</h2>
            <SignOutButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <HydrateClient>{children}</HydrateClient>
          </div>
        </main>
      </div>
    </div>
  );
}
