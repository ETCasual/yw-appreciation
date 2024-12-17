/* eslint-disable @next/next/no-img-element */

import { Envelope } from "@/components/Envelope";
import { type Card } from "@/pages/[id]";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const GiftPage: NextPage<Card> = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (props.from === "" && props.to === "") void router.push("/");
  }, []);
  return (
    <main
      id="main"
      className="flex h-[100dvh] w-screen flex-col items-center bg-[url('/TG_BG.jpg')] bg-cover bg-center bg-no-repeat py-10 3xl:py-16"
    >
      <img
        src="/TG_Title.png"
        className="w-[170px] object-cover lg:w-[230px] 2xl:w-[270px]"
      />

      <Envelope hint {...props} />
      {/* <div className="absolute left-1/2 bottom-20 -translate-x-1/2 text-xl text-white">
        <p className="font-chi text-center w-full lg:text-4xl leading-[155%]">
          写一段感恩的话语
        </p>
        <p className="font-chi text-center w-full lg:text-4xl leading-[155%]">
          再把它转发给你想感恩的人。
        </p>
        <p className="font-en text-center w-full lg:text-lg">
          Write a thanksgiving message to someone and forward it.
        </p>
      </div> */}
    </main>
  );
};
