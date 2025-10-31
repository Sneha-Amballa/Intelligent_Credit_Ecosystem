import Head from "next/head";

import "../styles/global.css";
import "react-chat-elements/dist/main.css";

import { AuthProvider } from "@/context/AuthProvider";
import { LandDataProvider } from "@/context/LandDataProvider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FinanceFriend</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AuthProvider>
        <LandDataProvider>
          <Component {...pageProps} />
        </LandDataProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
