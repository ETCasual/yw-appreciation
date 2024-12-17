import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Appreciation | YWKL</title>
        <meta name="description" content="Happy Thanksgiving!" />
      </Head>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default MyApp;
