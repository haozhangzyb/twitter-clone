import { type NextPage } from "next";
import NewTweetForm from "~/components/NewTweetForm";
import TweetsFeed from "~/components/TweetsFeed";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-b-slate-600">
        <h1 className="px-4 py-3 text-xl font-bold">Home</h1>
      </header>
      <NewTweetForm />
      <TweetsFeed isOnlyTweetsFromFollowingUsers={false} />
    </>
  );
};

export default Home;
