import { type FC } from "react";
import type { TweetQueryOutput } from "~/utils/types";
import Avatar from "./Avatar";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { api } from "~/utils/api";

interface TweetCardProps {
  tweet: TweetQueryOutput;
}

const TweetCard: FC<TweetCardProps> = ({ tweet }) => {
  const ctx = api.useContext();

  const { id, content, user, createdAt, likeCount, likedByMe } = tweet;
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateTweet: Parameters<
        typeof ctx.tweet.infiniteTweets.setInfiniteData
      >[1] = (oldTweets) => {
        if (oldTweets == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldTweets,
          pages: oldTweets.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };

      ctx.tweet.infiniteTweets.setInfiniteData({}, updateTweet);
    },
  });

  const handleToggleLike = () => {
    toggleLike.mutate({ tweetId: id });
  };

  return (
    <div className="flex gap-3 border-b border-b-slate-600 px-4 pt-4">
      <Avatar user={user} className="flex-shrink-0 flex-grow-0" />

      <div className="flex flex-col">
        <div className="flex gap-2">
          <Link href={`/profiles/${user.id}`} passHref={true}>
            <p className="font-bold">{user.name}</p>
          </Link>
          <Link href={`/profiles/${user.id}`} passHref={true}>
            <p className="text-gray-500">@{user.id}</p>
          </Link>
          {/* TODO: how long ago */}
          <p className="text-gray-500">· {createdAt.getTime()}</p>
        </div>
        <div style={{ overflowWrap: "anywhere" }}>{content}</div>
        <div className="my-1 flex">
          <LikeButton
            disabled={toggleLike.isLoading}
            likeCount={likeCount}
            showCount={true}
            likedByMe={likedByMe}
            onClick={handleToggleLike}
          />
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
