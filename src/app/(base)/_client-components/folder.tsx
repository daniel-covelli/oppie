"use client";

import { useState } from "react";
import FolderClosed from "~/app/_components/svgs/folder-closed";
import FolderOpenSolid from "~/app/_components/svgs/folder-open-solid";
import Plus from "~/app/_components/svgs/plus";
import DropDown from "~/app/_components/dropdown";
import clsx from "clsx";
import Options from "~/app/_components/svgs/options";
import Modal, { HeadingModal } from "~/app/_components/modal";
import Button from "~/app/_components/button";
import Chevron from "~/app/_components/svgs/chevron";
import { api } from "~/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { MenuButton } from "@headlessui/react";
import TrashSolid from "~/app/_components/svgs/trash-solid";
import EditSolid from "~/app/_components/svgs/edit-solid";
import FolderPlus from "~/app/_components/svgs/folder-plus";
import FilePlus from "~/app/_components/svgs/file-plus";
import ActionWrapper from "~/app/_components/action-wrapper";
import Link from "next/link";
import FileIcon from "~/app/_components/svgs/file";
import Loading from "~/app/_components/svgs/loading";

interface FolderType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  ownerId: string;
  children?: FolderType[];
  files: { id: string; heading: { id: string; content: string } }[];
  heading: {
    id: string;
    content: string;
  };
}

function OptionsButton({ folderId }: { folderId: string }) {
  const openState = useState(false);
  const utils = api.useUtils();
  const router = useRouter();
  const deleteFolder = api.folder.deleteFolder.useMutation({
    onSuccess: async () => {
      await utils.folder.getFolders.invalidate();
      router.push(`/`);
    },
  });

  const handleDeleteFolder = async () => {
    deleteFolder.mutate({
      id: folderId,
    });
  };

  return (
    <>
      <Modal
        openState={openState}
        footer={() => (
          <Button as="button" color="danger" onClick={handleDeleteFolder}>
            {deleteFolder.isPending ? (
              <Loading className="size-4" />
            ) : (
              "I am Sure"
            )}
          </Button>
        )}
      />
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
                  e.stopPropagation();
                  openState[1](true);
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
  const utils = api.useUtils();
  const router = useRouter();
  const openState = useState(false);
  const openFileModalState = useState(false);
  const inputState = useState("");
  const addFile = api.file.addFile.useMutation({
    onSuccess: async (data) => {
      await utils.folder.getFolders.invalidate();
      openState[1](false);
      router.push(`/document/${data.id}`);
      setTimeout(() => {
        inputState[1]("");
      }, 1000);
    },
  });
  const addFolder = api.folder.addFolder.useMutation({
    onSuccess: async (data) => {
      await utils.folder.getFolders.invalidate();
      openState[1](false);
      router.push(`/folder/${data.id}`);
      setTimeout(() => {
        inputState[1]("");
      }, 1000);
    },
  });

  const handleAddFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputState[0]) return;
    addFolder.mutate({
      parentId: folderId,
      heading: inputState[0],
    });
  };

  const handleAddFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputState[0]) return;
    addFile.mutate({
      folderId: folderId,
      heading: inputState[0],
    });
  };

  return (
    <>
      <HeadingModal
        openState={openState}
        inputState={inputState}
        onSubmit={handleAddFolder}
      />
      <HeadingModal
        openState={openFileModalState}
        inputState={inputState}
        onSubmit={handleAddFile}
      />
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
                onClick={(e) => {
                  e.stopPropagation();
                  openState[1](true);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  openFileModalState[1](true);
                }}
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

export default function Folder({ folder }: { folder: FolderType }) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <ActionWrapper
        active={pathname.includes(folder.id)}
        preface={({ hovered }) => (
          <button
            className="rounded p-1 hover:bg-slate-600"
            onClick={(e) => {
              e.stopPropagation();
              setOpened((prev) =>
                folder.children && folder.children.length > 0 ? !prev : prev,
              );
            }}
          >
            {hovered && folder.children && folder.children.length > 0 ? (
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
      {opened && folder.children && folder.children.length > 0 && (
        <div className="flex flex-col pl-5">
          {folder.children.map((children) => (
            <Folder key={`${folder.id}${children.id}`} folder={children} />
          ))}
          {folder.files?.map((file) => (
            <ActionWrapper key={file.id} active={pathname.includes(file.id)}>
              <Link
                className="flex flex-1 flex-row items-center gap-3 truncate pl-1 text-left text-lg"
                href={`/document/${file.id}`}
              >
                <FileIcon className="size-4" />
                {file.heading.content}
              </Link>
            </ActionWrapper>
          ))}
        </div>
      )}
    </>
  );
}
