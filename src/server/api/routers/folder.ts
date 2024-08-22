import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const folderRouter = createTRPCRouter({
  addFolder: protectedProcedure
    .input(
      z.object({
        heading: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.folder.create({
        data: {
          heading: {
            create: { content: input.heading, type: "HEADING" },
          },
          owner: { connect: { id: ctx.session.user.id } },
          ...(input.parentId
            ? { parent: { connect: { id: input.parentId } } }
            : {}),
        },
      });
    }),

  getFolders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.folder.findMany({
      where: { ownerId: ctx.session.user.id, parentId: null },
      include: {
        heading: true,
        files: { include: { heading: true } },
        children: {
          include: {
            heading: true,
            files: { include: { heading: true } },
            children: {
              include: {
                files: { include: { heading: true } },
                children: true,
                heading: true,
              },
            },
          },
        },
      },
    });
  }),

  deleteFolder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.folder.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
