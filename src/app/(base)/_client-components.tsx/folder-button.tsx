"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "~/app/_components/button";
import Chevron from "~/app/_components/svgs/chevron";
import FolderPlus from "~/app/_components/svgs/folder-plus";
import { api } from "~/trpc/react";

export default function AddFolderButton({ parentId }: { parentId?: string }) {
  const [pressed, setPressed] = useState(false);
  const router = useRouter()
  const [folderName, setFolderName] = useState("");
  const utils = api.useUtils();
  const { mutate, isPending } = api.folder.addFolder.useMutation({
    onSuccess: async () => {
        await utils.folder.invalidate()
        setPressed(false)
    },
  });

  if (isPending) {
    return <div className="h-6 animate-pulse rounded-lg bg-slate-700" />;
  }

  return pressed ? (
    <form
      className="flex flex-row items-center gap-2 py-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (folderName) {
          mutate({ name: folderName, parentId });
        }
      }}
    >
      <Chevron className="size-3 rotate-180 text-gray-400" />
      <input
        autoFocus
        onBlur={() => {
          if (folderName) {
            mutate({ name: folderName });
          } else {
            setPressed(false);
            setFolderName("");
          }
        }}
        className="rounded bg-slate-750 outline-none focus:outline-sky-600"
        placeholder="Add folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
    </form>
  ) : (
    <Button onClick={() => setPressed(true)} icon className="justify-center">
      <FolderPlus className="size-4" />
      Add folder
    </Button>
  );
}
