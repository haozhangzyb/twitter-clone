import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import SideNav from "~/components/SideNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="This is a twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] sm:pr-4">
        <div className="container mx-auto flex items-start text-slate-200">
          <SideNav />
          <div className="min-h-screen flex-grow border-x">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
