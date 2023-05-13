import { type FC } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
} from "react-icons/ai";
import { BsPerson, BsPersonFill } from "react-icons/bs";

import NavLink from "./NavLink";
import Button from "./Button";

const SideNav: FC = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="sticky top-0 flex min-h-screen flex-shrink-0 flex-col justify-between py-4 pl-2 pr-4">
      <ul className="flex flex-col items-start items-center gap-6 whitespace-nowrap text-xl">
        <li>
          <NavLink
            href="/home"
            ActiveIcon={AiFillHome}
            InactiveIcon={AiOutlineHome}
          >
            Home
          </NavLink>
        </li>
        <li>
          {sessionData && (
            <NavLink
              href={`/profiles/${sessionData.user.id}`}
              ActiveIcon={BsPersonFill}
              InactiveIcon={BsPerson}
            >
              Profile
            </NavLink>
          )}
        </li>
      </ul>
      <Button
        className="flex items-center justify-between gap-2"
        gray
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? (
          <AiOutlineLogout size={30} />
        ) : (
          <AiOutlineLogin size={30} />
        )}
        <span className="hidden md:inline">
          {sessionData ? "Sign out" : "Sign in"}
        </span>
      </Button>
    </nav>
  );
};

export default SideNav;
