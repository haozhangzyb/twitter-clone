import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { VscAccount } from "react-icons/vsc";

type User = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

interface AvatarProps {
  user: User;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ user, className = "" }) => {
  const { id, image } = user;

  return (
    <Link href={`/profiles/${id}`} passHref={true}>
      <div
        className={`h-12 w-12 overflow-hidden rounded-full ${className} relative flex-shrink-0 flex-grow-0`}
      >
        {image == null ? (
          <VscAccount className="h-full w-full" />
        ) : (
          <Image src={image} alt="Profile Image" quality={100} fill />
        )}
      </div>
    </Link>
  );
};

export default Avatar;
