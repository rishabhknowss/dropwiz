import { SITE_URL } from "./constants";

export type ComparisonItem = {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  pricing?: string;
  rating?: number;
};

export type Comparison = {
  slug: string;
  title: string;
  description: string;
  question: string;
  lastUpdated: string;
  category: string;
  keywords: string[];
  itemA: ComparisonItem;
  itemB: ComparisonItem;
  verdict: string;
  criteria: Array<{
    name: string;
    itemAScore: number;
    itemBScore: number;
    notes: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const comparisons: Record<string, Comparison> = {
  "dropshipping-vs-print-on-demand": {
    slug: "dropshipping-vs-print-on-demand",
    title: "Dropshipping vs Print on Demand: Which is Better in 2026?",
    description:
      "Compare dropshipping and print on demand business models. Learn the pros, cons, and which is right for your e-commerce business.",
    question: "Should I start with dropshipping or print on demand?",
    lastUpdated: "2026-05-01",
    category: "business-models",
    keywords: [
      "dropshipping vs print on demand",
      "pod vs dropshipping",
      "print on demand or dropshipping",
    ],
    itemA: {
      name: "Dropshipping",
      description:
        "Sell products without inventory by having suppliers ship directly to customers.",
      pros: [
        "Massive product selection",
        "Easy to test new products",
        "Lower learning curve",
        "Quick to start",
        "No design skills needed",
      ],
      cons: [
        "Lower profit margins (15-30%)",
        "High competition on same products",
        "Longer shipping times",
        "Less brand differentiation",
        "Quality control challenges",
      ],
      bestFor:
        "Beginners who want to test e-commerce with minimal investment and no design skills",
      pricing: "$100-500 to start",
      rating: 4.2,
    },
    itemB: {
      name: "Print on Demand",
      description:
        "Sell custom-designed products that are printed only when ordered.",
      pros: [
        "Higher profit margins (30-50%)",
        "Unique, branded products",
        "Build a real brand",
        "No inventory risk",
        "Creative freedom",
      ],
      cons: [
        "Design skills required",
        "Limited product types",
        "Longer production times",
        "Higher per-unit costs",
        "More work per product",
      ],
      bestFor:
        "Creative entrepreneurs who want to build a unique brand with higher margins",
      pricing: "$100-300 to start",
      rating: 4.4,
    },
    verdict:
      "Choose dropshipping if you want quick validation and massive product variety. Choose print on demand if you have design skills and want higher margins with brand differentiation. Many successful entrepreneurs do both.",
    criteria: [
      {
        name: "Startup Cost",
        itemAScore: 4,
        itemBScore: 5,
        notes: "Both are low-cost to start, POD slightly lower",
      },
      {
        name: "Profit Margins",
        itemAScore: 3,
        itemBScore: 5,
        notes: "POD typically offers 30-50% vs dropshipping 15-30%",
      },
      {
        name: "Product Variety",
        itemAScore: 5,
        itemBScore: 2,
        notes: "Dropshipping offers unlimited products, POD limited to printables",
      },
      {
        name: "Brand Building",
        itemAScore: 2,
        itemBScore: 5,
        notes: "POD allows unique designs, dropshipping sells same products as others",
      },
      {
        name: "Ease of Start",
        itemAScore: 5,
        itemBScore: 3,
        notes: "Dropshipping requires no design, POD needs creative skills",
      },
      {
        name: "Shipping Speed",
        itemAScore: 3,
        itemBScore: 3,
        notes: "Both typically 7-14 days unless using local suppliers",
      },
    ],
    faqs: [
      {
        question: "Can I do both dropshipping and print on demand?",
        answer:
          "Yes! Many successful stores combine both models. You might sell POD apparel alongside dropshipped accessories. This diversifies your product range and revenue streams.",
      },
      {
        question: "Which is more profitable: dropshipping or POD?",
        answer:
          "Print on demand typically has higher per-item margins (30-50% vs 15-30%), but dropshipping can be more profitable at scale due to product variety and faster testing cycles.",
      },
      {
        question: "Is print on demand easier than dropshipping?",
        answer:
          "Dropshipping is generally easier to start since you don't need design skills. However, POD can be easier to sustain since you have unique products and less direct competition.",
      },
    ],
  },
  "shopify-vs-woocommerce": {
    slug: "shopify-vs-woocommerce",
    title: "Shopify vs WooCommerce 2026: Complete Comparison",
    description:
      "Detailed comparison of Shopify and WooCommerce for e-commerce. Features, pricing, pros and cons to help you choose the right platform.",
    question: "Should I use Shopify or WooCommerce for my store?",
    lastUpdated: "2026-05-01",
    category: "platforms",
    keywords: [
      "shopify vs woocommerce",
      "woocommerce vs shopify",
      "best ecommerce platform",
    ],
    itemA: {
      name: "Shopify",
      description:
        "All-in-one hosted e-commerce platform with everything included.",
      pros: [
        "Easy setup (launch in hours)",
        "No technical skills needed",
        "Built-in hosting and security",
        "24/7 customer support",
        "Massive app ecosystem",
        "Mobile-optimized by default",
      ],
      cons: [
        "Monthly fees add up",
        "Transaction fees (unless using Shopify Payments)",
        "Less customization flexibility",
        "Locked into platform",
        "Advanced features cost extra",
      ],
      bestFor:
        "Beginners and businesses that want a turnkey solution without technical hassle",
      pricing: "$29-299/month + transaction fees",
      rating: 4.6,
    },
    itemB: {
      name: "WooCommerce",
      description:
        "Free WordPress plugin that turns any site into an online store.",
      pros: [
        "Free core software",
        "Complete customization control",
        "No transaction fees",
        "Own your data completely",
        "Thousands of themes and plugins",
        "SEO advantages",
      ],
      cons: [
        "Technical knowledge required",
        "Must handle hosting separately",
        "Security is your responsibility",
        "Plugin conflicts possible",
        "Steeper learning curve",
      ],
      bestFor:
        "Tech-savvy users who want full control and already use WordPress",
      pricing: "Free (but hosting $10-50/month, plugins extra)",
      rating: 4.3,
    },
    verdict:
      "Choose Shopify if you want simplicity and are willing to pay for convenience. Choose WooCommerce if you want full control, have technical skills, or already have a WordPress site. For most dropshippers, Shopify's ease of use makes it the better choice.",
    criteria: [
      {
        name: "Ease of Use",
        itemAScore: 5,
        itemBScore: 3,
        notes: "Shopify is plug-and-play, WooCommerce needs setup",
      },
      {
        name: "Pricing",
        itemAScore: 3,
        itemBScore: 4,
        notes: "WooCommerce can be cheaper but has hidden costs",
      },
      {
        name: "Customization",
        itemAScore: 3,
        itemBScore: 5,
        notes: "WooCommerce offers unlimited customization",
      },
      {
        name: "App Ecosystem",
        itemAScore: 5,
        itemBScore: 5,
        notes: "Both have thousands of extensions",
      },
      {
        name: "Dropshipping Support",
        itemAScore: 5,
        itemBScore: 4,
        notes: "Shopify has better dropshipping app integrations",
      },
      {
        name: "Scalability",
        itemAScore: 5,
        itemBScore: 4,
        notes: "Both scale well, Shopify handles hosting automatically",
      },
    ],
    faqs: [
      {
        question: "Is WooCommerce really free?",
        answer:
          "The core WooCommerce plugin is free, but you'll need hosting ($10-50/month), a domain ($12/year), and likely premium themes/plugins. Total cost is often similar to Shopify for a full-featured store.",
      },
      {
        question: "Can I switch from Shopify to WooCommerce later?",
        answer:
          "Yes, you can migrate, but it requires effort. Tools like Cart2Cart can help transfer products and customers. Consider your long-term needs before choosing.",
      },
      {
        question: "Which is better for SEO?",
        answer:
          "WooCommerce has a slight edge due to WordPress's SEO capabilities and plugins like Yoast. However, Shopify's built-in SEO is solid and sufficient for most stores.",
      },
    ],
  },
  "aliexpress-vs-alibaba": {
    slug: "aliexpress-vs-alibaba",
    title: "AliExpress vs Alibaba: Which to Use for Sourcing Products?",
    description:
      "Compare AliExpress and Alibaba for product sourcing. Learn when to use each platform for dropshipping and wholesale.",
    question: "Should I source from AliExpress or Alibaba?",
    lastUpdated: "2026-05-01",
    category: "sourcing",
    keywords: [
      "aliexpress vs alibaba",
      "alibaba or aliexpress",
      "where to source products",
    ],
    itemA: {
      name: "AliExpress",
      description:
        "Consumer-focused marketplace for single-unit purchases and dropshipping.",
      pros: [
        "No minimum order quantity",
        "Buyer protection program",
        "Easy dropshipping integration",
        "Individual item shipping",
        "Good for product testing",
      ],
      cons: [
        "Higher per-unit prices",
        "Longer shipping times",
        "Less negotiation room",
        "Limited customization",
        "Inconsistent quality",
      ],
      bestFor:
        "Dropshippers and those testing products before committing to bulk orders",
      pricing: "Retail prices, no minimums",
      rating: 4.1,
    },
    itemB: {
      name: "Alibaba",
      description:
        "B2B marketplace connecting businesses with manufacturers for bulk orders.",
      pros: [
        "Lowest wholesale prices",
        "Direct manufacturer access",
        "Product customization",
        "Private labeling options",
        "Trade assurance protection",
      ],
      cons: [
        "Minimum order quantities (50-1000+)",
        "Higher upfront investment",
        "Longer lead times",
        "More complex process",
        "Communication challenges",
      ],
      bestFor:
        "Established businesses ready to buy in bulk and create private label products",
      pricing: "Wholesale prices, MOQs required",
      rating: 4.3,
    },
    verdict:
      "Start with AliExpress for testing and validation. Move to Alibaba once you've proven demand and want better margins through bulk purchasing or private labeling.",
    criteria: [
      {
        name: "Pricing",
        itemAScore: 2,
        itemBScore: 5,
        notes: "Alibaba offers 30-70% lower prices on bulk orders",
      },
      {
        name: "Minimum Orders",
        itemAScore: 5,
        itemBScore: 2,
        notes: "AliExpress allows single units, Alibaba requires MOQs",
      },
      {
        name: "Customization",
        itemAScore: 1,
        itemBScore: 5,
        notes: "Alibaba allows full product customization",
      },
      {
        name: "Ease of Use",
        itemAScore: 5,
        itemBScore: 3,
        notes: "AliExpress is straightforward, Alibaba requires negotiation",
      },
      {
        name: "Dropship Friendly",
        itemAScore: 5,
        itemBScore: 2,
        notes: "AliExpress built for dropshipping, Alibaba is B2B",
      },
      {
        name: "Quality Control",
        itemAScore: 3,
        itemBScore: 4,
        notes: "Both vary, Alibaba allows factory audits",
      },
    ],
    faqs: [
      {
        question: "Can I dropship from Alibaba?",
        answer:
          "While possible, Alibaba isn't designed for dropshipping. Most suppliers have MOQs and don't ship individual orders. Use AliExpress or find Alibaba suppliers who explicitly offer dropshipping.",
      },
      {
        question: "When should I switch from AliExpress to Alibaba?",
        answer:
          "Consider Alibaba when you're selling 50+ units per month of a product. The bulk discount savings offset the MOQ investment, and you can negotiate better terms.",
      },
      {
        question: "Are Alibaba and AliExpress the same company?",
        answer:
          "Yes, both are owned by Alibaba Group. AliExpress targets consumers and small businesses, while Alibaba.com focuses on B2B wholesale trade.",
      },
    ],
  },
  "facebook-ads-vs-tiktok-ads": {
    slug: "facebook-ads-vs-tiktok-ads",
    title: "Facebook Ads vs TikTok Ads for E-commerce 2026",
    description:
      "Compare Facebook and TikTok advertising for dropshipping. Learn costs, targeting, and which platform is right for your products.",
    question: "Should I advertise on Facebook or TikTok?",
    lastUpdated: "2026-05-01",
    category: "advertising",
    keywords: [
      "facebook ads vs tiktok ads",
      "tiktok vs facebook advertising",
      "best ads for dropshipping",
    ],
    itemA: {
      name: "Facebook Ads",
      description:
        "Meta's advertising platform covering Facebook, Instagram, and Messenger.",
      pros: [
        "Mature, sophisticated platform",
        "Advanced targeting options",
        "Proven for e-commerce",
        "Large user base (3B+)",
        "Strong retargeting capabilities",
        "Better for older demographics",
      ],
      cons: [
        "Higher CPMs ($10-20)",
        "Ad fatigue common",
        "Privacy changes impacted tracking",
        "More competitive",
        "Creative burnout faster",
      ],
      bestFor:
        "Established brands, products with broader appeal, retargeting campaigns",
      pricing: "CPM: $10-20, CPC: $0.50-2.00",
      rating: 4.3,
    },
    itemB: {
      name: "TikTok Ads",
      description:
        "TikTok's advertising platform with native video ad formats.",
      pros: [
        "Lower CPMs ($5-12)",
        "Viral potential",
        "Highly engaged audience",
        "Native-feeling ads work well",
        "Growing user base",
        "TikTok Shop integration",
      ],
      cons: [
        "Younger audience skews",
        "Less mature platform",
        "Requires video content",
        "Less targeting precision",
        "Shorter attention spans",
      ],
      bestFor:
        "Trendy products, visual products, younger audiences, viral marketing",
      pricing: "CPM: $5-12, CPC: $0.30-1.00",
      rating: 4.2,
    },
    verdict:
      "Use both platforms strategically. TikTok for awareness and viral potential with lower costs. Facebook for retargeting and reaching broader demographics. Start with TikTok if targeting Gen Z, Facebook for 30+.",
    criteria: [
      {
        name: "Cost Efficiency",
        itemAScore: 3,
        itemBScore: 5,
        notes: "TikTok CPMs are 30-50% lower",
      },
      {
        name: "Targeting",
        itemAScore: 5,
        itemBScore: 3,
        notes: "Facebook has more granular targeting options",
      },
      {
        name: "Creative Format",
        itemAScore: 4,
        itemBScore: 5,
        notes: "TikTok native content feels less like ads",
      },
      {
        name: "Audience Size",
        itemAScore: 5,
        itemBScore: 4,
        notes: "Meta platforms have larger total reach",
      },
      {
        name: "E-commerce Features",
        itemAScore: 5,
        itemBScore: 4,
        notes: "Both have shop integration, Facebook more mature",
      },
      {
        name: "Learning Curve",
        itemAScore: 3,
        itemBScore: 4,
        notes: "TikTok is simpler to start, Facebook more complex",
      },
    ],
    faqs: [
      {
        question: "Which platform is better for beginners?",
        answer:
          "TikTok is often easier for beginners due to lower costs and simpler ad creation. However, Facebook's learning resources are more extensive. Start with $50-100/day on either to learn.",
      },
      {
        question: "Can I use the same ads on both platforms?",
        answer:
          "Not recommended. TikTok users expect native, authentic content. Polished Facebook ads often underperform on TikTok. Create platform-specific creatives for best results.",
      },
      {
        question: "How much should I budget for testing?",
        answer:
          "Allocate $300-500 per platform for initial testing. This allows enough data to determine if a product has potential before scaling or moving on.",
      },
    ],
  },
  "general-store-vs-niche-store": {
    slug: "general-store-vs-niche-store",
    title: "General Store vs Niche Store: Which Dropshipping Model Wins?",
    description:
      "Compare general stores and niche stores for dropshipping. Learn the pros and cons of each approach and which is right for you.",
    question: "Should I start a general store or niche store?",
    lastUpdated: "2026-05-01",
    category: "strategy",
    keywords: [
      "general store vs niche store",
      "dropshipping niche store",
      "general dropshipping store",
    ],
    itemA: {
      name: "General Store",
      description:
        "A store selling products across multiple categories without a specific focus.",
      pros: [
        "Test many products quickly",
        "Not limited to one niche",
        "Find winners faster",
        "Pivot easily",
        "Good for learning",
      ],
      cons: [
        "No brand identity",
        "Lower customer loyalty",
        "Harder to market",
        "Lower conversion rates",
        "Difficult to build email list",
      ],
      bestFor: "Beginners testing products and learning what sells",
      pricing: "Same startup costs",
      rating: 3.8,
    },
    itemB: {
      name: "Niche Store",
      description:
        "A store focused on a specific product category or audience.",
      pros: [
        "Stronger brand identity",
        "Higher customer loyalty",
        "Better SEO potential",
        "Easier to market",
        "Higher conversion rates",
        "Build email list easily",
      ],
      cons: [
        "Limited to one market",
        "Higher risk if niche fails",
        "Slower to test variety",
        "Requires niche research",
        "May need to start over",
      ],
      bestFor:
        "Entrepreneurs ready to commit to a specific market and build a brand",
      pricing: "Same startup costs",
      rating: 4.4,
    },
    verdict:
      "Start with a general store to learn and find winning products. Once you identify consistent winners in a category, transition to a niche store for better branding and customer loyalty.",
    criteria: [
      {
        name: "Branding",
        itemAScore: 2,
        itemBScore: 5,
        notes: "Niche stores build much stronger brands",
      },
      {
        name: "Product Testing",
        itemAScore: 5,
        itemBScore: 2,
        notes: "General stores can test anything",
      },
      {
        name: "Conversion Rate",
        itemAScore: 2,
        itemBScore: 4,
        notes: "Niche stores convert 2-3x better",
      },
      {
        name: "SEO Potential",
        itemAScore: 2,
        itemBScore: 5,
        notes: "Niche stores rank better for targeted keywords",
      },
      {
        name: "Customer Retention",
        itemAScore: 2,
        itemBScore: 5,
        notes: "Niche stores build repeat customers",
      },
      {
        name: "Learning Speed",
        itemAScore: 5,
        itemBScore: 3,
        notes: "General stores teach you faster through variety",
      },
    ],
    faqs: [
      {
        question: "Can I convert a general store to a niche store?",
        answer:
          "Yes! Many successful dropshippers start general, identify their best-selling category, then rebrand as a niche store focusing on those products. This is actually a proven strategy.",
      },
      {
        question: "How many products should a niche store have?",
        answer:
          "Start with 10-20 carefully curated products. Quality over quantity. You can expand as you learn what your audience wants. Many successful niche stores have under 50 products.",
      },
      {
        question: "Which has better profit margins?",
        answer:
          "Niche stores typically have higher margins because customers are willing to pay more from a specialized, trusted brand. They also have lower ad costs due to better targeting.",
      },
    ],
  },
};

export const getComparisonBySlug = (slug: string): Comparison | undefined => {
  return comparisons[slug];
};

export const getAllComparisons = (): Comparison[] => {
  return Object.values(comparisons);
};

export const getComparisonsByCategory = (category: string): Comparison[] => {
  return getAllComparisons().filter((c) => c.category === category);
};
