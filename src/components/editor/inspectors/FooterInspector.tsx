import type { StoreSection } from "@/db/schema";
import type { FooterData } from "@/types/store-sections";
import { TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const FooterInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as FooterData;
  return (
    <TextField
      label="Store name"
      defaultValue={data.storeName}
      onCommit={(v) => onCommit({ storeName: v })}
    />
  );
};
