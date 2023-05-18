import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import type { TweetRouter } from "~/server/api/routers/tweet";

type TweetRouterOutput = inferRouterOutputs<TweetRouter>;

export type TweetQueryOutput =
  TweetRouterOutput["infiniteFeed"]["tweets"][number];

export type infiniteFeedQueryOutput = TweetRouterOutput["infiniteFeed"];

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
