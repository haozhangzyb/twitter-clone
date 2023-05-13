import { useSession } from "next-auth/react";
import { type FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  disabled: boolean;
  onClick: () => void;
  likedByMe: boolean;
  showCount: boolean;
  likeCount: number;
}

const LikeButton: FC<LikeButtonProps> = ({
  disabled,
  onClick,
  likedByMe,
  showCount,
  likeCount,
}) => {
  const session = useSession();

  const isAuthenticated = session.status === "authenticated";

  const HeartIcon = likedByMe ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      disabled={!isAuthenticated || disabled}
      onClick={onClick}
      className={`group flex items-center text-sm text-slate-500 
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
