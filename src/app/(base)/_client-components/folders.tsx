"use client";
import { api } from "~/trpc/react";

import Folder from "./folder";
import ActionWrapper from "~/app/_components/action-wrapper";
import Plus from "~/app/_components/svgs/plus";
import { HeadingModal } from "~/app/_components/modal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Folders() {
  const [folders] = api.folder.getFolders.useSuspenseQuery();
  const modalOpenState = useState(false);
  const inputState = useState("");
  const utils = api.useUtils();
  const router = useRouter();
  const addFolder = api.folder.addFolder.useMutation({
    onSuccess: async (data) => {
      await utils.folder.getFolders.invalidate();
      modalOpenState[1](false);

      router.push(`/folder/${data.id}`);
      setTimeout(() => {
        inputState[1]("");
      }, 1000);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputState[0]) return;

    addFolder.mutate({ heading: inputState[0] });
  };

  return (
    <>
      <HeadingModal
        openState={modalOpenState}
        inputState={inputState}
        onSubmit={handleSubmit}
      />
      <div className="flex flex-col">
        <div className="pl-2.5 pr-4">
          <ActionWrapper
            actions={() => (
              <button
                onClick={() => modalOpenState[1](true)}
                className="flex flex-1 flex-row items-center gap-2 rounded p-1 leading-snug text-slate-200 hover:bg-slate-600"
              >
                <Plus className="size-4" />
              </button>
            )}
          >
            <p className="flex-1 text-sm">Folders</p>
          </ActionWrapper>
        </div>

        {folders.length > 0 ? (
          <div className="pl-2.5 pr-4">
            {folders.map((folder) => (
              <Folder key={folder.id} folder={folder} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-1">
            <p className="text-sm text-gray-400">Nothing here yet</p>
          </div>
        )}
      </div>
    </>
  );
}
