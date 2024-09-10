import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ComponentTypes } from "@prisma/client";

const upsertComponentInputSchema = z
  .object({
    type: z
      .enum([ComponentTypes.BODY, ComponentTypes.CODE, ComponentTypes.HEADING])
      .optional(),
    content: z.string().optional(),
    fileId: z.string().nullable(),
    position: z.number().optional(),
    id: z.string().optional(),
  })
  .refine(
    (val) => {
      if (!val.id) {
        return val.fileId;
      }
      return true;
    },
    { message: "Invalid arguments for creating a component" },
  );

export const componentRouter = createTRPCRouter({
  upsertComponent: protectedProcedure
    .input(upsertComponentInputSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      let nextPosition: null | number = null;
      if (!input.id) {
        const next = (
          await ctx.db.component.aggregate({
            where: { fileId: input.fileId },
            _max: { position: true },
          })
        )._max.position;
        nextPosition = next === null ? 1 : next + 1;
      }

      return ctx.db.component.upsert({
        where: { id: input.id ?? "" },
        update: {
          type: input.type,
          content: input.content,
          position: input.position,
        },
        create: {
          type: input.type!,
          content: input.content!,
          position: nextPosition,
          file: { connect: { id: input.fileId! } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.component.delete({
        where: { id: input.id, file: { ownerId: ctx.session.user.id } },
      });
      return true;
    }),
});
