"use client";

import { signIn, type ClientSafeProvider } from "next-auth/react";
import Button from "../_components/button";
import Google from "../_components/svgs/google";
import { TypeAnimation } from "react-type-animation";

export function LoginButton({ provider }: { provider: ClientSafeProvider }) {
  return (
    <Button onClick={() => signIn(provider.id)}>
      <div className="flex flex-row items-center gap-2">
        {provider.name === "Google" && <Google />}
        <span>Continue with {provider.name}</span>
      </div>
    </Button>
  );
}

export function Typing() {
  return (
    <TypeAnimation
      sequence={[
        "A better way to save your",

        "A better way to save your knowledge", // Types 'One'
        3000, // Waits 1s
        "A better way to save your code", // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        "A better way to save your components", // Types 'Three' without deleting 'Two'
        3000,
        "A better way to save your algorithms", // Types 'Three' without deleting 'Two'
        3000,
      ]}
      preRenderFirstString
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      className="text-lg text-slate-50 sm:text-2xl"
    />
  );
}
