"use client";
import { api } from "~/trpc/react";
import AddFolderButton from "./folder-button";
import Folder from "./folder";

export default function Folders() {
  const [folders] = api.folder.getFolders.useSuspenseQuery();
  return folders.length > 0 ? (
    <div className="flex flex-col pb-4">
      {folders.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
    </div>
  ) : (
    <AddFolderButton />
  );
}
