import {
  autoUpdate,
  FloatingFocusManager,
  FloatingList,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingReturn,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import {
  type PropsWithChildren,
  useRef,
  type HTMLProps,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import { ItemButton, type DropdownButtonProps } from "../clickable";
import React from "react";

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
  context?: UseFloatingReturn["context"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
}

const MenuContext = React.createContext<MenuContextType>({
  getItemProps: () => ({}),
  activeIndex: null,
  isOpen: false,
  setIsOpen: () => ({}),
  getFloatingProps: () => ({}),
  setFloating: () => ({}),
  listRef: { current: [] },
  context: undefined,
  getReferenceProps: () => ({}),
  setReference: () => ({}),
});

type RenderProps = Pick<MenuContextType, "setIsOpen">;
type MenuProviderProps = {
  children: (props: RenderProps) => React.ReactNode;
  handleOutsidePress?: () => void;
};

export const MenuProvider = ({
  children,
  handleOutsidePress,
}: MenuProviderProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { refs, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: (val, _, reason) => {
      setIsOpen(val);
      if (reason === "escape-key" || reason === "outside-press") {
        handleOutsidePress?.();
      }
    },
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
  });
  const listRef = useRef<Array<HTMLButtonElement | null>>([]);

  const click = useClick(context);
  const role = useRole(context, { role: "menu" });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex: activeIndex,
    onNavigate: setActiveIndex,
  });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, click, dismiss, listNavigation],
  );

  const menuContext = useMemo(
    () => ({
      activeIndex,
      getItemProps,
      setIsOpen,
      isOpen,
      getFloatingProps,
      setFloating: refs.setFloating,
      setReference: refs.setReference,
      listRef,
      context,
      getReferenceProps,
      isPositioned,
    }),
    [
      activeIndex,
      getItemProps,
      isOpen,
      getFloatingProps,
      refs.setFloating,
      refs.setReference,
      context,
      getReferenceProps,
      isPositioned,
    ],
  );

  const renderProps = useCallback(
    () => ({
      setIsOpen,
    }),
    [setIsOpen],
  );
  return (
    <MenuContext.Provider value={menuContext}>
      {children(renderProps())}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};

export const MenuTrigger = ({ children }: PropsWithChildren) => {
  const { setReference, getReferenceProps } = useMenuContext();
  return (
    <div ref={setReference} {...getReferenceProps()}>
      {children}
    </div>
  );
};

export const Menu = ({ children }: PropsWithChildren) => {
  const { isOpen, getFloatingProps, context, setFloating, listRef } =
    useMenuContext();

  if (!context) return;

  return (
    isOpen && (
      <FloatingFocusManager context={context} modal={false}>
        <div
          className="ml-[37px] flex w-40 flex-col items-start rounded border border-slate-600 bg-slate-750 p-1 focus:outline-none"
          ref={setFloating}
          {...getFloatingProps()}
        >
          <FloatingList elementsRef={listRef}>{children}</FloatingList>
        </div>
      </FloatingFocusManager>
    )
  );
};

export const MenuItem = ({
  text,
  onClick,
  ...rest
}: Omit<DropdownButtonProps, "description">) => {
  const menu = React.useContext(MenuContext);
  const item = useListItem({ label: text });
  const isActive = item.index === menu.activeIndex;

  return (
    <ItemButton
      ref={item.ref}
      {...rest}
      tabIndex={isActive ? 0 : -1}
      type="button"
      role="menuitem"
      className="gap-3"
      {...menu.getItemProps({
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          menu.setIsOpen(false);
        },
      })}
      text={text}
    />
  );
};

MenuItem.displayName = "MenuItem";
