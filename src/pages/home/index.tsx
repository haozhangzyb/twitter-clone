import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Header from "~/components/Header";
import NewTweetForm from "~/components/NewTweetForm";
import TweetsFeed from "~/components/TweetsFeed";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(TABS[0]);

  return (
    <>
      <Header>
        <h1 className="px-4 py-3 text-xl font-bold">Home</h1>
      </Header>
      <div className="flex border-b border-b-slate-600 ">
        {status === "authenticated" &&
          TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-grow py-3 
              hover:bg-gray-500 hover:bg-opacity-10
              ${tab === activeTab ? "font-semibold" : ""}`}
            >
              {tab}
              {tab === activeTab && (
                <div className="absolute bottom-0 h-1 w-full bg-blue-500" />
              )}
            </button>
          ))}
      </div>
      <NewTweetForm />
      <TweetsFeed isOnlyTweetsFromFollowingUsers={activeTab === "Following"} />
    </>
  );
};

export default Home;
