import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useOpenAddTitleModal } from "./modal/add-title-modal";
import clsx from "clsx";
import Plus from "./svgs/plus";
import FolderPlus from "./svgs/folder-plus";
import FilePlus from "./svgs/file-plus";
import Options from "./svgs/options";
import { useOpenAlertModal } from "./modal/alert-modal";
import TrashSolid from "./svgs/trash-solid";
import EditSolid from "./svgs/edit-solid";
import React from "react";
import IconButton from "./icon-button";

export default function DropDown({
  icon: Icon,
  options,
  shouldButtonDisapearOnOpen = false,
  title,
}: {
  icon: React.ComponentType;
  options: {
    id: string;
    component: React.ComponentType<{ close: () => void }>;
  }[];
  shouldButtonDisapearOnOpen?: boolean;
  title?: string;
}) {
  return (
    <Menu as="div" className="relative inline-block">
      {({ open, close }) => {
        return (
          <>
            <MenuButton as="div">
              <IconButton
                className={clsx(
                  open && shouldButtonDisapearOnOpen && "opacity-0",
                )}
              >
                <Icon />
              </IconButton>
            </MenuButton>
            <MenuItems
              transition
              anchor={{ to: "top start", gap: "2px", padding: "100px" }}
              className="origin-center rounded border border-slate-600 bg-slate-700 p-2 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-1">
                {title && (
                  <p className="pb-1 pl-2 text-xs text-gray-300">{title}</p>
                )}
                {options.map(({ id, component: Component }) => (
                  <MenuItem as={"div"} key={id} className="flex">
                    <Component close={close} />
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </>
        );
      }}
    </Menu>
  );
}

export function AddButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAddTitleModal();

  return (
    <>
      <DropDown
        icon={() => <Plus className="size-4" />}
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

export function OptionsButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAlertModal();

  return (
    <>
      <DropDown
        icon={() => <Options className="size-4" />}
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
              <button className="flex flex-row items-center gap-2 rounded p-1 leading-snug text-slate-200 hover:bg-slate-600">
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
