import type { StoreSection } from "@/db/schema";
import type { VideoData } from "@/types/store-sections";
import { TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const VideoInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as VideoData;

  return (
    <div className="space-y-3">
      <TextField
        label="Video URL"
        defaultValue={data.videoUrl ?? ""}
        placeholder="https://youtube.com/watch?v=..."
        onCommit={(v) => onCommit({ videoUrl: v })}
      />
      <div className="text-[10px] text-[color:var(--dw-text-dim)]">
        Supports YouTube, Vimeo, Loom, or direct video URLs
      </div>
      <TextField
        label="Caption (optional)"
        defaultValue={data.caption ?? ""}
        placeholder="Video description..."
        multiline
        onCommit={(v) => onCommit({ caption: v })}
      />
    </div>
  );
};
