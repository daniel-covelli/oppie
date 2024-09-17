"use client";

import { Fragment, type PropsWithChildren } from "react";
import { api, type RouterInputs, type RouterOutputs } from "~/trpc/react";
import InlineInput from "./inline-input";

import TrashSolid from "~/app/components/svgs/trash-solid";
import IconButton from "~/app/components/icon-button";
import CodeDisplay from "~/app/components/code-display";
import clsx from "clsx";
import { useComponentFocusHandler } from "./utils";
import CodeGen from "./code-gen";

export default function FileContent({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  const { data } = api.file.getFile.useQuery(
    { id: file.id },
    { initialData: file },
  );
  console.log("components", file.components);
  const { components, manageDeleteComponent, lastComponentRef } =
    useComponentFocusHandler(data.components);

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

  return (
    <>
      <div className="mb-40 flex flex-col gap-1">
        <InlineWrapper>
          <InlineInput
            fileId={data.id}
            handleUpsert={handleUpdate}
            component={data.heading}
          />
        </InlineWrapper>
        {components.map((component, index) => {
          return component.type === "CODE" && !component.content ? null : (
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
              {component.type === "CODE" &&
              data.codeOutputType &&
              component.content ? (
                <CodeDisplay
                  type={data.codeOutputType}
                  value={component.content}
                />
              ) : (
                <InlineInput
                  ref={
                    index === components.length - 1
                      ? lastComponentRef
                      : undefined
                  }
                  fileId={data.id}
                  handleUpsert={handleUpdate}
                  component={component}
                />
              )}
            </InlineWrapper>
          );
        })}

        <CodeGen file={data} />
      </div>
    </>
  );
}

export function InlineWrapper({
  children,
  cta: Cta = () => <Fragment />,
  className,
}: PropsWithChildren<{
  cta?: React.ComponentType;
  className?: string;
}>) {
  return (
    <div
      className={clsx("group grid grid-cols-[25px_auto] content-center gap-3")}
    >
      <div className={clsx("opacity-0 group-hover:opacity-100")}>
        <Cta />
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
