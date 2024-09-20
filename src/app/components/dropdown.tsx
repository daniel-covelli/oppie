import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useOpenAddTitleModal } from "./floating/add-title-modal";
import clsx from "clsx";
import Plus from "./svgs/plus";
import FolderPlus from "./svgs/folder-plus";
import FilePlus from "./svgs/file-plus";
import React, { type Dispatch, type SetStateAction } from "react";
import IconButton from "./icon-button";
import { DropdownButton, type DropdownButtonProps } from "./clickable";

const dummyDispatch: Dispatch<SetStateAction<boolean>> = (_) => undefined;

export interface DropdownOption extends DropdownButtonProps {
  id: string;
}

export type DropdownOptions = DropdownOption[];

export default function DropDown({
  icon: Icon,
  options,
  shouldButtonDisapearOnOpen = false,
  title,
  setIgnoreMouseOut = dummyDispatch,
}: {
  icon: React.ComponentType;
  options: DropdownOptions;
  shouldButtonDisapearOnOpen?: boolean;
  title?: string;
  setIgnoreMouseOut?: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Menu>
      {({ open }) => {
        return (
          <>
            <MenuButton
              as={IconButton}
              className={clsx(
                open && shouldButtonDisapearOnOpen && "opacity-0",
                "mb-0!",
              )}
              onClick={() => setIgnoreMouseOut(true)}
            >
              <Icon />
            </MenuButton>
            <MenuItems
              transition
              anchor={{ to: "top start", gap: "2px", padding: "100px" }}
              className="origin-center rounded border border-slate-600 bg-slate-700 p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-1">
                {title && (
                  <p className="pb-1 pl-2 text-xs text-gray-300">{title}</p>
                )}
                {options.map(({ id, ...props }) => (
                  <MenuItem key={id} as={DropdownButton} {...props} />
                ))}
              </div>
            </MenuItems>
          </>
        );
      }}
    </Menu>
  );
}

interface FolderTriggerProps {
  folderId: string;
  // setHovered: Dispatch<SetStateAction<boolean>>;
  // setIgnoreMouseOut: Dispatch<SetStateAction<boolean>>;
}

export function AddButton({
  folderId,
  // setHovered,
  // setIgnoreMouseOut,
}: FolderTriggerProps) {
  const handleOpen = useOpenAddTitleModal();

  return (
    <>
      <DropDown
        // setIgnoreMouseOut={setIgnoreMouseOut}
        icon={() => <Plus className="size-4" />}
        options={[
          {
            id: "Add folder",
            text: "Add folder",
            icon: () => <FolderPlus className="size-4 text-slate-400" />,
            onClick: (e) => {
              handleOpen(e, { type: "folder", parentId: folderId });
              // setHovered(false);
              // setIgnoreMouseOut(false);
            },
          },
          {
            id: "Add document",
            text: "Add document",
            icon: () => <FilePlus className="size-4 text-slate-400" />,
            onClick: (e) => {
              handleOpen(e, { type: "document", folderId });
              // setHovered(false);
              // setIgnoreMouseOut(false);
            },
          },
        ]}
      />
    </>
  );
}

// export function OptionsButton({
//   folderId,
//   setIgnoreMouseOut,
// }: FolderTriggerProps) {
//   const handleOpen = useOpenDeletFileOrFolderModal();

//   return (
//     <>
//       <DropDown
//         setIgnoreMouseOut={setIgnoreMouseOut}
//         icon={() => <Options className="size-4" />}
//         options={[
//           {
//             id: "Delete",
//             text: "Delete",
//             icon: () => <TrashSolid className="size-4 text-slate-400" />,
//             onClick: (e) => {
//               handleOpen(e, { type: "folder", folderId });
//             },
//           },
//           {
//             id: "Edit",
//             icon: () => <EditSolid className="size-4 text-slate-400" />,
//             disabled: true,
//             text: "Edit Name",
//           },
//         ]}
//       />
//     </>
//   );
// }
