/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GiftPage } from "@/modules/Gift";
import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";

export type Card = {
  to: string;
  message: string;
  image: string | null;
};

const Gift: NextPage<Card> = (card) => {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />

        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="You Got Mail!" />
      </Head>
      <GiftPage {...card} />
    </>
  );
};

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const res = await fetch(
    `http://localhost:3000/api/getCard/${context.params?.id as string}`,
    {
      method: "GET",
    },
  );
  const card = await res.json();
  console.log("card", card);

  if (res.ok)
    return {
      props: {
        to: card.card.to ?? "",
        message: card.card.message ?? "",
        image: card.card.image ?? "",
      },
    };
  else
    return {
      props: {
        from: "",
        to: "",
        message: "",
        image: "",
      },
    };
}) satisfies GetServerSideProps<Card>;

export default Gift;
