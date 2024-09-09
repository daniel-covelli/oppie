import clsx from "clsx";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";

export default function ActionWrapper({
  active,
  children,
  actions: Actions,
  preface: Preface = () => <Fragment />,
  className,
}: React.PropsWithChildren<{
  active?: boolean;
  actions?: React.ComponentType<{
    setHovered: Dispatch<SetStateAction<boolean>>;
    setIgnoreMouseOut: Dispatch<SetStateAction<boolean>>;
  }>;
  preface?: React.ComponentType<{ hovered?: boolean }>;
  className?: string;
}>) {
  const [hovered, setHovered] = useState(false);
  const [ignoreMouseOut, setIgnoreMouseOut] = useState(false);

  return (
    <div
      className={clsx(
        "flex h-8 flex-row items-center justify-center gap-2 rounded-lg p-1 pl-1.5 hover:cursor-pointer",
        hovered && "bg-slate-700",
        active && "bg-slate-800",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => (!ignoreMouseOut ? setHovered(false) : undefined)}
    >
      <Preface hovered={hovered} />
      {children}
      {hovered && Actions && (
        <div className="flex flex-row place-items-center content-center justify-center justify-items-center gap-1 self-center p-0">
          {
            <Actions
              setHovered={setHovered}
              setIgnoreMouseOut={setIgnoreMouseOut}
            />
          }
        </div>
      )}
    </div>
  );
}
