import clsx from "clsx";
import React, { type ElementType } from "react";
import { type PolymorphicComponentProp } from "~/definitions/plymorphic-component";
import { Slot } from "./slot";

type ColorScheme = "primary" | "secondary" | "success" | "danger" | "special";
type Variant = "filled" | "outline" | "transparent";
type Size = "sm" | "md" | "lg";

interface CustomButtonProps {
  variant?: Variant;
  color?: ColorScheme;
  rounded?: boolean;
  fit?: boolean;
  size?: Size;
  icon?: boolean;
}

const getButtonStyles = ({
  variant = "filled",
  color = "primary",
  size = "md",
  rounded,
  fit,
  icon,
}: CustomButtonProps) =>
  clsx(
    "px-4 py-2 font-medium leading-none shadow-inner shadow-white/10",
    "transition-colors focus:outline-none",
    rounded ? "rounded-full" : "rounded-md",
    {
      filled: {
        primary: "bg-slate-600 text-slate-50 hover:bg-slate-500",
        secondary:
          "bg-blue-600 text-slate-50 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-slate-400",
        success: "bg-green-500 text-slate-50 hover:bg-green-600",
        danger: "bg-red-700 text-slate-200 hover:bg-red-800",
        special: "",
      },
      outline: {
        primary: "border border-slate-600 text-slate-100 hover:bg-slate-700",
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
    { md: "text-md px-3", sm: "px-1 text-sm", lg: "px-4 text-lg" }[size],
    icon && "flex flex-row items-center gap-2",
    fit && "w-fit",
  );

const CustomButton = <T extends ElementType = "button">({
  variant = "filled",
  color = "primary",
  size = "md",
  icon,
  fit,
  rounded,
  className,
  as,
  ...props
}: PolymorphicComponentProp<T, CustomButtonProps>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={clsx(
        getButtonStyles({ variant, color, size, icon, fit, rounded }),
        className,
      )}
      {...props}
    />
  );
};

export default CustomButton;

interface UIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild: true;
  children: React.ReactElement;
  variant?: Variant;
  color?: ColorScheme;
  rounded?: boolean;
  fit?: boolean;
  size?: Size;
  icon?: boolean;
}

export const UIButton = ({
  asChild: _,
  rounded,
  color,
  variant,
  size,
  icon,
  fit,
  className,
  ...props
}: UIButtonProps) => {
  return (
    <Slot
      {...props}
      className={clsx(
        getButtonStyles({ variant, color, size, icon, fit, rounded }),
        className,
      )}
    />
  );
};
