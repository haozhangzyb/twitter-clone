import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
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
            select: {
              id: true,
            },
          },
        },
      });

      if (!profile) return;

      return profile;
    }),

  toggleFollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session?.user?.id;

      const { userId } = input;

      const existingFollow = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          followers: { some: { id: currentUserId } },
        },
      });

      let addedFollow;

      if (existingFollow !== null) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            followers: {
              disconnect: {
                id: currentUserId,
              },
            },
          },
        });
        addedFollow = false;
      } else {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            followers: {
              connect: {
                id: currentUserId,
              },
            },
          },
        });
        addedFollow = true;
      }

      // use `void` to ignore waiting the promise
      void ctx.revalidateSSG?.(`/profiles/${userId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);

      return { addedFollow };
    }),
});
