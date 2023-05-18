import { type FC } from "react";
import { api } from "~/utils/api";
import InfiniteFeed from "./InfiniteFeed";

interface TweetsFeedProps {
  isOnlyTweetsFromFollowingUsers: boolean;
}

const TweetsFeed: FC<TweetsFeedProps> = ({
  isOnlyTweetsFromFollowingUsers,
}) => {
  const res = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: isOnlyTweetsFromFollowingUsers },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const { data, isError, isLoading, hasNextPage, fetchNextPage } = res;
  const tweets = data?.pages.flatMap((page) => page.tweets);
  return (
    <InfiniteFeed
      tweets={tweets}
      isError={isError}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default TweetsFeed;
