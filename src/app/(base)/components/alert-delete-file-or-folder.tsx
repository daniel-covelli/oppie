import { z } from "zod";
import AlertDialog from "../../components/floating/dialog/alert-dialog";
import { create } from "zustand";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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
  fileOrDocumentData: z.infer<typeof FolderDocumentSchema> | undefined;
};

type Action = {
  updateIsOpenState: (isOpen: State["isOpen"]) => void;
  updateFileOrDocumentDataState: (
    metaData: State["fileOrDocumentData"],
  ) => void;
};

const useAlertModalStore = create<State & Action>((set) => ({
  isOpen: false,
  fileOrDocumentData: undefined,
  updateIsOpenState: (isOpen) => set(() => ({ isOpen })),
  updateFileOrDocumentDataState: (fileOrDocumentData) =>
    set(() => ({ fileOrDocumentData })),
}));

export const useOpenDeletFileOrFolderModal = () => {
  const { updateIsOpenState, updateFileOrDocumentDataState } =
    useAlertModalStore((store) => store);
  const handleOpen = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileOrDocumentData: z.infer<typeof FolderDocumentSchema>,
  ) => {
    updateIsOpenState(true);
    updateFileOrDocumentDataState(fileOrDocumentData);
  };
  return handleOpen;
};

const ALERT_DESCRIPTION_BY_TYPE = {
  folder: "This will permanently delete this folder and all of its content",
  document: "This will permanently delete this document",
};

export const AlertDeleteFileOrFolder = () => {
  const { isOpen, updateIsOpenState, fileOrDocumentData } = useAlertModalStore(
    (store) => store,
  );
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();

  const deleteFile = api.file.deleteFile.useMutation();
  const deleteFolder = api.folder.deleteFolder.useMutation();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (fileOrDocumentData?.type === "document") {
        await deleteFile.mutateAsync({ id: fileOrDocumentData.fileId });
      }
      if (fileOrDocumentData?.type === "folder") {
        await deleteFolder.mutateAsync({ id: fileOrDocumentData.folderId });
      }
      await utils.folder.getFolders.invalidate();
      router.replace("/");
      updateIsOpenState(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fileOrDocumentData?.type) return null;

  return (
    <AlertDialog
      open={isOpen}
      loading={isLoading}
      setOpen={updateIsOpenState}
      heading="Are you sure?"
      description={ALERT_DESCRIPTION_BY_TYPE[fileOrDocumentData.type]}
      danger={{ text: "I am sure", onClick: handleSubmit }}
    />
  );
};
