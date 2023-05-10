import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

interface SideNavProps {}

const SideNav: FC<SideNavProps> = ({}) => {
  const { data: sessionData } = useSession();

  return (
    <nav className="sticky top-0 flex min-h-screen flex-col justify-between px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          {sessionData && (
            <Link href={`/profiles/${sessionData?.user.id}`}>Profile</Link>
          )}
        </li>
      </ul>
      <button
        className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </nav>
  );
};

export default SideNav;
