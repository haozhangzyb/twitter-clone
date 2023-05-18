import { type FC } from "react";
import type { TweetQueryOutput } from "~/utils/types";
import Link from "next/link";

import Avatar from "./Avatar";
import LikeButton from "./LikeButton";

interface TweetCardProps {
  tweet: TweetQueryOutput;
}

const TweetCard: FC<TweetCardProps> = ({ tweet }) => {
  const { content, user, createdAt } = tweet;

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
          <LikeButton tweet={tweet} showCount={true} />
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
