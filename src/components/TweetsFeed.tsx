import { type FC } from "react";
import { api } from "~/utils/api";

interface TweetsFeedProps {
  isOnlyTweetsFromFollowingUsers: boolean;
}

const TweetsFeed: FC<TweetsFeedProps> = ({
  isOnlyTweetsFromFollowingUsers,
}) => {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.tweet.infiniteTweets.useInfiniteQuery(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const tweets = data?.pages.flatMap((page) => page.tweets);

  return (
    <div>
      {tweets?.map((tweet) => (
        <p key={tweet.id}>{tweet.content}</p>
      ))}
    </div>
  );
};

export default TweetsFeed;
