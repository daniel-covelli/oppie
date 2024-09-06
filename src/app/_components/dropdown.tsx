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

export default function DropDown({
  menuButton: MenuButton,
  options,
}: {
  menuButton: React.ComponentType;
  options: {
    id: string;
    component: React.ComponentType;
  }[];
}) {
  return (
    <div className="relative flex">
      <Menu>
        <MenuButton />
        <MenuItems
          transition
          anchor={{ to: "bottom start", gap: "4px" }}
          className="w-fit origin-top-right rounded border border-slate-600 bg-slate-700 p-2 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="flex flex-col gap-1">
            {options.map(({ id, component: Component }) => (
              <MenuItem key={id}>
                <Component />
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}

export function AddButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAddTitleModal();

  return (
    <>
      <DropDown
        menuButton={() => (
          <MenuButton
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "mb-0 rounded p-1 text-slate-300 hover:bg-slate-600",
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

export function OptionsButton({ folderId }: { folderId: string }) {
  const handleOpen = useOpenAlertModal();

  return (
    <>
      <DropDown
        menuButton={() => (
          <MenuButton
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "mb-0 rounded p-1 text-slate-300 hover:bg-slate-600",
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
