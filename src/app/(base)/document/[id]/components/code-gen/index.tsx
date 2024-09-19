import { Fragment, useEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import CodeDisplay from "~/app/components/code-display";
import { useComponentFocusHandler } from "../utils";
import { InlineWrapper } from "../_client-components";
import FollowUpActionsMenu from "./follow-up-actions-menu";
import { AddComponentMenu } from "./add-component-menu";
import { useControlledMenu } from "~/app/components/modal/menu";
import {
  Dialog,
  DialogContent,
  DialogHeading,
} from "~/app/components/modal/dialog";
import { CloseButton } from "@headlessui/react";
import clsx from "clsx";
import Submit from "~/app/components/svgs/submit";
import Button from "~/app/components/button";

export default function CodeGen({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  useComponentFocusHandler(file.components);

  const [stream, setStream] = useState("");
  const [input, setInput] = useState("");
  const [called, setCalled] = useState(false);
  const [newCodeComponentId, setNewCodeComponentId] = useState("");
  const {
    data: streamData,
    refetch,
    isRefetching,
  } = api.claude.getMessageStreamForFile.useQuery(
    {
      input,
      fileId: file.id,
    },
    {
      // initialData: undefined,
      refetchOnMount: false,
      enabled: false,
      gcTime: 0,
      // manual: true,
    },
  );

  const [isPromptingOpen, setIsPromptingOpen] = useState(false);

  const utils = api.useUtils();
  const addEmptyComponent = api.component.addEmptyComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRefetching || called) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [called, isRefetching]);

  useEffect(() => {
    if (streamData && streamData?.length > 0) {
      setStream(streamData.join(""));
    }
  }, [streamData]);

  const { isMenuOpen, setIsMenuOpen, setMenuAnchorRef, menuAnchorRef } =
    useControlledMenu();

  const [modalAnchorRef, setModalAnchorRef] = useState<HTMLElement | null>(
    null,
  );

  return (
    <>
      {!isPromptingOpen && !stream && !called && (
        <AddComponentMenu
          id={file.id}
          codeOutputType={file.codeOutputType}
          setIsPromptingOpen={setIsPromptingOpen}
        />
      )}

      {file.codeOutputType && (called || !!stream) && (
        <InlineWrapper>
          <div ref={setMenuAnchorRef}>
            {called && !stream && (
              <div className="h-96 w-full animate-pulse rounded-lg bg-slate-700" />
            )}
            {!!stream &&
              (stream.includes("<code>") ? (
                <div className="shadow-[0_0_25px_-9px_rgba(173,216,230,0.5)]">
                  <CodeDisplay value={stream} type={file.codeOutputType} />
                </div>
              ) : (
                <p>{stream}</p>
              ))}
          </div>
        </InlineWrapper>
      )}
      <div ref={setModalAnchorRef} className="ml-[37px] bg-slate-100" />
      <FollowUpActionsMenu
        fileId={file.id}
        setStream={setStream}
        stream={stream}
        open={isMenuOpen}
        setOpen={setIsMenuOpen}
        anchorRef={menuAnchorRef}
        newCodeComponentId={newCodeComponentId}
        setIsPromptingOpen={setIsPromptingOpen}
      />

      <Dialog
        anchorRef={modalAnchorRef}
        setOpen={setIsPromptingOpen}
        open={isPromptingOpen}
        handleOutsidePress={() => setStream("")}
        placement="bottom-start"
      >
        <DialogContent className="rounded border border-slate-600 bg-slate-750 p-2">
          {!file.codeOutputType ? (
            <Fragment />
          ) : (
            <>
              <DialogHeading className={"pb-1 text-xs text-slate-200"}>
                What code would you like to generate?
              </DialogHeading>
              <form
                className="flex flex-row items-end"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsPromptingOpen(false);
                  setStream("");
                  setCalled(true);
                  const component = await addEmptyComponent.mutateAsync({
                    fileId: file.id,
                    type: "CODE",
                  });
                  setNewCodeComponentId(component.id);
                  await refetch();
                  setCalled(false);
                  setInput("");
                  setIsMenuOpen(true);
                }}
              >
                <textarea
                  className={clsx(
                    `mr-2 w-full resize-none bg-transparent text-lg focus:outline-none`,
                  )}
                  placeholder="Generate..."
                  value={input}
                  rows={3}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <Button
                  as={CloseButton}
                  type="submit"
                  variant="filled"
                  color="secondary"
                  onClick={() => setIsPromptingOpen(false)}
                >
                  <Submit className="size-4" />
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div ref={contentRef} />
    </>
  );
}
