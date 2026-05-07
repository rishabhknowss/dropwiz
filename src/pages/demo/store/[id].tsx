import { useRouter } from "next/router";
import Image from "next/image";

const DEMO_STORES = [
  {
    id: 1,
    name: "Nimbus Posture",
    tagline: "Stand tall. Feel unstoppable.",
    category: "Health & Wellness",
    theme: { bg: "#0a0a0a", text: "#fafafa", accent: "#c7ff3d" },
    price: "$49",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  },
  {
    id: 2,
    name: "GlowSkin Co",
    tagline: "Radiance starts from within",
    category: "Beauty",
    theme: { bg: "#fdf2f8", text: "#831843", accent: "#ec4899" },
    price: "$79",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
  },
  {
    id: 3,
    name: "Peak Focus",
    tagline: "Unlock your cognitive potential",
    category: "Supplements",
    theme: { bg: "#020617", text: "#f8fafc", accent: "#3b82f6" },
    price: "$39",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
  },
  {
    id: 4,
    name: "Terra Roots",
    tagline: "Nature's power, bottled",
    category: "Organic",
    theme: { bg: "#ecfdf5", text: "#065f46", accent: "#10b981" },
    price: "$34",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
  },
  {
    id: 5,
    name: "Volt Energy",
    tagline: "Fuel your grind",
    category: "Energy",
    theme: { bg: "#18181b", text: "#fafafa", accent: "#f59e0b" },
    price: "$29",
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800",
  },
  {
    id: 6,
    name: "SereneNight",
    tagline: "Deep sleep. Every night.",
    category: "Sleep",
    theme: { bg: "#1e1b4b", text: "#e0e7ff", accent: "#a78bfa" },
    price: "$44",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
  },
  {
    id: 7,
    name: "AquaPure",
    tagline: "Hydration elevated",
    category: "Hydration",
    theme: { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0ea5e9" },
    price: "$24",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
  },
  {
    id: 8,
    name: "IronCore",
    tagline: "Strength from within",
    category: "Fitness",
    theme: { bg: "#0a0a0a", text: "#fafafa", accent: "#ef4444" },
    price: "$59",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
  },
  {
    id: 9,
    name: "ZenMind",
    tagline: "Clarity in chaos",
    category: "Mindfulness",
    theme: { bg: "#fafaf9", text: "#1c1917", accent: "#78716c" },
    price: "$32",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
  },
  {
    id: 10,
    name: "VitaBoost",
    tagline: "Your daily essential",
    category: "Vitamins",
    theme: { bg: "#fffbeb", text: "#78350f", accent: "#f59e0b" },
    price: "$27",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
  },
  {
    id: 11,
    name: "FlexJoint",
    tagline: "Move without limits",
    category: "Joint Health",
    theme: { bg: "#f0fdf4", text: "#166534", accent: "#22c55e" },
    price: "$42",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
  },
  {
    id: 12,
    name: "LuxeCollagen",
    tagline: "Timeless beauty starts here",
    category: "Anti-Aging",
    theme: { bg: "#0f0f0f", text: "#fafafa", accent: "#d4af37" },
    price: "$89",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
  },
];

const StorePage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const store = DEMO_STORES.find((s) => s.id === id);

  if (!store) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Store not found</div>;
  }

  const { theme } = store;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", minHeight: "100vh" }}>
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-xl font-bold">{store.name}</div>
        <div className="flex items-center gap-6">
          <span className="text-sm opacity-70">Shop</span>
          <span className="text-sm opacity-70">About</span>
          <span className="text-sm opacity-70">FAQ</span>
          <button
            className="rounded-full px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            Shop Now
          </button>
        </div>
      </nav>

      <section className="grid min-h-[600px] grid-cols-2 items-center gap-12 px-16 py-20">
        <div className="space-y-6">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
          >
            {store.category}
          </div>
          <h1 className="text-6xl font-bold leading-tight">{store.tagline}</h1>
          <p className="text-lg opacity-70" style={{ maxWidth: 480 }}>
            Join thousands who have already transformed their lives with {store.name}.
            Science-backed, results-proven.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button
              className="rounded-xl px-8 py-4 text-lg font-semibold transition hover:scale-105"
              style={{ backgroundColor: theme.accent, color: theme.bg }}
            >
              Get Started — {store.price}
            </button>
            <button
              className="rounded-xl border-2 px-8 py-4 text-lg font-semibold"
              style={{ borderColor: `${theme.text}30` }}
            >
              Learn More
            </button>
          </div>
          <div className="flex items-center gap-6 pt-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 text-xs first:ml-0"
                  style={{ borderColor: theme.bg, backgroundColor: `${theme.accent}30` }}
                >
                  {["😊", "🙌", "💪", "✨", "🔥"][i - 1]}
                </div>
              ))}
            </div>
            <span className="text-sm opacity-70">
              <strong>4,823</strong> happy customers
            </span>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl"
            style={{ backgroundColor: theme.accent }}
          />
          <div className="relative z-10 aspect-square w-full overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={store.image}
              alt={store.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="px-16 py-16">
        <div
          className="grid grid-cols-4 gap-6 rounded-2xl p-8"
          style={{ backgroundColor: `${theme.text}08` }}
        >
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "🔄", title: "30-Day Returns", desc: "No questions asked" },
            { icon: "🛡️", title: "Secure Checkout", desc: "256-bit encryption" },
            { icon: "💬", title: "24/7 Support", desc: "Always here for you" },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mb-3 text-3xl">{item.icon}</div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm opacity-60">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StorePage;
