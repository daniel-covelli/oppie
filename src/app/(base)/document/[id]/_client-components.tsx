"use client";

import clsx from "clsx";
import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useDebouncedCallback } from "use-debounce";

type ComponentType = RouterOutputs["file"]["getFile"]["heading"];
interface SubmitArgs {
  component: ComponentType;
  value: string;
}

function InlineInput({
  component,
  handleUpsert,
}: {
  component: ComponentType;
  handleUpsert: (args: SubmitArgs) => void;
}) {
  const [value, setValue] = useState(component.content);

  const debounced = useDebouncedCallback((value: string) => {
    handleUpsert({ component, value });
  }, 1000);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpsert({ component, value });
      }}
    >
      <input
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
}

export default function FileContent({
  file,
}: {
  file: RouterOutputs["file"]["getFile"];
}) {
  const { data } = api.file.getFile.useQuery(
    {
      id: file.id,
    },
    { initialData: file },
  );

  const utils = api.useUtils();
  const upsertComponent = api.component.upsertComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: file.id });
    },
  });
  console.log("data", JSON.stringify(data, null, 2));

  // if (isPending) return "Loading...";
  const handleUpsert = ({ component, value }: SubmitArgs) => {
    console.log(
      "component",
      JSON.stringify(
        {
          id: component.id,
          content: value,
          fileId: file.id,
        },
        null,
        2,
      ),
    );

    upsertComponent.mutate({
      id: component.id,
      content: value,
      fileId: file.id,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <InlineInput handleUpsert={handleUpsert} component={data.heading} />
      {data.components.map((component) => (
        <InlineInput
          handleUpsert={handleUpsert}
          key={component.id}
          component={component}
        />
      ))}
      <InlineInput
        handleUpsert={handleUpsert}
        component={{
          id: "",
          fileId: file.id,
          position: 0,
          type: "BODY",
          content: "",
        }}
      />
    </div>
  );
}
