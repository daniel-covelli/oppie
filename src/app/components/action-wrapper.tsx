import clsx from "clsx";
import { Fragment, useState } from "react";

export default function ActionWrapper({
  active,
  children,
  actions: Actions = () => <Fragment />,
  preface: Preface = () => <Fragment />,
  className,
}: React.PropsWithChildren<{
  active?: boolean;
  actions?: React.ComponentType;
  preface?: React.ComponentType<{ hovered?: boolean }>;
  className?: string;
}>) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={clsx(
        "flex h-8 flex-row items-center justify-center gap-2 rounded-lg p-1 pl-1.5 hover:bg-slate-700",
        active && "bg-slate-800",
        className,
      )}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <Preface hovered={hovered} />
      {children}
      {hovered && Actions && (
        <div className="flex flex-row place-items-center content-center justify-center justify-items-center gap-1 self-center p-0">
          <Actions />
        </div>
      )}
    </div>
  );
}
