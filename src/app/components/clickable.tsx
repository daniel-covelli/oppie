import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";

interface TileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export function Tile({
  icon,
  title,
  description,
  className = "",
  ...buttonProps
}: TileProps) {
  return (
    <button
      className={clsx(
        "flex flex-row items-center gap-3 rounded p-2 hover:bg-slate-600",
        className,
      )}
      {...buttonProps}
    >
      <div className="rounded border border-slate-400 p-2">{icon}</div>
      <div className="text-start">
        <p className="">{title}</p>
        <p className="text-xs font-thin tracking-tight">{description}</p>
      </div>
    </button>
  );
}
