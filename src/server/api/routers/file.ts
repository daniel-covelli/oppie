import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const fileRouter = createTRPCRouter({
  addFile: protectedProcedure
    .input(
      z.object({
        heading: z.string(),
        folderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.file.create({
        data: {
          owner: { connect: { id: ctx.session.user.id } },
          folder: { connect: { id: input.folderId } },
          heading: { create: { content: input.heading, type: "HEADING" } },
        },
      });
    }),
});
