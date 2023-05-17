import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              follows: true,
              tweets: true,
            },
          },

          followers: {
            where: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });

      if (!profile) return;

      return profile;
    }),
});
