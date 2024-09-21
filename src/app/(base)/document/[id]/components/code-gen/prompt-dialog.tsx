import clsx from "clsx";
import { type FormEvent } from "react";
import Button from "~/app/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeading,
} from "~/app/components/floating/dialog";
import Spinner from "~/app/components/svgs/spinner";
import Submit from "~/app/components/svgs/submit";
import { type ControlledFloatingProps } from "~/definitions/modals";

interface PromptDialogProps extends ControlledFloatingProps {
  prompt: string;
  onPromptChange: (text: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDialogCanceled: () => void;
  loading: boolean;
}

export default function PromptDialog({
  handleDialogCanceled,
  prompt,
  onPromptChange,
  loading,
  handleSubmit,
  ...dialogProps
}: PromptDialogProps) {
  return (
    <Dialog
      {...dialogProps}
      handleOutsidePress={handleDialogCanceled}
      placement="bottom-start"
    >
      <DialogContent className="rounded border border-slate-600 bg-slate-750 p-2">
        <DialogHeading className={"pb-1 text-xs text-slate-200"}>
          What code would you like to generate?
        </DialogHeading>
        <form className="flex flex-row items-end" onSubmit={handleSubmit}>
          {loading ? (
            <div className="mr-2 h-[84px] w-full animate-pulse rounded-md bg-slate-700" />
          ) : (
            <textarea
              className={clsx(
                `mr-2 h-[84px] w-full resize-none bg-transparent text-lg focus:outline-none`,
              )}
              placeholder="Generate..."
              value={prompt}
              rows={3}
              onChange={(e) => onPromptChange(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
          )}

          <Button
            disabled={loading}
            type="submit"
            variant="filled"
            color="secondary"
            className="disabled:bg-blue-600 disabled:text-slate-50"
          >
            {loading ? (
              <Spinner className="size-4" />
            ) : (
              <Submit className="size-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
