"server-only";
import { z } from "zod";

import {
  createTRPCRouter,
  promptingProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import ClaudeService from "../services/claude";
import { TRPCError } from "@trpc/server";

const claudeService = new ClaudeService();

export const claudeRouter = createTRPCRouter({
  getMessage: promptingProcedure
    .input(
      z.object({
        input: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { input } }) => {
      return claudeService.getMessageByUserSession({
        user: ctx.session.user,
        input,
      });
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
      return claudeService.getMessageByOutputType({
        type: file.codeOutputType,
        input: input.input,
      });
    }),
});
