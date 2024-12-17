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
      </Head>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default MyApp;
