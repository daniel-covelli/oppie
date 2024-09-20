import { Dialog, DialogPanel, DialogTitle, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { type Dispatch, type FormEvent, type SetStateAction } from "react";
import Button from "~/app/components/button";
import Spinner from "~/app/components/svgs/spinner";
import Submit from "~/app/components/svgs/submit";
import { api, type RouterOutputs } from "~/trpc/react";

export default function PromptModal({
  onSubmit,
  input,
  setInput,
  loading,
  file,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  loading: boolean;
  file: RouterOutputs["file"]["getFile"];
}) {
  // const { position, isOpen, updateIsOpen } = usePromptModal();
  const utils = api.useUtils();
  const { mutateAsync } = api.file.addCodeOutputType.useMutation({
    onSuccess: async () => await utils.file.getFile.invalidate({ id: file.id }),
  });

  // useEffect(() => {
  //   if (isOpen) {
  //     setInput("");
  //   }
  // }, [isOpen, setInput]);

  return (
    <Dialog
      className="relative inset-0 z-10 overflow-y-auto"
      open={false}
      onClose={() => {
        // updateIsOpen(false);
        setInput("");
      }}
    >
      <DialogPanel
        transition
        className="data-[closed]:transform-[scale(95%)] z-20 m-0 rounded border border-slate-600 bg-slate-750 p-2 duration-75 ease-out data-[closed]:opacity-0"
        // style={{
        //   position: "fixed",
        //   left: `${position.x}px`,
        //   top: `${position.y}px`,
        //   width: `${position.w}px`,
        // }}
      >
        {!file.codeOutputType ? (
          <>
            <DialogTitle className={"pb-1 text-xs text-slate-200"}>
              What coding paradigm would you like to use for this file?
            </DialogTitle>
            <div className="flex flex-row items-center gap-2">
              <Button
                onClick={async () =>
                  await mutateAsync({ id: file.id, type: "RTT" })
                }
              >
                React, Typescript, Tailwind
              </Button>
              <Button
                onClick={async () =>
                  await mutateAsync({ id: file.id, type: "PYTHON" })
                }
              >
                Python
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className={"pb-1 text-xs text-slate-200"}>
              What code would you like to generate?
            </DialogTitle>
            <form className="flex flex-row items-end" onSubmit={onSubmit}>
              <Textarea
                autoFocus
                className={clsx(
                  `mr-2 w-full resize-none bg-transparent text-lg focus:outline-none`,
                )}
                placeholder="Generate..."
                value={input}
                rows={3}
                onChange={(e) => setInput(e.target.value)}
              />

              <Button
                type="submit"
                disabled={loading}
                variant="filled"
                color="secondary"
              >
                {loading ? (
                  <Spinner className="size-4" />
                ) : (
                  <Submit className="size-4" />
                )}
              </Button>
            </form>
          </>
        )}
      </DialogPanel>
    </Dialog>
  );
}
