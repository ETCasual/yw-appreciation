import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/system";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Appreciation | YWKL</title>
        <meta name="description" content="YW Appreciation Dinner" />
        <meta property="og:type" content="website" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="You Got Mail!" />
        <meta property="og:image:url" content="/yw_logo.png" />
      </Head>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default MyApp;
