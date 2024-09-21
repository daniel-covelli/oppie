import {
  MenuContent,
  MenuItem,
  Menu,
  MenuTrigger,
} from "~/app/components/floating/menu";
import TrashSolid from "~/app/components/svgs/trash-solid";
import { useOpenDeletFileOrFolderModal } from "../alert-delete-file-or-folder";
import Options from "~/app/components/svgs/options";
import { UIIconButton } from "~/app/components/icon-button";
import EditSolid from "~/app/components/svgs/edit-solid";

export default function OptionsMenu({ folderId }: { folderId: string }) {
  const handleOpen = useOpenDeletFileOrFolderModal();
  return (
    <Menu>
      <UIIconButton asChild>
        <MenuTrigger>
          <Options className="size-4" />
        </MenuTrigger>
      </UIIconButton>
      <MenuContent>
        <MenuItem
          text="Delete"
          icon={() => <TrashSolid className="size-4 text-slate-400" />}
          onClick={() => {
            handleOpen({ type: "folder", folderId });
          }}
        />
        <MenuItem
          text="Edit"
          disabled
          icon={() => <EditSolid className="size-4 text-slate-400" />}
        />
      </MenuContent>
    </Menu>
  );
}
