export const CheckboxField = ({
  label,
  defaultChecked,
  onCommit,
}: {
  label: string;
  defaultChecked: boolean;
  onCommit: (value: boolean) => void;
}) => (
  <label className="flex items-center gap-2 text-[12px]">
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      onChange={(e) => onCommit(e.target.checked)}
    />
    {label}
  </label>
);
