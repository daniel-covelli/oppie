"use client";

import clsx from "clsx";
import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ComponentType = RouterOutputs["file"]["getFile"]["heading"];
interface SubmitArgs {
  component?: ComponentType;
  value: string;
}

function InlineInput({
  component,
  handleUpsert,
}: {
  component?: ComponentType;
  handleUpsert: (args: SubmitArgs) => void;
}) {
  const [value, setValue] = useState(component?.content ?? "");

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
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add something here"
      />
    </form>
  );
}

export default function File({ params }: { params: { id: string } }) {
  const { data, isPending } = api.file.getFile.useQuery({ id: params.id });
  console.log("data", JSON.stringify(data, null, 2));

  if (!data) return "Loading...";
  const handleUpsert = (args: SubmitArgs) => {
    console.log(args);
  };

  return (
    <div className="flex flex-col gap-2">
      <InlineInput handleUpsert={handleUpsert} component={data?.heading} />
      {data?.components.map((component) => (
        <InlineInput
          handleUpsert={handleUpsert}
          key={component.id}
          component={component}
        />
      ))}
      <InlineInput handleUpsert={handleUpsert} />
    </div>
  );
}
