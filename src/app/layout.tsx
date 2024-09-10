import "~/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Oppie",
  description: "A better way to save your knowledge",
  icons: [{ rel: "icon", url: "/O.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistMono.variable}`}>
      <body className="bg-slate-800 text-slate-50">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
