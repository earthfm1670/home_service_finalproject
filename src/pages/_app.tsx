import "@/styles/globals.css";
import type { AppProps } from "next/app";
import jwtInterceptor from "@/utils/jwtInterseptor";
import { AuthProvider } from "@/context/authContext";
import { TimerProvider } from "@/context/TimerContext";

export default function App({ Component, pageProps }: AppProps) {
  jwtInterceptor();
  return (
    <AuthProvider>
      <TimerProvider>
        <Component {...pageProps} />
      </TimerProvider>
    </AuthProvider>
  );
}
