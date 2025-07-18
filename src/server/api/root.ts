import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { claudeRouter } from "~/server/api/routers/claude/router";
import { sessionRouter } from "./routers/session";
import { folderRouter } from "./routers/folder";
import { fileRouter } from "./routers/file";
import { componentRouter } from "./routers/component";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  claude: claudeRouter,
  session: sessionRouter,
  folder: folderRouter,
  file: fileRouter,
  component: componentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
