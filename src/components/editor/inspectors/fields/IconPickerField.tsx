import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import * as Icons from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STORE_ICONS = [
  "Truck01Icon",
  "DeliveryTruck01Icon",
  "DeliveryBox01Icon",
  "PackageIcon",
  "ShoppingBag01Icon",
  "ShoppingCart01Icon",
  "ShoppingBasket01Icon",
  "CreditCardIcon",
  "SecurityCheckIcon",
  "ShieldCheckIcon",
  "ShieldUserIcon",
  "Lock01Icon",
  "LockIcon",
  "CheckmarkCircle01Icon",
  "CheckmarkSquare01Icon",
  "CheckmarkBadge01Icon",
  "StarIcon",
  "FavouriteIcon",
  "HeartCheckIcon",
  "ThumbsUpIcon",
  "AwardIcon",
  "Award01Icon",
  "Award02Icon",
  "Medal01Icon",
  "TrophyIcon",
  "DiamondIcon",
  "Crown01Icon",
  "SparklesIcon",
  "FlashIcon",
  "Zap01Icon",
  "ZapIcon",
  "BoltIcon",
  "RocketIcon",
  "Rocket01Icon",
  "Target01Icon",
  "Target02Icon",
  "FlagIcon",
  "Flag01Icon",
  "TimeQuarter01Icon",
  "Time01Icon",
  "Clock01Icon",
  "Calendar01Icon",
  "CalendarCheckIn01Icon",
  "RefreshIcon",
  "Recycle01Icon",
  "LeafIcon",
  "Leaf01Icon",
  "PlantIcon",
  "SunIcon",
  "Sun01Icon",
  "MoonIcon",
  "Moon01Icon",
  "WaterDropIcon",
  "Fire01Icon",
  "FireIcon",
  "Idea01Icon",
  "IdeaIcon",
  "LightBulb01Icon",
  "LightBulb02Icon",
  "Gift01Icon",
  "GiftIcon",
  "PresentationIcon",
  "Presentation01Icon",
  "ChartIcon",
  "Analytics01Icon",
  "Growth01Icon",
  "TrendUp01Icon",
  "MoneyBag01Icon",
  "Dollar01Icon",
  "Wallet01Icon",
  "CoinIcon",
  "UserIcon",
  "User01Icon",
  "UserCircleIcon",
  "UserCheck01Icon",
  "UsersIcon",
  "Users01Icon",
  "CustomerServiceIcon",
  "Headphones01Icon",
  "PhoneCall01Icon",
  "MessageIcon",
  "Message01Icon",
  "MailIcon",
  "Mail01Icon",
  "InboxIcon",
  "SendIcon",
  "Send01Icon",
  "LocationIcon",
  "Location01Icon",
  "PinLocation01Icon",
  "GlobeIcon",
  "Globe01Icon",
  "Home01Icon",
  "HomeIcon",
  "Building01Icon",
  "Store01Icon",
  "StoreIcon",
  "Settings01Icon",
  "SettingsIcon",
  "ToolIcon",
  "Wrench01Icon",
  "HammerIcon",
  "RepairIcon",
  "Medical01Icon",
  "HeartbeatIcon",
  "HealthIcon",
  "FitnessIcon",
  "Dumbbell01Icon",
  "Yoga01Icon",
  "Apple01Icon",
  "AppleIcon",
  "CoffeeIcon",
  "Coffee01Icon",
  "CameraIcon",
  "Camera01Icon",
  "ImageIcon",
  "Image01Icon",
  "VideoIcon",
  "Video01Icon",
  "MusicIcon",
  "Music01Icon",
  "BookIcon",
  "Book01Icon",
  "DocumentIcon",
  "Document01Icon",
  "FileIcon",
  "File01Icon",
  "FolderIcon",
  "Folder01Icon",
  "CloudIcon",
  "Cloud01Icon",
  "DownloadIcon",
  "Download01Icon",
  "UploadIcon",
  "Upload01Icon",
  "LinkIcon",
  "Link01Icon",
  "AttachmentIcon",
  "Attachment01Icon",
  "EditIcon",
  "Edit01Icon",
  "DeleteIcon",
  "Delete01Icon",
  "AddIcon",
  "Add01Icon",
  "RemoveIcon",
  "Remove01Icon",
  "SearchIcon",
  "Search01Icon",
  "FilterIcon",
  "Filter01Icon",
  "SortIcon",
  "Sort01Icon",
  "MenuIcon",
  "Menu01Icon",
  "GridIcon",
  "Grid01Icon",
  "ListIcon",
  "List01Icon",
  "EyeIcon",
  "Eye01Icon",
  "ViewIcon",
  "View01Icon",
  "HideIcon",
  "Hide01Icon",
  "InfoIcon",
  "Info01Icon",
  "HelpIcon",
  "Help01Icon",
  "QuestionIcon",
  "WarningIcon",
  "AlertIcon",
  "ErrorIcon",
  "SuccessIcon",
  "CloseIcon",
  "Close01Icon",
  "ArrowRightIcon",
  "ArrowLeftIcon",
  "ArrowUpIcon",
  "ArrowDownIcon",
  "ChevronRightIcon",
  "ChevronLeftIcon",
  "ChevronUpIcon",
  "ChevronDownIcon",
  "PlayIcon",
  "Play01Icon",
  "PauseIcon",
  "StopIcon",
  "SkipIcon",
  "RestartIcon",
  "PowerIcon",
  "Power01Icon",
  "BatteryIcon",
  "Battery01Icon",
  "WifiIcon",
  "Wifi01Icon",
  "BluetoothIcon",
  "PrinterIcon",
  "Printer01Icon",
  "ScanIcon",
  "Scan01Icon",
  "QrCodeIcon",
  "BarcodeIcon",
] as const;

type IconName = (typeof STORE_ICONS)[number];

type IconType = Parameters<typeof HugeiconsIcon>[0]["icon"];

const getIcon = (name: string): IconType | null => {
  const icon = (Icons as Record<string, IconType>)[name];
  return icon ?? null;
};

type Props = {
  label: string;
  value?: string;
  onCommit: (iconName: string) => void;
};

export const IconPickerField = ({ label, value, onCommit }: Props) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    if (!search) return STORE_ICONS.slice(0, 48);
    const q = search.toLowerCase();
    return STORE_ICONS.filter((name) =>
      name.toLowerCase().replace("icon", "").includes(q)
    ).slice(0, 48);
  }, [search]);

  const currentIcon = value ? getIcon(value) : null;

  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-[color:var(--dw-text-dim)]">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex h-9 w-full items-center gap-2 rounded-md border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-3 text-left text-[12px] transition hover:border-[color:var(--dw-accent)]/40"
          >
            {currentIcon ? (
              <HugeiconsIcon
                icon={currentIcon}
                size={16}
                className="text-[color:var(--dw-text)]"
              />
            ) : (
              <span className="text-[color:var(--dw-text-muted)]">Select icon...</span>
            )}
            {value && (
              <span className="flex-1 truncate text-[color:var(--dw-text-dim)]">
                {value.replace("Icon", "")}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] p-2"
          align="start"
          side="bottom"
        >
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 h-8 text-[12px]"
          />
          <div className="grid max-h-[240px] grid-cols-6 gap-1 overflow-y-auto">
            {filteredIcons.map((name) => {
              const icon = getIcon(name);
              if (!icon) return null;
              return (
                <button
                  key={name}
                  onClick={() => {
                    onCommit(name);
                    setOpen(false);
                    setSearch("");
                  }}
                  title={name.replace("Icon", "")}
                  className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                    value === name
                      ? "bg-[color:var(--dw-accent)] text-white"
                      : "hover:bg-[color:var(--dw-surface2)]"
                  }`}
                >
                  <HugeiconsIcon icon={icon} size={18} />
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <div className="py-4 text-center text-[11px] text-[color:var(--dw-text-muted)]">
              No icons found
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const StoreIcon = ({
  name,
  size = 20,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) => {
  if (!name) return null;
  const icon = getIcon(name);
  if (!icon) return null;
  return <HugeiconsIcon icon={icon} size={size} className={className} />;
};
