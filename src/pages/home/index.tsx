import { type NextPage } from "next";
import Header from "~/components/Header";
import NewTweetForm from "~/components/NewTweetForm";
import TweetsFeed from "~/components/TweetsFeed";

const Home: NextPage = () => {
  return (
    <>
      <Header>
        <h1 className="px-4 py-3 text-xl font-bold">Home</h1>
      </Header>
      <NewTweetForm />
      <TweetsFeed isOnlyTweetsFromFollowingUsers={false} />
    </>
  );
};

export default Home;
