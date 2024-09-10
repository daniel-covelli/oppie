"server-only";
import { z } from "zod";

import {
  createTRPCRouter,
  promptingProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { getMessageByCtx, getMessageByFile } from "./utils";
import { TRPCError } from "@trpc/server";

const GetMessageSchema = z.object({
  input: z.string(),
});

export const claudeRouter = createTRPCRouter({
  getMessage: promptingProcedure
    .input(GetMessageSchema)
    .mutation(async ({ ctx, input: { input } }) => {
      return getMessageByCtx({ ctx, input });
    }),

  getMessageForFile: protectedProcedure
    .input(
      z.object({
        input: z.string(),
        fileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUniqueOrThrow({
        where: { id: input.fileId },
      });
      if (!file.codeOutputType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must have codeOutputType selected",
        });
      }
      return getMessageByFile({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: file.codeOutputType,
        input: input.input,
      });
    }),
});
