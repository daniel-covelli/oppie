"use client";

import { useState } from "react";
import FolderClosed from "~/app/components/svgs/folder-closed";
import FolderOpenSolid from "~/app/components/svgs/folder-open-solid";

import Chevron from "~/app/components/svgs/chevron";
import { usePathname } from "next/navigation";
import ActionWrapper from "~/app/components/action-wrapper";
import Link from "next/link";
import Files from "./files";
import { type RouterOutputs } from "~/trpc/react";
import { AddButton, OptionsButton } from "~/app/components/dropdown";

type RecursiveFolderProps = Omit<
  RouterOutputs["folder"]["getFolders"][0],
  "children"
> & {
  children: RecursiveFolderProps[];
};

export default function Folder({ folder }: { folder: RecursiveFolderProps }) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();

  const hasChildren =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (folder.children && folder.children.length > 0) ||
    (folder.files && folder.files.length > 0);

  return (
    <>
      <ActionWrapper
        active={pathname.includes(folder.id)}
        preface={({ hovered }) => (
          <button
            className="rounded p-1 hover:bg-slate-600"
            onClick={(e) => {
              e.stopPropagation();
              setOpened((prev) => (hasChildren ? !prev : prev));
            }}
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
        actions={() => (
          <>
            <OptionsButton folderId={folder.id} />
            <AddButton folderId={folder.id} />
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
