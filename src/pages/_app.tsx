import "@/styles/globals.css";
import "nprogress/nprogress.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { api } from "@/utils/api";
import { ThemeProvider } from "@/lib/theme-context";
import { ShopProvider } from "@/lib/shop-context";
import { NProgressBar } from "@/lib/nprogress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <ShopProvider>
        <div className={`${inter.variable} ${mono.variable}`}>
          <style jsx global>{`
            html, body, button, input, select, textarea {
              font-family: ${inter.style.fontFamily}, ui-sans-serif, system-ui, -apple-system, sans-serif;
            }
            code, pre, .dw-mono {
              font-family: ${mono.style.fontFamily}, ui-monospace, monospace;
            }
          `}</style>
          <NProgressBar />
          <Component {...pageProps} />
          <Toaster
            theme="system"
            richColors
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: `${inter.style.fontFamily}, system-ui, sans-serif`,
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
