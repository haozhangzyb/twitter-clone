import { useSession } from "next-auth/react";
import { type FC } from "react";
import { api } from "~/utils/api";
import Button from "./Button";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

const FollowButton: FC<FollowButtonProps> = ({ userId, isFollowing }) => {
  const { data: session, status } = useSession();
  //   hide button if user is not authenticated or if the user is viewing their own profile
  //   if (status !== "authenticated" || session?.user?.id === userId) return null;

  const trpcUtils = api.useContext();
  const { isLoading, mutate } = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      if (status !== "authenticated") return;

      trpcUtils.profile.getById.setData({ userId }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            followers: oldData._count.followers + countModifier,
          },
          followers: addedFollow
            ? [...oldData.followers, { id: session.user.id }]
            : oldData.followers.filter(({ id }) => id !== session?.user?.id),
        };
      });
    },
  });

  return (
    <Button
      disabled={isLoading}
      onClick={() => mutate({ userId })}
      gray={isLoading}
      className="h-fit"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
