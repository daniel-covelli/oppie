import { type FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import CodeDisplay from "~/app/components/code-display";
import { useComponentFocusHandler } from "../utils";
import { InlineWrapper } from "../_client-components";
import FollowUpActionsMenu from "./follow-up-actions-menu";
import { AddComponentMenu } from "./add-component-menu";
import { useControlledMenu } from "~/app/components/floating/menu";

import PromptDialog from "./prompt-dialog";
import { useMergeRefs } from "@floating-ui/react";

export default function CodeGen({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  useComponentFocusHandler(file.components);

  const [stream, setStream] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCodeComponentId, setNewCodeComponentId] = useState("");
  const {
    data: streamData,
    refetch,
    isRefetching,
  } = api.claude.getMessageStreamForFile.useQuery(
    {
      input: prompt,
      fileId: file.id,
    },
    {
      refetchOnMount: false,
      enabled: false,
      gcTime: 0,
    },
  );

  const utils = api.useUtils();
  const addEmptyComponent = api.component.addEmptyComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRefetching) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, isRefetching]);

  useEffect(() => {
    if (streamData && streamData?.length > 0) {
      setStream(streamData.join(""));
    }
  }, [streamData]);

  const handlePromptSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStream("");
    setLoading(true);
    setIsPromptingOpen(false);
    try {
      const component = await addEmptyComponent.mutateAsync({
        fileId: file.id,
        type: "CODE",
      });
      setNewCodeComponentId(component.id);
      await refetch();
      setPrompt("");
      setIsFollowUpMenuOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const {
    isMenuOpen: isFollowUpMenuOpen,
    setIsMenuOpen: setIsFollowUpMenuOpen,
    setMenuAnchorRef,
    menuAnchorRef,
  } = useControlledMenu();

  const [modalAnchorRef, setModalAnchorRef] = useState<HTMLElement | null>(
    null,
  );

  const [isPromptingOpen, setIsPromptingOpen] = useState(false);

  return (
    <>
      {!isPromptingOpen && !stream && !loading && (
        <AddComponentMenu
          id={file.id}
          codeOutputType={file.codeOutputType}
          setIsPromptingOpen={setIsPromptingOpen}
        />
      )}

      {file.codeOutputType && (loading || !!stream) && (
        <InlineWrapper>
          <div>
            {loading && !stream && (
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
      <div
        ref={useMergeRefs([setModalAnchorRef, setMenuAnchorRef])}
        className="ml-[37px] bg-slate-100"
      />
      <FollowUpActionsMenu
        fileId={file.id}
        setStream={setStream}
        stream={stream}
        open={isFollowUpMenuOpen}
        setOpen={setIsFollowUpMenuOpen}
        anchorRef={menuAnchorRef}
        newCodeComponentId={newCodeComponentId}
        setIsPromptingOpen={setIsPromptingOpen}
      />
      <PromptDialog
        anchorRef={modalAnchorRef}
        loading={loading}
        open={isPromptingOpen}
        setOpen={setIsPromptingOpen}
        prompt={prompt}
        onPromptChange={setPrompt}
        handleSubmit={handlePromptSubmit}
        handleDialogCanceled={() => {
          setPrompt("");
          setStream("");
        }}
      />

      <div ref={contentRef} />
    </>
  );
}
