// export function OptionsButton({
//   folderId,
//   setIgnoreMouseOut,
// }: FolderTriggerProps) {
//   const handleOpen = useOpenDeletFileOrFolderModal();

import {
  MenuContent,
  MenuItem,
  Menu,
  MenuTrigger,
} from "~/app/components/modal/menu";
import TrashSolid from "~/app/components/svgs/trash-solid";
import { useOpenDeletFileOrFolderModal } from "../alert-delete-file-or-folder";
import Options from "~/app/components/svgs/options";

export default function OptionsMenu({ folderId }: { folderId: string }) {
  const handleOpen = useOpenDeletFileOrFolderModal();
  return (
    <Menu>
      <MenuTrigger>
        <Options className="size-4" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          text="Delete"
          icon={() => <TrashSolid className="size-4 text-slate-400" />}
          onClick={(e) => {
            handleOpen(e, { type: "folder", folderId });
          }}
        />
      </MenuContent>
    </Menu>
  );
}
