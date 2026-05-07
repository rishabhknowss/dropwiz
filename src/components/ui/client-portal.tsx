import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  targetId?: string;
};

export const ClientPortal = ({ children, targetId = "dw-app-root" }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById(targetId) ?? document.body;
  return createPortal(children, target);
};
