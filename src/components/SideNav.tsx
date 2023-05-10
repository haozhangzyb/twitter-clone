import { type FC } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import NavLink from "./NavLink";

const SideNav: FC = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="sticky top-0 flex min-h-screen flex-col justify-between py-4 pl-2 pr-4">
      <ul className="flex flex-col items-start gap-4 whitespace-nowrap text-xl">
        <li>
          <NavLink href="/home">Home</NavLink>
        </li>
        <li>
          {sessionData && (
            <NavLink href={`/profiles/${sessionData.user.id}`}>Profile</NavLink>
          )}
        </li>
      </ul>
      <button
        className="rounded-full bg-white/10 px-5 py-3 text-xl font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </nav>
  );
};

export default SideNav;
