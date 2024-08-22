import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "./button";
import {
  type Dispatch,
  type FormEventHandler,
  type SetStateAction,
} from "react";

export default function Modal({
  openState,
  footer: Footer,
}: {
  footer: React.ComponentType;
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
}) {
  return (
    <>
      <Dialog
        open={openState[0]}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => openState[1](false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/50" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium">
                Are you sure?
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-slate-400">
                This will permanently delete this item and all of its children
              </p>
              <div className="mt-4">
                <Footer />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export function HeadingModal({
  onSubmit,
  inputState,
  openState,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
  inputState: [string, Dispatch<SetStateAction<string>>];
}) {
  return (
    <Dialog
      open={openState[0]}
      as="div"
      className="fixed z-10 focus:outline-none"
      onClose={() => {
        openState[1](false);
        setTimeout(() => {
          inputState[1]("");
        }, 1000);
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/70 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-screen w-screen items-start justify-center pt-20">
          <DialogPanel
            transition
            className="data-[closed]:transform-[scale(95%)] w-fit rounded-lg border border-slate-600 bg-slate-800 p-1 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
          >
            <form className="flex flex-row gap-2" onSubmit={onSubmit}>
              <input
                onChange={(e) => inputState[1](e.target.value)}
                value={inputState[0]}
                data-autofocus
                className="bg-slate-800 py-1 pl-1 text-4xl focus:outline-none"
                placeholder="Add a title"
              />
              <Button type="submit" color="secondary">
                Submit
              </Button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
