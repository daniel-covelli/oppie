"use client";

import { useState } from "react";
import FolderClosed from "~/app/_components/svgs/folder-closed";
import FolderOpenSolid from "~/app/_components/svgs/folder-open-solid";
import AddFolderButton from "./folder-button";

interface FolderType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  ownerId: string;
  children?: FolderType[];
}

export default function Folder({ folder }: { folder: FolderType }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setOpened((prev) => !prev)}
        className="flex flex-row items-center gap-2 py-1"
        key={folder.id}
      >
        {opened ? (
          <FolderOpenSolid className="size-4 text-sky-500" />
        ) : (
          <FolderClosed className="size-4" />
        )}
        <p>{folder.name}</p>
      </button>
      {opened && (
        <div className="flex flex-col pl-5">
          <AddFolderButton key={folder.id} parentId={folder.id} />
          {folder.children?.map((children) => (
            <Folder key={`${folder.id}${children.id}`} folder={children} />
          ))}
        </div>
      )}
    </div>
  );
}
