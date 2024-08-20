import clsx from "clsx";
import React, { type ElementType } from "react";

type ColorScheme = "primary" | "secondary" | "success" | "danger";
type Variant = "filled" | "outline";

interface CustomButtonProps<T extends ElementType = "button"> {
  variant?: Variant;
  color?: ColorScheme;
  as?: T;
}

type ButtonProps<T extends ElementType> = CustomButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CustomButtonProps>;

const CustomButton = <T extends ElementType = "button">({
  children,
  variant = "filled",
  color = "primary",
  className,
  as,
  ...props
}: ButtonProps<T>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={clsx(
        "text-md rounded-md px-4 py-1 font-medium leading-snug shadow-inner shadow-white/10",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          filled: {
            primary: "bg-slate-600 text-slate-50 hover:bg-slate-500",
            secondary:
              "bg-sky-600 text-slate-50 hover:bg-sky-700 disabled:bg-sky-800 disabled:text-slate-400",
            success: "bg-green-500 text-slate-50 hover:bg-green-600",
            danger: "bg-red-500 text-slate-50 hover:bg-red-600",
          },
          outline: {
            primary: "border border-slate-500 text-slate-500 hover:bg-slate-50",
            secondary: "border border-sky-600 text-sky-500 hover:bg-sky-50",
            success: "border border-green-500 text-green-500 hover:bg-green-50",
            danger: "border border-red-500 text-red-500 hover:bg-red-50",
          },
        }[variant][color],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CustomButton;
