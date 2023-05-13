import { useSession } from "next-auth/react";
import { type FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { api } from "~/utils/api";

interface LikeButtonProps {
  tweetId: string;
  likedByMe: boolean;
  showCount: boolean;
  likeCount: number;
}

const LikeButton: FC<LikeButtonProps> = ({
  tweetId,
  likedByMe,
  showCount,
  likeCount,
}) => {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const trpcContext = api.useContext();

  const { isLoading, mutate } = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateTweet: Parameters<
        typeof trpcContext.tweet.infiniteTweets.setInfiniteData
      >[1] = (oldTweets) => {
        if (oldTweets == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldTweets,
          pages: oldTweets.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === tweetId) {
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

      trpcContext.tweet.infiniteTweets.setInfiniteData({}, updateTweet);
    },
  });

  function handleLickToggle() {
    mutate({ tweetId });
  }

  const HeartIcon = likedByMe ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      disabled={!isAuthenticated || isLoading}
      onClick={handleLickToggle}
      className={`
        group flex items-center text-sm text-slate-500 
        ${likedByMe ? "text-red-500" : ""} 
        ${isAuthenticated ? "hover:text-red-500" : ""} 
        transition-colors    duration-200        
        `}
    >
      <div className="group-transition-colors -ml-2 rounded-full  p-2 group-hover:bg-red-500/30">
        <HeartIcon size={20} className={`${likedByMe ? "fill-red-500" : ""}`} />
      </div>

      {showCount && <span className="ml-1">{likeCount}</span>}
    </button>
  );
};

export default LikeButton;
