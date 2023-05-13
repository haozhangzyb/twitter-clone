import type { inferRouterOutputs } from "@trpc/server";
import type { TweetRouter } from "~/server/api/routers/tweet";

type TweetRouterOutput = inferRouterOutputs<TweetRouter>;

export type TweetQueryOutput =
  TweetRouterOutput["infiniteTweets"]["tweets"][number];
