import clsx from "clsx";
import { Fragment, useState } from "react";

export default function ActionWrapper({
  active,
  children,
  actions: Actions,
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
        "flex h-8 flex-row items-center gap-2 rounded-lg p-1 pl-1.5 hover:cursor-pointer hover:bg-slate-700",
        active && "bg-slate-800",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Preface hovered={hovered} />
      {children}
      {hovered && Actions && (
        <div className="flex flex-row items-center gap-1">{<Actions />}</div>
      )}
    </div>
  );
}
