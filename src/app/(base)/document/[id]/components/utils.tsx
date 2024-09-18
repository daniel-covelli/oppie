import { useEffect, useRef } from "react";
import { create } from "zustand";
import { type RouterOutputs } from "~/trpc/react";

type ComponentType = RouterOutputs["file"]["getFile"]["heading"];

type State = {
  components: RouterOutputs["file"]["getFile"]["components"];
  isNewComponentAdded: boolean;
};

type Action = {
  updateComponentsState: (components: State["components"]) => void;
  updateIsNewComponentAddedState: (
    isNewComponentAdded: State["isNewComponentAdded"],
  ) => void;
};

export const useComponentFocusHandlerState = create<State & Action>((set) => ({
  components: [] as RouterOutputs["file"]["getFile"]["components"],
  isNewComponentAdded: false,
  updateComponentsState: (components) => set(() => ({ components })),
  updateIsNewComponentAddedState: (isNewComponentAdded) =>
    set(() => ({ isNewComponentAdded })),
}));

export const useComponentFocusHandler = (
  initialComponents?: RouterOutputs["file"]["getFile"]["components"],
) => {
  const {
    components,
    isNewComponentAdded,
    updateIsNewComponentAddedState,
    updateComponentsState,
  } = useComponentFocusHandlerState();

  useEffect(() => {
    if (initialComponents) {
      updateComponentsState(initialComponents);
    }
  }, [initialComponents, updateComponentsState]);

  const lastComponentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNewComponentAdded && lastComponentRef.current) {
      lastComponentRef.current.focus();
      updateIsNewComponentAddedState(false);
    }
  }, [components, isNewComponentAdded, updateIsNewComponentAddedState]);

  const manageNewComponentFocus = (newComponent: ComponentType) => {
    updateComponentsState([...components, newComponent]);
    updateIsNewComponentAddedState(true);
  };

  const addNewComponents = (
    components: RouterOutputs["file"]["getFile"]["components"],
  ) => {
    updateComponentsState(components);
  };

  const manageDeleteComponent = (id: string) => {
    updateComponentsState(
      components.filter((component) => component.id !== id) ?? components,
    );
  };
  return {
    manageNewComponentFocus,
    manageDeleteComponent,
    addNewComponents,
    lastComponentRef,
    components,
  };
};
