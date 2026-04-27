import type { ReactNode } from "react";

export const Panel = ({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) => (
  <div>
    <div className="mb-4">
      <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        {title}
      </div>
      {eyebrow && (
        <div className="mt-1 text-[11.5px] text-[color:var(--dw-text-dim)]">
          {eyebrow}
        </div>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);
