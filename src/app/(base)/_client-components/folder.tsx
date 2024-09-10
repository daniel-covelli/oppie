"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FolderClosed from "~/app/components/svgs/folder-closed";
import FolderOpenSolid from "~/app/components/svgs/folder-open-solid";

import Chevron from "~/app/components/svgs/chevron";
import { usePathname } from "next/navigation";
import ActionWrapper from "~/app/components/action-wrapper";
import Link from "next/link";
import Files from "./files";
import { type RouterOutputs } from "~/trpc/react";
import { AddButton, OptionsButton } from "~/app/components/dropdown";

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
      <ActionWrapper
        active={isActive}
        preface={({ hovered }) => (
          <button
            className="rounded p-1 hover:bg-slate-600"
            onClick={() => handleToggle()}
          >
            {hovered && hasChildren ? (
              <Chevron className="size-4 -rotate-90 p-0.5 text-slate-300" />
            ) : opened ? (
              <FolderOpenSolid className="size-4" />
            ) : (
              <FolderClosed className="size-4" />
            )}
          </button>
        )}
        actions={({ setHovered, setIgnoreMouseOut }) => (
          <>
            <OptionsButton
              folderId={folder.id}
              setHovered={setHovered}
              setIgnoreMouseOut={setIgnoreMouseOut}
            />
            <AddButton
              folderId={folder.id}
              setHovered={setHovered}
              setIgnoreMouseOut={setIgnoreMouseOut}
            />
          </>
        )}
      >
        <Link
          className="flex-1 truncate text-left text-lg"
          href={`/folder/${folder.id}`}
        >
          {folder.heading.content}
        </Link>
      </ActionWrapper>

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
