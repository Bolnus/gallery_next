import type { AppProps } from "next/app";
import "../globals.scss";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
