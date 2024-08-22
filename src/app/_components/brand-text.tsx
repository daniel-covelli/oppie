import clsx from "clsx";
import React, { type ElementType } from "react";

interface BrandTextProps<T extends ElementType = "h1"> {
  as?: T;
}

type BrandText<T extends ElementType> = BrandTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BrandTextProps>;

const BrandText = <T extends ElementType = "h1">({
  className,
  as,
  ...props
}: BrandText<T>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={clsx(
        "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400",
        "bg-clip-text font-bold text-transparent",
        className,
      )}
      {...props}
    />
  );
};

export default BrandText;
