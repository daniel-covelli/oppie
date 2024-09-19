import { type Placement } from "@floating-ui/react";

export interface ControlledFloatingProps {
  open?: boolean;
  setOpen?: (val: boolean) => void;
  anchorRef?: HTMLElement | null;
}

export interface FloatingOptions extends ControlledFloatingProps {
  initialOpen?: boolean;
  placement?: Placement;
  handleOutsidePress?: () => void;
}
