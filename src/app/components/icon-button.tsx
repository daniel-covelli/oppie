import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";

function IconButton({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        className,
        "inline-flex rounded p-1 text-slate-300 hover:bg-slate-600",
        "data-[active]:bg-slate-600",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default IconButton;
