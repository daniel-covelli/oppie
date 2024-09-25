export default function Question({ stream }: { stream: string }) {
  const parsedStream = stream
    .replace("<question>", "")
    .replace("</question>", "");

  return (
    <p className="rounded border border-slate-600 bg-slate-750 p-2">
      {parsedStream}
    </p>
  );
}
