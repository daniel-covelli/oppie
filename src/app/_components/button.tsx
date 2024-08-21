import clsx from "clsx";
import React, { type ElementType } from "react";

type ColorScheme = "primary" | "secondary" | "success" | "danger" | "special";
type Variant = "filled" | "outline" | "transparent";
type Size = "sm" | "md" | "lg";

interface CustomButtonProps<T extends ElementType = "button"> {
  variant?: Variant;
  color?: ColorScheme;
  rounded?: boolean;
  fit?: boolean;
  size?: Size;
  icon?: boolean;
  as?: T;
}

type ButtonProps<T extends ElementType> = CustomButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CustomButtonProps>;

const CustomButton = <T extends ElementType = "button">({
  children,
  variant = "filled",
  color = "primary",
  size = "md",
  icon,
  fit,
  rounded,
  className,
  as,
  ...props
}: ButtonProps<T>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={clsx(
        "px-4 py-1 font-medium leading-snug shadow-inner shadow-white/10",
        "transition-colors focus:outline-none",
        rounded ? "rounded-full" : "rounded-md",
        {
          filled: {
            primary: "bg-slate-600 text-slate-50 hover:bg-slate-500",
            secondary:
              "bg-sky-600 text-slate-50 hover:bg-sky-700 disabled:bg-sky-800 disabled:text-slate-400",
            success: "bg-green-500 text-slate-50 hover:bg-green-600",
            danger: "bg-red-500 text-slate-50 hover:bg-red-600",
            special: "",
          },
          outline: {
            primary:
              "border border-slate-600 text-slate-100 hover:bg-slate-700",
            secondary: "border border-sky-600 text-sky-500 hover:bg-sky-50",
            success: "border border-green-500 text-green-500 hover:bg-green-50",
            danger: "border border-red-500 text-red-500 hover:bg-red-50",
            special: "",
          },
          transparent: {
            primary:
              "text-slate-100 shadow-none hover:text-sky-600 disabled:text-slate-400",
            secondary: "border border-sky-600 text-sky-500 hover:bg-sky-50",
            success: "border border-green-500 text-green-500 hover:bg-green-50",
            danger: "border border-red-500 text-red-500 hover:bg-red-50",
            special: "",
          },
        }[variant][color],
        { md: "text-md px-4", sm: "px-1 text-sm", lg: "px-4 text-lg" }[size],
        icon && "flex flex-row items-center gap-3",
        fit && "w-fit",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CustomButton;
