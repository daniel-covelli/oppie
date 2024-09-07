"use client";
import { api, type RouterOutputs } from "~/trpc/react";

import Folder from "./folder";
import ActionWrapper from "~/app/components/action-wrapper";
import Plus from "~/app/components/svgs/plus";
import AddTitleModal, {
  useOpenAddTitleModal,
} from "~/app/components/modal/add-title-modal";
import AlertModal from "~/app/components/modal/alert-modal";

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
      <AlertModal />
      <div className="flex flex-col">
        <div className="pl-2.5 pr-2">
          <ActionWrapper
            actions={() => (
              <button
                onClick={(e) => {
                  handleOpen(e, { type: "folder" });
                }}
                className="flex flex-1 flex-row items-center gap-2 rounded p-1 leading-snug text-slate-200 hover:bg-slate-600"
              >
                <Plus className="size-4" />
              </button>
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
