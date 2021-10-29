/* eslint-disable react/no-danger */
import "../styles/globals.css";
import "@/styles/style.scss";
import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ANALYTICS_KEY } from "common/config";
import Head from "next/head";
import * as snippet from "@segment/snippet";
import { SegmentAnalytics } from "@segment/analytics.js-core";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import Widget from "@/components/Widget";
import { theme } from "@/common/constant/theme";
import WigetContext from "@/common/context/WigetContext";

declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [widgetConfig, setWidgetConfig] = useState({});

  const renderSnippet = () => {
    const opts = {
      apiKey: ANALYTICS_KEY,
      page: true,
    };

    return snippet.max(opts);
  };

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <meta name='theme-color' content='#000000' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700&family=Jost:wght@400;500;600&display=swap'
          rel='stylesheet'
        />
        <title>Oddle Reserve</title>
        <script dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
      </Head>

      <WigetContext.Provider value={{ widgetConfig, setWidgetConfig }}>
        <Widget />
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </WigetContext.Provider>
    </>
  );
}
export default MyApp;
