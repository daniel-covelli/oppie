import { Menu, MenuItem, MenuItems } from "@headlessui/react";

export default function DropDown({
  menuButton: MenuButton,
  options,
}: {
  menuButton: React.ComponentType;
  options: {
    id: string;
    component: React.ComponentType;
  }[];
}) {
  return (
    <div className="relative">
      <Menu>
        <MenuButton />
        <MenuItems
          transition
          anchor={{ to: "bottom start", gap: "4px" }}
          className="w-fit origin-top-right rounded border border-slate-600 bg-slate-700 p-2 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="flex flex-col gap-1">
            {options.map(({ id, component: Component }) => (
              <MenuItem key={id}>
                <Component />
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}
