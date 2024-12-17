import MainPage from "@/modules/Main";

export default function Home() {
  return (
    <>
      <meta property="og:type" content="website" />

      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="600" />
      <meta
        property="og:image:alt"
        content="Write a letter to someone you love!"
      />
      <MainPage />
    </>
  );
}
