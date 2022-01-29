import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '../src/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </>
    </Provider>
  );
}
export default MyApp;
