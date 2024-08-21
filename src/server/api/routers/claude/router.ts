"server-only";
import { z } from "zod";

import { createTRPCRouter, promptingProcedure } from "~/server/api/trpc";

import { getMessage } from "./utils";

const GetMessageSchema = z.object({
  input: z.string(),
});

export const claudeRouter = createTRPCRouter({
  getMessage: promptingProcedure
    .input(GetMessageSchema)
    .mutation(async ({ ctx, input: { input } }) => {
      return getMessage({ ctx, input });
    }),
});
