import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const anunciosRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.anuncio.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string(), email: z.string() }))
    .query(async ({ ctx, input }) => {
      
      return ctx.db.anuncio.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
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

    update: protectedProcedure
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
  

    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const anuncio = await db.anuncio.delete({
        where: { id: input.id },
      });
      return anuncio;
    }),
});