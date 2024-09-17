import clsx from "clsx";
import React, { forwardRef } from "react";
import { type ButtonHTMLAttributes } from "react";

export interface DropdownButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType;
  text: string;
  description?: string;
  close?: () => void;
}
const TileButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ className, text, icon: Icon, description, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "flex flex-row items-center gap-3 rounded p-2 hover:bg-slate-600",
          className,
        )}
        {...props}
      >
        <div className="rounded border border-slate-400 p-2">
          <Icon />
        </div>
        <div className="text-start">
          <p>{text}</p>
          <p className="text-xs font-thin tracking-tight">{description}</p>
        </div>
      </button>
    );
  },
);

TileButton.displayName = "TileButton";

export const ItemButton = forwardRef<
  HTMLButtonElement,
  Omit<DropdownButtonProps, "description">
>(({ className, icon: Icon, text, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        "flex w-full flex-row items-center gap-2 rounded p-1 px-1.5 leading-snug text-slate-200 outline-none focus:bg-slate-600 disabled:opacity-70 disabled:hover:bg-transparent data-[focus]:bg-slate-600",
        className,
      )}
      {...props}
    >
      <Icon />

      <p className="text-sm">{text}</p>
    </button>
  );
});

ItemButton.displayName = "ItemButton";

export const DropdownButton = forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(({ description, ...props }, ref) => {
  if (description) {
    return <TileButton ref={ref} description={description} {...props} />;
  }
  return <ItemButton ref={ref} {...props} />;
});

DropdownButton.displayName = "DropdownButton";
