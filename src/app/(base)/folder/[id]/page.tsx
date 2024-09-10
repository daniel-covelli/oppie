import { getSessionOrRedirect } from "~/server/ssr-utils";

export default async function Folder() {
  await getSessionOrRedirect();
  return <div>More to come...</div>;
}
