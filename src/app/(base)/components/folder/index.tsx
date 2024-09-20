"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FolderClosed from "~/app/components/svgs/folder-closed";
import FolderOpenSolid from "~/app/components/svgs/folder-open-solid";

import Chevron from "~/app/components/svgs/chevron";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type RouterOutputs } from "~/trpc/react";
import { AddButton } from "~/app/components/dropdown";
import Files from "../files";
import OptionsMenu from "./options-menu";
import clsx from "clsx";

export type RecursiveFolderProps = Omit<
  RouterOutputs["folder"]["getFolders"][0],
  "children"
> & {
  children: RecursiveFolderProps[];
};

const useFolderStateManager = (folder: RecursiveFolderProps) => {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();

  const hasChildren = useMemo(() => {
    return folder.children.length > 0 || folder.files.length > 0;
  }, [folder.children.length, folder.files.length]);

  const handleShouldOpen = useCallback(
    (currentPathname: string, currentFolder: RecursiveFolderProps): boolean => {
      if (currentPathname.includes(currentFolder.id)) {
        return true;
      }
      if (hasChildren) {
        return (
          currentFolder.children.some((child) =>
            handleShouldOpen(currentPathname, child),
          ) ||
          currentFolder.files.some((file) => currentPathname.includes(file.id))
        );
      }
      return false;
    },
    [hasChildren],
  );

  useEffect(() => {
    const shouldOpen = handleShouldOpen(pathname, folder);
    setOpened(shouldOpen);
  }, [folder, handleShouldOpen, pathname]);

  return {
    opened,
    isActive: pathname.includes(folder.id),
    hasChildren,
    handleToggle: () => setOpened((prev) => (hasChildren ? !prev : prev)),
  };
};

export default function Folder({ folder }: { folder: RecursiveFolderProps }) {
  const { opened, isActive, hasChildren, handleToggle } =
    useFolderStateManager(folder);

  return (
    <>
      <div
        className={clsx(
          isActive && "bg-slate-800",
          "group flex h-8 flex-row items-center justify-center gap-2 rounded-lg p-1 pl-1.5 hover:bg-slate-700",
        )}
      >
        <button
          className="rounded p-1 hover:bg-slate-600"
          onClick={() => handleToggle()}
        >
          <div className="group-hover:hidden">
            {opened ? (
              <FolderOpenSolid className="size-4" />
            ) : (
              <FolderClosed className="size-4" />
            )}
          </div>
          <div className="hidden group-hover:flex">
            {hasChildren ? (
              <Chevron className="size-4 -rotate-90 p-0.5 text-slate-300" />
            ) : (
              <FolderClosed className="size-4" />
            )}
          </div>
        </button>
        <Link
          className="flex-1 truncate text-left text-lg"
          href={`/folder/${folder.id}`}
        >
          {folder.heading.content}
        </Link>
        <div className="hidden group-hover:flex">
          <OptionsMenu folderId={folder.id} />
          <AddButton folderId={folder.id} />
        </div>
      </div>

      {opened && hasChildren && (
        <div className="flex flex-col pl-3">
          {folder.children?.map((children) => (
            <Folder key={`${folder.id}${children.id}`} folder={children} />
          ))}
          <Files files={folder.files} />
        </div>
      )}
    </>
  );
}
