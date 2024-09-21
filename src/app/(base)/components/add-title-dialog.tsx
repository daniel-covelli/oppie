import { Dialog, DialogContent } from "~/app/components/floating/dialog";
import Button from "~/app/components/button";
import Spinner from "~/app/components/svgs/spinner";
import Submit from "~/app/components/svgs/submit";
import { z } from "zod";
import { create } from "zustand";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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

export const useOpenAddTitleDialog = () => {
  const { updateInputState, updateMetaDataState, updateIsOpenState } =
    useTitleModalStore((state) => state);
  const handleOpen = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    metaData: z.infer<typeof FolderDocumentSchema>,
  ) => {
    updateMetaDataState(metaData);
    updateInputState("");
    updateIsOpenState(true);
  };

  return handleOpen;
};

const useSubmitTitleModal = () => {
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

export default function AddFileOrFolderTitleDialog() {
  const {
    isOpen,
    input,
    metaData,
    updateIsOpenState,
    updateInputState,
    isLoading,
  } = useTitleModalStore((state) => state);

  const { handleSubmit } = useSubmitTitleModal();

  return (
    <Dialog open={isOpen} setOpen={updateIsOpenState}>
      <DialogContent isCentered className="p-1 dialog">
        <form className="flex flex-row gap-2" onSubmit={handleSubmit}>
          <input
            onChange={(e) => updateInputState(e.target.value)}
            value={input}
            data-autofocus
            className="mr-2 w-[470px] bg-slate-750 py-1 pl-1 text-4xl focus:outline-none"
            placeholder={`Add a ${metaData?.type} header`}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="flex w-20 items-center justify-center"
            color="secondary"
          >
            {isLoading ? (
              <Spinner className="size-5" />
            ) : (
              <Submit className="size-5" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
