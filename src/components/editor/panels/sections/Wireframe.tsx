import type { VariantPreview } from "@/lib/section-variants";

const FILL = "var(--dw-text-muted)";
const SOFT = "var(--dw-border-strong)";

export const Wireframe = ({ kind }: { kind: VariantPreview }) => (
  <div
    className="aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] p-2.5"
    role="img"
    aria-label={kind}
  >
    <svg viewBox="0 0 160 100" className="h-full w-full">
      <Frame kind={kind} />
    </svg>
  </div>
);

const Frame = ({ kind }: { kind: VariantPreview }) => {
  switch (kind) {
    case "split-img-r":
      return (
        <>
          <Bar x={6} y={20} w={50} h={6} />
          <Bar x={6} y={32} w={70} h={4} soft />
          <Bar x={6} y={42} w={60} h={4} soft />
          <Btn x={6} y={56} w={28} h={8} />
          <Box x={92} y={20} w={62} h={60} />
        </>
      );
    case "stack-center":
      return (
        <>
          <Bar x={40} y={14} w={80} h={6} />
          <Bar x={50} y={26} w={60} h={4} soft />
          <Btn x={66} y={38} w={28} h={8} />
          <Box x={20} y={52} w={120} h={40} />
        </>
      );
    case "fullbleed":
      return (
        <>
          <Box x={0} y={0} w={160} h={100} />
          <Bar x={6} y={6} w={20} h={4} solid />
          <Bar x={130} y={6} w={24} h={4} solid />
          <Bar x={10} y={68} w={70} h={6} solid />
          <Bar x={10} y={80} w={50} h={4} solid />
        </>
      );
    case "minimal-grid":
      return (
        <>
          <Bar x={6} y={14} w={70} h={8} />
          <Bar x={94} y={36} w={60} h={4} soft />
          <Btn x={94} y={50} w={28} h={6} />
          <Box x={6} y={70} w={148} h={24} />
        </>
      );
    case "magazine-cover":
      return (
        <>
          <Bar x={6} y={6} w={20} h={3} soft />
          <Bar x={134} y={6} w={20} h={3} soft />
          <Box x={6} y={14} w={148} h={48} />
          <Bar x={6} y={68} w={86} h={9} />
          <Bar x={104} y={68} w={50} h={3} soft />
          <Bar x={104} y={76} w={40} h={3} soft />
        </>
      );
    case "tier-grid":
      return (
        <>
          <Bar x={6} y={8} w={50} h={5} />
          <Box x={6} y={22} w={34} h={70} />
          <Box x={44} y={22} w={34} h={70} />
          <Box x={82} y={22} w={34} h={70} solid />
          <Box x={120} y={22} w={34} h={70} />
        </>
      );
    case "radio-list":
      return (
        <>
          <Bar x={48} y={8} w={64} h={5} />
          <Row y={22} />
          <Row y={38} solid />
          <Row y={54} />
          <Btn x={20} y={76} w={120} h={10} />
        </>
      );
    case "feature-card":
      return (
        <>
          <Bar x={6} y={6} w={50} h={5} />
          <Box x={6} y={18} w={92} h={74} solid />
          <Box x={104} y={18} w={50} h={22} />
          <Box x={104} y={44} w={50} h={22} />
          <Box x={104} y={70} w={50} h={22} />
        </>
      );
    case "single-col":
      return (
        <>
          <Bar x={6} y={8} w={70} h={5} />
          <Row y={22} />
          <Row y={38} />
          <Row y={54} />
          <Row y={70} />
        </>
      );
    case "two-col-text":
      return (
        <>
          <Bar x={6} y={10} w={50} h={6} />
          <Bar x={6} y={22} w={40} h={4} soft />
          <Bar x={70} y={10} w={36} h={4} soft />
          <Bar x={70} y={20} w={32} h={3} soft />
          <Bar x={70} y={28} w={36} h={4} soft />
          <Bar x={70} y={38} w={32} h={3} soft />
          <Bar x={114} y={10} w={36} h={4} soft />
          <Bar x={114} y={20} w={32} h={3} soft />
          <Bar x={114} y={28} w={36} h={4} soft />
        </>
      );
    case "card-grid":
      return (
        <>
          <Bar x={6} y={8} w={40} h={5} />
          <Box x={6} y={20} w={70} h={32} />
          <Box x={84} y={20} w={70} h={32} />
          <Box x={6} y={56} w={70} h={32} />
          <Box x={84} y={56} w={70} h={32} />
        </>
      );
    case "grid-3":
      return (
        <>
          <Bar x={6} y={8} w={50} h={5} />
          <Box x={6} y={22} w={48} h={66} />
          <Box x={56} y={22} w={48} h={66} />
          <Box x={106} y={22} w={48} h={66} />
        </>
      );
    case "horizontal-strip":
      return (
        <>
          <Bar x={50} y={8} w={60} h={5} />
          <Box x={6} y={24} w={42} h={68} />
          <Box x={50} y={24} w={42} h={68} />
          <Box x={94} y={24} w={42} h={68} />
          <Box x={138} y={24} w={42} h={68} />
        </>
      );
    case "feature-quote":
      return (
        <>
          <Bar x={6} y={8} w={36} h={4} soft />
          <Bar x={6} y={20} w={86} h={6} />
          <Bar x={6} y={32} w={70} h={6} />
          <Bar x={6} y={44} w={50} h={6} />
          <Box x={6} y={60} w={20} h={20} />
          <Box x={108} y={20} w={46} h={22} />
          <Box x={108} y={46} w={46} h={22} />
          <Box x={108} y={72} w={46} h={20} />
        </>
      );
    case "icon-grid":
      return (
        <>
          <Bar x={50} y={8} w={60} h={5} />
          <Circle cx={30} cy={42} r={6} />
          <Bar x={14} y={56} w={32} h={4} />
          <Bar x={18} y={64} w={24} h={3} soft />
          <Circle cx={80} cy={42} r={6} />
          <Bar x={64} y={56} w={32} h={4} />
          <Bar x={68} y={64} w={24} h={3} soft />
          <Circle cx={130} cy={42} r={6} />
          <Bar x={114} y={56} w={32} h={4} />
          <Bar x={118} y={64} w={24} h={3} soft />
        </>
      );
    case "alt-rows":
      return (
        <>
          <Bar x={6} y={8} w={50} h={5} />
          <Circle cx={20} cy={30} r={6} />
          <Bar x={36} y={26} w={60} h={4} />
          <Bar x={36} y={34} w={50} h={3} soft />
          <Circle cx={140} cy={50} r={6} />
          <Bar x={64} y={46} w={70} h={4} />
          <Bar x={64} y={54} w={60} h={3} soft />
          <Circle cx={20} cy={72} r={6} />
          <Bar x={36} y={68} w={60} h={4} />
          <Bar x={36} y={76} w={50} h={3} soft />
        </>
      );
    case "list-with-header":
      return (
        <>
          <Bar x={6} y={14} w={36} h={6} />
          <Bar x={6} y={28} w={28} h={4} soft />
          <Bar x={6} y={36} w={26} h={4} soft />
          <Row y={20} x={64} w={92} />
          <Row y={40} x={64} w={92} />
          <Row y={60} x={64} w={92} />
          <Row y={80} x={64} w={92} />
        </>
      );
    case "single-product":
    case "product-with-images":
      return (
        <>
          <Box x={6} y={10} w={60} h={80} />
          <Bar x={6} y={92} w={12} h={6} />
          <Bar x={22} y={92} w={12} h={6} />
          <Bar x={38} y={92} w={12} h={6} />
          <Bar x={76} y={14} w={70} h={6} />
          <Bar x={76} y={26} w={50} h={4} soft />
          <Bar x={76} y={36} w={36} h={5} />
          <Btn x={76} y={50} w={64} h={9} />
        </>
      );
    case "trust-row":
      return (
        <>
          <Bar x={36} y={20} w={88} h={4} soft />
          <Pill x={6} y={42} w={28} h={14} />
          <Pill x={42} y={42} w={28} h={14} />
          <Pill x={78} y={42} w={28} h={14} />
          <Pill x={114} y={42} w={28} h={14} />
        </>
      );
    case "footer-min":
      return (
        <>
          <Bar x={6} y={20} w={36} h={6} />
          <Bar x={50} y={22} w={20} h={3} soft />
          <Bar x={76} y={22} w={20} h={3} soft />
          <Bar x={102} y={22} w={20} h={3} soft />
          <Bar x={6} y={70} w={148} h={2} soft />
          <Bar x={6} y={80} w={50} h={3} soft />
        </>
      );
    case "video-block":
      return (
        <>
          <Box x={10} y={14} w={140} h={72} />
          <Circle cx={80} cy={50} r={9} solid />
        </>
      );
    case "countdown-block":
      return (
        <>
          <Bar x={50} y={12} w={60} h={5} />
          <Box x={20} y={28} w={28} h={42} />
          <Box x={56} y={28} w={28} h={42} />
          <Box x={92} y={28} w={28} h={42} />
          <Box x={128} y={28} w={20} h={42} />
        </>
      );
    case "comparison-table":
      return (
        <>
          <Bar x={6} y={6} w={36} h={5} />
          <Bar x={70} y={6} w={26} h={4} soft />
          <Bar x={114} y={6} w={32} h={4} solid />
          <Row y={20} />
          <Row y={36} />
          <Row y={52} />
          <Row y={68} />
          <Row y={84} />
        </>
      );
    case "gallery-masonry":
      return (
        <>
          <Box x={6} y={8} w={48} h={48} />
          <Box x={56} y={8} w={48} h={32} />
          <Box x={106} y={8} w={48} h={48} />
          <Box x={6} y={58} w={48} h={36} />
          <Box x={56} y={42} w={48} h={52} />
          <Box x={106} y={58} w={48} h={36} />
        </>
      );
    case "lifestyle-split":
      return (
        <>
          <Box x={6} y={8} w={70} h={84} />
          <Bar x={84} y={26} w={64} h={6} />
          <Bar x={84} y={40} w={56} h={4} soft />
          <Bar x={84} y={50} w={60} h={4} soft />
          <Bar x={84} y={60} w={50} h={4} soft />
          <Btn x={84} y={74} w={32} h={8} />
        </>
      );
    case "announcement-bar":
      return (
        <>
          <rect x={0} y={0} width={160} height={18} fill="var(--dw-accent)" opacity={0.6} />
          <Bar x={20} y={6} w={24} h={6} solid />
          <Bar x={52} y={6} w={28} h={6} solid />
          <Bar x={88} y={6} w={32} h={6} solid />
          <Bar x={128} y={6} w={24} h={6} solid />
        </>
      );
    case "announcement-marquee":
      return (
        <>
          <rect x={0} y={0} width={160} height={18} fill="var(--dw-accent)" opacity={0.6} />
          <Bar x={-10} y={6} w={20} h={6} solid />
          <Bar x={18} y={6} w={24} h={6} solid />
          <Bar x={50} y={6} w={28} h={6} solid />
          <Bar x={86} y={6} w={32} h={6} solid />
          <Bar x={126} y={6} w={24} h={6} solid />
          <Bar x={158} y={6} w={20} h={6} solid />
        </>
      );
    case "how-it-works-cards":
      return (
        <>
          <Bar x={50} y={8} w={60} h={5} />
          <Box x={6} y={22} w={46} h={70} />
          <Circle cx={29} cy={32} r={6} solid />
          <Box x={57} y={22} w={46} h={70} />
          <Circle cx={80} cy={32} r={6} solid />
          <Box x={108} y={22} w={46} h={70} />
          <Circle cx={131} cy={32} r={6} solid />
        </>
      );
    case "how-it-works-timeline":
      return (
        <>
          <Bar x={50} y={8} w={60} h={5} />
          <Circle cx={20} cy={30} r={5} solid />
          <Bar x={20} y={35} w={2} h={25} soft />
          <Bar x={32} y={26} w={50} h={4} />
          <Bar x={32} y={34} w={40} h={3} soft />
          <Circle cx={20} cy={65} r={5} solid />
          <Bar x={20} y={70} w={2} h={25} soft />
          <Bar x={32} y={61} w={50} h={4} />
          <Bar x={32} y={69} w={40} h={3} soft />
        </>
      );
    case "header-simple":
      return (
        <>
          <rect x={0} y={0} width={160} height={20} fill={SOFT} opacity={0.25} />
          <Bar x={6} y={7} w={30} h={6} />
          <Circle cx={148} cy={10} r={5} />
        </>
      );
    default:
      return null;
  }
};

const Bar = ({
  x,
  y,
  w,
  h,
  soft,
  solid,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  soft?: boolean;
  solid?: boolean;
}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={Math.min(2, h / 2)}
    fill={solid ? "var(--dw-accent)" : soft ? SOFT : FILL}
    opacity={solid ? 0.8 : soft ? 0.45 : 0.7}
  />
);

const Box = ({
  x,
  y,
  w,
  h,
  solid,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  solid?: boolean;
}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={3}
    fill={solid ? "var(--dw-accent)" : SOFT}
    opacity={solid ? 0.45 : 0.55}
  />
);

const Btn = ({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={3}
    fill="var(--dw-accent)"
    opacity={0.8}
  />
);

const Circle = ({
  cx,
  cy,
  r,
  solid,
}: {
  cx: number;
  cy: number;
  r: number;
  solid?: boolean;
}) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill={solid ? "var(--dw-accent)" : SOFT}
    opacity={solid ? 0.85 : 0.5}
  />
);

const Pill = ({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={h / 2}
    fill={SOFT}
    opacity={0.5}
  />
);

const Row = ({
  x = 6,
  y,
  w = 148,
  solid,
}: {
  x?: number;
  y: number;
  w?: number;
  solid?: boolean;
}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={10}
    rx={3}
    fill={solid ? "var(--dw-accent)" : SOFT}
    opacity={solid ? 0.5 : 0.4}
  />
);
