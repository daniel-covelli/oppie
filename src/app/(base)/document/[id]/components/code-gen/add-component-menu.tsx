import IconButton from "~/app/components/clickable";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "~/app/components/floating/menu";
import Plus from "~/app/components/svgs/plus";
import { api, type RouterOutputs } from "~/trpc/react";
import { useComponentFocusHandler } from "../utils";
import ReactIcon from "~/app/components/svgs/react";
import { CodeOutputType } from "@prisma/client";
import TextIcon from "~/app/components/svgs/text";
import HeadingIcon from "~/app/components/svgs/heading";
import { useState, type Dispatch, type SetStateAction } from "react";

interface AddComponentMenuProps
  extends Pick<RouterOutputs["file"]["getFile"], "id" | "codeOutputType"> {
  setIsPromptingOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddComponentMenu = ({
  id: fileId,
  codeOutputType,
  setIsPromptingOpen,
}: AddComponentMenuProps) => {
  const { manageNewComponentFocus } = useComponentFocusHandler();
  const utils = api.useUtils();
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
      utils.file.getFile.setData({ id: fileId }, context?.previousFile);
    },
    onSuccess: async () => {
      void utils.file.getFile.invalidate({ id: fileId });
    },
  });

  const addEmptyComponent = api.component.addEmptyComponent.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: fileId });
    },
  });
  const [loading, setLoading] = useState(false);
  const handleNonCodeComponent = async (componentType: "HEADING" | "BODY") => {
    setLoading(true);
    try {
      const data = await addEmptyComponent.mutateAsync({
        fileId: fileId,
        type: componentType,
      });

      manageNewComponentFocus(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCodeComponent = (type: "RTT" | "PYTHON") => {
    if (!codeOutputType) {
      updateCodeOutputType.mutate({
        type,
        id: fileId,
      });
    }
    return setIsPromptingOpen(true);
  };

  const outputOption = {
    [CodeOutputType.RTT]: (
      <MenuItem
        text="React, Typescript, Tailwind"
        description="Build components with AI"
        icon={() => <ReactIcon className="size-5" />}
        onClick={() => handleAddCodeComponent("RTT")}
      />
    ),
    [CodeOutputType.PYTHON]: (
      <MenuItem
        text="Python"
        description="Build Python code with AI"
        icon={() => <ReactIcon className="size-5" />}
        onClick={() => handleAddCodeComponent("RTT")}
      />
    ),
  };

  const codeOptionsArray = codeOutputType
    ? [outputOption[codeOutputType]]
    : Object.values(outputOption);

  return (
    <Menu placement="top-start">
      <MenuTrigger
        as="button"
        className="group grid w-fit grid-cols-[25px_auto] items-center gap-3"
      >
        <IconButton
          as="div"
          className="opacity-0 transition-opacity duration-75 group-hover:opacity-100"
        >
          <Plus className="size-4" />
        </IconButton>
        {loading ? (
          <div className="h-7 w-52 rounded-md bg-slate-700" />
        ) : (
          <div className="content-center text-left text-sm text-slate-400 transition-colors duration-75 hover:text-slate-300">
            Add a component
          </div>
        )}
      </MenuTrigger>

      <MenuContent width="fit">
        {...codeOptionsArray}
        <MenuItem
          text="Text"
          description="Add a text block"
          icon={() => <TextIcon className="size-5" />}
          onClick={() => handleNonCodeComponent("BODY")}
        />
        <MenuItem
          text="Heading"
          description="Add a heading block"
          icon={() => <HeadingIcon className="size-5" />}
          onClick={() => handleNonCodeComponent("HEADING")}
        />
      </MenuContent>
    </Menu>
  );
};
