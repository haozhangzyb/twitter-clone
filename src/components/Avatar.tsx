import Image from "next/image";
import { type FC } from "react";
import { VscAccount } from "react-icons/vsc";

interface AvatarProps {
  src?: string | null;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ src, className = "" }) => {
  return (
    <div
      className={`h-14 w-14 overflow-hidden rounded-full ${className} relative`}
    >
      {src == null ? (
        <VscAccount className="h-full w-full" />
      ) : (
        <Image src={src} alt="Profile Image" quality={100} fill />
      )}
    </div>
  );
};

export default Avatar;
