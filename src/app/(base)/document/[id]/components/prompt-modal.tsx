import { Dialog, DialogPanel, DialogTitle, Input } from "@headlessui/react";
import clsx from "clsx";
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";
import { create } from "zustand";
import Button from "~/app/components/button";
import Loading from "~/app/components/svgs/loading";
import Submit from "~/app/components/svgs/submit";

type State = {
  isOpen: boolean;
  position: { x: number; y: number; w: number };
};

type Action = {
  updateIsOpen: (isOpen: State["isOpen"]) => void;
  updatePostion: (isOpen: State["position"]) => void;
};

const usePromptModalState = create<State & Action>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0, w: 0 },
  updateIsOpen: (isOpen) => set(() => ({ isOpen })),
  updatePostion: (position) => set(() => ({ position })),
}));

export const usePromptModal = () => {
  const { isOpen, updateIsOpen, position, updatePostion } =
    usePromptModalState();

  const positionRef = useRef<HTMLParagraphElement>(null);

  const handleOpenModal = () => {
    const rect = positionRef.current?.getBoundingClientRect();
    updatePostion({
      x: rect?.left ?? 0,
      w: rect?.width ?? 0,
      y: (rect?.top ?? 0) + document.documentElement.scrollTop,
    });
    updateIsOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, updateIsOpen]);

  return {
    positionRef,
    isOpen,
    updateIsOpen,
    position,
    handleOpenModal,
  };
};

export default function PromptModal({
  onSubmit,
  input,
  setInput,
  loading,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  loading: boolean;
}) {
  const { position, isOpen, updateIsOpen } = usePromptModal();

  return (
    <Dialog
      className="inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={() => updateIsOpen(false)}
    >
      <DialogPanel
        transition
        className="data-[closed]:transform-[scale(95%)] z-20 m-0 rounded border border-slate-600 bg-slate-750 p-2 duration-75 ease-out data-[closed]:opacity-0"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${position.w}px`,
        }}
      >
        <DialogTitle className={"pb-1 text-xs text-slate-200"}>
          What code would you like to generate?
        </DialogTitle>
        <form className="flex flex-row items-center" onSubmit={onSubmit}>
          <Input
            autoFocus
            className={clsx(`w-full bg-transparent text-lg focus:outline-none`)}
            placeholder="Generate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="filled"
            color="secondary"
          >
            {loading ? (
              <Loading className="size-4" />
            ) : (
              <Submit className="size-4" />
            )}
          </Button>
        </form>
      </DialogPanel>
    </Dialog>
  );
}
