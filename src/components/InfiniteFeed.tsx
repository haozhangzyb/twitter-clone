import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import type { RouterOutput } from "~/utils/types";
import TweetCard from "./TweetCard";

interface InfiniteFeedProps {
  tweets: RouterOutput["tweet"]["infiniteTweets"]["tweets"] | undefined;
  isError: boolean;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => Promise<UseInfiniteQueryResult>;
}

const InfiniteFeed: FC<InfiniteFeedProps> = ({
  tweets,
  isError,
  isLoading,
  hasNextPage,
  fetchNextPage,
}) => {
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  if (tweets == null || tweets.length === 0)
    return (
      <h2 className="my-4 text-center text-xl text-gray-500">No Tweets</h2>
    );

  return (
    <InfiniteScroll
      dataLength={tweets.length}
      next={fetchNextPage}
      hasMore={hasNextPage || false}
      loader={<p>loading...</p>}
      endMessage={
        <h2 className="my-4 text-center  text-gray-500">
          Yay! You have seen it all
        </h2>
      }
    >
      {tweets?.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
