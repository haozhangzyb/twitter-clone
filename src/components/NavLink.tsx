import React from "react";
import Link from "next/link";
import { type FC } from "react";
import clx from "classnames";
import { useRouter } from "next/router";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ href, children }) => {
  const { asPath } = useRouter();

  return (
    <Link href={href} className={clx({ "font-bold": asPath.startsWith(href) })}>
      {children}
    </Link>
  );
};

export default NavLink;
