"use client";

import { signIn, type ClientSafeProvider } from "next-auth/react";
import Button from "./button";
import Google from "./svgs/google";

export default function LoginButton({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  return (
    <Button onClick={() => signIn(provider.id)}>
      <div className="flex flex-row items-center gap-2">
        {provider.name === "Google" && <Google />}
        <span>Continue with {provider.name}</span>
      </div>
    </Button>
  );
}
