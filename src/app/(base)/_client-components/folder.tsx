"use client";

import { useCallback, useEffect, useState } from "react";
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

  const handleShouldOpen = useCallback(
    (pathname: string, folder: RecursiveFolderProps): boolean => {
      if (pathname.includes(folder.id)) {
        setOpened(true);
        return true;
      }
      if (folder.children.length > 0 || folder.files.length > 0) {
        const shouldOpen =
          folder.children.some((child) => handleShouldOpen(pathname, child)) ||
          folder.files.some((child) => pathname.includes(child.id));

        if (shouldOpen) {
          setOpened(true);
        }
        return shouldOpen;
      } else {
        setOpened(false);
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    handleShouldOpen(pathname, folder);
  }, [folder, handleShouldOpen, pathname]);

  const hasChildren =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (folder.children && folder.children.length > 0) ||
    (folder.files && folder.files.length > 0);

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
