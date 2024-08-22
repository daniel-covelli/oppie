import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ComponentTypes } from "@prisma/client";

export const componentRouter = createTRPCRouter({
  addComponent: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          ComponentTypes.BODY,
          ComponentTypes.CODE,
          ComponentTypes.HEADING,
        ]),
        content: z.string(),
        fileId: z.string(),
        position: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.component.create({
        data: {
          type: input.type,
          content: input.content,
          position: input.position,
          file: { connect: { id: input.fileId } },
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
});
