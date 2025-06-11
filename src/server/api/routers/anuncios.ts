import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const anunciosRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.anuncio.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.anuncio.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(3),
        descripcion: z.string().min(10),
        estado: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.anuncio.create({
        data: input,
      });
    }),

    update: publicProcedure
    .input(z.object({
      id: z.string(),
      titulo: z.string().min(3),
      descripcion: z.string().min(10),
      estado: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.anuncio.update({
        where: { id: input.id },
        data: {
          titulo: input.titulo,
          descripcion: input.descripcion,
          estado: input.estado,
        },
      });
    }),
  

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.anuncio.delete({
        where: { id: input.id },
      });
    }),
}); 