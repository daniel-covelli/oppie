import React from "react";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Loading from "../svgs/loading";

const FolderSchema = z.object({
  type: z.literal("folder"),
  parentId: z.string().optional(),
});

const DocumentSchema = z.object({
  type: z.literal("document"),
  folderId: z.string(),
});

const FolderDocumentSchema = z.discriminatedUnion("type", [
  FolderSchema,
  DocumentSchema,
]);

type State = {
  isLoading: boolean;
  isOpen: boolean;
  input: string;
  metaData: z.infer<typeof FolderDocumentSchema> | undefined;
};

type Action = {
  updateIsLoading: (loading: State["isLoading"]) => void;
  updateIsOpenState: (isOpen: State["isOpen"]) => void;
  updateInputState: (input: State["input"]) => void;
  updateMetaDataState: (metaData: State["metaData"]) => void;
};

export const useTitleModalStore = create<State & Action>((set) => ({
  isLoading: false,
  isOpen: false,
  input: "",
  metaData: undefined,
  updateIsLoading: (isLoading) => set(() => ({ isLoading })),
  updateIsOpenState: (isOpen) => set(() => ({ isOpen })),
  updateInputState: (input) => set(() => ({ input })),
  updateMetaDataState: (metaData) => set(() => ({ metaData })),
}));

export const useOpenAddTitleModal = () => {
  const { updateInputState, updateMetaDataState } = useTitleModalStore(
    (state) => state,
  );
  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    metaData: z.infer<typeof FolderDocumentSchema>,
  ) => {
    updateMetaDataState(metaData);
    updateInputState("");
  };

  return handleOpen;
};

export const useSubmitFileModal = () => {
  const {
    input,
    metaData,
    updateInputState,
    updateIsOpenState,
    updateIsLoading,
  } = useTitleModalStore((state) => state);

  const utils = api.useUtils();
  const router = useRouter();

  const addFolder = api.folder.addFolder.useMutation();
  const addFile = api.file.addFile.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    updateIsLoading(true);
    if (metaData?.type === "folder") {
      const data = await addFolder.mutateAsync({
        heading: input,
        parentId: metaData.parentId,
      });
      await utils.folder.getFolders.invalidate();
      router.push(`/folder/${data.id}`);
    }
    if (metaData?.type === "document") {
      const data = await addFile.mutateAsync({
        heading: input,
        folderId: metaData.folderId,
      });
      await utils.folder.getFolders.invalidate();
      await utils.file.getFile.prefetch({ id: data.id });
      router.push(`/document/${data.id}`);
    }
    updateIsLoading(false);
    updateIsOpenState(false);
    setTimeout(() => {
      updateInputState("");
    }, 1000);
  };

  return { handleSubmit };
};

export default function AddTitleModal() {
  const {
    isOpen,
    input,
    metaData,
    updateIsOpenState,
    updateInputState,
    isLoading,
  } = useTitleModalStore((state) => state);
  const { handleSubmit } = useSubmitFileModal();
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="fixed z-10 focus:outline-none"
      onClose={() => {
        updateIsOpenState(false);
        setTimeout(() => {
          updateInputState("");
        }, 1000);
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/70 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-screen w-screen items-start justify-center pt-20">
          <DialogPanel
            transition
            className="data-[closed]:transform-[scale(95%)] w-fit rounded-lg border border-slate-600 bg-slate-800 p-1 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
          >
            <form className="flex flex-row gap-2" onSubmit={handleSubmit}>
              <input
                onChange={(e) => updateInputState(e.target.value)}
                value={input}
                data-autofocus
                className="bg-slate-800 py-1 pl-1 text-4xl focus:outline-none"
                placeholder={`Add a ${metaData?.type} header`}
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="flex w-[85px] items-center justify-center"
                color="secondary"
              >
                {isLoading ? <Loading className="size-5" /> : "Submit"}
              </Button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
