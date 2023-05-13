import { type FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "~/utils/api";
import TweetCard from "./TweetCard";

interface TweetsFeedProps {
  isOnlyTweetsFromFollowingUsers: boolean;
}

const TweetsFeed: FC<TweetsFeedProps> = ({
  isOnlyTweetsFromFollowingUsers,
}) => {
  const res = api.tweet.infiniteTweets.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  // console.log(res);

  const { data, isError, isLoading, hasNextPage, fetchNextPage } = res;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  const tweets = data?.pages.flatMap((page) => page.tweets);
  if (tweets == null || tweets.length === 0)
    return (
      <h2 className="my-4 text-center text-xl text-gray-500">No Tweets</h2>
    );

  return (
    <div>
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
    </div>
  );
};

export default TweetsFeed;
