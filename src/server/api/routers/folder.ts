import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const folderRouter = createTRPCRouter({
  addFolder: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), parentId: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.folder.create({
        data: {
          name: input.name,
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
      orderBy: { name: "asc" },
      include: {
        files: true,
        children: {
          orderBy: { name: "asc" },
          include: {
            files: true,
            children: {
              orderBy: { name: "asc" },
              include: { files: true, children: true },
            },
          },
        },
      },
    });
  }),

  deleteFolders: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.folder.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
