import { SITE_URL } from "./constants";

export type GuideSection = {
  id: string;
  title: string;
  content: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  readTime: string;
  category: string;
  keywords: string[];
  sections: GuideSection[];
  faqs: Array<{ question: string; answer: string }>;
  relatedGuides: string[];
};

export const guides: Record<string, Guide> = {
  "how-to-start-dropshipping": {
    slug: "how-to-start-dropshipping",
    title: "How to Start Dropshipping in 2026: Complete Beginner Guide",
    description:
      "Learn how to start a profitable dropshipping business in 2026. Step-by-step guide covering product research, supplier selection, store setup, and marketing strategies.",
    lastUpdated: "2026-05-01",
    readTime: "15 min",
    category: "dropshipping",
    keywords: [
      "how to start dropshipping",
      "dropshipping 2026",
      "dropshipping for beginners",
      "start dropshipping business",
    ],
    sections: [
      {
        id: "what-is-dropshipping",
        title: "What is Dropshipping?",
        content: `Dropshipping is a retail fulfillment method where you sell products without holding any inventory. When a customer places an order, you purchase the item from a third-party supplier who ships it directly to the customer.

**Key benefits of dropshipping:**
- Low startup costs (no inventory investment)
- No warehouse or fulfillment logistics
- Wide product selection
- Location independence
- Easy to test new products

In 2026, dropshipping remains one of the most accessible ways to start an e-commerce business, especially with AI tools that can automate store creation and product research.`,
      },
      {
        id: "step-1-choose-niche",
        title: "Step 1: Choose Your Niche",
        content: `Selecting the right niche is crucial for dropshipping success. Here's how to find a profitable niche in 2026:

**Research trending products:**
- Use tools like Google Trends to identify growing markets
- Check social media platforms for viral products
- Analyze Amazon Best Sellers and AliExpress trending

**Evaluate niche criteria:**
- Passion & interest (you'll work with these products daily)
- Market size (large enough for profit, not too competitive)
- Profit margins (aim for 30-50% margins)
- Shipping considerations (avoid fragile or oversized items)

**Hot niches in 2026:**
- Sustainable/eco-friendly products
- Smart home accessories
- Pet tech and accessories
- Fitness and wellness gadgets
- Home office equipment`,
      },
      {
        id: "step-2-find-suppliers",
        title: "Step 2: Find Reliable Suppliers",
        content: `Your supplier relationship is the backbone of your dropshipping business. Here are the best platforms to find suppliers in 2026:

**Popular supplier platforms:**
- **AliExpress** - Largest selection, good for testing
- **CJ Dropshipping** - Faster shipping, quality control
- **Spocket** - US/EU suppliers, faster delivery
- **Alibaba** - For bulk orders and private labeling

**What to look for in a supplier:**
- Fast processing times (under 48 hours)
- Good communication and English proficiency
- Positive reviews and ratings (4.5+ stars)
- ePacket or faster shipping options
- Reasonable return policies`,
      },
      {
        id: "step-3-build-store",
        title: "Step 3: Build Your Online Store",
        content: `Your store is your digital storefront. In 2026, you have more options than ever:

**Recommended platforms:**
- **Shopify** - Most popular, extensive app ecosystem
- **WooCommerce** - WordPress-based, more customizable
- **BigCommerce** - Enterprise features, built-in SEO

**Essential store elements:**
- Professional, mobile-responsive design
- High-quality product images
- Compelling product descriptions
- Trust badges and social proof
- Clear shipping and return policies
- Multiple payment options

**Pro tip:** Use AI tools like Dropwiz to generate professional product pages instantly. Just paste a product URL and get conversion-optimized copy, images, and layouts in seconds.`,
      },
      {
        id: "step-4-marketing",
        title: "Step 4: Market Your Store",
        content: `Getting traffic is where many dropshippers struggle. Here are the most effective marketing strategies in 2026:

**Paid advertising:**
- Facebook/Instagram Ads (still effective for product discovery)
- TikTok Ads (lower CPMs, younger audience)
- Google Shopping (higher intent traffic)

**Organic marketing:**
- TikTok organic content (viral potential)
- Instagram Reels and Stories
- SEO and content marketing
- Influencer partnerships

**Email marketing:**
- Build an email list from day one
- Abandoned cart sequences
- Product launch announcements
- Customer retention campaigns`,
      },
    ],
    faqs: [
      {
        question: "Is dropshipping still profitable in 2026?",
        answer:
          "Yes, dropshipping remains profitable in 2026. While competition has increased, new tools like AI store builders, better supplier networks, and improved shipping options make it easier than ever to run a successful operation. The key is finding the right niche and providing value through branding and customer experience.",
      },
      {
        question: "How much money do I need to start dropshipping?",
        answer:
          "You can start dropshipping with as little as $100-500. This covers your store setup (Shopify starts at $29/month), domain name (~$12/year), and initial marketing budget. However, having $1,000-2,000 gives you more runway to test products and scale winners.",
      },
      {
        question: "Do I need a business license for dropshipping?",
        answer:
          "Requirements vary by location. In the US, you typically need a business license and may need to collect sales tax. Consult a local accountant or use services like Avalara for tax compliance. Many start as sole proprietors and incorporate later.",
      },
      {
        question: "How long does it take to make money dropshipping?",
        answer:
          "Most successful dropshippers see their first sale within 1-4 weeks of launching. However, building a consistently profitable business typically takes 3-6 months of testing products, optimizing ads, and refining your store.",
      },
    ],
    relatedGuides: [
      "shopify-dropshipping",
      "amazon-dropshipping",
      "print-on-demand",
    ],
  },
  "shopify-dropshipping": {
    slug: "shopify-dropshipping",
    title: "Shopify Dropshipping Guide 2026: Setup, Apps & Strategies",
    description:
      "Master Shopify dropshipping in 2026. Learn store setup, essential apps, product sourcing, and proven strategies to build a profitable Shopify dropshipping store.",
    lastUpdated: "2026-05-01",
    readTime: "12 min",
    category: "dropshipping",
    keywords: [
      "shopify dropshipping",
      "shopify dropshipping 2026",
      "shopify store setup",
      "dropshipping on shopify",
    ],
    sections: [
      {
        id: "why-shopify",
        title: "Why Choose Shopify for Dropshipping?",
        content: `Shopify dominates the dropshipping space for good reasons:

**Key advantages:**
- Easy setup (launch in hours, not days)
- Massive app ecosystem (8,000+ apps)
- Built-in payment processing
- Mobile-optimized themes
- 24/7 customer support
- Seamless integrations with suppliers

**2026 Shopify updates:**
- AI-powered product recommendations
- Improved checkout conversion
- Better inventory sync with suppliers
- Enhanced mobile shopping experience`,
      },
      {
        id: "setup-store",
        title: "Setting Up Your Shopify Store",
        content: `Follow these steps to set up your Shopify dropshipping store:

**1. Sign up and choose a plan**
- Start with Basic Shopify ($29/month)
- Use free trial to test before committing

**2. Configure settings**
- Add your business information
- Set up payment providers (Shopify Payments recommended)
- Configure shipping zones and rates
- Set up taxes (or use automated tax)

**3. Choose and customize a theme**
- Start with a free theme (Dawn is excellent)
- Focus on mobile experience
- Keep design clean and professional

**4. Add essential pages**
- About Us
- Contact
- Shipping Policy
- Return Policy
- Privacy Policy`,
      },
      {
        id: "essential-apps",
        title: "Essential Shopify Apps for Dropshipping",
        content: `These apps will supercharge your dropshipping store:

**Product sourcing:**
- DSers (official AliExpress partner)
- Spocket (US/EU suppliers)
- CJ Dropshipping app
- Dropwiz (AI store builder)

**Marketing:**
- Klaviyo (email marketing)
- Judge.me (product reviews)
- Privy (popups and email capture)

**Operations:**
- Loox (photo reviews)
- PageFly (landing pages)
- Vitals (all-in-one app)

**Analytics:**
- Triple Whale (attribution)
- Lucky Orange (heatmaps)`,
      },
    ],
    faqs: [
      {
        question: "Is Shopify good for dropshipping?",
        answer:
          "Shopify is the best platform for dropshipping in 2026. It offers the easiest setup, best app ecosystem, and most reliable infrastructure for running a dropshipping business. Over 60% of successful dropshippers use Shopify.",
      },
      {
        question: "How much does Shopify cost for dropshipping?",
        answer:
          "Shopify Basic costs $29/month, which is sufficient for most dropshippers. You'll also pay 2.9% + 30¢ per transaction with Shopify Payments. Factor in app costs ($20-100/month) and domain ($12/year) for total costs.",
      },
    ],
    relatedGuides: [
      "how-to-start-dropshipping",
      "amazon-dropshipping",
      "print-on-demand",
    ],
  },
  "amazon-dropshipping": {
    slug: "amazon-dropshipping",
    title: "Amazon Dropshipping 2026: Complete Guide & Strategies",
    description:
      "Learn Amazon dropshipping in 2026. Understand policies, find profitable products, and build a compliant Amazon dropshipping business.",
    lastUpdated: "2026-05-01",
    readTime: "10 min",
    category: "dropshipping",
    keywords: [
      "amazon dropshipping",
      "dropshipping on amazon",
      "amazon fba alternative",
      "amazon dropshipping 2026",
    ],
    sections: [
      {
        id: "overview",
        title: "Amazon Dropshipping: What You Need to Know",
        content: `Amazon dropshipping is allowed but heavily regulated. Here's what you need to understand:

**Amazon's dropshipping policy:**
- You MUST be the seller of record
- You CAN'T use another retailer as supplier (no retail arbitrage)
- Supplier must not include invoices or promotional materials
- You're responsible for returns and customer service

**Compliant dropshipping on Amazon:**
- Work directly with manufacturers or wholesalers
- Use private label products
- Ensure fast, reliable shipping`,
      },
      {
        id: "getting-started",
        title: "Getting Started with Amazon Dropshipping",
        content: `Follow these steps to start dropshipping on Amazon:

**1. Create a seller account**
- Professional account ($39.99/month)
- Required for category approvals

**2. Find compliant suppliers**
- US-based wholesalers
- Manufacturers with dropship programs
- Private label suppliers

**3. List your products**
- High-quality images
- Optimized titles and bullet points
- Competitive pricing

**4. Manage operations**
- Fast order processing
- Excellent customer service
- Monitor metrics closely`,
      },
    ],
    faqs: [
      {
        question: "Is dropshipping allowed on Amazon?",
        answer:
          "Yes, dropshipping is allowed on Amazon IF you follow their policy. You must be the seller of record, use legitimate suppliers (not other retailers), and ensure no third-party branding reaches customers. Violating these rules can result in account suspension.",
      },
      {
        question: "Is Amazon dropshipping profitable?",
        answer:
          "Amazon dropshipping can be profitable but margins are typically lower (10-20%) due to fees and competition. Success requires finding unique products, optimizing listings, and maintaining excellent seller metrics. Many find Shopify dropshipping more profitable.",
      },
    ],
    relatedGuides: [
      "how-to-start-dropshipping",
      "shopify-dropshipping",
      "print-on-demand",
    ],
  },
  "print-on-demand": {
    slug: "print-on-demand",
    title: "Print on Demand Guide 2026: Start Your POD Business",
    description:
      "Complete guide to starting a print on demand business in 2026. Learn about POD platforms, design tips, and marketing strategies for success.",
    lastUpdated: "2026-05-01",
    readTime: "11 min",
    category: "print-on-demand",
    keywords: [
      "print on demand",
      "print on demand 2026",
      "pod business",
      "custom products",
    ],
    sections: [
      {
        id: "what-is-pod",
        title: "What is Print on Demand?",
        content: `Print on Demand (POD) is a business model where products are printed only when ordered. It's similar to dropshipping but focuses on customized products.

**Popular POD products:**
- T-shirts and apparel
- Mugs and drinkware
- Phone cases
- Posters and wall art
- Tote bags
- Pillows and home decor

**Advantages over traditional dropshipping:**
- Higher margins (often 30-50%)
- Unique, branded products
- No inventory risk
- Creative freedom`,
      },
      {
        id: "pod-platforms",
        title: "Best Print on Demand Platforms in 2026",
        content: `Choose the right POD platform for your needs:

**Printful** - Premium quality, Shopify integration
**Printify** - Lowest prices, multiple print providers
**Gooten** - Good for scaling
**SPOD** - Fastest production times
**Gelato** - Best for international shipping

**Key factors to consider:**
- Product quality
- Printing options
- Shipping times and costs
- Integration with your store
- Profit margins`,
      },
    ],
    faqs: [
      {
        question: "Is print on demand profitable?",
        answer:
          "Yes, print on demand can be very profitable with margins of 30-50% per product. Success depends on unique designs, targeted marketing, and building a brand. Top POD stores generate $10,000+ monthly.",
      },
      {
        question: "Print on demand vs dropshipping: which is better?",
        answer:
          "Print on demand offers higher margins and brand differentiation but requires design skills. Traditional dropshipping has lower margins but wider product selection. Many successful entrepreneurs do both.",
      },
    ],
    relatedGuides: [
      "how-to-start-dropshipping",
      "shopify-dropshipping",
      "amazon-dropshipping",
    ],
  },
};

import { extendedGuides } from "./guides-extended";

const allGuides: Record<string, Guide> = { ...guides, ...extendedGuides };

export const getGuideBySlug = (slug: string): Guide | undefined => {
  return allGuides[slug];
};

export const getAllGuides = (): Guide[] => {
  return Object.values(allGuides);
};

export const getRelatedGuides = (currentSlug: string): Guide[] => {
  const current = allGuides[currentSlug];
  if (!current) return [];
  return current.relatedGuides
    .map((slug) => allGuides[slug])
    .filter((g): g is Guide => g !== undefined);
};
