import { Html, Head, Main, NextScript } from "next/document";

const GOOGLE_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

const Document = () => {
  return (
    <Html lang="en" className="" style={{ colorScheme: "light" }}>
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="ahrefs-site-verification" content="2ecbda243ed657087d76a9bc99a69efe6f4b8e9804bc1861e71d3b7aade46627" />
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
            __html: `(function(){try{var t=localStorage.getItem('dw-theme');var d=t==='dark';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
        <Main />
        <NextScript />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="N0RGzBza79q0EW9OssxytA"
          async
        />
      </body>
    </Html>
  );
};

export default Document;
