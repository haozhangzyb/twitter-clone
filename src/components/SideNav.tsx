import { type FC } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import NavLink from "./NavLink";
import Button from "./Button";

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
      <Button
        gray
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </nav>
  );
};

export default SideNav;
