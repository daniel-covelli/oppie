import Button from "../_components/button";
import { Message, SelectReactButton } from "./client-components";
import React from "react";
import ReactIcon from "../_components/svgs/react";
import Tag from "../_components/tag";
import TailwindIcon from "../_components/svgs/tailwind";
import TypescriptIcon from "../_components/svgs/typescript";
import {
  getSessionOrRedirect,
  hasClaudeSessionBeenEstablished,
} from "~/server/ssr-utils";

export default async function Home() {
  await getSessionOrRedirect();
  const isSessionEstablished = await hasClaudeSessionBeenEstablished();
  if (!isSessionEstablished) {
    return (
      <div>
        <p className="text-5xl">Welcome to Oppie 👋</p>
        <p className="pt-4 text-xl tracking-tighter text-slate-200">
          Please select a code output type for your purposes today
        </p>
        <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 pb-4">
        <Tag icon={ReactIcon} text="React" />
        <Tag icon={TypescriptIcon} text="TypeScript" />
        <Tag icon={TailwindIcon} text="Tailwind" />
      </div>
      <Message />
    </div>
  );
}
