"use client";
import { api } from "~/trpc/react";

import Folder from "./folder";
import ActionWrapper from "~/app/_components/action-wrapper";
import Plus from "~/app/_components/svgs/plus";
import AddTitleModal, {
  useOpenAddTitleModal,
} from "~/app/_components/modal/add-title-modal";
import AlertModal from "~/app/_components/modal/alert-modal";

// type State = {
//   openSet: Set<string>;
//   // closeSet: Set<string>;
// };

// type Action = {
//   updateOpenSet: (openSet: State["openSet"]) => void;
//   // updateCloseSet: (closeSet: State["closeSet"]) => void;
//   // addToOpenSet: (id: string, openSet: State["openSet"]) => void
//   // addToClosedSet: (id: string, closeSet: State["closeSet"]) => void
// };

// export const useOpenFilesStore = create<State & Action>((set) => ({
//   openSet: new Set<string>(),
//   // closeSet: new Set<string>(),
//   updateOpenSet: (openSet) => set(() => ({ openSet })),
//   // updateCloseSet: (closeSet) => set(() => ({ closeSet })),
//   // addToOpenSet: (id, openSet) => set(() => ({openSet: openSet.add(id)})),
//   // addToCloseSet: (id, closeSet) => set(() => ({closeSet: closeSet.add(id)}))
// }));

// interface Folders {
//   id: string;
//   parents?: Folders[];
//   children?: Folders[];
//   files?: { id: string }[];
// }

// const useOpenFiles = (folders: RouterOutputs["folder"]["getFolders"]) => {
//   const pathName = usePathname();

//   const { updateOpenSet, openSet } = useOpenFilesStore();

//   const dfs = useCallback(
//     (folder: Folders): boolean => {
//       if (!folder.children) return false;
//       if (pathName.includes(folder.id)) {
//         return true;
//       }
//       let res = false;
//       for (const file of folder.files ?? []) {
//         if (pathName.includes(file.id)) {
//           res = true;
//         }
//       }

//       for (const child of folder.children) {
//         res = dfs(child);
//       }

//       if (res) {
//         updateOpenSet(openSet.add(folder.id));
//       }
//       return res;
//     },
//     [openSet, pathName, updateOpenSet],
//   );

//   useEffect(() => {
//     updateOpenSet(new Set());
//     if (folders) {
//       for (const folder of folders) {
//         dfs(folder);
//       }
//     }
//   }, [pathName, folders, updateOpenSet, dfs]);
// };

export default function Folders() {
  const { data: folders } = api.folder.getFolders.useQuery();
  const handleOpen = useOpenAddTitleModal();
  // useOpenFiles(folders);

  return (
    <>
      <AddTitleModal />
      <AlertModal />
      <div className="flex flex-col">
        <div className="pl-2.5 pr-4">
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
          <div className="pl-2.5 pr-4">
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
