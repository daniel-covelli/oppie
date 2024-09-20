"use client";
import { api, type RouterOutputs } from "~/trpc/react";

import Folder from "./folder";
import ActionWrapper from "~/app/components/action-wrapper";
import Plus from "~/app/components/svgs/plus";
import AddTitleModal, {
  useOpenAddTitleModal,
} from "~/app/components/modal/add-title-modal";
import IconButton from "~/app/components/icon-button";
import { AlertDeleteFileOrFolder } from "./alert-delete-file-or-folder";

export default function Folders({
  initialFolders,
}: {
  initialFolders: RouterOutputs["folder"]["getFolders"];
}) {
  const { data: folders } = api.folder.getFolders.useQuery(undefined, {
    initialData: initialFolders,
  });
  const handleOpen = useOpenAddTitleModal();

  return (
    <>
      <AddTitleModal />
      <AlertDeleteFileOrFolder />
      <div className="flex flex-col">
        <div className="pl-2.5 pr-2">
          <ActionWrapper
            actions={() => (
              <IconButton
                onClick={(e) => {
                  handleOpen(e, { type: "folder" });
                }}
              >
                <Plus className="size-4" />
              </IconButton>
            )}
          >
            <p className="flex-1 text-sm">Folders</p>
          </ActionWrapper>
        </div>

        {folders && folders.length > 0 ? (
          <div className="pl-2.5 pr-2">
            {folders.map((folder) => (
              <Folder key={folder.id} folder={folder} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-1">
            <p className="text-sm text-gray-400">Nothing here yet</p>
          </div>
        )}
      </div>
    </>
  );
}
