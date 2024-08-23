import { getSessionOrRedirect } from "~/server/ssr-utils";
import FileContent from "./_client-components";
import { api } from "~/trpc/server";

export default async function File({ params }: { params: { id: string } }) {
  await getSessionOrRedirect();
  const file = await api.file.getFile({ id: params.id });
  return <FileContent file={file} />;
}
