type Option<T extends string> = { id: T; label: string; desc?: string };

type Props<T extends string> = {
  label?: string;
  value: T;
  options: Array<Option<T>>;
  onChange: (next: T) => void;
};

export const VariantPicker = <T extends string>({
  label = "Layout",
  value,
  options,
  onChange,
}: Props<T>) => (
  <div className="space-y-1.5">
    <div className="text-[11px] text-[color:var(--dw-text-dim)]">{label}</div>
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, 1fr)`,
      }}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            title={opt.desc}
            className={`rounded-[8px] border p-2 text-[11px] font-medium transition ${
              active
                ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                : "border-[color:var(--dw-border)] text-[color:var(--dw-text-muted)] hover:border-[color:var(--dw-accent)]/40"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);
