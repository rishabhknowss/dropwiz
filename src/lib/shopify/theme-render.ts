import type { Store, StoreSection, ThemeTokens } from "@/db/schema";
import type {
  HeroData,
  ProductData,
  BundleData,
  TrustData,
  FaqData,
  FooterData,
  LifestyleData,
  GalleryData,
  TestimonialsData,
  ValuePropsData,
} from "@/types/store-sections";

export function renderStoreToHtml(store: Store): { body: string; css: string } {
  const sections = [...store.sections].sort((a, b) => a.order - b.order);
  const body = sections.map((s) => renderSection(s)).join("\n");
  const css = renderCss(store.themeTokens as ThemeTokens);
  return { body, css };
}

function renderSection(section: StoreSection): string {
  switch (section.type) {
    case "hero":
      return renderHero(section.data as HeroData);
    case "product":
      return renderProduct(section.data as ProductData);
    case "bundles":
      return renderBundles(section.data as BundleData);
    case "trust":
      return renderTrust(section.data as TrustData);
    case "faq":
      return renderFaq(section.data as FaqData);
    case "footer":
      return renderFooter(section.data as FooterData);
    case "lifestyle":
      return renderLifestyle(section.data as LifestyleData);
    case "gallery":
      return renderGallery(section.data as GalleryData);
    case "testimonials":
      return renderTestimonials(section.data as TestimonialsData);
    case "valueProps":
      return renderValueProps(section.data as ValuePropsData);
    default:
      return "";
  }
}

const fmtPrice = (cents: number, currency: string): string => {
  const v = (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${v}`;
};

const renderHero = (d: HeroData): string => {
  const variant = d.variant ?? "split";
  const headline = esc(d.headline ?? "");
  const sub = esc(d.subheadline ?? "");
  const cta = esc(d.primaryCta ?? "Shop now");
  const cta2 = d.secondaryCta ? esc(d.secondaryCta) : "";
  const badge = d.urgencyBadge ? esc(d.urgencyBadge) : "";
  const social = d.socialProof ? esc(d.socialProof) : "";
  const img = d.imageUrl ?? "";

  if (variant === "centered") {
    return `<section class="dw-hero dw-hero-centered">
      <div class="dw-container dw-text-center">
        ${badge ? `<span class="dw-badge">${badge}</span>` : ""}
        <h1 class="dw-h1">${headline}</h1>
        <p class="dw-sub">${sub}</p>
        <div class="dw-cta-row dw-justify-center">
          <button class="dw-btn-primary">${cta}</button>
          ${cta2 ? `<button class="dw-btn-outline">${cta2}</button>` : ""}
        </div>
        ${social ? `<div class="dw-social">${social}</div>` : ""}
        ${img ? `<div class="dw-hero-img-video"><img src="${img}" alt="" /></div>` : ""}
      </div>
    </section>`;
  }
  if (variant === "full-bleed") {
    const overlay = d.overlayDarkness ?? 0.45;
    return `<section class="dw-hero-fullbleed">
      ${img ? `<img class="dw-hero-bg" src="${img}" alt="" />` : `<div class="dw-hero-bg dw-gradient"></div>`}
      <div class="dw-hero-overlay" style="background:linear-gradient(to bottom, rgba(0,0,0,${overlay * 0.6}) 0%, rgba(0,0,0,${overlay}) 60%, rgba(0,0,0,${overlay * 1.2}) 100%)"></div>
      <div class="dw-hero-fullbleed-inner">
        <nav class="dw-fullbleed-nav">
          <span class="dw-brand">${esc(d.brandName ?? "Brand")}</span>
          <button class="dw-btn-pill">${cta}</button>
        </nav>
        <div class="dw-fullbleed-copy">
          ${badge ? `<div class="dw-badge-glass">${badge}</div>` : ""}
          <h1 class="dw-h1 dw-on-dark">${headline}</h1>
          <p class="dw-sub dw-on-dark">${sub}</p>
          <div class="dw-cta-row">
            <button class="dw-btn-primary">${cta}</button>
            ${cta2 ? `<button class="dw-btn-outline-light">${cta2}</button>` : ""}
          </div>
        </div>
      </div>
    </section>`;
  }
  if (variant === "minimal") {
    return `<section class="dw-hero dw-hero-minimal">
      <div class="dw-container">
        ${badge ? `<div class="dw-mono-kicker">${badge}</div>` : ""}
        <div class="dw-hero-minimal-grid">
          <h1 class="dw-h1">${headline}</h1>
          <div>
            <p class="dw-sub">${sub}</p>
            <div class="dw-cta-row">
              <button class="dw-btn-primary">${cta}</button>
              ${cta2 ? `<button class="dw-btn-outline">${cta2}</button>` : ""}
            </div>
            ${social ? `<div class="dw-social">${social}</div>` : ""}
          </div>
        </div>
        ${img ? `<div class="dw-hero-img-video"><img src="${img}" alt="" /></div>` : ""}
      </div>
    </section>`;
  }
  if (variant === "magazine") {
    return `<section class="dw-hero dw-hero-magazine">
      <div class="dw-container">
        <div class="dw-mag-meta">
          <span>${badge || "Volume 01"}</span>
          <span>${esc(d.brandName ?? "Editorial")}</span>
        </div>
        ${img ? `<div class="dw-hero-img-wide"><img src="${img}" alt="" /></div>` : ""}
        <div class="dw-mag-grid">
          <h1 class="dw-h1 dw-h1-display">${headline}</h1>
          <div class="dw-mag-side">
            <p class="dw-sub">${sub}</p>
            <div class="dw-cta-row">
              <button class="dw-btn-primary">${cta}</button>
              ${cta2 ? `<button class="dw-btn-outline">${cta2}</button>` : ""}
            </div>
            ${social ? `<div class="dw-social">${social}</div>` : ""}
          </div>
        </div>
      </div>
    </section>`;
  }
  // split (default)
  return `<section class="dw-hero dw-hero-split">
    <div class="dw-container dw-grid-2">
      <div>
        ${badge ? `<span class="dw-badge">${badge}</span>` : ""}
        <h1 class="dw-h1">${headline}</h1>
        <p class="dw-sub">${sub}</p>
        <div class="dw-cta-row">
          <button class="dw-btn-primary">${cta}</button>
          ${cta2 ? `<button class="dw-btn-outline">${cta2}</button>` : ""}
        </div>
        ${social ? `<div class="dw-social">${social}</div>` : ""}
      </div>
      <div class="dw-hero-img-square">
        ${img ? `<img src="${img}" alt="" />` : `<div class="dw-gradient"></div>`}
      </div>
    </div>
  </section>`;
};

const renderProduct = (d: ProductData): string => {
  return `<section class="dw-section dw-product">
    <div class="dw-container dw-grid-2 dw-items-center">
      <div class="dw-product-img">
        ${d.imageUrl ? `<img src="${d.imageUrl}" alt="${esc(d.title)}" />` : ""}
      </div>
      <div>
        <h2 class="dw-h2">${esc(d.title)}</h2>
        <div class="dw-price">{{ product.price | money }}</div>
        {%- form 'product', product, class: 'dw-cart-form' -%}
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <button type="submit" class="dw-btn-primary dw-btn-block">
            Add to cart — {{ product.price | money }}
          </button>
        {%- endform -%}
      </div>
    </div>
  </section>`;
};

const renderBundles = (d: BundleData): string => {
  if (!d.bundles?.length) return "";
  const variant = d.variant ?? "tiers";
  const cards = d.bundles
    .map((b) => {
      const price = bundlePrice(d.basePriceCents, b.quantity, b.discountPercent);
      return `<div class="dw-bundle ${b.recommended ? "dw-bundle-rec" : ""}">
        ${b.badge ? `<span class="dw-bundle-badge">${esc(b.badge)}</span>` : ""}
        <div class="dw-bundle-name">${esc(b.name)}</div>
        <div class="dw-bundle-desc">${esc(b.description)}</div>
        <div class="dw-bundle-price">${fmtPrice(price, d.currency)}</div>
        <div class="dw-bundle-meta">${b.quantity} × — ${esc(b.savings)}</div>
        <button class="dw-btn-${b.recommended ? "primary" : "outline"} dw-btn-block">Add bundle</button>
      </div>`;
    })
    .join("");

  if (variant === "compact") {
    return `<section class="dw-section dw-bundles-compact">
      <div class="dw-container-narrow">
        <h2 class="dw-h2 dw-text-center">Pick a bundle</h2>
        <div class="dw-bundle-list">${cards}</div>
      </div>
    </section>`;
  }
  if (variant === "showcase") {
    return `<section class="dw-section">
      <div class="dw-container">
        <h2 class="dw-h2">Bundle &amp; save</h2>
        <div class="dw-bundle-showcase">${cards}</div>
      </div>
    </section>`;
  }
  return `<section class="dw-section">
    <div class="dw-container">
      <h2 class="dw-h2">Bundle &amp; save</h2>
      <p class="dw-section-sub">More items, bigger savings.</p>
      <div class="dw-bundle-grid">${cards}</div>
    </div>
  </section>`;
};

const renderFaq = (d: FaqData): string => {
  if (!d.faqs?.length) return "";
  const items = d.faqs
    .map(
      (f) => `<details class="dw-faq-item">
        <summary>${esc(f.question)}</summary>
        <div class="dw-faq-answer">${esc(f.answer)}</div>
      </details>`,
    )
    .join("");
  const variant = d.variant ?? "accordion";
  if (variant === "two-column") {
    return `<section class="dw-section">
      <div class="dw-container dw-grid-faq-twocol">
        <div>
          <div class="dw-mono-kicker">Help &amp; FAQ</div>
          <h2 class="dw-h2">Everything you might want to ask.</h2>
        </div>
        <div class="dw-faq-list">${items}</div>
      </div>
    </section>`;
  }
  if (variant === "cards") {
    return `<section class="dw-section">
      <div class="dw-container">
        <h2 class="dw-h2">Questions?</h2>
        <div class="dw-faq-cards">${items}</div>
      </div>
    </section>`;
  }
  return `<section class="dw-section">
    <div class="dw-container-narrow">
      <h2 class="dw-h2">Common questions</h2>
      <div class="dw-faq-list">${items}</div>
    </div>
  </section>`;
};

const renderTrust = (d: TrustData): string => {
  if (!d.badges?.length) return "";
  const items = d.badges
    .map((b) => `<div class="dw-trust-item">${esc(b)}</div>`)
    .join("");
  return `<section class="dw-trust"><div class="dw-container">${items}</div></section>`;
};

const renderTestimonials = (d: TestimonialsData): string => {
  if (!d.testimonials?.length) return "";
  const cards = d.testimonials
    .map(
      (t) => `<div class="dw-testimonial">
        ${t.rating ? `<div class="dw-stars">${"★".repeat(Math.round(t.rating))}<span class="dw-stars-faded">${"★".repeat(5 - Math.round(t.rating))}</span></div>` : ""}
        <p class="dw-quote">&ldquo;${esc(t.quote)}&rdquo;</p>
        <div class="dw-cite">
          <div class="dw-avatar">${t.avatarUrl ? `<img src="${t.avatarUrl}" alt="${esc(t.name)}" />` : ""}</div>
          <div>
            <div class="dw-cite-name">${esc(t.name)}</div>
            ${t.role ? `<div class="dw-cite-role">${esc(t.role)}</div>` : ""}
          </div>
        </div>
      </div>`,
    )
    .join("");
  return `<section class="dw-section">
    <div class="dw-container">
      ${d.title ? `<h2 class="dw-h2">${esc(d.title)}</h2>` : ""}
      <div class="dw-testimonial-grid">${cards}</div>
    </div>
  </section>`;
};

const renderValueProps = (d: ValuePropsData): string => {
  if (!d.props?.length) return "";
  const items = d.props
    .map(
      (p) => `<div class="dw-prop">
        <div class="dw-icon">${p.icon ?? "✦"}</div>
        <div class="dw-prop-title">${esc(p.title)}</div>
        <div class="dw-prop-desc">${esc(p.description)}</div>
      </div>`,
    )
    .join("");
  return `<section class="dw-section">
    <div class="dw-container">
      ${d.title ? `<h2 class="dw-h2 dw-text-center">${esc(d.title)}</h2>` : ""}
      <div class="dw-prop-grid">${items}</div>
    </div>
  </section>`;
};

const renderLifestyle = (d: LifestyleData): string => {
  const right = (d.imagePosition ?? "right") === "right";
  return `<section class="dw-section">
    <div class="dw-container dw-grid-2 dw-items-center ${right ? "" : "dw-reverse"}">
      <div>
        <h2 class="dw-h2">${esc(d.headline)}</h2>
        <p class="dw-sub">${esc(d.body)}</p>
      </div>
      <div class="dw-lifestyle-img">
        ${d.imageUrl ? `<img src="${d.imageUrl}" alt="" />` : `<div class="dw-gradient"></div>`}
      </div>
    </div>
  </section>`;
};

const renderGallery = (d: GalleryData): string => {
  if (!d.images?.length) return "";
  const items = d.images
    .map(
      (i) => `<figure class="dw-gallery-item">
        ${i.url ? `<img src="${i.url}" alt="${esc(i.caption ?? "")}" />` : `<div class="dw-gradient"></div>`}
        ${i.caption ? `<figcaption>${esc(i.caption)}</figcaption>` : ""}
      </figure>`,
    )
    .join("");
  return `<section class="dw-section">
    <div class="dw-container">
      ${d.title ? `<h2 class="dw-h2">${esc(d.title)}</h2>` : ""}
      <div class="dw-gallery-grid">${items}</div>
    </div>
  </section>`;
};

const renderFooter = (d: FooterData): string => {
  return `<footer class="dw-footer">
    <div class="dw-container">
      <span>&copy; ${new Date().getFullYear()} ${esc(d.storeName)}</span>
      <span>Built with Dropwiz</span>
    </div>
  </footer>`;
};

function bundlePrice(base: number, qty: number, discountPct: number): number {
  return Math.round(base * qty * (1 - discountPct / 100));
}

function esc(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCss(tokens: ThemeTokens): string {
  const c = tokens?.colors ?? {};
  const t = tokens?.typography ?? {};
  const r = tokens?.radius ?? 12;
  const bg = c.background ?? "#fafaf7";
  const text = c.text ?? "#0a0a0a";
  const primary = c.primary ?? "#0a0a0a";
  const accent = c.accent ?? "#c7ff3d";
  const sans = t.sans ? `"${t.sans}"` : "system-ui";
  const display = t.display ? `"${t.display}"` : sans;

  return `
:root {
  --dw-bg: ${bg};
  --dw-text: ${text};
  --dw-primary: ${primary};
  --dw-accent: ${accent};
  --dw-radius: ${r}px;
  --dw-font-sans: ${sans}, system-ui, -apple-system, sans-serif;
  --dw-font-display: ${display}, ${sans}, system-ui, sans-serif;
}

.dw-store, .dw-store * { box-sizing: border-box; }
.dw-store { background: var(--dw-bg); color: var(--dw-text); font-family: var(--dw-font-sans); -webkit-font-smoothing: antialiased; line-height: 1.5; container-type: inline-size; container-name: store; }
.dw-store h1, .dw-store h2, .dw-store h3 { font-family: var(--dw-font-display); margin: 0; }
.dw-store p { margin: 0; }
.dw-store img { max-width: 100%; height: auto; display: block; }
.dw-store button { font: inherit; cursor: pointer; border: 0; }

.dw-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.dw-container-narrow { max-width: 820px; margin: 0 auto; padding: 0 20px; }
.dw-section { padding: 56px 0; border-top: 1px solid rgba(0,0,0,0.05); }
.dw-grid-2 { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-text-center { text-align: center; }
.dw-justify-center { justify-content: center; }
.dw-items-center { align-items: center; }
.dw-reverse > *:first-child { order: 2; }

.dw-h1 { font-size: 36px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; }
.dw-h1-display { font-family: var(--dw-font-display); }
.dw-h2 { font-size: 26px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 28px; }
.dw-on-dark { color: #fff; }
.dw-sub { font-size: 15px; line-height: 1.55; opacity: 0.75; margin-top: 16px; }
.dw-section-sub { margin-bottom: 32px; opacity: 0.7; }
.dw-mono-kicker { font-family: ui-monospace, "JetBrains Mono", Menlo, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; margin-bottom: 16px; }

.dw-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.dw-btn-primary, .dw-btn-outline, .dw-btn-outline-light, .dw-btn-pill {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 22px; font-size: 14px; font-weight: 600;
  border-radius: var(--dw-radius); transition: opacity 0.15s;
}
.dw-btn-block { width: 100%; padding: 14px 22px; margin-top: 16px; }
.dw-btn-primary { background: var(--dw-primary); color: var(--dw-bg); }
.dw-btn-outline { background: transparent; color: var(--dw-text); border: 1px solid rgba(0,0,0,0.18); }
.dw-btn-outline-light { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); }
.dw-btn-pill { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; font-size: 12px; backdrop-filter: blur(8px); }
.dw-btn-primary:hover, .dw-btn-outline:hover, .dw-btn-outline-light:hover, .dw-btn-pill:hover { opacity: 0.85; }

.dw-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; background: var(--dw-accent); color: var(--dw-primary); margin-bottom: 20px; }
.dw-badge-glass { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; background: rgba(255,255,255,0.15); color: #fff; backdrop-filter: blur(8px); margin-bottom: 18px; }
.dw-social { font-size: 12px; opacity: 0.6; margin-top: 18px; }

.dw-hero { padding: 48px 0; }
.dw-hero-img-square, .dw-hero-img-video, .dw-hero-img-wide { border-radius: var(--dw-radius); overflow: hidden; background: rgba(0,0,0,0.05); }
.dw-hero-img-square { aspect-ratio: 1/1; }
.dw-hero-img-video { aspect-ratio: 16/10; margin-top: 36px; }
.dw-hero-img-wide { aspect-ratio: 16/9; margin: 32px 0; }
.dw-hero-img-square img, .dw-hero-img-video img, .dw-hero-img-wide img { width: 100%; height: 100%; object-fit: cover; }
.dw-gradient { background: linear-gradient(135deg, var(--dw-accent) 0%, var(--dw-primary) 100%); width: 100%; height: 100%; }

.dw-hero-fullbleed { position: relative; height: 88svh; min-height: 520px; overflow: hidden; }
.dw-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.dw-hero-overlay { position: absolute; inset: 0; }
.dw-hero-fullbleed-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; padding: 24px 20px; color: #fff; }
.dw-fullbleed-nav { display: flex; align-items: center; justify-content: space-between; }
.dw-brand { font-size: 14px; font-weight: 600; }
.dw-fullbleed-copy { margin-top: auto; max-width: 820px; }

.dw-hero-minimal-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-mag-meta { display: flex; justify-content: space-between; font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; margin-bottom: 24px; }
.dw-mag-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-mag-side { border-top: 1px solid rgba(0,0,0,0.15); padding-top: 16px; }

.dw-product-img { aspect-ratio: 1/1; border-radius: var(--dw-radius); overflow: hidden; background: rgba(0,0,0,0.05); }
.dw-product-img img { width: 100%; height: 100%; object-fit: cover; }
.dw-price { font-size: 26px; font-weight: 600; margin: 12px 0 4px; }

.dw-bundle-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-bundle { position: relative; padding: 20px; border: 1px solid rgba(0,0,0,0.1); border-radius: var(--dw-radius); display: flex; flex-direction: column; }
.dw-bundle-rec { box-shadow: 0 0 0 2px var(--dw-primary); border-color: transparent; }
.dw-bundle-badge { position: absolute; top: -12px; left: 16px; background: var(--dw-primary); color: var(--dw-bg); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 9999px; }
.dw-bundle-name { font-size: 17px; font-weight: 600; }
.dw-bundle-desc { font-size: 13px; opacity: 0.65; margin-top: 4px; }
.dw-bundle-price { font-size: 28px; font-weight: 600; margin: 18px 0 4px; }
.dw-bundle-meta { font-size: 12px; opacity: 0.6; }

.dw-bundle-list .dw-bundle { display: flex; align-items: center; flex-direction: row; gap: 16px; border-radius: 0; border-bottom: 1px solid rgba(0,0,0,0.05); border-left: none; border-right: none; border-top: none; }
.dw-bundle-showcase { display: grid; grid-template-columns: 1fr; gap: 20px; }

.dw-faq-list { }
.dw-faq-item { border-bottom: 1px solid rgba(0,0,0,0.05); padding: 18px 0; }
.dw-faq-item summary { cursor: pointer; font-size: 15px; font-weight: 500; list-style: none; }
.dw-faq-item summary::-webkit-details-marker { display: none; }
.dw-faq-answer { margin-top: 12px; font-size: 14px; line-height: 1.6; opacity: 0.75; }
.dw-faq-cards { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-faq-cards .dw-faq-item { border: 1px solid rgba(0,0,0,0.1); border-radius: var(--dw-radius); padding: 18px 20px; }
.dw-grid-faq-twocol { display: grid; grid-template-columns: 1fr; gap: 28px; }

.dw-trust { padding: 32px 0; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(0,0,0,0.02); }
.dw-trust .dw-container { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-trust-item { font-size: 14px; opacity: 0.85; }

.dw-prop-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-prop { text-align: center; }
.dw-icon { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--dw-radius); background: color-mix(in oklab, var(--dw-accent) 18%, transparent); color: var(--dw-primary); font-size: 22px; margin-bottom: 14px; }
.dw-prop-title { font-size: 17px; font-weight: 600; }
.dw-prop-desc { font-size: 14px; line-height: 1.55; opacity: 0.7; margin-top: 6px; }

.dw-testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-testimonial { padding: 24px; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--dw-radius); }
.dw-stars { letter-spacing: 2px; font-size: 14px; margin-bottom: 12px; color: var(--dw-text); }
.dw-stars-faded { opacity: 0.3; }
.dw-quote { font-size: 15px; line-height: 1.55; }
.dw-cite { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05); }
.dw-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, var(--dw-accent), var(--dw-primary)); flex-shrink: 0; }
.dw-avatar img { width: 100%; height: 100%; object-fit: cover; }
.dw-cite-name { font-size: 14px; font-weight: 500; }
.dw-cite-role { font-size: 12px; opacity: 0.6; }

.dw-lifestyle-img { aspect-ratio: 4/5; border-radius: var(--dw-radius); overflow: hidden; }
.dw-lifestyle-img img { width: 100%; height: 100%; object-fit: cover; }

.dw-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.dw-gallery-item { position: relative; aspect-ratio: 1/1; overflow: hidden; border-radius: var(--dw-radius); margin: 0; }
.dw-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.dw-gallery-item figcaption { position: absolute; inset-inline: 0; bottom: 0; padding: 10px; font-size: 11px; font-weight: 500; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,0.6)); }

.dw-footer { border-top: 1px solid rgba(0,0,0,0.05); padding: 36px 0; font-size: 12px; opacity: 0.6; }
.dw-footer .dw-container { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }

@container store (min-width: 768px) {
  .dw-section { padding: 80px 0; }
  .dw-container, .dw-container-narrow { padding: 0 48px; }
  .dw-grid-2 { grid-template-columns: 1fr 1fr; gap: 40px; }
  .dw-h1 { font-size: 56px; line-height: 1.02; letter-spacing: -0.035em; }
  .dw-h2 { font-size: 36px; }
  .dw-sub { font-size: 17px; }
  .dw-bundle-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .dw-faq-cards { grid-template-columns: repeat(2, 1fr); }
  .dw-trust .dw-container { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dw-prop-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; }
  .dw-testimonial-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dw-gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .dw-grid-faq-twocol { grid-template-columns: 0.9fr 1.4fr; gap: 48px; }
  .dw-hero-minimal-grid { grid-template-columns: 1.4fr 1fr; gap: 48px; }
  .dw-mag-grid { grid-template-columns: 1.5fr 1fr; gap: 40px; }
  .dw-bundle-showcase { grid-template-columns: 1.5fr 1fr; }
  .dw-h1 { font-size: 64px; }
}
@container store (min-width: 1024px) {
  .dw-bundle-grid { grid-template-columns: repeat(4, 1fr); }
  .dw-gallery-grid { grid-template-columns: repeat(4, 1fr); }
  .dw-h1 { font-size: 72px; }
}
`.trim();
}
