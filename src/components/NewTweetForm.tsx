import { useRef, type FC, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import Button from "./Button";
import Avatar from "./Avatar";
import useAutoResizeTextArea from "~/hooks/useAutoResizeTextArea";
import { api } from "~/utils/api";
import type { TweetQueryOutput } from "~/utils/trpc";

const NewTweetForm: FC = ({}) => {
  const trpcContext = api.useContext();
  const { data: sessionData, status } = useSession();

  const user = sessionData?.user;

  const [inputVal, setInputVal] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextArea(textAreaRef.current, inputVal);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      if (status !== "authenticated") return;

      setInputVal("");

      const newCacheTweet: TweetQueryOutput = {
        ...newTweet,
        likeCount: 0,
        likedByMe: false,
        user: {
          id: sessionData.user.id,
          name: sessionData.user.name ?? null,
          image: sessionData.user.image ?? null,
        },
      };

      const addNewTweet: Parameters<
        typeof trpcContext.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldTweets) => {
        if (oldTweets == null || oldTweets.pages[0] == null) {
          // trpcContext.tweet.infiniteFeed.invalidate();
          return;
        }

        return {
          ...oldTweets,
          pages: [
            {
              ...oldTweets.pages[0],
              tweets: [newCacheTweet, ...oldTweets.pages[0].tweets],
            },
            ...oldTweets.pages.slice(1),
          ],
        };
      };

      trpcContext.tweet.infiniteFeed.setInfiniteData({}, addNewTweet);
      trpcContext.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        addNewTweet
      );
      trpcContext.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: false },
        addNewTweet
      );
      if (!user) return;
      trpcContext.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        addNewTweet
      );
    },
    onError: (err) => {
      console.error(err);
      // const errorMessage = err.data?.zodError?.fieldErrors.message;
      toast.error("Failed to create tweet! Please try again later.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputVal !== "") {
      createTweet.mutate({ content: inputVal });
    }
  };

  if (!sessionData) return null;
  return (
    <form
      className="flex gap-2 border-b border-b-slate-600 px-4 py-2"
      onSubmit={handleSubmit}
    >
      <Avatar user={sessionData.user} />
      <div className="flex w-full flex-col gap-4">
        <textarea
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          ref={textAreaRef}
          className="flex-grow resize-none overflow-hidden border-b border-b-slate-600 bg-transparent px-4 py-3 text-lg font-semibold outline-none"
          placeholder="What's happening?"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (inputVal !== "") {
                createTweet.mutate({ content: inputVal });
              }
            }
          }}
        />
        <Button className="self-end" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default NewTweetForm;
