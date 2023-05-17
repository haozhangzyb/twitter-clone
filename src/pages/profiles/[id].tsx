import type {
  GetStaticPropsContext,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";

import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import Header from "~/components/Header";

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{profile.name} / Twitter Clone</title>
      </Head>
      <Header showBackButton>
        <div className="flex flex-col items-start px-4 py-1">
          <h1 className=" text-xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">
            {profile._count.tweets} Tweets
          </p>
        </div>
      </Header>
      {profile.name}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default Profile;
