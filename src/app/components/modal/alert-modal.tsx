import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Loading from "../svgs/loading";
import { create } from "zustand";
import { z } from "zod";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Button from "../button";

const FolderSchema = z.object({
  type: z.literal("folder"),
  folderId: z.string(),
});

const DocumentSchema = z.object({
  type: z.literal("document"),
  fileId: z.string(),
});

const FolderDocumentSchema = z.discriminatedUnion("type", [
  FolderSchema,
  DocumentSchema,
]);

type State = {
  isOpen: boolean;
  metaData: z.infer<typeof FolderDocumentSchema> | undefined;
};

type Action = {
  updateIsOpenState: (isOpen: State["isOpen"]) => void;
  updateMetaDataState: (metaData: State["metaData"]) => void;
};

const useAlertModalStore = create<State & Action>((set) => ({
  isOpen: false,
  metaData: undefined,
  updateIsOpenState: (isOpen) => set(() => ({ isOpen })),
  updateMetaDataState: (metaData) => set(() => ({ metaData })),
}));

export const useOpenAlertModal = () => {
  const { updateIsOpenState, updateMetaDataState } = useAlertModalStore(
    (store) => store,
  );
  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    metadata: z.infer<typeof FolderDocumentSchema>,
  ) => {
    updateIsOpenState(true);
    updateMetaDataState(metadata);
  };
  return handleOpen;
};

export default function AlertModal() {
  const { isOpen, updateIsOpenState, metaData } = useAlertModalStore(
    (store) => store,
  );
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();

  const deleteFile = api.file.deleteFile.useMutation();
  const deleteFolder = api.folder.deleteFolder.useMutation();

  const handleSubmit = async () => {
    setIsLoading(true);
    if (metaData?.type === "document") {
      await deleteFile.mutateAsync({ id: metaData.fileId });
    }
    if (metaData?.type === "folder") {
      await deleteFolder.mutateAsync({ id: metaData.folderId });
    }
    await utils.folder.getFolders.invalidate();
    router.replace("/");
    updateIsOpenState(false);
    setIsLoading(false);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => updateIsOpenState(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/50" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium">
                Are you sure?
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-slate-400">
                This will permanently delete this{" "}
                {metaData?.type === "folder"
                  ? `${metaData.type} and all of its children`
                  : metaData?.type}
              </p>
              <div className="mt-4 flex w-fit">
                <Button
                  color="danger"
                  className="flex w-36 items-center justify-center"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loading className="size-4" /> : "I am Sure"}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
