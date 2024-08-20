"use client";

import { SessionProvider, signOut } from "next-auth/react";
import Button from "../_components/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}

function SelectReactButtonContent() {
  const router = useRouter();
  const updateSession = api.session.updateSession.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <Button color="secondary" onClick={() => updateSession.mutate()}>
      {updateSession.isPending ? "Loading..." : "Select"}
    </Button>
  );
}

export function SelectReactButton() {
  return (
    <SessionProvider>
      <SelectReactButtonContent />
    </SessionProvider>
  );
}

function RemoveSessionButtonContent() {
  const router = useRouter();
  const removeSession = api.session.removeSession.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <Button color="secondary" onClick={() => removeSession.mutate()}>
      {removeSession.isPending ? "Loading..." : "Select"}
    </Button>
  );
}

export function RemoveSessionButton() {
  return (
    <SessionProvider>
      <RemoveSessionButtonContent />
    </SessionProvider>
  );
}
