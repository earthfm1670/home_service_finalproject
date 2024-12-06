import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ServicesProvider } from "@/components/ServicesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ServicesProvider>
      <Component {...pageProps} />
    </ServicesProvider>
  );
}
