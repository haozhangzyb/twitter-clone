import { type Prisma } from "@prisma/client";
import { TRPCError, type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
});

export const tweetRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { userId, limit = 10, cursor }, ctx }) => {
      return getInfiniteFeedHelper({
        ctx,
        limit,
        cursor,
        whereClause: {
          userId,
        },
      });
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user?.id;

        return getInfiniteFeedHelper({
          ctx,
          limit,
          cursor,
          whereClause:
            !currentUserId || !onlyFollowing
              ? {}
              : {
                  user: {
                    follows: {
                      some: {
                        id: currentUserId,
                      },
                    },
                  },
                },
        });
      }
    ),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const userId = ctx.session.user.id;

      const { success } = await ratelimit.limit(userId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          userId,
        },
      });

      void ctx.revalidateSSG?.(`/profiles/${userId}`);

      return tweet;
    }),

  toggleLike: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ input: { tweetId }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const data = { userId: currentUserId, tweetId };

      const like = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (like == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
});

async function getInfiniteFeedHelper({
  ctx,
  limit,
  cursor,
  whereClause,
}: {
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  whereClause: Prisma.TweetWhereInput;
}) {
  const currentUserId = ctx.session?.user?.id;

  const tweets = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (tweets.length > limit) {
    const nextItem = tweets.pop();
    if (!nextItem) throw new Error("nextItem is undefined");

    const { id, createdAt } = nextItem;
    nextCursor = { id, createdAt };
  }

  return {
    tweets: tweets.map(({ likes, _count, ...filteredData }) => ({
      likeCount: _count.likes,
      likedByMe: likes?.length > 0,
      ...filteredData,
    })),
    nextCursor,
  };
}
