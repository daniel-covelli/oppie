import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingOverlay,
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingReturn,
  useInteractions,
  type UseInteractionsReturn,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import {
  type PropsWithChildren,
  useRef,
  useMemo,
  useState,
  useContext,
  type ElementType,
  forwardRef,
} from "react";
import { DropdownButton, type DropdownButtonProps } from "../clickable";
import React from "react";
import {
  type PolymorphicRef,
  type PolymorphicComponentProp,
} from "~/definitions/plymorphic-component";
import clsx from "clsx";
import { type FloatingOptions } from "~/definitions/modals";

interface MenuContextType {
  activeIndex: number | null;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  listRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  labelsRef: React.MutableRefObject<(string | null)[]>;
  controller: UseFloatingReturn;
  interactions: UseInteractionsReturn;
}

export const MenuContext = React.createContext<MenuContextType>({
  activeIndex: null,
  isOpen: false,
  setIsOpen: () => ({}),
  listRef: { current: [] },
  labelsRef: { current: [] },
  controller: {} as UseFloatingReturn,
  interactions: {} as UseInteractionsReturn,
});

export function useControlledMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchorRef, setMenuAnchorRef] = useState<HTMLElement | null>(null);
  return useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen,
      menuAnchorRef,
      setMenuAnchorRef,
    }),
    [menuAnchorRef, isMenuOpen],
  );
}

export function useMenu({
  initialOpen = false,
  open: controlledOpen,
  setOpen: setControlledOpen,
  placement = "bottom-start",
  handleOutsidePress,
  anchorRef,
}: FloatingOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const controller = useFloating({
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

  const { context } = controller;

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

  const interactions = useInteractions([
    role,
    click,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  return useMemo(
    () => ({
      activeIndex,
      setIsOpen: setOpen,
      isOpen: open,
      listRef,
      labelsRef,
      interactions,
      controller,
    }),
    [activeIndex, interactions, setOpen, open, controller],
  );
}

export const Menu = ({
  children,
  ...rest
}: PropsWithChildren<FloatingOptions>) => {
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

export const MenuTrigger = forwardRef(
  <T extends ElementType = "div">(
    { children, as, ...rest }: PolymorphicComponentProp<T, PropsWithChildren>,
    forwardedRef?: PolymorphicRef<T>,
  ) => {
    const {
      controller: { refs },
      interactions: { getReferenceProps },
    } = useMenuContext();
    const Component = as ?? "div";
    return (
      <Component
        ref={useMergeRefs([refs.setReference, forwardedRef])}
        {...rest}
        {...getReferenceProps()}
      >
        {children}
      </Component>
    );
  },
);

MenuTrigger.displayName = "MenuTrigger";

export const MenuContent = ({
  children,
  width = "sm",
  paddingScheme = "document",
}: PropsWithChildren<{
  width?: "sm" | "fit";
  paddingScheme?: "document" | "none";
}>) => {
  const {
    isOpen,
    controller: { context, refs, floatingStyles },
    interactions: { getFloatingProps },
    listRef,
    labelsRef,
  } = useMenuContext();

  if (!context) return;

  return (
    <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
      {isOpen && (
        <>
          <FloatingOverlay />
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              returnFocus={false}
              visuallyHiddenDismiss
            >
              <div
                className={clsx(
                  "flex flex-col rounded border border-slate-600 bg-slate-750 p-1 focus:outline-none",
                  width === "sm" ? "w-40" : "w-fit",
                  paddingScheme === "document" && "ml-[37px]",
                )}
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        </>
      )}
    </FloatingList>
  );
};

export const MenuItem = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ onClick, text, disabled, ...rest }, forwardedRef) => {
    const {
      interactions: { getItemProps },
      activeIndex,
      setIsOpen,
    } = React.useContext(MenuContext);
    const item = useListItem({ label: disabled ? null : text });
    const isActive = item.index === activeIndex;

    return (
      <DropdownButton
        {...rest}
        ref={useMergeRefs([item.ref, forwardedRef])}
        tabIndex={isActive ? 0 : -1}
        type="button"
        role="menuitem"
        className="MenuItem gap-3"
        {...getItemProps({
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            setIsOpen(false);
          },
        })}
        text={text}
      />
    );
  },
);

MenuItem.displayName = "MenuItem";
