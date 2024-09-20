import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<
  C extends ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];

export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = object,
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };
