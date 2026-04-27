import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  speed: 350,
  minimum: 0.12,
  trickleSpeed: 140,
});

export const NProgressBar = () => {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      timer = setTimeout(() => NProgress.start(), 120);
    };
    const done = () => {
      if (timer) clearTimeout(timer);
      NProgress.done();
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
      if (timer) clearTimeout(timer);
    };
  }, [router.events]);

  return null;
};
