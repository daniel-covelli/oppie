import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// function extractIdFromUrl(url: string): string | null {
//   // Regular expression to match ID after 'folder/' or 'document/'
//   const pattern = /(?:folder|document)\/([^/]+)/;

//   // Find the first match in the URL
//   const match = url.match(pattern);

//   // If a match is found, return the captured group (the ID)
//   // Otherwise, return null
//   return match?.[1] ? match[1] : null;
// }

// function returnShouldOpen(folders: FolderType[], slug: string | null) {
//   const copies: FolderResponseType[] = [];
//   const dfs = (folder: FolderType) => {
//     const copy = { ...folder, isOpen: false };
//     if (folder.id === slug) {
//       return true;
//     }
//     if (!folder.children) {
//       return false;
//     }

//     for (const file of folder.files) {
//       if (file.id === slug) {
//         return true;
//       }
//     }

//     for (const child of folder.children) {
//       const res = dfs(child);
//       if (res) {
//         copy.isOpen = true;
//       }
//     }
//     copies.push(copy as FolderResponseType);
//     return true;
//   };
//   for (const folder of folders) {
//     dfs(folder);
//   }

//   return copies;
// }

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
    const folders = await ctx.db.folder.findMany({
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

    // const slug = extractIdFromUrl(ctx.headers.get("referer") ?? "");

    return folders;
  }),

  deleteFolder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.folder.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),
});
