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
          heading: {
            create: {
              content: input.heading,
              type: "HEADING",
            },
          },
        },
      });
    }),

  getFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.file.findUniqueOrThrow({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
        include: {
          heading: true,
          components: {
            where: { NOT: { position: null } },
            orderBy: { position: "asc" },
          },
        },
      });
    }),

  deleteFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.file.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
