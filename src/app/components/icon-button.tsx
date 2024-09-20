import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "./slot";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const CLASS_NAME = "mb-0 rounded p-1 text-slate-300 hover:bg-slate-600";
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button ref={ref} className={clsx(CLASS_NAME, className)} {...rest}>
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;

interface UIIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild: true;
  children: React.ReactElement;
}

export const UIIconButton = ({
  asChild: _,
  className,
  ...props
}: UIIconButtonProps) => {
  return <Slot {...props} className={clsx(CLASS_NAME, className)} />;
};
