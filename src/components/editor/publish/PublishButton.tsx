import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RocketIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PublishModal } from "./PublishModal";

export const PublishButton = ({ storeId }: { storeId: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" className="h-8 gap-1.5" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={RocketIcon} size={13} />
        Publish
      </Button>
      {open && <PublishModal storeId={storeId} onClose={() => setOpen(false)} />}
    </>
  );
};
