import clsx from "clsx";
import Link from "next/link";
import React, { type PropsWithChildren } from "react";
import IconButton from "~/app/components/clickable";

interface FileFolderWrapperProps {
  active: boolean;
  heading: PropsWithChildren<{ href: string }>;
  left: {
    onClick?: () => void;
    hoveredIcon?: React.ReactNode;
    defaultIcon: React.ReactNode;
  };
  right: React.ReactNode;
}
export default function FileFolderWrapper({
  active,
  heading,
  left: { hoveredIcon, defaultIcon, ...leftRest },
  right,
}: FileFolderWrapperProps) {
  return (
    <div
      className={clsx(
        active && "bg-slate-800",
        "group flex flex-row items-center justify-center gap-2 rounded-lg p-1 pl-1.5 hover:bg-slate-700",
      )}
    >
      <IconButton
        {...leftRest}
        className={clsx(!hoveredIcon && "hover:bg-transparent")}
      >
        {hoveredIcon ? (
          <>
            <div className="group-hover:hidden">{defaultIcon}</div>
            <div className="hidden group-hover:flex">{hoveredIcon}</div>
          </>
        ) : (
          defaultIcon
        )}
      </IconButton>
      <Link className="flex-1 truncate text-left text-lg" {...heading} />
      <div className="hidden flex-row gap-1 group-hover:flex">{right}</div>
    </div>
  );
}
