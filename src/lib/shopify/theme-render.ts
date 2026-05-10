import type { Store, StoreSection, StorePage, ThemeTokens } from "@/db/schema";
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
  AnnouncementData,
  HeaderData,
  VideoData,
  FeatureMarqueeData,
  HowItWorksData,
  ReviewStatsData,
} from "@/types/store-sections";
import * as HugeIcons from "@hugeicons/core-free-icons";

const log = (event: string, data: Record<string, unknown> = {}) => {
  const ts = new Date().toISOString();
  console.log(`[theme-render ${ts}] ${event}`, JSON.stringify(data, null, 2));
};

export function renderStoreToHtml(store: Store): { body: string; css: string } {
  log("renderStoreToHtml.start", {
    storeId: store.id,
    sectionsCount: store.sections.length,
    sectionTypes: store.sections.map((s) => s.type),
  });
  const sections = [...store.sections].sort((a, b) => a.order - b.order);
  const body = sections.map((s) => {
    log("renderStoreToHtml.renderingSection", { type: s.type, id: s.id, order: s.order });
    const html = renderSection(s);
    log("renderStoreToHtml.sectionRendered", { type: s.type, htmlLength: html.length });
    return html;
  }).join("\n");
  const css = renderCss(store.themeTokens as ThemeTokens);
  log("renderStoreToHtml.complete", { bodyLength: body.length, cssLength: css.length });
  return { body, css };
}

export function renderPageToHtml(
  store: Store,
  page: StorePage
): { body: string; css: string } {
  log("renderPageToHtml.start", {
    storeId: store.id,
    pageId: page.id,
    pageName: page.name,
    pageType: page.type,
    sectionsCount: page.sections.length,
    sectionTypes: page.sections.map((s) => ({ id: s.id, type: s.type, order: s.order })),
  });
  const sections = [...page.sections].sort((a, b) => a.order - b.order);
  log("renderPageToHtml.sortedSections", {
    sortedOrder: sections.map((s) => ({ type: s.type, order: s.order })),
  });
  const body = sections.map((s) => {
    log("renderPageToHtml.renderingSection", {
      type: s.type,
      id: s.id,
      order: s.order,
      dataKeys: Object.keys(s.data || {}),
      dataPreview: JSON.stringify(s.data).substring(0, 200),
    });
    const html = renderSection(s);
    log("renderPageToHtml.sectionRendered", {
      type: s.type,
      htmlLength: html.length,
      htmlPreview: html.substring(0, 300),
      isEmpty: html.trim() === "",
    });
    return html;
  }).join("\n");
  const css = renderCss(store.themeTokens as ThemeTokens);
  log("renderPageToHtml.complete", {
    pageId: page.id,
    bodyLength: body.length,
    cssLength: css.length,
    bodyPreview: body.substring(0, 500),
  });
  return { body, css };
}

export function renderSectionsToHtml(
  sections: StoreSection[],
  themeTokens: ThemeTokens
): { body: string; css: string } {
  log("renderSectionsToHtml.start", {
    sectionsCount: sections.length,
    sectionTypes: sections.map((s) => s.type),
  });
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const body = sortedSections.map((s) => {
    log("renderSectionsToHtml.renderingSection", { type: s.type, id: s.id });
    const html = renderSection(s);
    log("renderSectionsToHtml.sectionRendered", { type: s.type, htmlLength: html.length });
    return html;
  }).join("\n");
  const css = renderCss(themeTokens);
  log("renderSectionsToHtml.complete", { bodyLength: body.length, cssLength: css.length });
  return { body, css };
}

function renderSection(section: StoreSection): string {
  log("renderSection.start", {
    sectionId: section.id,
    sectionType: section.type,
    sectionOrder: section.order,
    hasData: !!section.data,
    dataKeys: Object.keys(section.data || {}),
  });

  let result: string;
  switch (section.type) {
    case "announcement":
      result = renderAnnouncement(section.data as AnnouncementData);
      break;
    case "header":
      result = renderHeader(section.data as HeaderData);
      break;
    case "hero":
      result = renderHero(section.data as HeroData);
      break;
    case "product":
      result = renderProduct(section.data as ProductData);
      break;
    case "bundles":
      result = renderBundles(section.data as BundleData);
      break;
    case "trust":
      result = renderTrust(section.data as TrustData);
      break;
    case "faq":
      result = renderFaq(section.data as FaqData);
      break;
    case "footer":
      result = renderFooter(section.data as FooterData);
      break;
    case "lifestyle":
      result = renderLifestyle(section.data as LifestyleData);
      break;
    case "gallery":
      result = renderGallery(section.data as GalleryData);
      break;
    case "testimonials":
      result = renderTestimonials(section.data as TestimonialsData);
      break;
    case "valueProps":
      result = renderValueProps(section.data as ValuePropsData);
      break;
    case "video":
      result = renderVideo(section.data as VideoData);
      break;
    case "featureMarquee":
      result = renderFeatureMarquee(section.data as FeatureMarqueeData);
      break;
    case "howItWorks":
      result = renderHowItWorks(section.data as HowItWorksData);
      break;
    case "reviewStats":
      result = renderReviewStats(section.data as ReviewStatsData);
      break;
    default:
      log("renderSection.unknownType", { type: section.type });
      result = "";
  }

  log("renderSection.complete", {
    sectionId: section.id,
    sectionType: section.type,
    resultLength: result.length,
    isEmpty: result.trim() === "",
  });

  return result;
}

const fmtPrice = (cents: number, currency: string): string => {
  const v = (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${v}`;
};

type IconPathData = [string, Record<string, string>][];

const ICON_NAME_MAP: Record<string, string> = {
  Truck01Icon: "TruckDeliveryIcon",
  Lock01Icon: "LockIcon",
  ShieldCheckIcon: "SecurityCheckIcon",
  ShieldUserIcon: "UserShieldIcon",
  CheckmarkCircle01Icon: "CheckmarkCircle02Icon",
  CheckmarkSquare01Icon: "CheckmarkSquare02Icon",
  CheckmarkBadge01Icon: "CheckmarkBadge02Icon",
  Clock01Icon: "Clock02Icon",
  Time01Icon: "Time02Icon",
  Home01Icon: "Home02Icon",
  Store01Icon: "Store02Icon",
  Building01Icon: "Building02Icon",
};

const iconDataToSvg = (iconData: IconPathData, size = "1em"): string => {
  const paths = iconData
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}></${tag}>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor">${paths}</svg>`;
};

const getIconSvg = (iconName?: string, size = "1em"): string => {
  if (!iconName) return "";
  const mappedName = ICON_NAME_MAP[iconName] ?? iconName;
  let iconData = (HugeIcons as Record<string, IconPathData>)[mappedName];
  if (!iconData || !Array.isArray(iconData)) {
    const baseName = iconName.replace(/\d+Icon$/, "Icon");
    iconData = (HugeIcons as Record<string, IconPathData>)[baseName];
  }
  if (!iconData || !Array.isArray(iconData)) return "";
  return iconDataToSvg(iconData, size);
};

const renderAnnouncement = (d: AnnouncementData): string => {
  if (!d.badges?.length) return "";
  const variant = d.variant ?? "bar";

  if (variant === "marquee") {
    const items = d.badges
      .map((b) => `<span class="dw-marquee-item"><span class="dw-marquee-icon">${getIconSvg(b.icon)}</span>${esc(b.text)}</span>`)
      .join("");
    return `<div class="dw-marquee"><div class="dw-marquee-track">${items}${items}${items}${items}</div></div>`;
  }

  if (variant === "pills") {
    const items = d.badges
      .map((b) => `<span class="dw-announcement-pill"><span class="dw-announcement-icon">${getIconSvg(b.icon)}</span>${esc(b.text)}</span>`)
      .join("");
    return `<div class="dw-announcement-pills">${items}</div>`;
  }

  const items = d.badges
    .map((b) => `<span class="dw-announcement-item"><span class="dw-announcement-icon">${getIconSvg(b.icon)}</span>${esc(b.text)}</span>`)
    .join("");
  return `<div class="dw-announcement">${items}</div>`;
};

const PRODUCT_LINK = "{% if product %}{{ product.url }}{% else %}/collections/all{% endif %}";
const PRODUCT_ANCHOR = "#dw-product";

const renderHeader = (d: HeaderData): string => {
  const name = esc(d.storeName ?? "Store");
  const showLogo = !!d.logoUrl;
  const showName = d.showNameWithLogo !== false || !showLogo;

  const logoContent = showLogo
    ? `<img src="${d.logoUrl}" alt="${name}" class="dw-header-logo-img" />${showName && d.showNameWithLogo ? `<span class="dw-header-name">${name}</span>` : ""}`
    : name;

  return `<header class="dw-header">
    <div class="dw-container dw-header-inner">
      <a href="/" class="dw-header-logo">${logoContent}</a>
      <nav class="dw-header-nav">
        <a href="{% if product %}${PRODUCT_ANCHOR}{% else %}${PRODUCT_LINK}{% endif %}" class="dw-btn-primary dw-btn-sm">Shop Now</a>
      </nav>
    </div>
  </header>`;
};

const formatStaticPrice = (cents: number, currency: string = "USD"): string => {
  const amount = (cents / 100).toFixed(2);
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹", CAD: "CA$", AUD: "A$" };
  return `${symbols[currency] ?? currency + " "}${amount}`;
};

const renderIcon = (iconName: string): string => {
  if (!iconName) return "";
  return getIconSvg(iconName);
};

const renderHeroProductHero = (d: HeroData): string => {
  const headline = esc(d.headline ?? "");
  const subheadline = d.subheadline ? esc(d.subheadline) : "";
  const ctaMode = d.ctaMode ?? "cart";
  const cta = esc(d.primaryCta ?? (ctaMode === "navigate" ? "SHOP NOW" : "ADD TO CART"));
  const ctaLink = d.ctaLink ?? PRODUCT_LINK;
  const img = d.imageUrl ?? "";
  const showHeader = d.showHeader !== false;
  const sideFeatures = d.sideFeatures ?? [];
  const additionalImages = d.additionalImages ?? [];
  const benefits = d.benefits ?? [];
  const quickFeatures = d.quickFeatures ?? [];
  const inlineFaqs = d.inlineFaqs ?? [];
  const trustCards = d.trustCards ?? [];
  const currency = d.currency ?? "USD";

  const sideFeaturesHtml = sideFeatures.slice(0, 4).map(f => {
    return `<div class="dw-ph-side-card">
      <div class="dw-ph-side-icon-wrap"><span class="dw-ph-side-icon">${getIconSvg(f.icon)}</span></div>
      <span class="dw-ph-side-label">${esc(f.label)}</span>
      ${"description" in f && f.description ? `<span class="dw-ph-side-desc">${esc(f.description)}</span>` : ""}
    </div>`;
  }).join("");

  const additionalImagesHtml = additionalImages.slice(0, 3).map(url =>
    `<div class="dw-ph-thumb"><img src="${url}" alt="" loading="lazy" /></div>`
  ).join("");

  const benefitsHtml = benefits.map(b =>
    `<div class="dw-ph-benefit"><span class="dw-ph-benefit-icon">${getIconSvg(b.icon)}</span><span>${esc(b.text)}</span></div>`
  ).join("");

  const quickFeaturesHtml = quickFeatures.slice(0, 4).map(f =>
    `<div class="dw-ph-quick"><span class="dw-ph-quick-check">✓</span><span>${esc(f.text)}</span></div>`
  ).join("");

  const inlineFaqsHtml = inlineFaqs.map(faq =>
    `<details class="dw-ph-faq"><summary>${esc(faq.question)}</summary><div class="dw-ph-faq-answer">${esc(faq.answer)}</div></details>`
  ).join("");

  const trustCardsHtml = trustCards.map(c =>
    `<div class="dw-ph-trust-card">
      ${c.icon ? `<span class="dw-ph-trust-icon">${getIconSvg(c.icon)}</span>` : ""}
      <div>
        <div class="dw-ph-trust-title">${esc(c.title)}</div>
        <div class="dw-ph-trust-desc">${esc(c.description)}</div>
      </div>
    </div>`
  ).join("");

  const ratingSource = d.ratingSource ?? "customers";
  const ratingSourceLabels: Record<string, string> = {
    trustpilot: "Trustpilot",
    google: "Google",
    judgeme: "Judge.me",
    loox: "Loox",
    customers: "customers",
  };
  const ratingLabel = ratingSourceLabels[ratingSource] ?? ratingSource;
  const ratingHtml = d.rating && d.reviewCount ? `<div class="dw-ph-rating" data-source="${esc(ratingSource)}">
    <span class="dw-ph-rating-bar">${"★".repeat(5)}</span>
    <span class="dw-ph-rating-text">${d.rating.toFixed(1)}/5 stars by ${d.reviewCount.toLocaleString()}+ ${esc(ratingLabel)}</span>
  </div>` : "";

  const staticPrice = d.priceCents ? formatStaticPrice(d.priceCents, currency) : "";
  const staticOriginalPrice = d.originalPriceCents ? formatStaticPrice(d.originalPriceCents, currency) : "";

  const priceHtml = d.priceCents ? `<div class="dw-ph-price">
    <span class="dw-ph-price-current">{% if product %}{{ product.price | money }}{% else %}${staticPrice}{% endif %}</span>
    ${d.originalPriceCents ? `<span class="dw-ph-price-old">{% if product %}{{ product.compare_at_price | money }}{% else %}${staticOriginalPrice}{% endif %}</span>` : ""}
    ${d.stockBadge ? `<span class="dw-ph-stock">${esc(d.stockBadge)}</span>` : ""}
  </div>` : "";

  const imageBadgeHtml = d.imageBadge?.text ? `<div class="dw-ph-img-badge">
    ${d.imageBadge.icon ? `<span>${getIconSvg(d.imageBadge.icon)}</span>` : ""}
    <span>${esc(d.imageBadge.text)}</span>
  </div>` : "";

  const bottomMessageHtml = d.bottomMessage?.text ? `<div class="dw-ph-bottom-msg">
    ${d.bottomMessage.icon ? `<span>${getIconSvg(d.bottomMessage.icon)}</span>` : ""}
    <span>${esc(d.bottomMessage.text)}</span>
  </div>` : "";

  const headerHtml = showHeader ? `<header class="dw-ph-header">
    <span class="dw-ph-brand">${esc(d.brandName ?? "Brand")}</span>
    <a href="{% if product %}${PRODUCT_ANCHOR}{% else %}${PRODUCT_LINK}{% endif %}" class="dw-ph-header-btn">Shop Now</a>
  </header>` : "";

  const ctaHtml = ctaMode === "navigate"
    ? `<a href="${ctaLink}" class="dw-ph-cta">${cta}</a>`
    : `{% if product %}{%- form 'product', product, class: 'dw-ph-form' -%}
      <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
      <button type="submit" class="dw-ph-cta">${cta}</button>
    {%- endform -%}{% else %}<a href="${PRODUCT_LINK}" class="dw-ph-cta">${cta}</a>{% endif %}`;

  return `<section class="dw-hero-product">
    ${headerHtml}
    <div class="dw-ph-grid">
      <div class="dw-ph-left">
        <div class="dw-ph-img-wrap">
          ${sideFeaturesHtml ? `<div class="dw-ph-side-cards">${sideFeaturesHtml}</div>` : ""}
          <div class="dw-ph-main-img">
            ${imageBadgeHtml}
            ${img ? `<img src="${img}" alt="${headline}" loading="eager" />` : `<div class="dw-gradient"></div>`}
          </div>
        </div>
        ${additionalImagesHtml ? `<div class="dw-ph-thumbs">${additionalImagesHtml}</div>` : ""}
        ${sideFeaturesHtml ? `<div class="dw-ph-side-cards-mobile">${sideFeaturesHtml}</div>` : ""}
      </div>
      <div class="dw-ph-right">
        ${ratingHtml}
        <h1 class="dw-ph-headline">${headline}</h1>
        ${subheadline ? `<p class="dw-ph-subheadline">${subheadline}</p>` : ""}
        ${priceHtml}
        ${benefitsHtml ? `<div class="dw-ph-benefits">${benefitsHtml}</div>` : ""}
        ${ctaHtml}
        ${quickFeaturesHtml ? `<div class="dw-ph-quick-grid">${quickFeaturesHtml}</div>` : ""}
        ${inlineFaqsHtml ? `<div class="dw-ph-faqs">${inlineFaqsHtml}</div>` : ""}
        ${trustCardsHtml ? `<div class="dw-ph-trust-cards">${trustCardsHtml}</div>` : ""}
        ${bottomMessageHtml}
      </div>
    </div>
  </section>`;
};

const renderHero = (d: HeroData): string => {
  const variant = d.variant ?? "split";
  if (variant === "product-hero") {
    return renderHeroProductHero(d);
  }

  const headline = esc(d.headline ?? "");
  const sub = esc(d.subheadline ?? "");
  const cta = esc(d.primaryCta ?? "Shop now");
  const cta2 = d.secondaryCta ? esc(d.secondaryCta) : "";
  const badge = d.urgencyBadge ? esc(d.urgencyBadge) : "";
  const social = d.socialProof ? esc(d.socialProof) : "";
  const img = d.imageUrl ?? "";
  const ctaLink = d.ctaLink ?? PRODUCT_LINK;

  const ratingHtml = d.rating ? `<div class="dw-rating">
    <span class="dw-stars">${"★".repeat(Math.floor(d.rating))}<span class="dw-stars-faded">${"★".repeat(5 - Math.floor(d.rating))}</span></span>
    <span class="dw-rating-text">${d.rating}/5${d.reviewCount ? ` (${d.reviewCount.toLocaleString()}+ reviews)` : ""}</span>
  </div>` : "";

  const featureBadgesHtml = d.featureBadges?.length ? `<div class="dw-feature-badges">
    ${d.featureBadges.map(fb => `<span class="dw-feature-badge">${fb.icon ? `<span class="dw-feature-icon">${getIconSvg(fb.icon)}</span>` : "✓"} ${esc(fb.label)}</span>`).join("")}
  </div>` : "";

  if (variant === "centered") {
    return `<section class="dw-hero dw-hero-centered">
      <div class="dw-container dw-text-center">
        ${badge ? `<span class="dw-badge">${badge}</span>` : ""}
        <h1 class="dw-h1">${headline}</h1>
        <p class="dw-sub">${sub}</p>
        <div class="dw-cta-row dw-justify-center">
          <a href="${ctaLink}" class="dw-btn-primary">${cta}</a>
          ${cta2 ? `<a href="#dw-faq" class="dw-btn-outline">${cta2}</a>` : ""}
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
          <a href="${ctaLink}" class="dw-btn-pill">${cta}</a>
        </nav>
        <div class="dw-fullbleed-copy">
          ${badge ? `<div class="dw-badge-glass">${badge}</div>` : ""}
          <h1 class="dw-h1 dw-on-dark">${headline}</h1>
          <p class="dw-sub dw-on-dark">${sub}</p>
          <div class="dw-cta-row">
            <a href="${ctaLink}" class="dw-btn-primary">${cta}</a>
            ${cta2 ? `<a href="#dw-faq" class="dw-btn-outline-light">${cta2}</a>` : ""}
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
              <a href="${ctaLink}" class="dw-btn-primary">${cta}</a>
              ${cta2 ? `<a href="#dw-faq" class="dw-btn-outline">${cta2}</a>` : ""}
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
              <a href="${ctaLink}" class="dw-btn-primary">${cta}</a>
              ${cta2 ? `<a href="#dw-faq" class="dw-btn-outline">${cta2}</a>` : ""}
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
        ${ratingHtml}
        ${badge ? `<span class="dw-badge">${badge}</span>` : ""}
        <h1 class="dw-h1">${headline}</h1>
        <p class="dw-sub">${sub}</p>
        ${featureBadgesHtml}
        <div class="dw-cta-row">
          <a href="${ctaLink}" class="dw-btn-primary">${cta}</a>
          ${cta2 ? `<a href="#dw-faq" class="dw-btn-outline">${cta2}</a>` : ""}
        </div>
        ${social ? `<div class="dw-social">${social}</div>` : ""}
      </div>
      <div class="dw-hero-img-square">
        ${img ? `<img src="${img}" alt="" />` : `<div class="dw-gradient"></div>`}
      </div>
    </div>
  </section>`;
};

const renderProductRating = (rating?: number, reviewCount?: number): string => {
  if (!rating || !reviewCount) return "";
  const fullStars = Math.round(rating);
  const stars = "★".repeat(fullStars);
  const faded = "★".repeat(5 - fullStars);
  return `<div class="dw-prod-rating">
    <span class="dw-stars">${stars}<span class="dw-stars-faded">${faded}</span></span>
    <span class="dw-rating-text">${rating.toFixed(1)}/5 (${reviewCount.toLocaleString()}+ reviews)</span>
  </div>`;
};

const renderProductPrice = (d: ProductData): string => {
  const hasOriginal = d.originalPriceCents && d.originalPriceCents > d.priceCents;
  const staticPrice = formatStaticPrice(d.priceCents, d.currency);
  const originalPrice = hasOriginal ? formatStaticPrice(d.originalPriceCents!, d.currency) : "";
  return `<div class="dw-prod-price">
    <span class="dw-prod-price-current">{% if product %}{{ product.price | money }}{% else %}${staticPrice}{% endif %}</span>
    ${hasOriginal ? `<span class="dw-prod-price-original">{% if product %}{{ product.compare_at_price | money }}{% else %}${originalPrice}{% endif %}</span>` : ""}
    ${d.badge ? `<span class="dw-prod-badge">${esc(d.badge)}</span>` : ""}
  </div>`;
};

const renderFeatureBadges = (features?: Array<{ icon: string; label: string }>): string => {
  if (!features?.length) return "";
  return `<div class="dw-prod-features">${features.map(f => `<div class="dw-prod-feature">
    ${f.icon ? `<span class="dw-prod-feature-icon">${renderIcon(f.icon)}</span>` : ""}
    <span>${esc(f.label)}</span>
  </div>`).join("")}</div>`;
};

const PAYMENT_FILE_MAP: Record<string, string> = {
  visa: "visa.png",
  mastercard: "mastercard.png",
  amex: "amex.png",
  paypal: "paypal.png",
  applepay: "applepay.png",
  googlepay: "gpay.png",
  discover: "visa.png",
  stripe: "shopify.png",
};

const renderPaymentBadges = (show?: boolean, methods?: string[]): string => {
  if (show === false) return "";
  const activePayments = methods ?? ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];
  return `<div class="dw-payment-badges">${activePayments.map(p => `<div class="dw-payment-badge"><img src="{{ '${PAYMENT_FILE_MAP[p] ?? "visa.png"}' | asset_url }}" alt="${p}" /></div>`).join("")}</div>`;
};

const renderProductImages = (mainImage: string, images?: string[]): string => {
  const allImages = images?.length ? images : [mainImage];
  const thumbs = allImages.slice(0, 6).map((img, i) => `<button class="dw-prod-thumb ${i === 0 ? "active" : ""}" data-image="${img}"><img src="${img}" alt="" /></button>`).join("");
  return `<div class="dw-prod-gallery">
    <div class="dw-prod-thumbs">${thumbs}</div>
    <div class="dw-prod-main-img"><img src="${allImages[0]}" alt="" class="dw-prod-active-img" /></div>
  </div>`;
};

const renderSideFeatures = (features?: Array<{ icon: string; label: string }>): string => {
  if (!features?.length) return "";
  return `<div class="dw-prod-side-features">${features.slice(0, 4).map(f => `<div class="dw-prod-side-card">
    <span class="dw-prod-side-icon">${renderIcon(f.icon)}</span>
    <span class="dw-prod-side-label">${esc(f.label)}</span>
  </div>`).join("")}</div>`;
};

const renderProductForm = (ctaText: string, showPrice = true): string => {
  const priceText = showPrice ? " — {{ product.price | money }}" : "";
  return `{%- form 'product', product, class: 'dw-prod-form' -%}
    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
    <button type="submit" class="dw-prod-cta">${ctaText}${priceText}</button>
  {%- endform -%}`;
};

const renderProduct = (d: ProductData): string => {
  const variant = d.variant ?? "default";
  const title = esc(d.title);
  const subtitle = d.subtitle ? esc(d.subtitle) : "";
  const description = d.description ? esc(d.description) : "";
  const ratingHtml = renderProductRating(d.rating, d.reviewCount);
  const priceHtml = renderProductPrice(d);
  const featuresHtml = renderFeatureBadges(d.features);
  const paymentHtml = renderPaymentBadges(d.showPaymentBadges, d.paymentMethods);
  const imagesHtml = renderProductImages(d.imageUrl, d.images);
  const formHtml = renderProductForm("Add to cart", variant !== "gallery");

  if (variant === "compact") {
    return `<section class="dw-prod dw-prod-compact" id="dw-product">
      <div class="dw-prod-compact-inner">
        ${ratingHtml}
        <h2 class="dw-prod-title">${title}</h2>
        ${priceHtml}
        ${description ? `<p class="dw-prod-desc">${description}</p>` : ""}
        ${formHtml}
        ${paymentHtml}
      </div>
    </section>`;
  }

  if (variant === "gallery") {
    return `<section class="dw-prod dw-prod-gallery-variant" id="dw-product">
      <div class="dw-prod-gallery-grid">
        <div class="dw-prod-gallery-left">
          <div class="dw-prod-main-img-wrap">
            ${d.badge ? `<span class="dw-prod-img-badge">${esc(d.badge)}</span>` : ""}
            <img src="${d.imageUrl}" alt="${title}" class="dw-prod-hero-img" />
          </div>
          ${d.images?.length ? `<div class="dw-prod-thumb-row">${d.images.slice(0, 4).map((img, i) => `<button class="dw-prod-thumb-btn ${i === 0 ? "active" : ""}"><img src="${img}" alt="" /></button>`).join("")}</div>` : ""}
        </div>
        <div class="dw-prod-gallery-right">
          ${ratingHtml}
          <h2 class="dw-prod-title dw-prod-title-lg">${title}</h2>
          ${subtitle ? `<p class="dw-prod-subtitle">${subtitle}</p>` : ""}
          ${priceHtml}
          ${description ? `<p class="dw-prod-desc">${description}</p>` : ""}
          ${featuresHtml}
          ${renderProductForm("Add to cart", false)}
          ${paymentHtml}
        </div>
      </div>
    </section>`;
  }

  if (variant === "rich") {
    const sideHtml = renderSideFeatures(d.sideFeatures);
    const hasSide = Boolean(d.sideFeatures?.length);
    const galleryImagesHtml = d.galleryImages?.length ? `<div class="dw-prod-rich-gallery">${d.galleryImages.map(img => `<div class="dw-prod-rich-gallery-img"><img src="${img}" alt="" /></div>`).join("")}</div>` : "";
    return `<section class="dw-prod dw-prod-rich" id="dw-product">
      <div class="dw-prod-rich-grid ${hasSide ? "dw-prod-rich-with-side" : ""}">
        ${hasSide ? sideHtml : ""}
        <div class="dw-prod-rich-center">
          <div class="dw-prod-main-img-wrap">
            ${d.badge ? `<span class="dw-prod-img-badge">${esc(d.badge)}</span>` : ""}
            <img src="${d.imageUrl}" alt="${title}" class="dw-prod-hero-img" />
          </div>
          ${d.images?.length && d.images.length > 1 ? `<div class="dw-prod-thumb-row">${d.images.slice(0, 6).map((img, i) => `<button class="dw-prod-thumb-btn ${i === 0 ? "active" : ""}"><img src="${img}" alt="" /></button>`).join("")}</div>` : ""}
          ${hasSide ? `<div class="dw-prod-side-mobile">${sideHtml}</div>` : ""}
        </div>
        <div class="dw-prod-rich-right">
          ${ratingHtml}
          <h2 class="dw-prod-title">${title}</h2>
          ${subtitle ? `<p class="dw-prod-subtitle">${subtitle}</p>` : ""}
          ${priceHtml}
          ${description ? `<p class="dw-prod-desc">${description}</p>` : ""}
          ${featuresHtml}
          ${renderProductForm("Add to cart", false)}
          ${paymentHtml}
        </div>
      </div>
      ${galleryImagesHtml}
    </section>`;
  }

  return `<section class="dw-prod dw-prod-default" id="dw-product">
    <div class="dw-prod-grid">
      ${imagesHtml}
      <div class="dw-prod-info">
        ${ratingHtml}
        <h2 class="dw-prod-title">${title}</h2>
        ${subtitle ? `<p class="dw-prod-subtitle">${subtitle}</p>` : ""}
        ${priceHtml}
        ${description ? `<p class="dw-prod-desc">${description}</p>` : ""}
        ${featuresHtml}
        ${formHtml}
        ${paymentHtml}
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
        {%- form 'product', product, class: 'dw-bundle-form' -%}
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <input type="hidden" name="quantity" value="${b.quantity}" />
          <button type="submit" class="dw-btn-${b.recommended ? "primary" : "outline"} dw-btn-block">Add ${b.quantity > 1 ? `${b.quantity} items` : ""} to cart</button>
        {%- endform -%}
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
    return `<section class="dw-section" id="dw-faq">
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
    return `<section class="dw-section" id="dw-faq">
      <div class="dw-container">
        <h2 class="dw-h2">Questions?</h2>
        <div class="dw-faq-cards">${items}</div>
      </div>
    </section>`;
  }
  return `<section class="dw-section" id="dw-faq">
    <div class="dw-container-narrow">
      <h2 class="dw-h2">Common questions</h2>
      <div class="dw-faq-list">${items}</div>
    </div>
  </section>`;
};

const renderTrust = (d: TrustData): string => {
  if (!d.badges?.length) return "";
  const items = d.badges
    .map((b) => {
      const text = typeof b === "string" ? b : b.title;
      return `<div class="dw-trust-item">${esc(text)}</div>`;
    })
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
        <div class="dw-icon">${getIconSvg(p.icon)}</div>
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

const renderFooterPaymentBadges = (show?: boolean, methods?: string[]): string => {
  if (show === false) return "";
  const defaultMethods = ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];
  const activePayments = methods ?? defaultMethods;
  if (activePayments.length === 0) return "";
  return `<div class="dw-footer-payments">${activePayments.map(p => `<div class="dw-footer-payment"><img src="{{ '${PAYMENT_FILE_MAP[p] ?? "visa.png"}' | asset_url }}" alt="${p}" /></div>`).join("")}</div>`;
};

const renderFooter = (d: FooterData): string => {
  const showPayments = d.showPayments !== false;
  const showPoweredBy = d.showPoweredBy !== false;
  const logoHtml = d.logoUrl
    ? `<img src="${esc(d.logoUrl)}" alt="${esc(d.storeName)}" class="dw-footer-logo-img">`
    : `<span class="dw-footer-name">${esc(d.storeName)}</span>`;
  const taglineHtml = d.tagline ? `<span class="dw-footer-tagline">${esc(d.tagline)}</span>` : "";
  const paymentHtml = renderFooterPaymentBadges(showPayments, d.paymentMethods);
  const copyrightExtra = d.copyrightText ? ` &middot; ${esc(d.copyrightText)}` : "";
  const poweredByHtml = showPoweredBy ? `<span>Built with <a href="https://dropwiz.ai" class="dw-footer-link">Dropwiz</a></span>` : "";

  return `<footer class="dw-footer">
    <div class="dw-container">
      <div class="dw-footer-main">
        <div class="dw-footer-brand">
          ${logoHtml}
          ${taglineHtml}
        </div>
        ${paymentHtml}
      </div>
      <div class="dw-footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${esc(d.storeName)}${copyrightExtra}</span>
        ${poweredByHtml}
      </div>
    </div>
  </footer>`;
};

const getVideoEmbedUrl = (videoUrl: string): { embedUrl: string; isEmbed: boolean } => {
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");
  const isLoom = videoUrl.includes("loom.com");

  if (isYouTube) {
    const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return { embedUrl: match ? `https://www.youtube.com/embed/${match[1]}` : videoUrl, isEmbed: true };
  }
  if (isVimeo) {
    const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return { embedUrl: match ? `https://player.vimeo.com/video/${match[1]}` : videoUrl, isEmbed: true };
  }
  if (isLoom) {
    const match = videoUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    return { embedUrl: match ? `https://www.loom.com/embed/${match[1]}` : videoUrl, isEmbed: true };
  }
  return { embedUrl: videoUrl, isEmbed: false };
};

const renderVideo = (d: VideoData): string => {
  if (!d.videoUrl) return "";
  const { embedUrl, isEmbed } = getVideoEmbedUrl(d.videoUrl);
  const videoContent = isEmbed
    ? `<iframe src="${embedUrl}" class="dw-video-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video"></iframe>`
    : `<video src="${embedUrl}" controls class="dw-video-native">Your browser does not support the video tag.</video>`;

  return `<section class="dw-section dw-video-section">
    <div class="dw-container-narrow">
      <div class="dw-video-wrap">${videoContent}</div>
      ${d.caption ? `<p class="dw-video-caption">${esc(d.caption)}</p>` : ""}
    </div>
  </section>`;
};

const renderFeatureMarquee = (d: FeatureMarqueeData): string => {
  if (!d.items?.length) return "";
  const items = d.items
    .map((item) => `<span class="dw-marquee-item"><span class="dw-marquee-icon">${getIconSvg(item.icon)}</span>${esc(item.label)}</span>`)
    .join("");
  return `<div class="dw-marquee">
    <div class="dw-marquee-track">${items}${items}</div>
  </div>`;
};

const renderHowItWorks = (d: HowItWorksData): string => {
  if (!d.steps?.length) return "";
  const variant = d.variant ?? "cards";
  const steps = d.steps
    .map((step, i) => {
      if (variant === "numbered") {
        return `<div class="dw-how-step dw-how-numbered">
          <span class="dw-how-num">${i + 1}</span>
          <div>
            <div class="dw-how-title">${esc(step.title)}</div>
            <div class="dw-how-desc">${esc(step.description)}</div>
          </div>
        </div>`;
      }
      if (variant === "timeline") {
        return `<div class="dw-how-step dw-how-timeline">
          <div class="dw-how-dot"></div>
          <div>
            <div class="dw-how-title">${esc(step.title)}</div>
            <div class="dw-how-desc">${esc(step.description)}</div>
          </div>
        </div>`;
      }
      return `<div class="dw-how-step dw-how-card">
        ${step.icon ? `<div class="dw-how-icon">${getIconSvg(step.icon)}</div>` : `<span class="dw-how-num">${i + 1}</span>`}
        <div class="dw-how-title">${esc(step.title)}</div>
        <div class="dw-how-desc">${esc(step.description)}</div>
      </div>`;
    })
    .join("");

  return `<section class="dw-section">
    <div class="dw-container">
      ${d.title ? `<h2 class="dw-h2 dw-text-center">${esc(d.title)}</h2>` : ""}
      <div class="dw-how-grid dw-how-${variant}">${steps}</div>
    </div>
  </section>`;
};

const renderReviewStats = (d: ReviewStatsData): string => {
  const showStars = d.showStars !== false;
  const sourceLabels: Record<string, string> = {
    trustpilot: "Trustpilot",
    google: "Google",
    judgeme: "Judge.me",
    loox: "Loox",
    customers: "customers",
  };
  const sourceLabel = sourceLabels[d.source ?? "customers"] ?? d.source ?? "customers";
  return `<div class="dw-review-stats">
    ${showStars ? `<span class="dw-review-stars">${"★".repeat(Math.floor(d.rating))}<span class="dw-stars-faded">${"★".repeat(5 - Math.floor(d.rating))}</span></span>` : ""}
    <span class="dw-review-text">${d.rating.toFixed(1)}/5 from ${d.reviewCount.toLocaleString()}+ ${esc(sourceLabel)}</span>
  </div>`;
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

export function renderCss(tokens: ThemeTokens): string {
  const c = tokens?.colors ?? {};
  const t = tokens?.typography ?? {};
  const r = tokens?.radius ?? 12;
  const br = tokens?.buttonRadius ?? 8;
  const bg = c.background ?? "#fafaf7";
  const text = c.text ?? "#0a0a0a";
  const primary = c.primary ?? "#0a0a0a";
  const secondary = c.secondary ?? "#1f2937";
  const accent = c.accent ?? "#c7ff3d";
  const sans = t.sans ? `"${t.sans}"` : "system-ui";
  const display = t.display ? `"${t.display}"` : sans;
  const buttonStyle = tokens?.buttons?.style ?? "classic";
  const imageStyle = tokens?.images?.style ?? "none";
  const cardStyle = tokens?.cards?.style ?? "default";

  const getButtonStyleCss = () => {
    switch (buttonStyle) {
      case "brick":
        return `border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important;`;
      case "bubble":
        return `border-radius: 24px !important;`;
      case "gradient":
        return `background: linear-gradient(135deg, ${primary}, ${primary}99) !important;`;
      case "soft":
        return `background: ${primary}20 !important; color: ${primary} !important;`;
      case "ghost":
        return `background: transparent !important; border: 2px solid ${primary} !important; color: ${primary} !important;`;
      case "solid":
        return `border-radius: ${br}px !important;`;
      case "classic":
      default:
        return `border-radius: ${br}px !important; border: 2px solid ${primary} !important;`;
    }
  };

  const getImageStyleCss = () => {
    switch (imageStyle) {
      case "brick":
        return `.dw-img-styled { border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important; }`;
      case "light":
        return `.dw-img-styled { border-radius: 16px !important; border: 3px solid rgba(255,255,255,0.8) !important; }`;
      case "solid":
        return `.dw-img-styled { border: 4px solid rgba(0,0,0,0.9) !important; }`;
      case "polaroid":
        return `.dw-img-styled { padding: 8px 8px 24px !important; background: #fff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }`;
      case "shadow":
        return `.dw-img-styled { box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important; }`;
      default:
        return "";
    }
  };

  const getCardStyleCss = () => {
    switch (cardStyle) {
      case "brick":
        return `.dw-card-styled { border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important; }`;
      case "solid":
        return `.dw-card-styled { border: 2px solid rgba(0,0,0,0.9) !important; }`;
      case "shadow":
        return `.dw-card-styled { box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; }`;
      default:
        return "";
    }
  };

  return `
html { scroll-behavior: smooth; }

:root {
  --store-bg: ${bg};
  --store-text: ${text};
  --store-primary: ${primary};
  --store-secondary: ${secondary};
  --store-accent: ${accent};
  --store-radius: ${r}px;
  --store-button-radius: ${br}px;
  --store-font-sans: ${sans}, system-ui, -apple-system, sans-serif;
  --store-font-display: ${display}, ${sans}, system-ui, sans-serif;
}

${getImageStyleCss()}
${getCardStyleCss()}

.dw-store, .dw-store * { box-sizing: border-box; }
.dw-store { background: var(--store-bg); color: var(--store-text); font-family: var(--store-font-sans); -webkit-font-smoothing: antialiased; line-height: 1.5; container-type: inline-size; container-name: store; }
.dw-store h1, .dw-store h2, .dw-store h3 { font-family: var(--store-font-display); margin: 0; }
.dw-store p { margin: 0; }
.dw-store img { max-width: 100%; height: auto; display: block; }
.dw-store a { text-decoration: none; color: inherit; }
.dw-store button { font: inherit; cursor: pointer; border: 0; }

.dw-announcement { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; padding: 12px 20px; background: var(--store-primary); color: var(--store-bg); font-size: 13px; font-weight: 500; }
.dw-announcement-item { display: inline-flex; align-items: center; gap: 6px; }
.dw-announcement-icon { font-size: 16px; }
.dw-announcement-pills { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; }
.dw-announcement-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: color-mix(in oklab, var(--store-primary) 10%, transparent); color: var(--store-primary); transition: background 0.15s, transform 0.15s; }
.dw-announcement-pill:hover { background: color-mix(in oklab, var(--store-primary) 18%, transparent); transform: scale(1.02); }

.dw-header { padding: 16px 0; border-bottom: 1px solid rgba(0,0,0,0.05); position: relative; z-index: 100; background: var(--store-bg); }
.dw-header-inner { display: flex; align-items: center; justify-content: space-between; }
.dw-header-logo { display: flex; align-items: center; gap: 10px; font-family: var(--store-font-display); font-size: 20px; font-weight: 600; letter-spacing: -0.02em; text-decoration: none; color: inherit; }
.dw-store .dw-header .dw-header-logo img,
.dw-store .dw-header .dw-header-logo-img,
.dw-store .dw-header-logo img,
.dw-header-logo img,
.dw-header-logo-img { height: 36px !important; width: auto !important; max-width: 160px !important; max-height: 36px !important; object-fit: contain !important; display: block !important; }
.dw-header-name { font-size: 18px; font-weight: 600; }
.dw-header-nav { display: flex; align-items: center; gap: 16px; }
.dw-btn-sm { padding: 8px 16px; font-size: 13px; }

.dw-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.dw-container-narrow { max-width: 820px; margin: 0 auto; padding: 0 20px; }
.dw-section { padding: 56px 0; border-top: 1px solid rgba(0,0,0,0.05); }
.dw-grid-2 { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-text-center { text-align: center; }
.dw-justify-center { justify-content: center; }
.dw-items-center { align-items: center; }
.dw-reverse > *:first-child { order: 2; }

.dw-h1 { font-size: 36px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; }
.dw-h1-display { font-family: var(--store-font-display); }
.dw-h2 { font-size: 26px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 28px; }
.dw-on-dark { color: #fff; }
.dw-sub { font-size: 15px; line-height: 1.55; opacity: 0.75; margin-top: 16px; }
.dw-section-sub { margin-bottom: 32px; opacity: 0.7; }
.dw-mono-kicker { font-family: ui-monospace, "JetBrains Mono", Menlo, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; margin-bottom: 16px; }

.dw-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.dw-store .dw-btn-primary, .dw-store .dw-btn-outline, .dw-store .dw-btn-outline-light, .dw-store .dw-btn-pill {
  display: inline-flex !important; align-items: center !important; justify-content: center !important;
  padding: 12px 22px !important; font-size: 14px !important; font-weight: 600 !important;
  border-radius: var(--store-button-radius) !important; transition: all 0.15s !important;
  text-decoration: none !important; cursor: pointer !important;
}
.dw-store .dw-btn-block { width: 100% !important; padding: 14px 22px !important; margin-top: 16px !important; }
.dw-store .dw-btn-primary { background: var(--store-primary) !important; color: var(--store-bg) !important; border: none !important; }
.dw-store .dw-btn-styled { ${getButtonStyleCss()} }
.dw-store .dw-btn-outline { background: transparent !important; color: var(--store-text) !important; border: 1px solid rgba(0,0,0,0.18) !important; }
.dw-store .dw-btn-outline-light { background: transparent !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.4) !important; }
.dw-store .dw-btn-pill { background: rgba(255,255,255,0.1) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.3) !important; padding: 8px 16px !important; font-size: 12px !important; backdrop-filter: blur(8px) !important; }
.dw-store .dw-btn-primary:hover, .dw-store .dw-btn-outline:hover, .dw-store .dw-btn-outline-light:hover, .dw-store .dw-btn-pill:hover { opacity: 0.85 !important; }

.dw-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; background: var(--store-accent); color: #000; margin-bottom: 20px; }
.dw-badge-glass { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; background: rgba(255,255,255,0.15); color: #fff; backdrop-filter: blur(8px); margin-bottom: 18px; }
.dw-social { font-size: 12px; opacity: 0.6; margin-top: 18px; }

.dw-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.dw-rating .dw-stars { letter-spacing: 2px; font-size: 16px; color: #fbbf24; }
.dw-rating .dw-stars-faded { opacity: 0.3; }
.dw-rating-text { font-size: 13px; font-weight: 500; opacity: 0.8; }

.dw-feature-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; margin-bottom: 8px; }
.dw-feature-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(0,0,0,0.04); border-radius: var(--store-radius); font-size: 13px; font-weight: 500; }
.dw-feature-icon { font-size: 14px; }

.dw-hero { padding: 48px 0; }
.dw-hero-img-square, .dw-hero-img-video, .dw-hero-img-wide { border-radius: var(--store-radius); overflow: hidden; background: rgba(0,0,0,0.05); }
.dw-hero-img-square { aspect-ratio: 1/1; }
.dw-hero-img-video { aspect-ratio: 16/10; margin-top: 36px; }
.dw-hero-img-wide { aspect-ratio: 16/9; margin: 32px 0; }
.dw-hero-img-square img, .dw-hero-img-video img, .dw-hero-img-wide img { width: 100%; height: 100%; object-fit: cover; }
.dw-gradient { background: linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%); width: 100%; height: 100%; }

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

.dw-product-img { aspect-ratio: 1/1; border-radius: var(--store-radius); overflow: hidden; background: rgba(0,0,0,0.05); }
.dw-product-img img { width: 100%; height: 100%; object-fit: cover; }
.dw-price { font-size: 26px; font-weight: 600; margin: 12px 0 4px; }

.dw-bundle-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-bundle { position: relative; padding: 20px; border: 1px solid rgba(0,0,0,0.1); border-radius: var(--store-radius); display: flex; flex-direction: column; transition: transform 0.15s, box-shadow 0.15s; }
.dw-bundle:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.dw-bundle-rec { box-shadow: 0 0 0 2px var(--store-primary); border-color: transparent; }
.dw-bundle-rec:hover { box-shadow: 0 0 0 2px var(--store-primary), 0 8px 24px rgba(0,0,0,0.1); }
.dw-bundle-badge { position: absolute; top: -12px; left: 16px; background: var(--store-primary); color: var(--store-bg); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 9999px; }
.dw-bundle-name { font-size: 17px; font-weight: 600; }
.dw-bundle-desc { font-size: 13px; opacity: 0.65; margin-top: 4px; }
.dw-bundle-price { font-size: 28px; font-weight: 600; margin: 18px 0 4px; }
.dw-bundle-meta { font-size: 12px; opacity: 0.6; }

.dw-bundle-list .dw-bundle { display: flex; align-items: center; flex-direction: row; gap: 16px; border-radius: 0; border-bottom: 1px solid rgba(0,0,0,0.05); border-left: none; border-right: none; border-top: none; }
.dw-bundle-showcase { display: grid; grid-template-columns: 1fr; gap: 20px; }

.dw-faq-list { }
.dw-faq-item { border-bottom: 1px solid rgba(0,0,0,0.05); padding: 18px 0; transition: background 0.15s; }
.dw-faq-item summary { cursor: pointer; font-size: 15px; font-weight: 500; list-style: none; transition: color 0.15s; }
.dw-faq-item summary:hover { color: var(--store-primary); }
.dw-faq-item summary::-webkit-details-marker { display: none; }
.dw-faq-item summary::after { content: '+'; float: right; font-size: 18px; opacity: 0.5; transition: transform 0.2s; }
.dw-faq-item[open] summary::after { content: '−'; transform: rotate(180deg); }
.dw-faq-answer { margin-top: 12px; font-size: 14px; line-height: 1.6; opacity: 0.75; }
.dw-faq-cards { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-faq-cards .dw-faq-item { border: 1px solid rgba(0,0,0,0.1); border-radius: var(--store-radius); padding: 18px 20px; transition: transform 0.15s, box-shadow 0.15s; }
.dw-faq-cards .dw-faq-item:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
.dw-grid-faq-twocol { display: grid; grid-template-columns: 1fr; gap: 28px; }

.dw-trust { padding: 32px 0; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(0,0,0,0.02); }
.dw-trust .dw-container { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-trust-item { font-size: 14px; opacity: 0.85; }

.dw-prop-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
.dw-prop { text-align: center; }
.dw-icon { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--store-radius); background: color-mix(in oklab, var(--store-accent) 18%, transparent); color: var(--store-primary); font-size: 22px; margin-bottom: 14px; }
.dw-icon svg { width: 24px; height: 24px; stroke: currentColor; }
.dw-icon-placeholder { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: color-mix(in srgb, var(--store-primary) 12%, transparent); color: var(--store-primary); border-radius: 6px; font-size: 14px; }
.dw-marquee-icon svg, .dw-announcement-icon svg { width: 16px; height: 16px; stroke: currentColor; }
.dw-ph-side-icon svg, .dw-ph-benefit-icon svg, .dw-ph-trust-icon svg { width: 18px; height: 18px; stroke: currentColor; }
.dw-feature-icon svg, .dw-prod-feature-icon svg, .dw-prod-side-icon svg { width: 16px; height: 16px; stroke: currentColor; }
.dw-how-icon svg { width: 24px; height: 24px; stroke: currentColor; }
.dw-prop-title { font-size: 17px; font-weight: 600; }
.dw-prop-desc { font-size: 14px; line-height: 1.55; opacity: 0.7; margin-top: 6px; }

.dw-testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.dw-testimonial { padding: 24px; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--store-radius); transition: transform 0.15s, box-shadow 0.15s; }
.dw-testimonial:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.dw-stars { letter-spacing: 2px; font-size: 14px; margin-bottom: 12px; color: var(--store-text); }
.dw-stars-faded { opacity: 0.3; }
.dw-quote { font-size: 15px; line-height: 1.55; }
.dw-cite { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05); }
.dw-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, var(--store-accent), var(--store-primary)); flex-shrink: 0; }
.dw-avatar img { width: 100%; height: 100%; object-fit: cover; }
.dw-cite-name { font-size: 14px; font-weight: 500; }
.dw-cite-role { font-size: 12px; opacity: 0.6; }

.dw-lifestyle-img { aspect-ratio: 4/5; border-radius: var(--store-radius); overflow: hidden; }
.dw-lifestyle-img img { width: 100%; height: 100%; object-fit: cover; }

.dw-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.dw-gallery-item { position: relative; aspect-ratio: 1/1; overflow: hidden; border-radius: var(--store-radius); margin: 0; }
.dw-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.dw-gallery-item figcaption { position: absolute; inset-inline: 0; bottom: 0; padding: 10px; font-size: 11px; font-weight: 500; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,0.6)); }

.dw-footer { border-top: 1px solid rgba(0,0,0,0.08); padding: 32px 0 28px; font-size: 12px; }
.dw-footer-main { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.dw-footer-brand { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.dw-footer-logo-img { height: 32px; max-width: 140px; width: auto; object-fit: contain; }
.dw-footer-name { font-size: 15px; font-weight: 600; }
.dw-footer-tagline { font-size: 12px; opacity: 0.6; }
.dw-footer-payments { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; }
.dw-footer-payment { display: flex; align-items: center; justify-content: center; width: 56px; height: 40px; border: 1px solid rgba(0,0,0,0.1); background: #fff; border-radius: 6px; padding: 6px; overflow: hidden; }
.dw-footer-payment img { height: 20px; width: auto; object-fit: contain; }
.dw-footer-bottom { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); font-size: 11px; opacity: 0.5; }
.dw-footer-link { text-decoration: underline; }
@container store (min-width: 640px) {
  .dw-footer-main { flex-direction: row; justify-content: space-between; align-items: flex-start; }
  .dw-footer-brand { align-items: flex-start; }
  .dw-footer-bottom { flex-direction: row; justify-content: space-between; }
}

.dw-video-section { padding: 56px 0; }
.dw-video-wrap { position: relative; aspect-ratio: 16/9; border-radius: var(--store-radius); overflow: hidden; background: rgba(0,0,0,0.05); }
.dw-video-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
.dw-video-native { width: 100%; height: 100%; object-fit: cover; }
.dw-video-caption { margin-top: 16px; text-align: center; font-size: 13px; opacity: 0.6; }

.dw-marquee { overflow: hidden; padding: 14px 0; background: var(--store-primary); color: var(--store-bg); }
.dw-marquee-track { display: flex; gap: 32px; animation: dw-marquee 25s linear infinite; white-space: nowrap; }
.dw-marquee:hover .dw-marquee-track { animation-play-state: paused; }
.dw-marquee-item { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; flex-shrink: 0; padding: 0 8px; }
.dw-marquee-icon { font-size: 16px; }
@keyframes dw-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.dw-how-grid { display: grid; gap: 20px; }
.dw-how-cards { grid-template-columns: 1fr; }
.dw-how-step { padding: 24px; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--store-radius); }
.dw-how-card { text-align: center; }
.dw-how-icon { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--store-radius); background: color-mix(in oklab, var(--store-accent) 18%, transparent); color: var(--store-primary); font-size: 22px; margin-bottom: 14px; }
.dw-how-num { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--store-primary); color: var(--store-bg); font-size: 14px; font-weight: 700; margin-bottom: 12px; flex-shrink: 0; }
.dw-how-title { font-size: 16px; font-weight: 600; }
.dw-how-desc { font-size: 14px; line-height: 1.55; opacity: 0.7; margin-top: 6px; }
.dw-how-numbered { display: flex; align-items: flex-start; gap: 16px; }
.dw-how-numbered .dw-how-num { margin-bottom: 0; margin-top: 2px; }
.dw-how-timeline { display: flex; align-items: flex-start; gap: 16px; position: relative; padding-left: 24px; }
.dw-how-dot { position: absolute; left: 0; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--store-primary); }
.dw-how-timeline::before { content: ''; position: absolute; left: 5px; top: 22px; width: 2px; height: calc(100% + 8px); background: rgba(0,0,0,0.1); }
.dw-how-timeline:last-child::before { display: none; }

.dw-review-stats { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 20px; background: rgba(0,0,0,0.02); font-size: 14px; font-weight: 500; }
.dw-review-stars { letter-spacing: 2px; color: #fbbf24; }

.dw-hero-product { padding: 0; }
.dw-ph-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.dw-ph-brand { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
.dw-ph-header-btn { padding: 8px 16px; font-size: 12px; font-weight: 500; border: 1px solid rgba(0,0,0,0.1); border-radius: var(--store-radius); background: rgba(255,255,255,0.8); }
.dw-ph-grid { display: grid; grid-template-columns: 1fr; gap: 32px; padding: 40px 20px 48px; }
.dw-ph-left { order: 1; }
.dw-ph-right { order: 2; }
.dw-ph-img-wrap { display: flex; gap: 12px; }
.dw-ph-side-cards { display: none; flex-direction: column; gap: 12px; width: 110px; flex-shrink: 0; }
.dw-ph-side-cards-mobile { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 16px; }
.dw-ph-side-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.06); border-radius: var(--store-radius); box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: box-shadow 0.2s; }
.dw-ph-side-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.dw-ph-side-icon { font-size: 24px; }
.dw-ph-side-label { font-size: 11px; font-weight: 500; text-align: center; line-height: 1.3; }
.dw-ph-main-img { position: relative; flex: 1; aspect-ratio: 1/1; border-radius: var(--store-radius); overflow: hidden; }
.dw-ph-main-img img { width: 100%; height: 100%; object-fit: cover; }
.dw-ph-img-badge { position: absolute; right: 12px; top: 12px; display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(255,255,255,0.95); border-radius: var(--store-radius); box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.dw-ph-thumbs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
.dw-ph-thumb { aspect-ratio: 4/3; border-radius: var(--store-radius); overflow: hidden; }
.dw-ph-thumb img { width: 100%; height: 100%; object-fit: cover; }
.dw-ph-rating { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 13px; font-weight: 500; }
.dw-ph-rating-bar { display: inline-flex; padding: 3px 8px; background: #16a34a; border-radius: 4px; color: #fff; font-size: 10px; letter-spacing: 1px; }
.dw-ph-rating[data-source="trustpilot"] .dw-ph-rating-bar { background: #00b67a; }
.dw-ph-rating[data-source="google"] .dw-ph-rating-bar { background: #fff; border: 1px solid #e5e7eb; color: #f59e0b; }
.dw-ph-rating[data-source="judgeme"] .dw-ph-rating-bar { background: #6366f1; }
.dw-ph-rating[data-source="loox"] .dw-ph-rating-bar { background: #ff6b00; }
.dw-ph-rating[data-source="customers"] .dw-ph-rating-bar { background: #16a34a; }
.dw-ph-headline { font-size: 26px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0; }
.dw-ph-price { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 16px; }
.dw-ph-price-current { font-size: 28px; font-weight: 700; color: var(--store-primary); }
.dw-ph-price-old { font-size: 18px; color: rgba(0,0,0,0.4); text-decoration: line-through; }
.dw-ph-stock { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 9999px; font-size: 11px; font-weight: 600; color: #16a34a; }
.dw-ph-stock::before { content: ''; width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }
.dw-ph-benefits { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.dw-ph-benefit { display: flex; align-items: flex-start; gap: 10px; }
.dw-ph-benefit-icon { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: var(--store-primary); color: var(--store-bg); border-radius: 50%; font-size: 11px; flex-shrink: 0; margin-top: 2px; }
.dw-ph-benefit span:last-child { font-size: 14px; font-weight: 500; line-height: 1.4; }
.dw-ph-form { margin-top: 24px; }
.dw-store .dw-ph-cta { width: 100% !important; padding: 16px 24px !important; background: var(--store-primary) !important; color: var(--store-bg) !important; border: none !important; border-radius: var(--store-radius) !important; font-size: 15px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; cursor: pointer !important; transition: transform 0.1s !important; }
.dw-store .dw-ph-cta:hover { transform: scale(1.01) !important; }
.dw-ph-quick-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; margin-top: 16px; }
.dw-ph-quick { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: rgba(0,0,0,0.7); }
.dw-ph-quick-check { color: rgba(0,0,0,0.5); }
.dw-ph-faqs { margin-top: 20px; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--store-radius); overflow: hidden; background: #fff; }
.dw-ph-faq { border-bottom: 1px solid rgba(0,0,0,0.05); }
.dw-ph-faq:last-child { border-bottom: none; }
.dw-ph-faq summary { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; cursor: pointer; font-size: 14px; font-weight: 500; list-style: none; }
.dw-ph-faq summary::-webkit-details-marker { display: none; }
.dw-ph-faq summary::after { content: '+'; font-size: 18px; color: rgba(0,0,0,0.4); }
.dw-ph-faq[open] summary::after { content: '−'; }
.dw-ph-faq-answer { padding: 0 16px 14px; font-size: 13px; line-height: 1.55; color: rgba(0,0,0,0.65); }
.dw-ph-trust-cards { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 20px; }
.dw-ph-trust-card { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--store-radius); box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: box-shadow 0.2s, transform 0.2s; }
.dw-ph-trust-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
.dw-ph-trust-icon { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--store-primary); color: var(--store-bg); border-radius: 10px; font-size: 18px; flex-shrink: 0; }
.dw-ph-trust-title { font-size: 13px; font-weight: 600; color: var(--store-primary); }
.dw-ph-trust-desc { font-size: 12px; line-height: 1.4; color: rgba(0,0,0,0.6); margin-top: 2px; }
.dw-ph-bottom-msg { display: flex; align-items: center; gap: 8px; margin-top: 20px; font-size: 13px; font-weight: 500; }

.dw-prod { border-top: 1px solid color-mix(in srgb, var(--store-text) 5%, transparent); padding: 48px 20px; }
.dw-prod-grid { display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 1200px; margin: 0 auto; }
.dw-prod-info { }
.dw-prod-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.dw-prod-rating .dw-stars { letter-spacing: 2px; font-size: 14px; color: #fbbf24; }
.dw-prod-rating .dw-stars-faded { opacity: 0.3; }
.dw-prod-rating .dw-rating-text { font-size: 13px; color: color-mix(in srgb, var(--store-text) 60%, transparent); }
.dw-prod-title { font-size: 26px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
.dw-prod-title-lg { font-size: 32px; }
.dw-prod-subtitle { margin-top: 6px; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.5; }
.dw-prod-price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; margin-top: 16px; }
.dw-prod-price-current { font-size: 28px; font-weight: 600; }
.dw-prod-price-original { font-size: 16px; color: color-mix(in srgb, var(--store-text) 40%, transparent); text-decoration: line-through; }
.dw-prod-badge { display: inline-flex; align-items: center; border-radius: 9999px; padding: 4px 10px; background: var(--store-primary); color: var(--store-bg); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.dw-prod-desc { margin-top: 16px; font-size: 14px; line-height: 1.6; opacity: 0.75; max-width: 480px; }
.dw-prod-features { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.dw-prod-feature { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid color-mix(in srgb, var(--store-text) 8%, transparent); background: color-mix(in srgb, var(--store-text) 2%, transparent); border-radius: 9999px; font-size: 12px; font-weight: 500; }
.dw-prod-feature-icon { font-size: 14px; }
.dw-prod-form { margin-top: 24px; }
.dw-store .dw-prod-cta { width: 100% !important; padding: 14px 20px !important; background: var(--store-primary) !important; color: var(--store-bg) !important; border: none !important; border-radius: var(--store-button-radius) !important; font-size: 14px !important; font-weight: 600 !important; cursor: pointer !important; transition: opacity 0.15s !important; }
.dw-store .dw-prod-cta:hover { opacity: 0.9 !important; }
.dw-payment-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.dw-payment-badge { display: flex; align-items: center; justify-content: center; width: 56px; height: 40px; border: 1px solid color-mix(in srgb, var(--store-text) 8%, transparent); background: #fff; border-radius: 6px; padding: 6px; }
.dw-payment-badge svg { width: 100%; height: 100%; }
.dw-payment-badge img { height: 20px; width: auto; }
.dw-prod-gallery { display: flex; flex-direction: column; gap: 12px; }
.dw-prod-thumbs { display: flex; gap: 8px; order: 2; overflow-x: auto; padding-bottom: 4px; }
.dw-prod-thumb { width: 56px; height: 56px; flex-shrink: 0; border-radius: calc(var(--store-radius) * 0.5); overflow: hidden; opacity: 0.6; cursor: pointer; transition: opacity 0.15s; border: 2px solid transparent; }
.dw-prod-thumb.active { opacity: 1; border-color: var(--store-primary); }
.dw-prod-thumb:hover { opacity: 1; }
.dw-prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
.dw-prod-main-img { order: 1; flex: 1; aspect-ratio: 1/1; border-radius: var(--store-radius); overflow: hidden; background: color-mix(in srgb, var(--store-text) 3%, transparent); }
.dw-prod-main-img img { width: 100%; height: 100%; object-fit: cover; }
.dw-prod-compact { text-align: center; }
.dw-prod-compact-inner { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.dw-prod-compact .dw-prod-desc { max-width: 520px; }
.dw-prod-compact .dw-prod-form { width: auto; }
.dw-store .dw-prod-compact .dw-prod-cta { width: auto !important; padding: 14px 32px !important; }
.dw-prod-compact .dw-payment-badges { justify-content: center; }
.dw-prod-gallery-variant { }
.dw-prod-gallery-grid { display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 1200px; margin: 0 auto; }
.dw-prod-gallery-left { }
.dw-prod-gallery-right { display: flex; flex-direction: column; justify-content: center; }
.dw-prod-main-img-wrap { position: relative; aspect-ratio: 1/1; border-radius: var(--store-radius); overflow: hidden; }
.dw-prod-hero-img { width: 100%; height: 100%; object-fit: cover; }
.dw-prod-img-badge { position: absolute; left: 12px; top: 12px; display: inline-flex; align-items: center; border-radius: 9999px; padding: 6px 12px; background: var(--store-primary); color: var(--store-bg); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.dw-prod-thumb-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
.dw-prod-thumb-btn { aspect-ratio: 1/1; border-radius: calc(var(--store-radius) * 0.6); overflow: hidden; opacity: 0.6; cursor: pointer; transition: opacity 0.15s; border: 2px solid transparent; }
.dw-prod-thumb-btn.active { opacity: 1; border-color: var(--store-primary); }
.dw-prod-thumb-btn:hover { opacity: 1; }
.dw-prod-thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
.dw-prod-rich { }
.dw-prod-rich-grid { display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 1300px; margin: 0 auto; }
.dw-prod-rich-with-side { }
.dw-prod-side-features { display: none; flex-direction: column; gap: 12px; }
.dw-prod-side-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; background: var(--store-bg); border: 1px solid color-mix(in srgb, var(--store-text) 8%, transparent); border-radius: var(--store-radius); box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; transition: all 0.2s; }
.dw-prod-side-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.dw-prod-side-icon { font-size: 24px; color: var(--store-primary); }
.dw-prod-side-label { font-size: 12px; font-weight: 600; line-height: 1.3; }
.dw-prod-rich-center { }
.dw-prod-side-mobile { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 16px; }
.dw-prod-side-mobile .dw-prod-side-features { display: contents; }
.dw-prod-rich-right { }
.dw-prod-rich-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 40px; }
.dw-prod-rich-gallery-img { aspect-ratio: 1/1; border-radius: var(--store-radius); overflow: hidden; transition: transform 0.2s; }
.dw-prod-rich-gallery-img:hover { transform: scale(1.02); }
.dw-prod-rich-gallery-img img { width: 100%; height: 100%; object-fit: cover; }

@container store (min-width: 768px) {
  .dw-section { padding: 80px 0; }
  .dw-container, .dw-container-narrow { padding: 0 48px; }
  .dw-header-logo img, .dw-header-logo-img { height: 40px !important; max-height: 40px !important; max-width: 200px !important; }
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
  .dw-ph-grid { grid-template-columns: 1fr 1fr; gap: 48px; padding: 48px 48px 64px; }
  .dw-ph-left { order: 1; }
  .dw-ph-right { order: 2; }
  .dw-ph-side-cards { display: flex; }
  .dw-ph-side-cards-mobile { display: none; }
  .dw-ph-headline { font-size: 32px; }
  .dw-ph-price-current { font-size: 32px; }
  .dw-ph-thumbs { grid-template-columns: repeat(3, 1fr); }
  .dw-ph-trust-cards { grid-template-columns: repeat(2, 1fr); }
  .dw-ph-header { padding: 20px 48px; }
  .dw-how-cards { grid-template-columns: repeat(3, 1fr); }
  .dw-video-section { padding: 80px 0; }
  .dw-prod { padding: 64px 48px; }
  .dw-prod-grid { grid-template-columns: 1.1fr 1fr; gap: 48px; }
  .dw-prod-gallery { flex-direction: row; gap: 16px; }
  .dw-prod-thumbs { flex-direction: column; order: 1; width: 72px; overflow-y: auto; overflow-x: hidden; padding-bottom: 0; }
  .dw-prod-thumb { width: 72px; height: 72px; }
  .dw-prod-main-img { order: 2; }
  .dw-prod-title { font-size: 32px; }
  .dw-prod-price-current { font-size: 34px; }
  .dw-prod-gallery-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  .dw-prod-title-lg { font-size: 36px; }
  .dw-prod-rich-grid { gap: 24px; }
  .dw-prod-rich-with-side { grid-template-columns: 120px 1fr 1fr; }
  .dw-prod-rich-grid:not(.dw-prod-rich-with-side) { grid-template-columns: 1fr 1fr; }
  .dw-prod-side-features { display: flex; }
  .dw-prod-side-mobile { display: none; }
  .dw-prod-rich-gallery { grid-template-columns: repeat(4, 1fr); gap: 16px; }
}
@container store (min-width: 1024px) {
  .dw-bundle-grid { grid-template-columns: repeat(4, 1fr); }
  .dw-gallery-grid { grid-template-columns: repeat(4, 1fr); }
  .dw-h1 { font-size: 72px; }
  .dw-ph-headline { font-size: 36px; }
  .dw-how-cards { grid-template-columns: repeat(4, 1fr); }
  .dw-prod-title { font-size: 36px; }
  .dw-prod-title-lg { font-size: 42px; }
}
`.trim();
}
