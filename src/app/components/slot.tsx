import clsx from "clsx";
import {
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
} from "react";

export const Slot = ({
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactElement;
}) => {
  if (isValidElement<HTMLAttributes<HTMLElement>>(children)) {
    return cloneElement(children, {
      ...props,
      ...children.props,
      className: clsx(children.props.className, props.className),
    });
  }
  throw new TypeError(`Single element child is required in Slot`);
};
