import { useState } from "react";
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

const DemoStoresPage = () => {
  const [selected, setSelected] = useState(0);
  const store = DEMO_STORES[selected];

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Demo Store Previews</h1>
        <div className="mb-8 flex flex-wrap gap-2">
          {DEMO_STORES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(i)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                selected === i
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div
          id={`store-preview-${store.id}`}
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: store.theme.bg }}
        >
          <StorePreview store={store} />
        </div>
      </div>
    </div>
  );
};

const StorePreview = ({ store }: { store: (typeof DEMO_STORES)[0] }) => {
  const { theme } = store;

  return (
    <div style={{ color: theme.text, fontFamily: "system-ui, sans-serif" }}>
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

      <section className="px-16 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold">Why Choose {store.name}</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "Fast Results", desc: "See the difference in just 14 days of consistent use." },
            { icon: "🌿", title: "Natural Ingredients", desc: "100% organic, no artificial additives or fillers." },
            { icon: "🔬", title: "Science-Backed", desc: "Formulated by experts with clinical research." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-8"
              style={{ backgroundColor: `${theme.text}05` }}
            >
              <div
                className="mb-4 flex size-14 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-16 py-20" style={{ backgroundColor: `${theme.text}05` }}>
        <h2 className="mb-12 text-center text-4xl font-bold">What Customers Say</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { name: "Sarah M.", text: "Life-changing! I've never felt better.", rating: 5 },
            { name: "James K.", text: "The quality is unmatched. Worth every penny.", rating: 5 },
            { name: "Emily R.", text: "Finally found something that actually works!", rating: 5 },
          ].map((review, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{ backgroundColor: theme.bg }}
            >
              <div className="mb-3 text-lg">{"⭐".repeat(review.rating)}</div>
              <p className="mb-4 text-lg">&ldquo;{review.text}&rdquo;</p>
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm opacity-60">Verified Buyer</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-16 py-24 text-center">
        <h2 className="mb-6 text-5xl font-bold">Ready to Transform?</h2>
        <p className="mx-auto mb-10 max-w-xl text-xl opacity-70">
          Join thousands who have made the switch. 30-day money-back guarantee.
        </p>
        <button
          className="rounded-2xl px-12 py-5 text-xl font-semibold transition hover:scale-105"
          style={{ backgroundColor: theme.accent, color: theme.bg }}
        >
          Get {store.name} — {store.price}
        </button>
      </section>

      <footer className="border-t px-16 py-8" style={{ borderColor: `${theme.text}10` }}>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{store.name}</div>
          <div className="text-sm opacity-60">© 2026 {store.name}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default DemoStoresPage;
