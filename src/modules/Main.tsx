/* eslint-disable @next/next/no-img-element */
import { Envelope } from "@/components/Envelope";

function MainPage() {
  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center bg-[url('/TG_BG.jpg')] bg-cover bg-center bg-no-repeat py-10 3xl:py-16">
      <img
        src="/TG_Title.png"
        className="w-[170px] object-cover lg:w-[230px] 2xl:w-[270px]"
      />
      <Envelope hint sending />
      <div className="absolute bottom-[18.5%] left-1/2 flex w-full -translate-x-1/2 flex-col text-white lg:bottom-10 3xl:bottom-20">
        <p className="w-full text-center font-chi text-2xl lg:text-4xl">
          写一段感恩的话语，
          <br />
          再把它发给你想感恩的人。
        </p>

        <p className="w-[75%] self-center text-center font-en text-sm lg:text-lg">
          Write a thanksgiving message to someone.
        </p>
      </div>
    </main>
  );
}

export default MainPage;
