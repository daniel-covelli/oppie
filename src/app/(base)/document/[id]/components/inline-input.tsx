import clsx from "clsx";
import React, { useImperativeHandle, useRef, useState } from "react";
import { type RouterInputs, type RouterOutputs } from "~/trpc/react";
import { useDebouncedCallback } from "use-debounce";

interface InlineInputProps {
  component: RouterOutputs["file"]["getFile"]["heading"];
  handleUpsert: (args: RouterInputs["component"]["upsertComponent"]) => void;
}

export interface MyComponentRef {
  focus: () => void;
}

const InlineInput = React.forwardRef<MyComponentRef, InlineInputProps>(
  ({ component, handleUpsert }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(component.content ?? "");

    const debounced = useDebouncedCallback((value: string) => {
      handleUpsert({
        id: component.id,
        content: value,
        fileId: component.fileId,
      });
    }, 1000);

    useImperativeHandle(ref, () => ({
      focus: () => {
        internalRef.current?.focus();
      },
    }));

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpsert({
            id: component.id,
            content: value,
            fileId: component.fileId,
          });
        }}
      >
        <input
          ref={internalRef}
          id={component.id}
          className={clsx(
            "bg-transparent focus:outline-none",
            component?.type === "HEADING" && "text-3xl",
          )}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debounced(e.target.value);
          }}
          placeholder="Add something here"
        />
      </form>
    );
  },
);

InlineInput.displayName = "InlineInput";

export default InlineInput;
