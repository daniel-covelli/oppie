import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
} from "./index";
import Spinner from "~/app/components/svgs/spinner";
import { type ControlledFloatingProps } from "~/definitions/modals";

interface AlertModalProps extends Omit<ControlledFloatingProps, "anchorRef"> {
  heading: string;
  description: string;
  danger: { text: string; onClick: () => Promise<void> };
  loading: boolean;
}

const AlertDialog = ({
  heading,
  description,
  danger,
  loading,
  ...dialogProps
}: AlertModalProps) => {
  return (
    <Dialog {...dialogProps}>
      <DialogContent isCentered className="max-w-md p-6 dialog">
        <DialogHeading className="text-base font-medium">
          {heading}
        </DialogHeading>
        <DialogDescription className="mt-2 text-sm text-slate-400">
          {description}
        </DialogDescription>
        <DialogClose className="mt-4" onClick={danger.onClick}>
          {loading ? <Spinner className="size-4" /> : danger.text}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
