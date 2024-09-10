"use client";

import clsx from "clsx";
import {
  type FormEvent,
  Fragment,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { api, type RouterInputs, type RouterOutputs } from "~/trpc/react";
import TextIcon from "~/app/components/svgs/text";
import { Tile } from "~/app/components/clickable";
import InlineInput from "./inline-input";
import DropDown from "~/app/components/dropdown";
import Plus from "~/app/components/svgs/plus";
import Code from "~/app/components/svgs/code";
import HeadingIcon from "~/app/components/svgs/heading";
import TrashSolid from "~/app/components/svgs/trash-solid";
import IconButton from "~/app/components/icon-button";
import { tsxLanguage } from "@codemirror/lang-javascript";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { myTheme } from "~/app/_configs";
import PromptModal, { usePromptModal } from "./prompt-modal";

type ComponentType = RouterOutputs["file"]["getFile"]["heading"];

const useComponentFocusHandler = (
  initialComponents: RouterOutputs["file"]["getFile"]["components"],
) => {
  const [components, setComponents] = useState(initialComponents);
  const [isNewComponentAdded, setIsNewComponentAdded] = useState(false);
  const lastComponentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNewComponentAdded && lastComponentRef.current) {
      lastComponentRef.current.focus();
      setIsNewComponentAdded(false);
    }
  }, [components, isNewComponentAdded]);

  const manageNewComponent = (newComponent: ComponentType) => {
    setComponents((prev) => [...prev, newComponent]);
    setIsNewComponentAdded(true);
  };

  const manageDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((component) => component.id !== id));
  };

  return {
    manageNewComponent,
    manageDeleteComponent,
    lastComponentRef,
    components,
  };
};

export default function FileContent({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  const {
    components,
    manageNewComponent,
    manageDeleteComponent,
    lastComponentRef,
  } = useComponentFocusHandler(file.components);
  const { handleOpenModal, positionRef, updateIsOpen } = usePromptModal();
  const [input, setInput] = useState("");

  const utils = api.useUtils();
  const upsertComponent = api.component.upsertComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const deleteComponent = api.component.delete.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });

  const handleUpdate = async (
    args: RouterInputs["component"]["upsertComponent"],
  ) => {
    upsertComponent.mutate(args);
  };

  const handleAdd = async (
    args: RouterInputs["component"]["upsertComponent"],
  ) => {
    if (args.type === "CODE") {
      return handleOpenModal();
    }

    const data = await upsertComponent.mutateAsync(args);

    manageNewComponent(data);
  };

  const { mutateAsync } = api.claude.getMessage.useMutation();

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setSubmitted(true);
    const data = await mutateAsync({ input });
    const component = await upsertComponent.mutateAsync({
      fileId: file.id,
      type: "CODE",
      content: data.message,
    });
    updateIsOpen(false);
    setSubmitted(true);
    manageNewComponent(component);
  };

  return (
    <>
      <div className="mb-40 flex flex-col gap-1">
        <InlineWrapper>
          <InlineInput handleUpsert={handleUpdate} component={file.heading} />
        </InlineWrapper>
        {components.map((component, index) => {
          return (
            <InlineWrapper
              key={component.id}
              cta={() => (
                <IconButton
                  onClick={() => {
                    deleteComponent.mutate({ id: component.id });
                    manageDeleteComponent(component.id);
                  }}
                >
                  <TrashSolid className="size-4" />
                </IconButton>
              )}
            >
              {component.type === "CODE" ? (
                <CodeMirror
                  key={component.id}
                  id="code-block"
                  readOnly
                  value={component.content ?? ""}
                  extensions={[tsxLanguage, EditorView.lineWrapping]}
                  theme={myTheme}
                />
              ) : (
                <InlineInput
                  ref={
                    index === components.length - 1
                      ? lastComponentRef
                      : undefined
                  }
                  handleUpsert={handleUpdate}
                  component={component}
                />
              )}
            </InlineWrapper>
          );
        })}

        <InlineWrapper
          cta={() => <AddBlock fileId={file.id} onClick={handleAdd} />}
        >
          <p ref={positionRef} className="text-slate-500">
            Add a component
          </p>
        </InlineWrapper>
      </div>
      <PromptModal
        onSubmit={onSubmit}
        input={input}
        setInput={setInput}
        loading={submitted}
      />
    </>
  );
}

function AddBlock({
  fileId,
  onClick,
}: PropsWithChildren<{
  fileId: string;
  onClick: (
    args: RouterInputs["component"]["upsertComponent"],
  ) => Promise<void>;
}>) {
  return (
    <DropDown
      shouldButtonDisapearOnOpen
      icon={() => <Plus className="size-4" />}
      title="Select a block"
      options={[
        {
          id: "code",
          component: ({ close }) => (
            <Tile
              onClick={async () => {
                close();
                await onClick({ fileId, type: "CODE" });
              }}
              icon={<Code className="size-5" />}
              title={"Code"}
              description={"Build a code block with AI"}
            />
          ),
        },
        {
          id: "text",
          component: ({ close }) => (
            <Tile
              onClick={async () => {
                await onClick({ fileId, type: "BODY" });
                close();
              }}
              icon={<TextIcon className="size-5" />}
              title={"Text"}
              description={"Add a text block"}
            />
          ),
        },
        {
          id: "heading",
          component: ({ close }) => (
            <Tile
              onClick={async () => {
                await onClick({ fileId, type: "HEADING" });
                close();
              }}
              icon={<HeadingIcon className="size-5" />}
              title={"Heading"}
              description={"Add a heading block"}
            />
          ),
        },
      ]}
    />
  );
}

function InlineWrapper({
  children,
  cta: Cta = () => <Fragment />,
}: PropsWithChildren<{
  cta?: React.ComponentType;
}>) {
  return (
    <div
      className={clsx("group grid grid-cols-[25px_auto] content-center gap-3")}
    >
      <div className={clsx("opacity-0 group-hover:opacity-100")}>
        <Cta />
      </div>
      <div>{children}</div>
    </div>
  );
}
