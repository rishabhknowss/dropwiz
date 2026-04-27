import "@/styles/globals.css";
import "nprogress/nprogress.css";
import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { api } from "@/utils/api";
import { ThemeProvider } from "@/lib/theme-context";
import { NProgressBar } from "@/lib/nprogress";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <div
        id="dw-app-root"
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
      >
        <NProgressBar />
        <Component {...pageProps} />
        <Toaster
          theme="system"
          richColors
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-geist-sans)",
              borderRadius: "12px",
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default api.withTRPC(App);
