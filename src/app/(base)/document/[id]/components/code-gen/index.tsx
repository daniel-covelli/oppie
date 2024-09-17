import {
  Fragment,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import CodeDisplay from "~/app/components/code-display";
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
  Textarea,
} from "@headlessui/react";
import Button from "~/app/components/button";
import Submit from "~/app/components/svgs/submit";
import clsx from "clsx";
import { CodeOutputType, type ComponentTypes } from "@prisma/client";
import DropDown, {
  type DropdownOption,
  type DropdownOptions,
} from "~/app/components/dropdown";
import TextIcon from "~/app/components/svgs/text";
import Plus from "~/app/components/svgs/plus";
import PythonIcon from "~/app/components/svgs/python";
import ReactIcon from "~/app/components/svgs/react";
import HeadingIcon from "~/app/components/svgs/heading";
import { useComponentFocusHandler } from "../utils";
import { InlineWrapper } from "../_client-components";
import FollowUpActionsMenu, {
  useDeleteComponent,
} from "./follow-up-actions-menu";
import { MenuProvider, MenuTrigger } from "~/app/components/modal/menu";

type SelectComponentTypeArgs = {
  codeOutputType?: CodeOutputType;
  type: ComponentTypes;
};

function AddBlock({
  onClick,
  codeOutputType,
}: PropsWithChildren<{
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    extraArg: SelectComponentTypeArgs,
  ) => void;
  codeOutputType: CodeOutputType | null;
}>) {
  const codeOptions: Record<CodeOutputType, DropdownOption> = {
    [CodeOutputType.RTT]: {
      id: "RTT",
      description: "Build a component with AI",
      text: "React, Typescript, Tailwind",
      onClick: (e) => onClick(e, { type: "CODE", codeOutputType: "RTT" }),
      icon: () => <ReactIcon className="size-5" />,
    },
    [CodeOutputType.PYTHON]: {
      id: "Python",
      text: "Python",
      description: "Build a python code block with AI",
      onClick: (e) => onClick(e, { type: "CODE", codeOutputType: "PYTHON" }),
      icon: () => <PythonIcon className="size-5" />,
    },
  };
  const codeOptionsArray: DropdownOptions = codeOutputType
    ? [codeOptions[codeOutputType]]
    : Object.values(codeOptions);

  return (
    <DropDown
      shouldButtonDisapearOnOpen
      icon={() => <Plus className="size-4" />}
      title="Select a block"
      options={[
        ...codeOptionsArray,
        {
          id: "text",
          text: "Text",
          description: "Add a text block",
          icon: () => <TextIcon className="size-5" />,
          onClick: (e) => onClick(e, { type: "BODY" }),
        },
        {
          id: "heading",
          text: "Heading",
          description: "Add a heading block",
          icon: () => <HeadingIcon className="size-5" />,
          onClick: (e) => onClick(e, { type: "HEADING" }),
        },
      ]}
    />
  );
}

export default function CodeGen({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  const { manageNewComponentFocus } = useComponentFocusHandler(file.components);

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
    { initialData: undefined, refetchOnMount: false, enabled: false },
  );

  const utils = api.useUtils();
  const addEmptyComponent = api.component.addEmptyComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const updateCodeOutputType = api.file.addCodeOutputType.useMutation({
    onMutate: async ({ type, id }) => {
      await utils.file.getFile.cancel();

      const previousFile = utils.file.getFile.getData();

      utils.file.getFile.setData({ id }, (oldQueryData) => {
        if (oldQueryData) {
          return {
            ...oldQueryData,
            codeOutputType: type,
          };
        }
      });
      return { previousFile };
    },
    onError: (_, _newTodo, context) => {
      utils.file.getFile.setData({ id: file.id }, context?.previousFile);
    },
    onSuccess: async () => {
      void utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const popoverButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewComponent = async (
    _: React.MouseEvent<HTMLButtonElement>,
    args: SelectComponentTypeArgs,
  ) => {
    if (args.type === "CODE") {
      if (args.codeOutputType && !file.codeOutputType) {
        updateCodeOutputType.mutate({
          type: args.codeOutputType,
          id: file.id,
        });
      }
      return popoverButtonRef.current?.click();
    }

    const data = await addEmptyComponent.mutateAsync({
      fileId: file.id,
      type: args.type,
    });

    manageNewComponentFocus(data);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRefetching) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isRefetching, stream]);

  useEffect(() => {
    if (streamData && streamData?.length > 0) {
      setStream(streamData.join(""));
    }
  }, [streamData]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { handleDeleteComponent } = useDeleteComponent({
    fileId: file.id,
    setStream,
    newCodeComponentId,
  });

  return (
    <MenuProvider handleOutsidePress={handleDeleteComponent}>
      {({ setIsOpen }) => (
        <>
          {!popoverOpen && !stream && !called && (
            <InlineWrapper
              cta={() => (
                <AddBlock
                  onClick={handleNewComponent}
                  codeOutputType={file.codeOutputType}
                />
              )}
            >
              {addEmptyComponent.isPending ? (
                <div className="h-6 w-44 animate-pulse rounded-lg bg-slate-700" />
              ) : (
                <p className="text-slate-500">Add a component</p>
              )}
            </InlineWrapper>
          )}

          {file.codeOutputType && (called || !!stream) && (
            <InlineWrapper>
              <MenuTrigger>
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
              </MenuTrigger>
            </InlineWrapper>
          )}
          <FollowUpActionsMenu
            fileId={file.id}
            setStream={setStream}
            stream={stream}
            newCodeComponentId={newCodeComponentId}
          />
          <Popover className="ml-[37px]">
            {({ open }) => {
              setPopoverOpen(open);

              return (
                <>
                  <PopoverButton
                    className={"block w-full"}
                    ref={popoverButtonRef}
                  />
                  <PopoverPanel
                    transition
                    anchor={"bottom start"}
                    className="data-[closed]:transform-[scale(95%)] z-20 m-0 block w-[var(--button-width)] rounded border border-slate-600 bg-slate-750 p-2 duration-75 ease-out data-[closed]:opacity-0"
                  >
                    {!file.codeOutputType ? (
                      <Fragment />
                    ) : (
                      <>
                        <p className={"pb-1 text-xs text-slate-200"}>
                          What code would you like to generate?
                        </p>
                        <form
                          className="flex flex-row items-end"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setCalled(true);
                            const component =
                              await addEmptyComponent.mutateAsync({
                                fileId: file.id,
                                type: "CODE",
                              });
                            setNewCodeComponentId(component.id);
                            await refetch();
                            setCalled(false);
                            setInput("");
                            setIsOpen(true);
                          }}
                        >
                          <Textarea
                            autoFocus
                            className={clsx(
                              `mr-2 w-full resize-none bg-transparent text-lg focus:outline-none`,
                            )}
                            placeholder="Generate..."
                            value={input}
                            rows={3}
                            onChange={(e) => setInput(e.target.value)}
                          />

                          <Button
                            as={CloseButton}
                            type="submit"
                            variant="filled"
                            color="secondary"
                          >
                            <Submit className="size-4" />
                          </Button>
                        </form>
                      </>
                    )}
                  </PopoverPanel>
                </>
              );
            }}
          </Popover>
          <div ref={contentRef} />
        </>
      )}
    </MenuProvider>
  );
}
