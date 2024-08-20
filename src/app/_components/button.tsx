import React, { type ReactNode, type ElementType } from "react";

type ColorScheme = "primary" | "secondary" | "success" | "danger";
type Variant = "filled" | "outline";

type VariantClasses = Record<
  "filled" | "outline",
  {
    [key in ColorScheme]: string;
  }
>;

const variantClasses: VariantClasses = {
  filled: {
    primary:
      "bg-slate-600 hover:bg-slate-500 text-white shadow-inner shadow-white/10",
    secondary: "bg-sky-500 hover:bg-sky-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  },
  outline: {
    primary: "border border-slate-500 text-slate-500 hover:bg-slate-50",
    secondary: "border border-sky-500 text-sky-500 hover:bg-sky-50",
    success: "border border-green-500 text-green-500 hover:bg-green-50",
    danger: "border border-red-500 text-red-500 hover:bg-red-50",
  },
};

interface CustomButtonProps<T extends ElementType = "button"> {
  children: ReactNode;
  variant?: Variant;
  color?: ColorScheme;
  className?: string;
  as?: T;
}

type ButtonProps<T extends ElementType> = CustomButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CustomButtonProps>;

const CustomButton = <T extends ElementType = "button">({
  children,
  variant = "filled",
  color = "primary",
  className = "",
  as,
  ...props
}: ButtonProps<T>) => {
  const Component = as ?? "button";
  const baseClasses =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ";
  const colorClasses = variantClasses[variant][color];

  return (
    <Component
      className={`${baseClasses} ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CustomButton;
