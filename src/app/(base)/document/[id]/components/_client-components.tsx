"use client";

import clsx from "clsx";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { api, type RouterInputs, type RouterOutputs } from "~/trpc/react";
import TextIcon from "~/app/components/svgs/text";
import { Tile } from "~/app/components/clickable";
import InlineInput from "./inline-input";
import DropDown from "~/app/components/dropdown";
import Plus from "~/app/components/svgs/plus";
import Code from "~/app/components/svgs/code";
import HeadingIcon from "~/app/components/svgs/heading";

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

  return { manageNewComponent, lastComponentRef, components };
};

export default function FileContent({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  const { components, manageNewComponent, lastComponentRef } =
    useComponentFocusHandler(file.components);

  const utils = api.useUtils();
  const upsertComponent = api.component.upsertComponent.useMutation({
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
    const data = await upsertComponent.mutateAsync(args);

    manageNewComponent(data);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[23px_auto] gap-4 pb-5">
        <div />
        <InlineInput handleUpsert={handleUpdate} component={file.heading} />
      </div>
      {components.map((component, index) => (
        <div key={component.id} className="grid grid-cols-[25px_auto] gap-4">
          <div />
          <InlineInput
            ref={index === components.length - 1 ? lastComponentRef : undefined}
            handleUpsert={handleUpdate}
            component={component}
          />
        </div>
      ))}

      <InlineWrapper fileId={file.id} onClick={handleAdd}>
        <p className="text-slate-500">Add a component</p>
      </InlineWrapper>
    </div>
  );
}

function InlineWrapper({
  children,
  fileId,
  onClick,
}: PropsWithChildren<{
  fileId: string;
  onClick: (
    args: RouterInputs["component"]["upsertComponent"],
  ) => Promise<void>;
}>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="grid grid-cols-[25px_auto] gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={clsx(!isHovered && "opacity-0", "justify-center")}>
        <DropDown
          shouldButtonDisapearOnOpen
          buttonIcon={() => <Plus className="size-4" />}
          title="Select a block"
          options={[
            {
              id: "code",
              component: () => (
                <Tile
                  onClick={async () => onClick({ fileId, type: "CODE" })}
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
              component: () => (
                <Tile
                  onClick={() => onClick({ fileId, type: "HEADING" })}
                  icon={<HeadingIcon className="size-5" />}
                  title={"Heading"}
                  description={"Add a heading block"}
                />
              ),
            },
          ]}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
