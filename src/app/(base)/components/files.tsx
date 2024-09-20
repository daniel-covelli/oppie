import { usePathname, useRouter } from "next/navigation";
import { type RecursiveFolderProps } from "./folder";
import TrashSolid from "~/app/components/svgs/trash-solid";
import FileIcon from "~/app/components/svgs/file";
import FileIconSolid from "~/app/components/svgs/file-solid";
import { useOpenDeletFileOrFolderModal } from "./alert-delete-file-or-folder";
import FileFolderWrapper from "./file-folder-wrapper";
import IconButton from "~/app/components/clickable";

export default function Files({
  files,
}: {
  files: RecursiveFolderProps["files"];
}) {
  const pathname = usePathname();
  const handleOpen = useOpenDeletFileOrFolderModal();
  const router = useRouter();

  return files.map((file) => {
    const isActive = pathname.includes(file.id);
    return (
      <FileFolderWrapper
        key={file.id}
        active={isActive}
        left={{
          onClick: () => router.push(`/document/${file.id}`),
          defaultIcon: isActive ? (
            <FileIconSolid className="size-4 shrink-0" />
          ) : (
            <FileIcon className="size-4 shrink-0" />
          ),
        }}
        heading={{
          href: `/document/${file.id}`,
          children: file.heading.content,
        }}
        right={
          <IconButton
            onClick={() => handleOpen({ type: "document", fileId: file.id })}
          >
            <TrashSolid className="size-4" />{" "}
          </IconButton>
        }
      />
    );
  });
}
