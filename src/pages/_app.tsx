import "@/styles/globals.css";
import type { AppProps } from "next/app";
import jwtInterceptor from "@/utils/jwtInterseptor";
import { AuthProvider } from "@/context/authContext";

export default function App({ Component, pageProps }: AppProps) {
  jwtInterceptor();
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
