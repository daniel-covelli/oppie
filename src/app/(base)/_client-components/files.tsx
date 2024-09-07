import { usePathname } from "next/navigation";
import { type FolderType } from "./folder";
import { useOpenAlertModal } from "~/app/components/modal/alert-modal";
import ActionWrapper from "~/app/components/action-wrapper";
import clsx from "clsx";
import TrashSolid from "~/app/components/svgs/trash-solid";
import Link from "next/link";
import FileIcon from "~/app/components/svgs/file";

export default function Files({ files }: { files: FolderType["files"] }) {
  const pathname = usePathname();
  const handleOpen = useOpenAlertModal();

  return files.map((file) => (
    <ActionWrapper
      key={file.id}
      active={pathname.includes(file.id)}
      actions={() => (
        <button
          onClick={(e) => {
            handleOpen(e, { type: "document", fileId: file.id });
          }}
          className={clsx(
            "rounded p-1 text-slate-300 hover:bg-slate-600",
            "data-[active]:bg-slate-600",
          )}
        >
          <TrashSolid className="size-4" />
        </button>
      )}
    >
      <Link
        className="flex flex-1 flex-row items-center gap-3 truncate pl-1 text-left text-lg"
        href={`/document/${file.id}`}
      >
        <FileIcon className="size-4 shrink-0" />
        {file.heading.content}
      </Link>
    </ActionWrapper>
  ));
}
