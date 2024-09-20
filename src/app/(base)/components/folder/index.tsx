"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FolderClosed from "~/app/components/svgs/folder-closed";
import FolderOpenSolid from "~/app/components/svgs/folder-open-solid";

import Chevron from "~/app/components/svgs/chevron";
import { usePathname } from "next/navigation";
import { type RouterOutputs } from "~/trpc/react";
import Files from "../files";
import OptionsMenu from "./options-menu";
import AddFolderOrFileMenu from "./add-folder-or-file-menu";
import FileFolderWrapper from "../file-folder-wrapper";

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
      <FileFolderWrapper
        active={isActive}
        left={{
          onClick: handleToggle,
          defaultIcon: opened ? (
            <FolderOpenSolid className="size-4" />
          ) : (
            <FolderClosed className="size-4" />
          ),
          hoveredIcon: hasChildren ? (
            <Chevron className="size-4 -rotate-90 p-0.5" />
          ) : (
            <FolderClosed className="size-4" />
          ),
        }}
        heading={{
          children: folder.heading.content,
          href: `/folder/${folder.id}`,
        }}
        right={
          <>
            <OptionsMenu folderId={folder.id} />
            <AddFolderOrFileMenu folderId={folder.id} />
          </>
        }
      />
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
