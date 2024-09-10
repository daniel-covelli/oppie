import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  updateSession: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.session.updateMany({
      where: { userId: ctx.session.user.id },
      data: {
        language: "TypeScript",
        framework: "React",
        stylingLibrary: "Tailwind",
      },
    });

    return { ok: "success" };
  }),

  getClaudeSession: protectedProcedure.query(async ({ ctx }) => {
    return (
      !!ctx.session?.user.language &&
      !!ctx.session?.user.framework &&
      !!ctx.session.user.stylingLibrary
    );
  }),

  removeSession: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.session.updateMany({
      where: { userId: ctx.session.user.id },
      data: {
        language: null,
        framework: null,
        stylingLibrary: null,
      },
    });

    return { ok: "success" };
  }),
});
