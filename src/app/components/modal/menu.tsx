import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  type Placement,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingReturn,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import {
  type PropsWithChildren,
  useRef,
  type HTMLProps,
  useMemo,
  useState,
  useContext,
  type ElementType,
  forwardRef,
} from "react";
import { DropdownButton, type DropdownButtonProps } from "../clickable";
import React from "react";
import { type PolymorphicComponentProp } from "~/definitions/plymorphic-component";
import clsx from "clsx";

interface MenuContextType {
  getItemProps: (
    userProps?: React.HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;
  activeIndex: number | null;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  getFloatingProps: (
    userProps?: HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;
  setFloating: UseFloatingReturn["refs"]["setFloating"];
  setReference: UseFloatingReturn["refs"]["setReference"];
  listRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  labelsRef: React.MutableRefObject<(string | null)[]>;
  context?: UseFloatingReturn["context"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  floatingStyles: UseFloatingReturn["floatingStyles"];
}

export const MenuContext = React.createContext<MenuContextType>({
  getItemProps: () => ({}),
  activeIndex: null,
  isOpen: false,
  setIsOpen: () => ({}),
  getFloatingProps: () => ({}),
  setFloating: () => ({}),
  listRef: { current: [] },
  labelsRef: { current: [] },
  context: undefined,
  getReferenceProps: () => ({}),
  setReference: () => ({}),
  floatingStyles: {},
});

export function useControlledMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);
  return useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen,
      anchorRef,
      setAnchorRef,
    }),
    [anchorRef, isMenuOpen],
  );
}

export interface ControlledMenuProps {
  open?: boolean;
  setOpen?: (val: boolean) => void;
  anchorRef?: HTMLElement | null;
}
export interface MenuOptions extends ControlledMenuProps {
  initialOpen?: boolean;
  placement?: Placement;
  handleOutsidePress?: () => void;
}

export function useMenu({
  initialOpen = false,
  open: controlledOpen,
  setOpen: setControlledOpen,
  placement = "bottom-start",
  handleOutsidePress,
  anchorRef,
}: MenuOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const { floatingStyles, refs, context } = useFloating({
    placement,
    open: open,
    middleware: [flip(), offset(5)],
    elements: {
      reference: anchorRef,
    },
    onOpenChange: (val, _, reason) => {
      setOpen(val);
      if (reason === "escape-key" || reason === "outside-press") {
        handleOutsidePress?.();
      }
    },
    whileElementsMounted: autoUpdate,
  });

  const listRef = useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const click = useClick(context);
  const role = useRole(context, { role: "menu" });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex: activeIndex,
    onNavigate: setActiveIndex,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: open ? setActiveIndex : undefined,
    activeIndex,
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, click, dismiss, listNavigation, typeahead],
  );

  return useMemo(
    () => ({
      activeIndex,
      getItemProps,
      setIsOpen: setOpen,
      isOpen: open,
      getFloatingProps,
      setFloating: refs.setFloating,
      setReference: refs.setReference,
      listRef,
      context,
      getReferenceProps,
      floatingStyles,
      labelsRef,
    }),
    [
      activeIndex,
      getItemProps,
      setOpen,
      open,
      getFloatingProps,
      refs.setFloating,
      refs.setReference,
      context,
      getReferenceProps,
      floatingStyles,
    ],
  );
}

export const Menu = ({ children, ...rest }: PropsWithChildren<MenuOptions>) => {
  const menuContext = useMenu(rest);
  return (
    <MenuContext.Provider value={menuContext}>{children}</MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};

export const MenuTrigger = <T extends ElementType = "div">({
  children,
  as,
  ...rest
}: PolymorphicComponentProp<T, PropsWithChildren>) => {
  const { setReference, getReferenceProps } = useMenuContext();
  const Component = as ?? "div";
  return (
    <Component ref={setReference} {...rest} {...getReferenceProps()}>
      {children}
    </Component>
  );
};

export const MenuContent = ({
  children,
  width = "sm",
  paddingScheme = "document",
}: PropsWithChildren<{ width?: "sm" | "fit"; paddingScheme?: "document" }>) => {
  const {
    isOpen,
    floatingStyles,
    getFloatingProps,
    context,
    setFloating,
    listRef,
    labelsRef,
  } = useMenuContext();

  if (!context) return;

  return (
    <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={clsx(
                "Menu flex flex-col rounded border border-slate-600 bg-slate-750 p-1 focus:outline-none",
                width === "sm" ? "w-40" : "w-fit",
                paddingScheme && "ml-[37px]",
              )}
              ref={setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FloatingList>
  );
};

export const MenuItem = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ onClick, text, disabled, ...rest }, forwardedRef) => {
    const menu = React.useContext(MenuContext);
    const item = useListItem({ label: disabled ? null : text });
    const isActive = item.index === menu.activeIndex;

    return (
      <DropdownButton
        {...rest}
        ref={useMergeRefs([item.ref, forwardedRef])}
        tabIndex={isActive ? 0 : -1}
        type="button"
        role="menuitem"
        className="MenuItem gap-3"
        {...menu.getItemProps({
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            menu.setIsOpen(false);
          },
        })}
        text={text}
      />
    );
  },
);

MenuItem.displayName = "MenuItem";
