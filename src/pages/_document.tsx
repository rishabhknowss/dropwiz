import { Html, Head, Main, NextScript } from "next/document";

const GOOGLE_FONT_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Fraunces:wght@400;500;600;700",
    "family=Lora:wght@400;500;600;700",
    "family=Manrope:wght@400;500;600;700;800",
    "family=DM+Sans:wght@400;500;600;700",
    "family=DM+Mono:wght@400;500",
    "family=Space+Grotesk:wght@400;500;600;700",
    "family=Space+Mono:wght@400;700",
    "family=Instrument+Serif:wght@400;500",
    "family=Instrument+Sans:wght@400;500;600;700",
    "family=Playfair+Display:wght@400;500;600;700;800",
    "family=Inter:wght@400;500;600;700",
    "family=Archivo:wght@400;500;600;700",
    "family=Archivo+Black",
    "family=JetBrains+Mono:wght@400;500;600",
  ].join("&") +
  "&display=swap";

const Document = () => {
  return (
    <Html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONT_HREF} />
      </Head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dw-theme');var d=t==='light'?false:true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
