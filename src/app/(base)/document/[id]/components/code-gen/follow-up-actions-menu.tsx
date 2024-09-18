import { type Dispatch, type SetStateAction } from "react";
import CheckMark from "~/app/components/svgs/check-mark";
import { api } from "~/trpc/react";
import { useComponentFocusHandlerState } from "../utils";
import CloseIcon from "~/app/components/svgs/close";
import RetryIcon from "~/app/components/svgs/retry";
import {
  type ControlledMenuProps,
  Menu,
  MenuContent,
  MenuItem,
} from "~/app/components/modal/menu";

interface FollowUpActionsMenu extends ControlledMenuProps {
  fileId: string;
  newCodeComponentId: string;
  stream: string;
  setStream: Dispatch<SetStateAction<string>>;
}

export default function FollowUpActionsMenu({
  fileId,
  newCodeComponentId,
  stream,
  setStream,
  ...menuProps
}: FollowUpActionsMenu) {
  const { updateComponentsState } = useComponentFocusHandlerState();

  const utils = api.useUtils();
  const updateComponent = api.component.update.useMutation({
    onMutate: async ({ content, id }) => {
      await utils.file.getFile.cancel();

      const previousFile = utils.file.getFile.getData({ id: fileId });

      utils.file.getFile.setData({ id: fileId }, (oldQueryData) => {
        if (oldQueryData && content) {
          const updatedComponents = oldQueryData.components.map((component) =>
            component.id === id ? { ...component, content } : component,
          );
          updateComponentsState(updatedComponents);

          return {
            ...oldQueryData,
            components: updatedComponents,
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

  const deleteComponent = api.component.delete.useMutation({
    onSuccess: async () => {
      await utils.file.getFile.invalidate({ id: fileId });
    },
  });

  const handleDeleteComponent = () => {
    setStream("");
    if (newCodeComponentId) {
      deleteComponent.mutate({ id: newCodeComponentId });
    }
  };

  return (
    <Menu {...menuProps} handleOutsidePress={handleDeleteComponent}>
      <MenuContent>
        {stream.includes("<code>") && (
          <MenuItem
            text="Accept"
            icon={() => <CheckMark className="size-3" />}
            onClick={() => {
              if (newCodeComponentId) {
                updateComponent.mutate({
                  id: newCodeComponentId,
                  fileId: fileId,
                  content: stream,
                  type: "CODE",
                });
                setStream("");
              }
            }}
          />
        )}
        <MenuItem
          text="Decline"
          icon={() => <CloseIcon className="size-3" />}
          onClick={handleDeleteComponent}
        />
        <MenuItem
          text="Try again"
          icon={() => <RetryIcon className="size-3" />}
          onClick={() => {
            console.log("retry");
          }}
        />
      </MenuContent>
    </Menu>
  );
}
