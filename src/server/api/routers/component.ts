import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ComponentTypes } from "@prisma/client";
import ComponentService from "~/server/services/component";

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

const componentService = new ComponentService();

export const componentRouter = createTRPCRouter({
  addEmptyComponent: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        type: z.enum([
          ComponentTypes.BODY,
          ComponentTypes.CODE,
          ComponentTypes.HEADING,
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.file.findUniqueOrThrow({
        where: { id: input.fileId, ownerId: ctx.session.user.id },
      });

      const nextPosition = await componentService.getNextPosition({
        fileId: input.fileId,
      });

      return ctx.db.component.create({
        data: {
          type: input.type,
          position: nextPosition,
          file: { connect: { id: input.fileId } },
        },
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        type: z.enum([
          ComponentTypes.BODY,
          ComponentTypes.CODE,
          ComponentTypes.HEADING,
        ]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.file.findUniqueOrThrow({
        where: { id: input.fileId, ownerId: ctx.session.user.id },
      });

      const nextPosition = await componentService.getNextPosition({
        fileId: input.fileId,
      });

      return ctx.db.component.create({
        data: {
          content: input.content,
          type: input.type,
          position: nextPosition,
          file: { connect: { id: input.fileId } },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fileId: z.string(),
        type: z
          .enum([
            ComponentTypes.BODY,
            ComponentTypes.CODE,
            ComponentTypes.HEADING,
          ])
          .optional(),
        content: z.string().optional(),
        position: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.component.update({
        where: {
          id: input.id,
          file: { id: input.fileId, ownerId: ctx.session.user.id },
        },
        data: {
          type: input.type,
          content: input.content,
          position: input.position,
        },
      });
    }),

  upsertComponent: protectedProcedure
    .input(upsertComponentInputSchema)
    .mutation(async ({ ctx, input }) => {
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
