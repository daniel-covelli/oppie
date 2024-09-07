import { type ComponentType } from "react";

export default function Tag({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className: string }>;
  text: string;
}) {
  return (
    <div className="flex flex-row items-center gap-2 rounded-full border border-slate-600 px-2 py-1">
      <Icon className="size-4 text-slate-400" />
      <p className="text-xs text-slate-300">{text}</p>
    </div>
  );
}
