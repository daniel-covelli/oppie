"use client";

import { useState } from "react";
import FolderClosed from "~/app/_components/svgs/folder-closed";
import FolderOpenSolid from "~/app/_components/svgs/folder-open-solid";
import Plus from "~/app/_components/svgs/plus";
import DropDown from "~/app/_components/dropdown";
import clsx from "clsx";
import Options from "~/app/_components/svgs/options";
import Chevron from "~/app/_components/svgs/chevron";
import { usePathname } from "next/navigation";
import { MenuButton } from "@headlessui/react";
import TrashSolid from "~/app/_components/svgs/trash-solid";
import EditSolid from "~/app/_components/svgs/edit-solid";
import FolderPlus from "~/app/_components/svgs/folder-plus";
import FilePlus from "~/app/_components/svgs/file-plus";
import ActionWrapper from "~/app/_components/action-wrapper";
import Link from "next/link";
import { useOpenAddTitleModal } from "~/app/_components/modal/add-title-modal";
import { useOpenAlertModal } from "~/app/_components/modal/alert-modal";
import Files from "./files";
import { type FolderResponseType } from "~/definitions";

function OptionsButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAlertModal();

  return (
    <>
      <DropDown
        menuButton={() => (
          <MenuButton
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "rounded p-1 text-slate-300 hover:bg-slate-600",
              "data-[active]:bg-slate-600",
            )}
          >
            <Options className="size-4" />
          </MenuButton>
        )}
        options={[
          {
            id: "Delete",
            component: () => (
              <button
                onClick={(e) => {
                  handleOpen(e, { type: "folder", folderId });
                }}
                className="flex w-full flex-row items-center gap-2 rounded p-1 leading-snug text-slate-200 hover:bg-slate-600"
              >
                <TrashSolid className="size-4 text-slate-400" />
                <p className="text-sm">{"Delete"}</p>
              </button>
            ),
          },
          {
            id: "Edit",
            component: () => (
              <button className="flex flex-1 flex-row items-center gap-2 rounded p-1 leading-snug text-slate-200 hover:bg-slate-600">
                <EditSolid className="size-4 text-slate-400" />
                <p className="text-sm">{"Edit name"}</p>
              </button>
            ),
          },
        ]}
      />
    </>
  );
}

function AddButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAddTitleModal();

  return (
    <>
      <DropDown
        menuButton={() => (
          <MenuButton
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "rounded p-1 text-slate-300 hover:bg-slate-600",
              "data-[active]:bg-slate-600",
            )}
          >
            <Plus className="size-4" />
          </MenuButton>
        )}
        options={[
          {
            id: "Add folder",
            component: () => (
              <button
                onClick={(e) =>
                  handleOpen(e, { type: "folder", parentId: folderId })
                }
                className="flex flex-1 flex-row items-center gap-2 rounded p-1 px-2 leading-snug text-slate-200 hover:bg-slate-600"
              >
                <FolderPlus className="size-4 text-slate-400" />
                <p className="text-sm">{"Add folder"}</p>
              </button>
            ),
          },
          {
            id: "Add document",
            component: () => (
              <button
                onClick={(e) => handleOpen(e, { type: "document", folderId })}
                className="flex flex-1 flex-row items-center gap-2 rounded p-1 px-2 leading-snug text-slate-200 hover:bg-slate-600"
              >
                <FilePlus className="size-4 text-slate-400" />
                <p className="text-sm">{"Add document"}</p>
              </button>
            ),
          },
        ]}
      />
    </>
  );
}

export default function Folder({ folder }: { folder: FolderResponseType }) {
  const [opened, setOpened] = useState(folder.isOpen);
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
        <div className="flex flex-col pl-5">
          {folder.children?.map((children) => (
            <Folder key={`${folder.id}${children.id}`} folder={children} />
          ))}
          <Files files={folder.files} />
        </div>
      )}
    </>
  );
}
