import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "@/context/authContext";
import { TimerProvider } from "@/context/TimerContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TimerProvider>
        <Component {...pageProps} />
      </TimerProvider>
    </AuthProvider>
  );
}
