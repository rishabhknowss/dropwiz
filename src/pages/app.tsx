import { useEffect } from "react";
import { useRouter } from "next/router";

const AppRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/stores");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)]">
      <div className="dw-mono text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        Redirecting…
      </div>
    </div>
  );
};

export default AppRedirect;
