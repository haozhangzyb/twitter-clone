import React from "react";
import Link from "next/link";
import { type FC } from "react";
import clx from "classnames";
import { useRouter } from "next/router";

import type { IconType } from "react-icons";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  ActiveIcon: IconType;
  InactiveIcon: IconType;
}

const NavLink: FC<NavLinkProps> = ({
  href,
  children,
  ActiveIcon,
  InactiveIcon,
}) => {
  const { asPath } = useRouter();

  const isActive = asPath.startsWith(href);
  const NavIcon = isActive ? ActiveIcon : InactiveIcon;

  return (
    <Link href={href} className={clx({ "font-bold": isActive })}>
      <div className="flex items-center justify-center gap-3">
        <NavIcon size={30} />
        <span className="hidden md:inline">{children}</span>
      </div>
    </Link>
  );
};

export default NavLink;
