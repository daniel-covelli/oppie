import { useOpenAddTitleModal } from "~/app/components/floating/add-title-modal";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "~/app/components/floating/menu";
import { UIIconButton } from "~/app/components/icon-button";
import FilePlus from "~/app/components/svgs/file-plus";
import FolderPlus from "~/app/components/svgs/folder-plus";
import Plus from "~/app/components/svgs/plus";

export default function AddFolderOrFileMenu({
  folderId,
}: {
  folderId: string;
}) {
  const handleOpen = useOpenAddTitleModal();
  return (
    <Menu>
      <UIIconButton asChild>
        <MenuTrigger>
          <Plus className="size-4" />
        </MenuTrigger>
      </UIIconButton>
      <MenuContent>
        <MenuItem
          text="Add folder"
          icon={() => <FolderPlus className="size-4 text-slate-400" />}
          onClick={(e) => handleOpen(e, { type: "folder", parentId: folderId })}
        />
        <MenuItem
          text="Add document"
          icon={() => <FilePlus className="size-4 text-slate-400" />}
          onClick={(e) => {
            handleOpen(e, { type: "document", folderId });
          }}
        />
      </MenuContent>
    </Menu>
  );
}
