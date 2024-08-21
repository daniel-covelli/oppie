import clsx from "clsx";
import { type ElementType } from "react";

interface InteractiveProps<T extends ElementType = "div"> {
  as?: T;
  footer?: React.ComponentType;
}

type InteractiveDynamicProps<T extends ElementType> = InteractiveProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof InteractiveProps>;

const Interactive = <T extends ElementType = "div">({
  as,
  children,
  className,
  footer: Footer,
  ...props
}: InteractiveDynamicProps<T>) => {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(
        "relative flex flex-col gap-4 rounded-lg bg-slate-900 p-4 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
      {!!Footer && (
        <>
          <hr className="border-slate-800" />
          <Footer />
        </>
      )}
    </Component>
  );
};

export default Interactive;
