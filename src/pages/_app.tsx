import "@/styles/globals.css";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { api } from "@/utils/api";
import { ThemeProvider } from "@/lib/theme-context";
import { ShopProvider } from "@/lib/shop-context";
import { NProgressBar } from "@/lib/nprogress";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    document.body.classList.add(GeistSans.variable, GeistMono.variable);
  }, []);

  return (
    <ThemeProvider>
      <ShopProvider>
        <style jsx global>{`
          body {
            font-family: var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif;
          }
        `}</style>
        <div
          id="dw-app-root"
          className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
        >
          <NProgressBar />
          <Component {...pageProps} />
          <Toaster
            theme="system"
            richColors
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "var(--font-geist-sans)",
                borderRadius: "12px",
              },
            }}
          />
        </div>
      </ShopProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(App);
