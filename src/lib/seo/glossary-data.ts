import { SITE_URL } from "./constants";

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  extendedDefinition: string;
  relatedTerms: string[];
  category: string;
};

export type GlossaryTermSummary = Omit<GlossaryTerm, "extendedDefinition" | "relatedTerms">;

export const glossaryTerms: Record<string, GlossaryTerm> = {
  dropshipping: {
    slug: "dropshipping",
    term: "Dropshipping",
    definition:
      "A retail fulfillment method where a store doesn't keep products in stock but instead transfers customer orders to a third-party supplier who ships directly to the customer.",
    extendedDefinition: `Dropshipping is an e-commerce business model that allows entrepreneurs to sell products without holding inventory. When a customer places an order, the store owner purchases the item from a third-party supplier who then ships it directly to the customer.

**How Dropshipping Works:**
1. Customer places an order on your online store
2. You forward the order to your supplier
3. Supplier ships the product directly to the customer
4. You keep the profit margin between retail and wholesale price

**Advantages:**
- Low startup costs (no inventory investment)
- No need for warehouse space
- Wide product selection without risk
- Location independence
- Easy to scale

**Challenges:**
- Lower profit margins than traditional retail
- Supplier reliability issues
- Shipping time concerns
- Less control over product quality
- High competition

Dropshipping became popular in the 2010s with platforms like Shopify and AliExpress making it accessible to anyone with internet access.`,
    relatedTerms: ["fulfillment", "supplier", "ecommerce", "profit-margin"],
    category: "business-models",
  },
  fulfillment: {
    slug: "fulfillment",
    term: "Fulfillment",
    definition:
      "The complete process of receiving, processing, and delivering orders to customers, including storage, picking, packing, and shipping.",
    extendedDefinition: `Order fulfillment encompasses everything that happens between a customer placing an order and receiving their product. It's a critical component of any e-commerce operation.

**Fulfillment Process Steps:**
1. Receiving inventory from suppliers
2. Storing products in a warehouse
3. Processing incoming orders
4. Picking products from storage
5. Packing items securely
6. Shipping to customers
7. Handling returns

**Types of Fulfillment:**
- **Self-fulfillment:** You handle all fulfillment in-house
- **Third-party fulfillment (3PL):** Outsource to fulfillment centers
- **Dropshipping:** Supplier handles fulfillment entirely
- **Hybrid:** Combination of methods

**Key Metrics:**
- Order accuracy rate
- Shipping speed
- Cost per order
- Return rate`,
    relatedTerms: ["dropshipping", "3pl", "shipping", "warehouse"],
    category: "operations",
  },
  supplier: {
    slug: "supplier",
    term: "Supplier",
    definition:
      "A business or individual that provides products to retailers or dropshippers, either as a manufacturer, wholesaler, or distributor.",
    extendedDefinition: `In e-commerce and dropshipping, suppliers are the backbone of your business. They manufacture, store, and often ship products on your behalf.

**Types of Suppliers:**
- **Manufacturers:** Make products directly, lowest prices but high minimums
- **Wholesalers:** Buy in bulk from manufacturers, lower minimums
- **Distributors:** Authorized resellers with regional coverage
- **Dropship suppliers:** Specialize in single-unit fulfillment

**Popular Supplier Platforms:**
- AliExpress (general products, dropship-friendly)
- Alibaba (bulk orders, manufacturers)
- Spocket (US/EU suppliers)
- CJ Dropshipping (fulfillment + sourcing)
- SaleHoo (supplier directory)

**What to Look For:**
- Product quality consistency
- Communication responsiveness
- Shipping speed and reliability
- Return/refund policies
- Pricing competitiveness`,
    relatedTerms: ["dropshipping", "aliexpress", "wholesale", "manufacturer"],
    category: "sourcing",
  },
  "profit-margin": {
    slug: "profit-margin",
    term: "Profit Margin",
    definition:
      "The percentage of revenue remaining after all costs are deducted, calculated as (Revenue - Costs) / Revenue × 100.",
    extendedDefinition: `Profit margin is the key metric that determines if your dropshipping business is sustainable. It represents how much money you keep from each sale.

**Types of Profit Margins:**
- **Gross margin:** Revenue minus product cost
- **Net margin:** Revenue minus all costs (product, shipping, ads, fees)

**Calculating Dropshipping Profit:**
\`\`\`
Selling Price: $39.99
- Product Cost: $12.00
- Shipping: $4.00
- Payment Fees: $1.50
- Ad Cost: $10.00
= Net Profit: $12.49 (31% margin)
\`\`\`

**Healthy Margins by Model:**
- Low-ticket dropshipping: 15-30%
- High-ticket dropshipping: 20-40%
- Print on demand: 30-50%
- Private label: 40-60%

**How to Improve Margins:**
- Negotiate better supplier pricing
- Reduce ad costs through optimization
- Increase average order value
- Build brand to command premium pricing`,
    relatedTerms: ["aov", "cogs", "roas", "break-even"],
    category: "finance",
  },
  aov: {
    slug: "aov",
    term: "AOV (Average Order Value)",
    definition:
      "The average amount spent each time a customer places an order, calculated by dividing total revenue by number of orders.",
    extendedDefinition: `Average Order Value is a critical e-commerce metric that measures how much customers spend per transaction. Higher AOV means more revenue without acquiring additional customers.

**Calculating AOV:**
\`\`\`
AOV = Total Revenue / Number of Orders

Example:
$10,000 revenue / 200 orders = $50 AOV
\`\`\`

**Strategies to Increase AOV:**
- **Product bundling:** Offer complementary products together
- **Upselling:** Suggest premium versions
- **Cross-selling:** Recommend related products
- **Free shipping thresholds:** "Free shipping on orders over $50"
- **Volume discounts:** "Buy 2, get 10% off"
- **Post-purchase offers:** One-click add-ons

**AOV Benchmarks:**
- Fashion: $80-120
- Electronics: $100-200
- Home goods: $60-100
- Beauty: $50-80`,
    relatedTerms: ["profit-margin", "ltv", "conversion-rate", "upsell"],
    category: "metrics",
  },
  "conversion-rate": {
    slug: "conversion-rate",
    term: "Conversion Rate",
    definition:
      "The percentage of website visitors who complete a desired action, typically making a purchase, calculated as (Conversions / Visitors) × 100.",
    extendedDefinition: `Conversion rate measures how effectively your store turns visitors into customers. It's one of the most important metrics for e-commerce success.

**Calculating Conversion Rate:**
\`\`\`
Conversion Rate = (Number of Sales / Number of Visitors) × 100

Example:
50 sales / 2,000 visitors = 2.5% conversion rate
\`\`\`

**E-commerce Conversion Rate Benchmarks:**
- Poor: Below 1%
- Average: 1-2%
- Good: 2-3%
- Excellent: 3-5%
- Elite: 5%+

**Factors Affecting Conversion:**
- Website speed and mobile experience
- Product page quality
- Price competitiveness
- Trust signals (reviews, guarantees)
- Checkout friction
- Traffic quality

**How to Improve:**
- A/B test product pages
- Add social proof
- Simplify checkout
- Offer multiple payment options
- Use exit-intent popups
- Improve site speed`,
    relatedTerms: ["aov", "ctr", "bounce-rate", "landing-page"],
    category: "metrics",
  },
  roas: {
    slug: "roas",
    term: "ROAS (Return on Ad Spend)",
    definition:
      "A marketing metric that measures revenue generated for every dollar spent on advertising, calculated as Revenue / Ad Spend.",
    extendedDefinition: `ROAS helps you understand the effectiveness of your advertising campaigns. It tells you how much revenue you earn for each dollar invested in ads.

**Calculating ROAS:**
\`\`\`
ROAS = Revenue from Ads / Cost of Ads

Example:
$5,000 revenue / $1,000 ad spend = 5x ROAS
\`\`\`

**ROAS vs ROI:**
- ROAS only considers ad spend
- ROI accounts for all costs (product, shipping, fees)
- A 3x ROAS might still be unprofitable after costs

**Breakeven ROAS Calculation:**
\`\`\`
If your profit margin is 30%:
Breakeven ROAS = 1 / 0.30 = 3.33x
\`\`\`

**ROAS Benchmarks by Platform:**
- Facebook Ads: 2-4x average
- Google Shopping: 3-5x average
- TikTok Ads: 2-3x average

**Improving ROAS:**
- Better audience targeting
- Creative testing
- Landing page optimization
- Retargeting campaigns
- Bid strategy adjustments`,
    relatedTerms: ["cpa", "cpm", "ctr", "profit-margin"],
    category: "advertising",
  },
  cpa: {
    slug: "cpa",
    term: "CPA (Cost Per Acquisition)",
    definition:
      "The total cost to acquire one paying customer, including all marketing and advertising expenses.",
    extendedDefinition: `Cost Per Acquisition measures how much you spend to get one customer. It's essential for understanding if your marketing is profitable.

**Calculating CPA:**
\`\`\`
CPA = Total Marketing Cost / Number of Customers Acquired

Example:
$2,000 ad spend / 100 customers = $20 CPA
\`\`\`

**CPA vs CAC:**
- CPA typically refers to a single campaign or channel
- CAC (Customer Acquisition Cost) includes all acquisition costs

**Is Your CPA Profitable?**
\`\`\`
Profit per order: $25
CPA: $20
Net profit: $5 ✓

Profit per order: $15
CPA: $20
Net profit: -$5 ✗
\`\`\`

**Reducing CPA:**
- Improve ad targeting
- Better landing pages
- Retargeting campaigns
- Organic content marketing
- Email marketing
- Referral programs`,
    relatedTerms: ["roas", "ltv", "cpm", "ctr"],
    category: "advertising",
  },
  cpm: {
    slug: "cpm",
    term: "CPM (Cost Per Mille)",
    definition:
      "The cost to reach 1,000 people with an advertisement, a standard metric for comparing advertising costs across platforms.",
    extendedDefinition: `CPM measures how much you pay for 1,000 ad impressions. "Mille" is Latin for thousand. It's useful for comparing reach costs across platforms.

**Calculating CPM:**
\`\`\`
CPM = (Ad Spend / Impressions) × 1,000

Example:
$500 spend / 100,000 impressions × 1,000 = $5 CPM
\`\`\`

**CPM Benchmarks (2026):**
- Facebook: $8-15
- Instagram: $10-20
- TikTok: $5-12
- Google Display: $2-5
- YouTube: $10-30

**Factors Affecting CPM:**
- Audience targeting specificity
- Competition in your niche
- Ad placement
- Time of year (Q4 is highest)
- Ad quality scores

**When to Focus on CPM:**
- Brand awareness campaigns
- Reaching new audiences
- Testing creative concepts

**When to Focus on Other Metrics:**
- Conversion campaigns (focus on CPA)
- Direct response (focus on ROAS)`,
    relatedTerms: ["cpa", "ctr", "roas", "impressions"],
    category: "advertising",
  },
  ctr: {
    slug: "ctr",
    term: "CTR (Click-Through Rate)",
    definition:
      "The percentage of people who click on a link or ad after seeing it, calculated as (Clicks / Impressions) × 100.",
    extendedDefinition: `Click-through rate measures how compelling your ads or content are. A higher CTR means more people are interested enough to take action.

**Calculating CTR:**
\`\`\`
CTR = (Clicks / Impressions) × 100

Example:
500 clicks / 50,000 impressions = 1% CTR
\`\`\`

**CTR Benchmarks:**
- Facebook Ads: 0.9-1.5%
- Google Search Ads: 2-5%
- Google Display: 0.3-0.5%
- Email marketing: 2-5%
- TikTok Ads: 1-2%

**Why CTR Matters:**
- Higher CTR = lower costs (better quality scores)
- Indicates ad relevance
- Affects overall campaign performance

**Improving CTR:**
- Compelling headlines
- Eye-catching visuals
- Clear value proposition
- Strong call to action
- Relevant audience targeting
- A/B testing creative`,
    relatedTerms: ["cpm", "cpa", "conversion-rate", "impressions"],
    category: "advertising",
  },
  ltv: {
    slug: "ltv",
    term: "LTV (Lifetime Value)",
    definition:
      "The total revenue a business can expect from a single customer account throughout their entire relationship.",
    extendedDefinition: `Customer Lifetime Value predicts how much revenue a customer will generate over time. It helps determine how much you can spend to acquire customers.

**Calculating LTV:**
\`\`\`
Simple LTV = Average Order Value × Purchase Frequency × Customer Lifespan

Example:
$50 AOV × 3 purchases/year × 2 years = $300 LTV
\`\`\`

**Why LTV Matters:**
- Determines sustainable CPA
- Guides marketing budget allocation
- Identifies high-value customer segments
- Justifies retention investments

**LTV:CAC Ratio:**
\`\`\`
Healthy ratio: 3:1 or higher
$300 LTV / $100 CAC = 3:1 ✓
\`\`\`

**Improving LTV:**
- Email marketing for repeat purchases
- Loyalty programs
- Subscription options
- Excellent customer service
- Product quality consistency
- Cross-selling and upselling`,
    relatedTerms: ["aov", "cpa", "retention", "churn"],
    category: "metrics",
  },
  "print-on-demand": {
    slug: "print-on-demand",
    term: "Print on Demand (POD)",
    definition:
      "A business model where custom products like t-shirts, mugs, and posters are printed only after an order is placed, eliminating inventory risk.",
    extendedDefinition: `Print on Demand allows entrepreneurs to sell custom-designed products without holding inventory. Products are printed and shipped by a third-party when orders come in.

**How POD Works:**
1. Create designs for products
2. Upload to POD platform
3. Connect to your store
4. Customer orders
5. POD provider prints and ships

**Popular POD Products:**
- T-shirts and apparel
- Mugs and drinkware
- Phone cases
- Posters and wall art
- Tote bags
- Pillows and home decor

**Top POD Platforms:**
- Printful (premium quality)
- Printify (best prices)
- Gooten (scaling)
- SPOD (fast shipping)
- Gelato (international)

**Advantages:**
- No inventory investment
- Unlimited designs possible
- Easy to test new products
- Higher margins than dropshipping
- Brand differentiation

**Challenges:**
- Design skills needed
- Longer shipping times
- Limited product types
- Quality variations by provider`,
    relatedTerms: ["dropshipping", "fulfillment", "ecommerce", "custom-products"],
    category: "business-models",
  },
  aliexpress: {
    slug: "aliexpress",
    term: "AliExpress",
    definition:
      "A Chinese online retail platform owned by Alibaba Group, popular among dropshippers for its vast product selection and low prices.",
    extendedDefinition: `AliExpress is one of the world's largest e-commerce platforms, connecting international buyers with Chinese suppliers. It's the go-to sourcing platform for many dropshippers.

**Why Dropshippers Use AliExpress:**
- Massive product selection (100+ million products)
- Low wholesale prices
- No minimum order quantities
- Buyer protection program
- ePacket shipping available

**AliExpress for Dropshipping:**
- Direct order placement for customers
- Integration with Shopify via apps (DSers, Oberlo)
- Supplier communication tools
- Price and stock tracking

**Pros:**
- Lowest prices available
- Huge variety
- Easy to start

**Cons:**
- Long shipping times (7-30 days)
- Quality inconsistency
- Limited branding options
- Communication barriers

**Alternatives:**
- CJ Dropshipping (faster shipping)
- Spocket (US/EU suppliers)
- Alibaba (bulk orders)`,
    relatedTerms: ["dropshipping", "supplier", "alibaba", "epacket"],
    category: "platforms",
  },
  shopify: {
    slug: "shopify",
    term: "Shopify",
    definition:
      "A leading e-commerce platform that allows businesses to create online stores, process payments, and manage products without technical expertise.",
    extendedDefinition: `Shopify is the most popular e-commerce platform for dropshippers and online retailers. It powers over 4 million online stores worldwide.

**Why Shopify for Dropshipping:**
- Easy store setup (no coding required)
- Massive app ecosystem (8,000+ apps)
- Built-in payment processing
- Mobile-optimized themes
- Reliable hosting and security
- 24/7 customer support

**Shopify Plans:**
- Basic: $29/month
- Shopify: $79/month
- Advanced: $299/month
- Plus: Custom pricing

**Essential Shopify Features:**
- Drag-and-drop store builder
- Abandoned cart recovery
- Discount codes
- Multi-channel selling
- Analytics and reports
- Inventory management

**Popular Dropshipping Apps:**
- DSers (AliExpress)
- Spocket (US/EU suppliers)
- Oberlo (legacy)
- Dropwiz (AI store builder)`,
    relatedTerms: ["ecommerce", "woocommerce", "dropshipping", "online-store"],
    category: "platforms",
  },
  "winning-product": {
    slug: "winning-product",
    term: "Winning Product",
    definition:
      "A product that generates consistent sales and profit in e-commerce, typically characterized by high demand, good margins, and low competition.",
    extendedDefinition: `A winning product is the holy grail of dropshipping - a product that sells consistently and profitably. Finding winning products is a key skill for e-commerce success.

**Characteristics of Winning Products:**
- Solves a problem or fulfills a desire
- "Wow factor" - stops the scroll
- Not easily found in local stores
- Good profit margins (30%+)
- Lightweight and easy to ship
- Not too competitive

**Where to Find Winning Products:**
- Social media (TikTok, Instagram)
- Amazon Best Sellers
- AliExpress trending
- Google Trends
- Competitor research
- Product research tools

**Validation Checklist:**
- Search volume exists
- Competition is manageable
- Multiple suppliers available
- Positive reviews on similar products
- Clear target audience
- Ad-friendly (not restricted)

**Testing Products:**
- Budget: $50-100 per product
- Timeline: 3-5 days
- Kill criteria: No sales after $100 spent
- Scale criteria: Profitable for 3+ days`,
    relatedTerms: ["product-research", "dropshipping", "profit-margin", "niche"],
    category: "strategy",
  },
  niche: {
    slug: "niche",
    term: "Niche",
    definition:
      "A specialized segment of a market focusing on a specific product category, audience, or need that a business targets.",
    extendedDefinition: `In e-commerce, a niche is the specific market segment you focus on. Choosing the right niche is one of the most important decisions for dropshipping success.

**Why Niche Selection Matters:**
- Easier to target marketing
- Build authority and trust
- Less direct competition
- Better customer loyalty
- More focused product catalog

**How to Choose a Niche:**
1. List your interests and passions
2. Research market size and trends
3. Analyze competition level
4. Evaluate profit potential
5. Consider shipping logistics

**Popular Dropshipping Niches:**
- Pet supplies
- Home and kitchen
- Fitness and wellness
- Beauty and skincare
- Baby products
- Tech accessories
- Outdoor and camping
- Car accessories

**Niche Evaluation Criteria:**
- Passion (you'll work with it daily)
- Profit margins (30%+ possible)
- Market size (enough demand)
- Competition (not oversaturated)
- Evergreen vs trending`,
    relatedTerms: ["winning-product", "target-audience", "dropshipping", "market-research"],
    category: "strategy",
  },
  "facebook-ads": {
    slug: "facebook-ads",
    term: "Facebook Ads",
    definition:
      "Meta's advertising platform that allows businesses to create and display ads across Facebook, Instagram, Messenger, and the Audience Network.",
    extendedDefinition: `Facebook Ads is the primary advertising platform for most dropshippers. It offers powerful targeting options and massive reach across Meta's platforms.

**Facebook Ads for Dropshipping:**
- Product discovery advertising
- Retargeting website visitors
- Lookalike audience targeting
- Dynamic product ads
- Video and carousel formats

**Campaign Structure:**
- Campaign (objective)
- Ad Set (targeting, budget)
- Ad (creative, copy)

**Key Metrics:**
- CPM (cost per 1000 impressions)
- CPC (cost per click)
- CTR (click-through rate)
- CPA (cost per acquisition)
- ROAS (return on ad spend)

**Targeting Options:**
- Demographics
- Interests and behaviors
- Custom audiences
- Lookalike audiences
- Detailed targeting

**Best Practices:**
- Start with broad targeting
- Test multiple creatives
- Use video when possible
- Implement pixel tracking
- Retarget engaged users`,
    relatedTerms: ["cpm", "roas", "cpa", "retargeting"],
    category: "advertising",
  },
  seo: {
    slug: "seo",
    term: "SEO (Search Engine Optimization)",
    definition:
      "The practice of optimizing websites and content to rank higher in search engine results, driving organic (non-paid) traffic.",
    extendedDefinition: `SEO helps your e-commerce store appear in Google and other search engines when people search for products or information. It's a long-term traffic strategy.

**Why SEO for E-commerce:**
- Free, sustainable traffic
- High purchase intent
- Builds brand authority
- Compounds over time
- Reduces ad dependency

**E-commerce SEO Elements:**
- **Technical SEO:** Site speed, mobile-friendliness, crawlability
- **On-page SEO:** Title tags, meta descriptions, headers
- **Content SEO:** Product descriptions, blog posts, guides
- **Off-page SEO:** Backlinks, brand mentions

**Product Page SEO:**
- Unique, detailed descriptions
- Keyword-optimized titles
- Alt text for images
- Schema markup for products
- Customer reviews

**Content Marketing:**
- Buying guides
- Product comparisons
- How-to articles
- Industry news

**Key Metrics:**
- Organic traffic
- Keyword rankings
- Click-through rate
- Time on page
- Bounce rate`,
    relatedTerms: ["keywords", "organic-traffic", "backlinks", "content-marketing"],
    category: "marketing",
  },
  retargeting: {
    slug: "retargeting",
    term: "Retargeting",
    definition:
      "An advertising strategy that shows ads to people who have previously visited your website or interacted with your brand.",
    extendedDefinition: `Retargeting (also called remarketing) is one of the most effective advertising strategies. It targets people already familiar with your brand, leading to higher conversion rates.

**Why Retargeting Works:**
- Targets warm audiences
- Higher conversion rates (2-4x)
- Lower cost per acquisition
- Reinforces brand awareness
- Recovers abandoned carts

**Types of Retargeting:**
- **Website visitors:** Anyone who visited
- **Product viewers:** Viewed specific products
- **Cart abandoners:** Added to cart but didn't buy
- **Past customers:** For repeat purchases
- **Email subscribers:** Upload customer lists

**Retargeting Platforms:**
- Facebook/Instagram Pixel
- Google Ads Remarketing
- TikTok Pixel
- Email (Klaviyo, etc.)

**Best Practices:**
- Segment audiences by behavior
- Use dynamic product ads
- Exclude recent purchasers
- Set frequency caps
- Create urgency (limited time)

**Retargeting Funnel:**
1. All visitors (7-day window)
2. Product viewers (14-day window)
3. Cart abandoners (3-day window)
4. Purchase (exclude 30 days)`,
    relatedTerms: ["facebook-ads", "conversion-rate", "pixel", "abandoned-cart"],
    category: "advertising",
  },
  "abandoned-cart": {
    slug: "abandoned-cart",
    term: "Abandoned Cart",
    definition:
      "When a shopper adds items to their online shopping cart but leaves the website without completing the purchase.",
    extendedDefinition: `Cart abandonment is one of the biggest challenges in e-commerce. On average, 70% of shopping carts are abandoned, representing massive revenue opportunity.

**Common Abandonment Reasons:**
- Unexpected shipping costs
- Required account creation
- Complicated checkout
- Security concerns
- Just browsing/comparing
- Found better price elsewhere
- Technical issues

**Abandoned Cart Recovery:**

**Email Sequences:**
- Email 1 (1 hour): Reminder
- Email 2 (24 hours): Address objections
- Email 3 (48 hours): Offer incentive

**Retargeting Ads:**
- Dynamic product ads
- Time-limited discounts
- Social proof messaging

**Prevention Strategies:**
- Show shipping costs early
- Guest checkout option
- Multiple payment methods
- Trust badges
- Exit-intent popups
- Progress indicators

**Recovery Metrics:**
- Industry average: 5-10% recovery
- Good: 10-15% recovery
- Excellent: 15-20%+ recovery`,
    relatedTerms: ["retargeting", "conversion-rate", "checkout", "email-marketing"],
    category: "operations",
  },
  "3pl": {
    slug: "3pl",
    term: "3PL (Third-Party Logistics)",
    definition: "Companies that handle warehousing, transportation, and fulfillment services for other businesses.",
    extendedDefinition: `Third-party logistics providers manage the storage, picking, packing, and shipping of products on behalf of e-commerce businesses. They're essential for scaling beyond self-fulfillment.

**Services Offered:**
- Warehouse storage
- Inventory management
- Order picking and packing
- Shipping and delivery
- Returns processing
- Kitting and assembly

**Popular 3PL Providers:**
- ShipBob
- Deliverr (Shopify Fulfillment)
- Red Stag Fulfillment
- ShipMonk
- Fulfillment by Amazon (FBA)

**When to Use 3PL:**
- Order volume exceeds 100-200/month
- Need faster shipping speeds
- Expanding to new regions
- Want to focus on marketing vs operations

**Costs:**
- Storage: $0.50-$2.50/cubic foot/month
- Pick and pack: $2-5 per order
- Shipping: Varies by carrier`,
    relatedTerms: ["fulfillment", "dropshipping", "warehouse", "shipping"],
    category: "operations",
  },
  "agentic-commerce": {
    slug: "agentic-commerce",
    term: "Agentic Commerce",
    definition: "An e-commerce model where AI agents autonomously research, compare, and complete purchases on behalf of consumers.",
    extendedDefinition: `Agentic commerce is the 2026 evolution of online shopping where AI agents act as proxies for buyers, executing the full purchase lifecycle from a goal rather than a click.

**How It Works:**
1. Customer sets intent and parameters
2. AI agent discovers relevant products
3. Agent compares prices and reviews
4. Agent negotiates or finds best deals
5. Agent completes purchase within guardrails

**Key Platforms (2026):**
- ChatGPT with Instant Checkout
- Google AI Mode Shopping
- Amazon Rufus
- Perplexity Comet Browser
- Shopify Agentic Storefronts

**Market Impact:**
- 45% of consumers use AI for buying journey (IBM 2026)
- McKinsey forecasts $900B-$1T US retail from agentic commerce by 2030

**For Merchants:**
- Optimize for Answer Engine Optimization (AEO)
- Structure product data for AI consumption
- Implement Universal Commerce Protocol (UCP)`,
    relatedTerms: ["ai-shopping-agent", "zero-click-commerce", "ucp", "aeo"],
    category: "ai-commerce",
  },
  "ai-shopping-agent": {
    slug: "ai-shopping-agent",
    term: "AI Shopping Agent",
    definition: "An autonomous AI system that researches, compares, and purchases products on behalf of users based on their preferences and constraints.",
    extendedDefinition: `AI shopping agents are the consumer-facing tools powering agentic commerce. They handle the entire shopping process from discovery to checkout.

**Current AI Shopping Agents (2026):**
- **ChatGPT Operator:** Browses websites and completes purchases
- **Google Shopping AI:** Integrated into Search and AI Mode
- **Amazon Rufus:** Product discovery and recommendations
- **Perplexity Buy:** Research-first shopping
- **Alexa+:** Voice-activated autonomous purchasing

**Capabilities:**
- Multi-site price comparison
- Review analysis and summarization
- Inventory and shipping time checks
- Automatic coupon application
- Purchase execution with saved payment

**Implications for Sellers:**
- Product data must be agent-readable
- Reviews and ratings matter more
- Structured data is essential
- Brand loyalty may decrease`,
    relatedTerms: ["agentic-commerce", "zero-click-commerce", "chatgpt", "voice-commerce"],
    category: "ai-commerce",
  },
  "zero-click-commerce": {
    slug: "zero-click-commerce",
    term: "Zero-Click Commerce",
    definition: "Shopping experiences where AI completes purchases without the customer clicking, searching, or visiting a website.",
    extendedDefinition: `Zero-click commerce represents the ultimate automation of shopping. Customers set preferences once, and AI handles everything else.

**Examples:**
- Alexa+ auto-purchasing when prices hit thresholds
- Subscription replenishment without confirmation
- AI agents buying based on calendar events
- Smart devices ordering supplies automatically

**Requirements for Merchants:**
- Machine-readable product catalogs
- Real-time inventory APIs
- Dynamic pricing feeds
- Structured return policies
- Agent-friendly checkout

**Consumer Benefits:**
- Time savings
- Never run out of essentials
- Best price guarantees
- Reduced decision fatigue

**Risks:**
- Over-purchasing
- Privacy concerns
- Reduced brand exploration`,
    relatedTerms: ["agentic-commerce", "ai-shopping-agent", "voice-commerce", "subscription"],
    category: "ai-commerce",
  },
  "social-commerce": {
    slug: "social-commerce",
    term: "Social Commerce",
    definition: "Buying and selling products directly within social media platforms without leaving the app.",
    extendedDefinition: `Social commerce integrates the entire shopping experience—discovery, browsing, checkout—into social media platforms like TikTok, Instagram, and Facebook.

**Market Size (2026):**
- Global: $2.6 trillion
- US: $126.6 billion
- Growth: 26.2% CAGR to $8.5T by 2030

**Major Platforms:**
- **TikTok Shop:** $23.4B US sales, 4.7% conversion rate
- **Instagram Shopping:** Native checkout, shoppable posts
- **Facebook Shops:** Free storefronts, integrated catalog
- **YouTube Shopping:** Product tags in videos
- **Pinterest:** Visual search and buyable pins

**Why It Works:**
- Discovery through entertainment
- Social proof and reviews
- Influencer trust
- Frictionless checkout
- Younger demographics

**Key Stat:** 1 in 2 US social buyers shop on TikTok (2026)`,
    relatedTerms: ["tiktok-shop", "live-shopping", "influencer-marketing", "ugc"],
    category: "social-commerce",
  },
  "tiktok-shop": {
    slug: "tiktok-shop",
    term: "TikTok Shop",
    definition: "TikTok's native e-commerce marketplace where brands and creators sell products directly within the app.",
    extendedDefinition: `TikTok Shop has become a dominant force in social commerce, generating $23.4 billion in US sales in 2026 with a 4.7% conversion rate—more than double Instagram Shopping.

**How It Works:**
- Brands create product catalogs
- Products appear in videos, lives, and shop tab
- Checkout happens within TikTok
- Creators earn commissions via affiliate

**Sales Channels:**
- In-feed video shopping (67% of GMV)
- Live shopping streams (30% of GMV)
- Shop tab browsing
- Search and discovery

**Success Factors:**
- Authentic creator content
- Trending sounds and formats
- Product demonstrations
- Entertainment-first approach

**Key Stats:**
- Larger than Target, Costco, Best Buy (US e-commerce)
- 56% YoY growth globally
- $87B global GMV projected 2026
- 40% lower return rates than traditional e-commerce`,
    relatedTerms: ["social-commerce", "live-shopping", "influencer-marketing", "ugc"],
    category: "social-commerce",
  },
  "live-shopping": {
    slug: "live-shopping",
    term: "Live Shopping",
    definition: "Real-time video broadcasts where hosts demonstrate and sell products with immediate purchase capabilities.",
    extendedDefinition: `Live shopping combines entertainment, product demonstration, and instant purchasing in real-time video streams. It's massive in Asia and growing rapidly in Western markets.

**Conversion Rates:**
- Live shopping: 9-30%
- Traditional e-commerce: 2-3%
- Return rates: 40% lower than standard

**Platform Options:**
- TikTok LIVE Shopping
- Instagram Live Shopping
- YouTube Live Shopping
- Amazon Live
- Dedicated platforms (Bambuser, Firework)

**Live Shopping Formats:**
- Product launches
- Flash sales and auctions
- Q&A demonstrations
- Influencer takeovers
- Behind-the-scenes tours

**Best Practices:**
- Engage constantly with comments
- Create urgency with limited quantities
- Demonstrate product use cases
- Offer live-only discounts
- Schedule regular shows`,
    relatedTerms: ["social-commerce", "tiktok-shop", "influencer-marketing", "conversion-rate"],
    category: "social-commerce",
  },
  "ucp": {
    slug: "ucp",
    term: "UCP (Universal Commerce Protocol)",
    definition: "An open standard enabling AI agents and systems to interact seamlessly across e-commerce platforms, merchants, and payment providers.",
    extendedDefinition: `The Universal Commerce Protocol is the infrastructure layer making agentic commerce possible. It creates a common language for AI agents to shop across the entire internet.

**What UCP Enables:**
- Agents query any merchant's inventory
- Standardized product data format
- Unified checkout across platforms
- Cross-platform price comparison
- Automated returns processing

**Founding Partners:**
- Shopify, Etsy, Wayfair
- Target, Walmart, Best Buy
- Stripe, Adyen, PayPal
- Visa, Mastercard, American Express
- Zalando, and 20+ others

**For Merchants:**
- Implement UCP endpoints
- Structure catalog data properly
- Enable agent authentication
- Provide real-time inventory
- Support programmatic checkout

**Competing Standards:**
- Google's Agent2Agent (A2A)
- Anthropic's Model Context Protocol (MCP)`,
    relatedTerms: ["agentic-commerce", "ai-shopping-agent", "api", "mcp"],
    category: "ai-commerce",
  },
  "aeo": {
    slug: "aeo",
    term: "AEO (Answer Engine Optimization)",
    definition: "Optimizing content and product data to appear in AI-generated answers and recommendations rather than traditional search results.",
    extendedDefinition: `Answer Engine Optimization is the evolution of SEO for the age of AI assistants and agentic commerce. It focuses on making your content and products discoverable by AI systems.

**AEO vs SEO:**
- SEO: Optimize for search engine rankings
- AEO: Optimize for AI-generated answers

**Key AEO Tactics:**
- Structured data markup (Schema.org)
- Clear, factual product descriptions
- Comprehensive FAQ sections
- Machine-readable specifications
- Rich metadata and attributes

**Why It Matters:**
- AI agents recommend products
- ChatGPT/Perplexity answer shopping queries
- Voice assistants suggest purchases
- Zero-click commerce relies on data quality

**Implementation:**
- Use Product schema markup
- Include all specifications
- Write natural language descriptions
- Maintain accurate inventory
- Provide clear pricing and availability`,
    relatedTerms: ["seo", "agentic-commerce", "schema-markup", "structured-data"],
    category: "ai-commerce",
  },
  "voice-commerce": {
    slug: "voice-commerce",
    term: "Voice Commerce",
    definition: "Shopping and purchasing products using voice-activated devices and assistants like Alexa, Google Assistant, and Siri.",
    extendedDefinition: `Voice commerce enables hands-free shopping through smart speakers and voice assistants. The market is projected to reach $40 billion by 2026.

**Voice Commerce Platforms:**
- Amazon Alexa (Echo devices)
- Google Assistant
- Apple Siri
- Samsung Bixby

**Alexa+ (2026):**
- Free for Prime members
- Monitors prices automatically
- Purchases when thresholds hit
- Executes multi-step tasks
- Full agentic capabilities

**Use Cases:**
- Reordering household essentials
- Adding items to shopping lists
- Checking order status
- Price comparisons
- Flash deal alerts

**Optimization for Voice:**
- Natural language product titles
- Common question phrases
- Clear brand pronunciation
- Voice-friendly descriptions`,
    relatedTerms: ["agentic-commerce", "ai-shopping-agent", "alexa", "smart-home"],
    category: "ai-commerce",
  },
  "white-label": {
    slug: "white-label",
    term: "White Label",
    definition: "Products manufactured by one company that other companies rebrand and sell as their own.",
    extendedDefinition: `White labeling allows businesses to sell products under their own brand without manufacturing them. The original manufacturer's identity is removed entirely.

**White Label vs Private Label:**
- White label: Generic products sold to multiple retailers
- Private label: Custom products made exclusively for one retailer

**Common White Label Products:**
- Supplements and vitamins
- Skincare and cosmetics
- Electronics accessories
- Software and SaaS tools
- Food and beverages

**Advantages:**
- Quick market entry
- No R&D costs
- Focus on marketing and sales
- Lower risk than manufacturing

**Challenges:**
- Less product differentiation
- Competition selling same product
- Limited customization
- Dependent on supplier quality`,
    relatedTerms: ["private-label", "dropshipping", "supplier", "branding"],
    category: "business-models",
  },
  "private-label": {
    slug: "private-label",
    term: "Private Label",
    definition: "Products manufactured by a third party but sold exclusively under a retailer's own brand name.",
    extendedDefinition: `Private labeling involves working with manufacturers to create products sold exclusively under your brand. It offers more control than white labeling.

**How Private Label Works:**
1. Identify product opportunity
2. Find manufacturer (Alibaba, trade shows)
3. Customize product and packaging
4. Create brand identity
5. Launch as exclusive product

**Private Label Categories:**
- Amazon FBA private label
- Cosmetics and skincare
- Supplements
- Home goods
- Apparel and accessories

**Profit Margins:**
- Typically 40-60% gross margin
- Higher than dropshipping
- Lower than manufacturing

**Investment Required:**
- Minimum orders: 500-5000 units
- Samples and prototypes: $100-500
- Packaging design: $200-1000
- Initial inventory: $2,000-20,000`,
    relatedTerms: ["white-label", "branding", "manufacturer", "amazon-fba"],
    category: "business-models",
  },
  "wholesale": {
    slug: "wholesale",
    term: "Wholesale",
    definition: "Purchasing products in large quantities at discounted prices for resale to consumers or other businesses.",
    extendedDefinition: `Wholesale involves buying products in bulk directly from manufacturers or distributors at reduced prices, then selling individually at retail prices.

**Wholesale vs Dropshipping:**
- Wholesale: You buy and hold inventory
- Dropshipping: No inventory, supplier ships direct

**Finding Wholesale Suppliers:**
- Trade shows (Canton Fair, ASD Market Week)
- Wholesale directories (SaleHoo, Worldwide Brands)
- Alibaba for bulk orders
- Direct manufacturer contact
- Industry associations

**Wholesale Pricing Tiers:**
- Small order: 20-30% off retail
- Medium order: 30-40% off retail
- Large order: 40-50%+ off retail

**Advantages:**
- Higher profit margins
- Inventory control
- Faster shipping
- Better customer experience

**Challenges:**
- Capital required upfront
- Storage space needed
- Inventory risk
- Cash flow management`,
    relatedTerms: ["supplier", "moq", "distributor", "inventory"],
    category: "sourcing",
  },
  "moq": {
    slug: "moq",
    term: "MOQ (Minimum Order Quantity)",
    definition: "The smallest number of units a supplier will sell in a single order.",
    extendedDefinition: `Minimum Order Quantity is a supplier requirement that determines the lowest amount you can purchase. It's a critical factor in sourcing decisions.

**Why Suppliers Set MOQs:**
- Production efficiency
- Profitability per order
- Material sourcing costs
- Setup and handling costs

**Typical MOQs by Source:**
- AliExpress: 1 unit (dropship friendly)
- Alibaba: 100-1000+ units
- US wholesalers: 12-144 units
- Manufacturers: 500-10,000+ units

**Negotiating MOQs:**
- Start with smaller test orders
- Offer to pay higher per-unit price
- Build long-term relationship
- Combine with other buyers
- Negotiate during slow seasons

**MOQ Considerations:**
- Storage capacity
- Cash flow availability
- Product demand certainty
- Expiration dates (if applicable)`,
    relatedTerms: ["wholesale", "supplier", "alibaba", "inventory"],
    category: "sourcing",
  },
  "cogs": {
    slug: "cogs",
    term: "COGS (Cost of Goods Sold)",
    definition: "The direct costs of producing or purchasing products sold, including materials, labor, and shipping to your warehouse.",
    extendedDefinition: `Cost of Goods Sold represents everything you spend to acquire the products you sell. It's essential for calculating true profitability.

**COGS Components:**
- Product purchase price
- Inbound shipping/freight
- Import duties and taxes
- Packaging materials
- Direct labor (if applicable)

**COGS Calculation:**
\`\`\`
Beginning Inventory
+ Purchases During Period
- Ending Inventory
= Cost of Goods Sold
\`\`\`

**COGS vs Operating Expenses:**
- COGS: Direct product costs
- OpEx: Rent, marketing, salaries, software

**Gross Profit Formula:**
\`\`\`
Revenue - COGS = Gross Profit
Gross Profit / Revenue = Gross Margin %
\`\`\`

**Reducing COGS:**
- Negotiate better supplier pricing
- Order in larger quantities
- Find alternative suppliers
- Optimize shipping routes`,
    relatedTerms: ["profit-margin", "gross-profit", "inventory", "wholesale"],
    category: "finance",
  },
  "break-even": {
    slug: "break-even",
    term: "Break-Even Point",
    definition: "The sales volume at which total revenue equals total costs, resulting in neither profit nor loss.",
    extendedDefinition: `The break-even point tells you exactly how many units or dollars in sales you need to cover all costs. It's crucial for business planning.

**Break-Even Formula:**
\`\`\`
Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)

Example:
$5,000 fixed costs / ($50 price - $20 cost) = 167 units
\`\`\`

**Fixed Costs Examples:**
- Shopify subscription
- Software tools
- Marketing retainers
- Rent/storage
- Salaries

**Variable Costs Examples:**
- Product cost
- Shipping per order
- Payment processing fees
- Packaging materials

**Using Break-Even Analysis:**
- Set minimum sales targets
- Price products appropriately
- Evaluate product viability
- Plan marketing budgets`,
    relatedTerms: ["profit-margin", "cogs", "fixed-costs", "pricing"],
    category: "finance",
  },
  "google-ads": {
    slug: "google-ads",
    term: "Google Ads",
    definition: "Google's online advertising platform for creating search, display, shopping, and video ads across Google's network.",
    extendedDefinition: `Google Ads is essential for e-commerce, offering multiple ad formats to reach customers at different stages of the buying journey.

**Ad Types for E-commerce:**
- **Search Ads:** Text ads on search results
- **Shopping Ads:** Product images with prices
- **Display Ads:** Banner ads across websites
- **YouTube Ads:** Video advertising
- **Performance Max:** AI-optimized multi-channel

**Google Shopping Setup:**
1. Create Merchant Center account
2. Upload product feed
3. Link to Google Ads
4. Create Shopping campaigns
5. Set bids and budgets

**Key Metrics:**
- Cost per click (CPC): $0.50-$5 average
- Conversion rate: 2-4% for shopping
- ROAS target: 3-5x for profitability

**Best Practices:**
- Optimize product titles and descriptions
- Use negative keywords
- Segment by product performance
- Enable smart bidding
- Monitor search terms report`,
    relatedTerms: ["roas", "cpc", "shopping-ads", "ppc"],
    category: "advertising",
  },
  "tiktok-ads": {
    slug: "tiktok-ads",
    term: "TikTok Ads",
    definition: "TikTok's advertising platform for creating video ads that appear in users' For You feeds and across TikTok's network.",
    extendedDefinition: `TikTok Ads has become a primary channel for e-commerce brands, especially for product discovery and impulse purchases.

**Ad Formats:**
- **In-Feed Ads:** Native video ads in For You feed
- **Spark Ads:** Boost organic creator content
- **TopView:** First ad users see when opening app
- **Branded Effects:** Custom AR filters
- **Shopping Ads:** Direct product integration

**TikTok Ads Benchmarks (2026):**
- CPM: $5-12
- CTR: 1-2%
- Conversion rate: 1-3%
- Average CPA: $10-30

**Creative Best Practices:**
- First 3 seconds are critical
- Use trending sounds
- Authentic, not polished
- Show product in use
- Include clear CTA

**Targeting Options:**
- Interest-based
- Behavior-based
- Custom audiences
- Lookalike audiences
- TikTok Shop integration`,
    relatedTerms: ["social-commerce", "tiktok-shop", "cpm", "ugc"],
    category: "advertising",
  },
  "ppc": {
    slug: "ppc",
    term: "PPC (Pay-Per-Click)",
    definition: "An advertising model where advertisers pay each time a user clicks on their ad.",
    extendedDefinition: `Pay-per-click is the dominant digital advertising model. You only pay when someone takes action by clicking your ad.

**PPC Platforms:**
- Google Ads
- Meta Ads (Facebook/Instagram)
- TikTok Ads
- Microsoft Ads (Bing)
- Pinterest Ads
- Amazon Ads

**PPC vs Other Models:**
- **PPC:** Pay per click
- **CPM:** Pay per 1,000 impressions
- **CPA:** Pay per acquisition/sale

**PPC Metrics:**
- Click-through rate (CTR)
- Cost per click (CPC)
- Quality Score
- Conversion rate
- Return on ad spend (ROAS)

**PPC Strategy:**
1. Keyword research
2. Ad copy creation
3. Landing page optimization
4. Bid management
5. Continuous testing

**Budget Recommendations:**
- Start: $20-50/day
- Scale: Based on ROAS
- Kill unprofitable campaigns quickly`,
    relatedTerms: ["google-ads", "cpc", "roas", "facebook-ads"],
    category: "advertising",
  },
  "cpc": {
    slug: "cpc",
    term: "CPC (Cost Per Click)",
    definition: "The amount an advertiser pays for each click on their advertisement.",
    extendedDefinition: `Cost per click is a fundamental metric in digital advertising. It determines how much you pay to drive traffic to your website.

**CPC Formula:**
\`\`\`
CPC = Total Ad Spend / Number of Clicks

Example:
$500 spent / 250 clicks = $2.00 CPC
\`\`\`

**Average CPCs by Platform (2026):**
- Google Search: $1-5
- Google Shopping: $0.50-2
- Facebook: $0.50-2
- Instagram: $0.70-3
- TikTok: $0.50-1.50
- Pinterest: $0.30-1.50

**Factors Affecting CPC:**
- Industry competitiveness
- Keyword difficulty
- Ad quality score
- Targeting specificity
- Time of day/seasonality

**Lowering CPC:**
- Improve ad relevance
- Increase quality scores
- Use negative keywords
- Target long-tail keywords
- Optimize landing pages`,
    relatedTerms: ["ppc", "cpm", "cpa", "google-ads"],
    category: "advertising",
  },
  "ugc": {
    slug: "ugc",
    term: "UGC (User-Generated Content)",
    definition: "Content created by customers or creators rather than brands, including reviews, photos, videos, and social media posts.",
    extendedDefinition: `User-generated content has become essential for e-commerce marketing. It provides social proof and authentic perspectives that brand content cannot match.

**Types of UGC:**
- Customer reviews and ratings
- Photo and video testimonials
- Social media posts and stories
- Unboxing videos
- Before/after content
- TikTok product reviews

**Why UGC Works:**
- 92% trust peer recommendations over ads
- 4x higher click-through rates
- 29% higher conversion rates
- Lower content production costs

**UGC Platforms:**
- TikTok Shop affiliates
- Instagram tagged posts
- YouTube reviews
- Amazon reviews

**Collecting UGC:**
- Post-purchase email requests
- Branded hashtag campaigns
- Incentivized reviews
- Creator partnerships
- Contest and giveaways`,
    relatedTerms: ["social-commerce", "influencer-marketing", "reviews", "tiktok-shop"],
    category: "marketing",
  },
  "influencer-marketing": {
    slug: "influencer-marketing",
    term: "Influencer Marketing",
    definition: "Partnering with social media personalities to promote products to their engaged audiences.",
    extendedDefinition: `Influencer marketing connects brands with creators who have established trust with specific audiences. It's particularly effective for product discovery.

**Influencer Tiers:**
- **Nano (1K-10K):** Highest engagement, lowest cost
- **Micro (10K-100K):** Niche authority, good ROI
- **Mid-tier (100K-500K):** Broader reach
- **Macro (500K-1M):** Mass awareness
- **Mega (1M+):** Celebrity status

**Collaboration Types:**
- Sponsored posts
- Affiliate partnerships
- Product seeding
- Brand ambassadorships
- Whitelisting (using creator content in ads)

**Platforms:**
- TikTok (highest engagement 2026)
- Instagram (established ecosystem)
- YouTube (long-form content)
- Pinterest (discovery-focused)

**Measuring Success:**
- Engagement rate
- Click-through rate
- Conversion tracking
- Brand mentions
- Revenue attribution`,
    relatedTerms: ["ugc", "social-commerce", "tiktok-shop", "affiliate-marketing"],
    category: "marketing",
  },
  "email-marketing": {
    slug: "email-marketing",
    term: "Email Marketing",
    definition: "Using email to communicate with customers for promotional, transactional, and relationship-building purposes.",
    extendedDefinition: `Email marketing remains one of the highest ROI channels for e-commerce, generating $36-42 for every $1 spent.

**Essential Email Flows:**
- **Welcome series:** 3-5 emails for new subscribers
- **Abandoned cart:** Recover lost sales
- **Post-purchase:** Order confirmation, reviews
- **Win-back:** Re-engage inactive customers
- **Browse abandonment:** Product reminders

**Key Metrics:**
- Open rate: 15-25% average
- Click rate: 2-5% average
- Conversion rate: 1-5%
- Revenue per email

**Email Platforms:**
- Klaviyo (e-commerce focused)
- Omnisend
- Mailchimp
- Drip
- Postscript (SMS)

**Best Practices:**
- Segment your list
- Personalize content
- Mobile-optimized design
- Clear CTAs
- A/B test subject lines
- Clean list regularly`,
    relatedTerms: ["abandoned-cart", "conversion-rate", "klaviyo", "crm"],
    category: "marketing",
  },
  "woocommerce": {
    slug: "woocommerce",
    term: "WooCommerce",
    definition: "An open-source e-commerce plugin for WordPress that enables website owners to create and manage online stores.",
    extendedDefinition: `WooCommerce powers over 6 million online stores, making it the most widely used e-commerce platform by market share.

**Advantages:**
- Free core plugin
- Full customization control
- Thousands of extensions
- Own your data
- WordPress ecosystem

**Disadvantages:**
- Requires hosting management
- Security responsibility
- Technical knowledge needed
- Plugin compatibility issues

**WooCommerce vs Shopify:**
- WooCommerce: More control, more work
- Shopify: Easier, more expensive

**Essential Plugins:**
- Payment gateways
- Shipping calculators
- SEO optimization
- Security and backup
- Analytics

**Costs:**
- Hosting: $10-50/month
- Theme: $0-200 one-time
- Extensions: Varies
- Maintenance: Ongoing`,
    relatedTerms: ["shopify", "ecommerce", "wordpress", "cms"],
    category: "platforms",
  },
  "amazon-fba": {
    slug: "amazon-fba",
    term: "Amazon FBA",
    definition: "Fulfillment by Amazon, a service where Amazon stores, picks, packs, and ships products on behalf of sellers.",
    extendedDefinition: `FBA lets sellers leverage Amazon's world-class logistics infrastructure. Products become Prime-eligible, significantly boosting sales potential.

**How FBA Works:**
1. Send products to Amazon warehouses
2. Amazon stores your inventory
3. Customer orders on Amazon
4. Amazon picks, packs, ships
5. Amazon handles returns

**FBA Fees:**
- Fulfillment fee: $3-8+ per unit
- Storage fee: $0.75-2.40/cubic foot/month
- Long-term storage: Additional charges
- Removal fees: $0.25-0.60 per unit

**Advantages:**
- Prime badge (2-day shipping)
- Buy Box advantage
- Customer service handled
- Multi-channel fulfillment option

**Disadvantages:**
- High fees eat margins
- Limited branding
- Storage limits
- Commingled inventory risks`,
    relatedTerms: ["3pl", "fulfillment", "amazon", "private-label"],
    category: "platforms",
  },
  "sku": {
    slug: "sku",
    term: "SKU (Stock Keeping Unit)",
    definition: "A unique alphanumeric code assigned to each distinct product for inventory tracking and management.",
    extendedDefinition: `SKUs are essential for inventory management, order processing, and product organization in e-commerce.

**SKU Structure:**
\`\`\`
Category-Brand-Size-Color
Example: SHRT-NIKE-LG-BLU
\`\`\`

**SKU Best Practices:**
- Keep consistent format
- Include key attributes
- Avoid special characters
- Make them scannable
- Document your system

**SKU vs Other Identifiers:**
- **SKU:** Internal tracking code (you create)
- **UPC:** Universal barcode (purchased)
- **ASIN:** Amazon's product ID
- **MPN:** Manufacturer part number

**Why SKUs Matter:**
- Inventory accuracy
- Order fulfillment speed
- Sales analysis by variant
- Reorder point tracking
- Multi-channel sync`,
    relatedTerms: ["inventory", "product-catalog", "upc", "fulfillment"],
    category: "operations",
  },
  "inventory": {
    slug: "inventory",
    term: "Inventory",
    definition: "The total stock of products a business has available for sale at any given time.",
    extendedDefinition: `Inventory management is critical for e-commerce success. Too much ties up capital; too little loses sales.

**Inventory Types:**
- **Raw materials:** Components before assembly
- **Work in progress:** Partially completed items
- **Finished goods:** Ready to sell
- **Safety stock:** Buffer for demand spikes

**Inventory Metrics:**
- **Days of inventory:** How long stock lasts
- **Turnover rate:** How fast you sell through
- **Stockout rate:** % of time out of stock
- **Carrying cost:** Cost to hold inventory

**Inventory Methods:**
- FIFO (First In, First Out)
- LIFO (Last In, First Out)
- Weighted average cost

**Management Software:**
- Shopify Inventory
- TradeGecko/QuickBooks Commerce
- Cin7
- Skubana
- Ordoro`,
    relatedTerms: ["sku", "3pl", "warehouse", "fulfillment"],
    category: "operations",
  },
  "shipping": {
    slug: "shipping",
    term: "Shipping",
    definition: "The process of transporting products from seller to customer, including carrier selection, packaging, and delivery.",
    extendedDefinition: `Shipping is often the most critical factor in customer satisfaction and repeat purchases for e-commerce.

**Shipping Options:**
- **Free shipping:** Best for conversion (build into price)
- **Flat rate:** Simple, predictable
- **Real-time rates:** Accurate but complex
- **Local delivery:** Fast, personal

**Major Carriers:**
- USPS (best for lightweight)
- UPS (reliable, business-focused)
- FedEx (fast options)
- DHL (international)
- Regional carriers

**Shipping Speed Expectations (2026):**
- Same-day: Growing demand
- Next-day: Premium standard
- 2-day: Expected baseline
- 3-5 day: Budget option
- 7-14 day: Dropshipping typical

**Reducing Shipping Costs:**
- Negotiate carrier rates
- Use shipping software
- Optimize packaging size
- Offer pickup options
- Zone-based pricing`,
    relatedTerms: ["fulfillment", "3pl", "carrier", "tracking"],
    category: "operations",
  },
  "epacket": {
    slug: "epacket",
    term: "ePacket",
    definition: "An affordable shipping option from China to select countries, offering tracking and faster delivery than standard international mail.",
    extendedDefinition: `ePacket was the go-to shipping method for dropshippers sourcing from China, though its advantages have diminished since postal treaty changes.

**ePacket Characteristics:**
- Tracking available
- 7-20 days delivery (varies)
- Low cost ($2-5 typically)
- Weight limit: 2kg
- Size restrictions apply

**Availability:**
- US, UK, Canada, Australia
- Select European countries
- Some Asian markets

**ePacket Evolution:**
- 2011: Introduced for China-US
- 2020: Postal subsidy reductions
- 2024+: Less cost advantage

**Alternatives:**
- AliExpress Standard Shipping
- Yanwen
- China Post Registered
- CJ Dropshipping local warehouses
- US/EU-based suppliers (Spocket)`,
    relatedTerms: ["dropshipping", "aliexpress", "shipping", "china-sourcing"],
    category: "operations",
  },
  "chargeback": {
    slug: "chargeback",
    term: "Chargeback",
    definition: "A forced refund initiated by a customer's bank when disputing a transaction, taking funds from the merchant's account.",
    extendedDefinition: `Chargebacks are costly for merchants, involving not just the refund amount but also fees and potential account penalties.

**Chargeback Process:**
1. Customer disputes with bank
2. Bank issues provisional credit
3. Merchant notified
4. Merchant can provide evidence
5. Bank makes final decision

**Common Chargeback Reasons:**
- Unauthorized transaction
- Item not received
- Product not as described
- Duplicate charge
- Subscription cancellation issues

**Chargeback Costs:**
- Refund amount
- Fee: $15-100 per chargeback
- Increased processing rates
- Account termination risk

**Prevention:**
- Clear product descriptions
- Prominent contact information
- Fast response to complaints
- Delivery confirmation
- Clear refund policy
- Recognizable billing descriptor`,
    relatedTerms: ["payment-gateway", "fraud-prevention", "refund", "dispute"],
    category: "payments",
  },
  "payment-gateway": {
    slug: "payment-gateway",
    term: "Payment Gateway",
    definition: "Technology that securely processes online payment transactions between customers and merchants.",
    extendedDefinition: `Payment gateways authorize and process credit card and digital wallet transactions for e-commerce stores.

**How Payment Gateways Work:**
1. Customer enters payment info
2. Gateway encrypts data
3. Sends to payment processor
4. Processor contacts card network
5. Bank approves/declines
6. Result sent back to merchant

**Popular Payment Gateways:**
- Shopify Payments (Stripe)
- PayPal
- Stripe
- Square
- Authorize.net
- Braintree

**Fees:**
- Transaction fee: 2.4-2.9% + $0.30
- International: Additional 1-1.5%
- Chargebacks: $15-25 each

**Selection Criteria:**
- Supported countries
- Currency options
- Integration ease
- Fraud protection
- Payout speed`,
    relatedTerms: ["stripe", "paypal", "checkout", "chargeback"],
    category: "payments",
  },
  "stripe": {
    slug: "stripe",
    term: "Stripe",
    definition: "A leading online payment processing platform for internet businesses, powering millions of e-commerce stores.",
    extendedDefinition: `Stripe is the payment infrastructure of choice for modern e-commerce, powering Shopify Payments and thousands of independent stores.

**Stripe Features:**
- Credit/debit card processing
- Digital wallets (Apple Pay, Google Pay)
- Buy now pay later (Klarna, Affirm)
- Subscription billing
- Fraud detection (Radar)
- International payments

**Pricing (2026):**
- Online: 2.9% + $0.30 per transaction
- In-person: 2.7% + $0.05
- International: +1.5%
- Currency conversion: +1%

**Developer Features:**
- Comprehensive APIs
- Webhooks
- Dashboard analytics
- Test mode
- Pre-built checkout

**Advantages:**
- Industry-leading reliability
- Extensive documentation
- Modern developer experience
- Strong fraud prevention`,
    relatedTerms: ["payment-gateway", "shopify", "checkout", "subscription"],
    category: "payments",
  },
  "paypal": {
    slug: "paypal",
    term: "PayPal",
    definition: "A digital payment platform allowing online money transfers and serving as an electronic alternative to traditional payment methods.",
    extendedDefinition: `PayPal is one of the most trusted names in online payments, with over 400 million active users globally.

**PayPal for E-commerce:**
- PayPal Checkout
- Pay Later options
- Venmo (US)
- PayPal Credit
- Business accounts

**Fees:**
- Standard: 2.99% + $0.49
- PayPal Checkout: 3.49% + $0.49
- International: Additional 1.5%
- Micropayments: 5% + $0.05

**Why Offer PayPal:**
- Buyer trust and protection
- No card entry required
- Mobile-friendly
- 22% higher checkout conversion
- Guest checkout option

**Limitations:**
- Higher fees than alternatives
- Account holds possible
- Complex dispute process
- Seller protection gaps`,
    relatedTerms: ["payment-gateway", "stripe", "checkout", "buy-now-pay-later"],
    category: "payments",
  },
  "buy-now-pay-later": {
    slug: "buy-now-pay-later",
    term: "Buy Now Pay Later (BNPL)",
    definition: "Payment options allowing customers to purchase items immediately and pay in installments over time, often interest-free.",
    extendedDefinition: `BNPL has transformed e-commerce checkout, increasing average order values and conversion rates significantly.

**Major BNPL Providers:**
- Shop Pay Installments (Shopify)
- Klarna
- Afterpay
- Affirm
- Sezzle
- PayPal Pay Later

**How BNPL Works:**
1. Customer selects BNPL at checkout
2. Quick credit check (soft pull)
3. Approval in seconds
4. Merchant paid immediately (minus fee)
5. Customer pays in 4 installments

**Merchant Benefits:**
- 20-30% higher AOV
- Improved conversion
- Younger demographics
- Reduced cart abandonment

**Fees:**
- Merchant pays 4-6% per transaction
- Customer pays nothing (if on time)
- Late fees for customers who miss payments`,
    relatedTerms: ["aov", "checkout", "payment-gateway", "conversion-rate"],
    category: "payments",
  },
  "pixel": {
    slug: "pixel",
    term: "Pixel (Tracking Pixel)",
    definition: "A small piece of code placed on a website to track user behavior, conversions, and enable retargeting.",
    extendedDefinition: `Tracking pixels are essential for e-commerce advertising, enabling conversion tracking and audience building.

**Common Pixels:**
- Meta Pixel (Facebook/Instagram)
- TikTok Pixel
- Google Ads Conversion Tag
- Pinterest Tag
- Snapchat Pixel

**What Pixels Track:**
- Page views
- Add to cart events
- Purchases and revenue
- Email signups
- Button clicks
- Scroll depth

**Meta Pixel Events:**
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase
- Search
- Lead

**Implementation:**
- Direct code installation
- Google Tag Manager
- Shopify app integration
- Server-side tracking (recommended 2026)

**Privacy Considerations:**
- iOS 14.5+ tracking limits
- Cookie consent required
- Server-side alternatives
- Conversion API (CAPI)`,
    relatedTerms: ["retargeting", "facebook-ads", "conversion-rate", "tracking"],
    category: "technical",
  },
  "api": {
    slug: "api",
    term: "API (Application Programming Interface)",
    definition: "A set of rules and protocols that allows different software applications to communicate with each other.",
    extendedDefinition: `APIs are the backbone of modern e-commerce, enabling integrations between platforms, apps, and services.

**Common E-commerce APIs:**
- Shopify Admin API
- Stripe API
- Shipping carrier APIs
- Inventory management
- Marketing platform APIs

**API Types:**
- **REST:** Most common, HTTP-based
- **GraphQL:** Flexible queries (Shopify uses this)
- **Webhooks:** Real-time event notifications

**What APIs Enable:**
- Sync inventory across channels
- Automate order processing
- Connect marketing tools
- Build custom integrations
- Create apps and extensions

**API Concepts:**
- Endpoints (URLs)
- Authentication (API keys, OAuth)
- Rate limits
- Request/response format (JSON)

**For Non-Developers:**
- Use apps with built-in integrations
- Zapier/Make for no-code automation
- Hire developers for custom work`,
    relatedTerms: ["webhook", "integration", "shopify", "automation"],
    category: "technical",
  },
  "product-research": {
    slug: "product-research",
    term: "Product Research",
    definition: "The process of analyzing market demand, competition, and profitability to identify promising products to sell.",
    extendedDefinition: `Product research is the foundation of dropshipping success. Finding winning products before competitors is key to profitability.

**Research Methods:**
- Social media trends (TikTok, Instagram)
- Amazon Best Sellers and Movers
- Google Trends analysis
- Competitor store analysis
- Supplier platform trends

**Product Research Tools:**
- Dropship.io
- Sell The Trend
- Niche Scraper
- Ecomhunt
- Minea (ad spy)

**Evaluation Criteria:**
- Search volume and trends
- Competition level
- Profit margin potential
- Shipping feasibility
- Supplier availability

**Validation Checklist:**
- Multiple suppliers exist
- Positive reviews elsewhere
- Not restricted for advertising
- Clear target audience
- Unique selling angle possible

**Testing Budget:**
- $50-100 per product
- Kill if no sales after $100 ad spend
- Scale winners quickly`,
    relatedTerms: ["winning-product", "niche", "competitor-analysis", "market-research"],
    category: "strategy",
  },
  "competitor-analysis": {
    slug: "competitor-analysis",
    term: "Competitor Analysis",
    definition: "The process of researching and evaluating competing businesses to understand their strategies, strengths, and weaknesses.",
    extendedDefinition: `Understanding your competitors helps you differentiate your store and identify opportunities they're missing.

**What to Analyze:**
- Product selection and pricing
- Website design and UX
- Marketing channels and messaging
- Customer reviews
- Social media presence
- Ad creatives

**Tools for Competitor Research:**
- SimilarWeb (traffic analysis)
- Facebook Ad Library (ad spy)
- Minea/AdSpy (ad databases)
- Store Inspector (Shopify analysis)
- Social Blade (social metrics)

**Finding Competitors:**
- Search your product keywords
- Check supplier best sellers
- Browse social media hashtags
- Use ad spy tools

**Key Questions:**
- What's their unique value proposition?
- What are customers complaining about?
- Which marketing channels work for them?
- What gaps can you fill?
- How can you differentiate?`,
    relatedTerms: ["product-research", "market-research", "niche", "differentiation"],
    category: "strategy",
  },
  "landing-page": {
    slug: "landing-page",
    term: "Landing Page",
    definition: "A standalone web page designed specifically for a marketing campaign to convert visitors into customers or leads.",
    extendedDefinition: `Landing pages are focused conversion tools that strip away distractions and guide visitors toward a single action.

**Landing Page vs Homepage:**
- Landing page: Single focused goal
- Homepage: Multiple navigation options

**Essential Elements:**
- Compelling headline
- Clear value proposition
- High-quality images/video
- Social proof (reviews, testimonials)
- Strong call-to-action
- Trust signals (guarantees, security)

**Landing Page Types:**
- Product pages
- Collection pages
- Quiz funnels
- Lead magnets
- Flash sales
- Pre-launch pages

**Optimization Tips:**
- Match ad messaging
- Mobile-first design
- Fast load speed
- Above-the-fold CTA
- Remove navigation
- A/B test continuously

**Conversion Benchmarks:**
- Average: 2-3%
- Good: 5-10%
- Excellent: 10%+`,
    relatedTerms: ["conversion-rate", "cta", "ab-testing", "sales-funnel"],
    category: "marketing",
  },
  "bounce-rate": {
    slug: "bounce-rate",
    term: "Bounce Rate",
    definition: "The percentage of visitors who leave a website after viewing only one page without taking any action.",
    extendedDefinition: `Bounce rate indicates how well your page meets visitor expectations. High bounce rates often signal relevance or user experience issues.

**Bounce Rate Calculation:**
\`\`\`
Bounce Rate = Single-page visits / Total visits × 100

Example: 300 bounces / 1,000 visits = 30%
\`\`\`

**Benchmarks by Page Type:**
- Homepage: 40-60%
- Product pages: 30-50%
- Blog posts: 60-80%
- Landing pages: 40-60%

**High Bounce Rate Causes:**
- Slow page load
- Poor mobile experience
- Misleading ads/links
- Confusing navigation
- Unappealing design
- Wrong audience targeting

**Reducing Bounce Rate:**
- Improve page speed
- Match ad to landing page
- Clear value proposition above fold
- Easy navigation
- Engaging content
- Internal linking`,
    relatedTerms: ["conversion-rate", "landing-page", "user-experience", "analytics"],
    category: "metrics",
  },
  "ab-testing": {
    slug: "ab-testing",
    term: "A/B Testing",
    definition: "A method of comparing two versions of a webpage, email, or ad to determine which performs better.",
    extendedDefinition: `A/B testing (split testing) is essential for data-driven optimization of your e-commerce store and marketing.

**What to A/B Test:**
- Headlines and copy
- Product images
- CTA buttons (text, color, placement)
- Pricing and offers
- Page layouts
- Email subject lines
- Ad creatives

**A/B Testing Process:**
1. Identify element to test
2. Create variant (change ONE thing)
3. Split traffic 50/50
4. Run until statistical significance
5. Implement winner
6. Test next element

**Sample Size Requirements:**
- Need enough traffic for valid results
- Typically 100+ conversions per variant
- Run for at least 1-2 weeks

**Tools:**
- Google Optimize (free)
- Optimizely
- VWO
- Shopify built-in testing
- Facebook/Google Ads experiments

**Common Mistakes:**
- Testing too many things at once
- Ending tests too early
- Ignoring statistical significance`,
    relatedTerms: ["conversion-rate", "landing-page", "optimization", "analytics"],
    category: "strategy",
  },
  "upsell": {
    slug: "upsell",
    term: "Upsell",
    definition: "A sales technique encouraging customers to purchase a more expensive or premium version of the product they're considering.",
    extendedDefinition: `Upselling increases revenue without acquiring new customers by maximizing the value of each transaction.

**Upsell vs Cross-sell:**
- Upsell: Better version of same product
- Cross-sell: Related complementary products

**Upsell Examples:**
- Basic → Pro subscription
- Small → Large size
- Standard → Express shipping
- Single → Bundle pack

**When to Upsell:**
- Product page (upgrade options)
- Cart page (before checkout)
- Post-purchase (order bump)
- Email follow-up

**Best Practices:**
- Keep it relevant
- Show clear value difference
- Limit to 1-2 options
- Use comparison tables
- Discount the upgrade

**Metrics:**
- Upsell conversion rate
- Revenue per upsell
- AOV increase percentage`,
    relatedTerms: ["cross-sell", "aov", "bundling", "checkout"],
    category: "strategy",
  },
  "cross-sell": {
    slug: "cross-sell",
    term: "Cross-sell",
    definition: "A sales technique suggesting related or complementary products to customers based on what they're buying.",
    extendedDefinition: `Cross-selling increases order value by recommending products that enhance or complement the main purchase.

**Cross-sell Examples:**
- Phone → Case, charger, screen protector
- Dress → Matching accessories
- Camera → Memory card, tripod, bag
- Coffee maker → Filters, mugs, beans

**Implementation:**
- "Frequently bought together"
- "Customers also bought"
- Product page recommendations
- Cart page suggestions
- Post-purchase emails

**Best Practices:**
- Relevance is key
- Show 2-4 options max
- Bundle for discount
- Use AI recommendations
- Test placement

**Platforms:**
- Shopify: Rebuy, Bold Upsell
- WooCommerce: Built-in
- Custom: Recommendation APIs`,
    relatedTerms: ["upsell", "aov", "bundling", "personalization"],
    category: "strategy",
  },
  "bundling": {
    slug: "bundling",
    term: "Bundling",
    definition: "Combining multiple products into a single package sold at a discounted price compared to buying items separately.",
    extendedDefinition: `Product bundling increases AOV and perceived value while helping move slower inventory.

**Bundle Types:**
- **Pure bundle:** Only sold together
- **Mixed bundle:** Available separately or together
- **Cross-category:** Products from different categories
- **BOGO:** Buy one get one

**Bundle Strategies:**
- Starter kits (everything to begin)
- Gift sets (curated selections)
- Replenishment bundles (consumables)
- Seasonal bundles (holiday themes)

**Pricing Psychology:**
- Show original vs bundle price
- Calculate % saved
- Anchor with higher price first

**Best Practices:**
- Bundle complementary items
- Offer real value (15-25% off)
- Create scarcity
- Name bundles memorably
- Test different combinations`,
    relatedTerms: ["aov", "upsell", "cross-sell", "pricing"],
    category: "strategy",
  },
  "subscription": {
    slug: "subscription",
    term: "Subscription",
    definition: "A recurring payment model where customers pay regularly to receive products or services on an ongoing basis.",
    extendedDefinition: `Subscription commerce reached $450 billion globally by 2026. It provides predictable revenue and increases customer lifetime value.

**Subscription Types:**
- **Replenishment:** Auto-reorder consumables
- **Curation:** Surprise boxes (subscription boxes)
- **Access:** Members-only products or prices
- **SaaS:** Software subscriptions

**Benefits:**
- Predictable recurring revenue
- Higher customer LTV
- Lower acquisition costs (retention focus)
- Better inventory planning

**Subscription Platforms:**
- Recharge (Shopify)
- Bold Subscriptions
- Ordergroove
- Smartrr

**Key Metrics:**
- MRR (Monthly Recurring Revenue)
- Churn rate
- Subscriber LTV
- Retention rate

**Best Practices:**
- Offer flexibility (pause, skip, cancel)
- Provide subscription discount (10-20%)
- Easy management portal
- Surprise and delight customers`,
    relatedTerms: ["ltv", "churn", "retention", "mrr"],
    category: "business-models",
  },
  "churn": {
    slug: "churn",
    term: "Churn Rate",
    definition: "The percentage of customers who stop doing business with a company during a given time period.",
    extendedDefinition: `Churn rate is critical for subscription businesses and any company focused on customer retention.

**Calculating Churn:**
\`\`\`
Monthly Churn = Customers Lost / Starting Customers × 100

Example: 50 churned / 1,000 customers = 5% monthly churn
\`\`\`

**Churn Benchmarks:**
- Excellent: <2% monthly
- Good: 2-5% monthly
- Poor: >5% monthly
- Subscription boxes: 10-15% monthly typical

**Types of Churn:**
- Voluntary: Customer chooses to leave
- Involuntary: Failed payments, card expiry
- Revenue churn: Lost revenue (different from customer count)

**Reducing Churn:**
- Improve product quality
- Enhance customer service
- Add value continuously
- Win-back campaigns
- Failed payment recovery
- Exit surveys

**Revenue Impact:**
5% churn improvement can increase profits 25-95%`,
    relatedTerms: ["subscription", "ltv", "retention", "customer-success"],
    category: "metrics",
  },
  "retention": {
    slug: "retention",
    term: "Retention Rate",
    definition: "The percentage of customers who continue to purchase from a business over a given time period.",
    extendedDefinition: `Customer retention is more cost-effective than acquisition. Increasing retention by 5% can boost profits 25-95%.

**Calculating Retention:**
\`\`\`
Retention Rate = ((Ending Customers - New Customers) / Starting Customers) × 100

Example: ((950 - 100) / 1000) × 100 = 85% retention
\`\`\`

**Retention Benchmarks:**
- Excellent: 90%+ annual
- Good: 70-90% annual
- Average: 50-70% annual

**Retention Strategies:**
- Email marketing and sequences
- Loyalty and rewards programs
- Exceptional customer service
- Post-purchase follow-up
- Exclusive offers for existing customers
- Community building

**Retention vs Acquisition:**
- Acquisition cost: 5-25x retention cost
- Existing customers: 60-70% conversion vs 5-20% new
- Retained customers: Higher AOV over time`,
    relatedTerms: ["churn", "ltv", "loyalty-program", "customer-success"],
    category: "metrics",
  },
  "alibaba": {
    slug: "alibaba",
    term: "Alibaba",
    definition: "The world's largest B2B e-commerce platform connecting manufacturers and wholesalers with business buyers globally.",
    extendedDefinition: `Alibaba is the primary platform for sourcing products in bulk from Chinese manufacturers, ideal for private label and wholesale.

**Alibaba vs AliExpress:**
- Alibaba: B2B, bulk orders, lower prices
- AliExpress: B2C/dropshipping, single units

**Finding Suppliers:**
- Search product keywords
- Filter by verified suppliers
- Check Gold Supplier status
- Review trade assurance
- Read buyer reviews

**Order Process:**
1. Contact multiple suppliers
2. Request quotes and samples
3. Negotiate pricing and MOQ
4. Use Trade Assurance for protection
5. Arrange shipping (often separate)

**Due Diligence:**
- Request samples before bulk order
- Verify business license
- Video call the factory
- Start with small order
- Use inspection services

**Shipping Options:**
- Sea freight (cheapest, slowest)
- Air freight (faster, expensive)
- Express (fastest, most expensive)`,
    relatedTerms: ["aliexpress", "supplier", "moq", "wholesale"],
    category: "platforms",
  },
  "cj-dropshipping": {
    slug: "cj-dropshipping",
    term: "CJ Dropshipping",
    definition: "A dropshipping platform offering product sourcing, warehousing, and fulfillment services with faster shipping options.",
    extendedDefinition: `CJ Dropshipping has become a popular AliExpress alternative, offering better shipping times through their warehouse network.

**CJ Dropshipping Features:**
- Product sourcing from China
- US/EU warehouse options
- Print on demand services
- Custom packaging available
- Product photography
- Quality inspection

**Advantages over AliExpress:**
- Faster shipping (US warehouse: 3-7 days)
- Better communication
- Branded packaging options
- Integration with Shopify
- Bulk sourcing services

**How to Use CJ:**
1. Create free account
2. Connect your Shopify store
3. Search or request products
4. Import to store
5. Orders auto-sync for fulfillment

**Pricing:**
- No membership fee
- Pay per product (wholesale price)
- Shipping calculated per order

**Considerations:**
- Quality varies by supplier
- US warehouse limited selection
- Communication can be slow`,
    relatedTerms: ["dropshipping", "aliexpress", "spocket", "fulfillment"],
    category: "platforms",
  },
  "spocket": {
    slug: "spocket",
    term: "Spocket",
    definition: "A dropshipping marketplace featuring suppliers primarily from the US and EU for faster shipping times.",
    extendedDefinition: `Spocket focuses on domestic and European suppliers, solving the long shipping time problem of traditional dropshipping.

**Spocket Features:**
- US/EU-based suppliers (60%+)
- 2-7 day shipping typical
- Shopify/WooCommerce integration
- Branded invoicing
- Real-time inventory sync
- Sample orders available

**Pricing Plans:**
- Free: Limited products
- Starter: $39/month
- Pro: $59/month
- Empire: $99/month

**Advantages:**
- Fast domestic shipping
- Higher quality products
- Easier returns handling
- Better customer experience
- Competitive with Amazon Prime

**Limitations:**
- Higher product costs
- Smaller product selection
- Monthly subscription required
- Less variety than AliExpress`,
    relatedTerms: ["dropshipping", "aliexpress", "cj-dropshipping", "supplier"],
    category: "platforms",
  },
  "oberlo": {
    slug: "oberlo",
    term: "Oberlo",
    definition: "A Shopify app that was used to find and import dropshipping products from AliExpress (discontinued in 2022, replaced by DSers).",
    extendedDefinition: `Oberlo was the original Shopify dropshipping app, helping launch thousands of stores before being discontinued.

**Oberlo History:**
- Founded: 2015
- Acquired by Shopify: 2017
- Discontinued: June 2022
- Replacement: DSers (official)

**What Oberlo Did:**
- AliExpress product import
- One-click order fulfillment
- Price and inventory sync
- Order tracking

**DSers (Replacement):**
- Official AliExpress partner
- Bulk order processing
- Supplier optimization
- Multiple store support
- Advanced mapping

**Other Alternatives:**
- Spocket (US/EU suppliers)
- CJ Dropshipping
- Zendrop
- AutoDS
- Dropified

**Migration:**
Oberlo users were migrated to DSers with existing products and settings preserved.`,
    relatedTerms: ["dsers", "aliexpress", "dropshipping", "shopify"],
    category: "platforms",
  },
  "dsers": {
    slug: "dsers",
    term: "DSers",
    definition: "The official AliExpress dropshipping partner app for Shopify, replacing Oberlo for product import and order fulfillment.",
    extendedDefinition: `DSers is now the go-to solution for AliExpress dropshipping, offering advanced features and bulk processing capabilities.

**DSers Features:**
- AliExpress product import
- Bulk order processing (100s at once)
- Supplier optimizer (find better prices)
- Multiple stores management
- Shipping method mapping
- Order tracking sync

**Pricing:**
- Free: Basic features, limited products
- Advanced: $19.90/month
- Pro: $49.90/month

**Key Advantages:**
- Faster bulk ordering
- Affiliate commissions from AliExpress
- Shipping cost calculator
- Bundle products feature
- Variant mapping

**Setup Process:**
1. Install DSers app
2. Connect AliExpress account
3. Import products
4. Map variants and shipping
5. Process orders in bulk`,
    relatedTerms: ["oberlo", "aliexpress", "dropshipping", "shopify"],
    category: "platforms",
  },
  "checkout": {
    slug: "checkout",
    term: "Checkout",
    definition: "The final step in the e-commerce purchase process where customers enter shipping, payment information and complete their order.",
    extendedDefinition: `Checkout optimization is critical—the average cart abandonment rate is 70%, with most drop-offs happening at checkout.

**Checkout Types:**
- **Standard:** Multi-page traditional
- **One-page:** Everything on single page
- **Express:** Apple Pay, Shop Pay
- **Guest:** No account required

**Shopify Checkout:**
- Shop Pay (fastest conversion)
- Checkout extensibility
- Post-purchase upsells
- Express payment options

**Optimization Tips:**
- Enable guest checkout
- Minimize form fields
- Show progress indicator
- Display trust badges
- Multiple payment options
- Clear shipping costs upfront

**Payment Options (2026):**
- Credit/debit cards
- Digital wallets (Apple Pay, Google Pay)
- Shop Pay
- PayPal
- Buy Now Pay Later
- Cryptocurrency (emerging)`,
    relatedTerms: ["abandoned-cart", "payment-gateway", "conversion-rate", "buy-now-pay-later"],
    category: "operations",
  },
  "reviews": {
    slug: "reviews",
    term: "Reviews",
    definition: "Customer feedback and ratings about products and shopping experiences that influence purchasing decisions.",
    extendedDefinition: `Reviews are essential social proof. 93% of consumers read reviews before purchasing, and products with reviews convert 270% better.

**Types of Reviews:**
- Star ratings (1-5)
- Written testimonials
- Photo reviews
- Video reviews
- Verified purchase badges

**Review Platforms:**
- Native Shopify reviews
- Loox (photo reviews)
- Judge.me
- Yotpo
- Stamped.io
- Trustpilot

**Collecting Reviews:**
- Post-purchase email sequences
- SMS follow-up
- Incentivized reviews (discount for next purchase)
- QR codes in packaging

**Review Best Practices:**
- Respond to negative reviews
- Display on product pages
- Show average rating
- Include review count
- Feature photo/video reviews

**Impact:**
- 5 reviews minimum for credibility
- 4.2-4.7 star sweet spot
- Negative reviews add authenticity`,
    relatedTerms: ["ugc", "social-proof", "conversion-rate", "trust-signals"],
    category: "customer-experience",
  },
  "returns": {
    slug: "returns",
    term: "Returns Policy",
    definition: "The rules and procedures governing how customers can return products and receive refunds or exchanges.",
    extendedDefinition: `A clear returns policy builds trust and reduces purchase anxiety. 67% of shoppers check the return policy before buying.

**Return Policy Elements:**
- Return window (30-60 days typical)
- Condition requirements
- Who pays return shipping
- Refund vs store credit
- Exceptions (final sale items)

**Dropshipping Returns:**
- Higher complexity than traditional
- Coordinate with supplier
- Often offer refund without return
- Consider restocking fees
- Clear policy reduces disputes

**Best Practices:**
- Easy-to-find policy page
- Simple, clear language
- FAQ section
- Self-service return portal
- Pre-paid return labels (if offering)

**Return Rate Benchmarks:**
- Apparel: 20-30%
- Electronics: 10-15%
- Home goods: 5-10%
- Overall e-commerce: 15-20%`,
    relatedTerms: ["refund", "customer-service", "chargeback", "policy"],
    category: "operations",
  },
  "customer-service": {
    slug: "customer-service",
    term: "Customer Service",
    definition: "The support and assistance provided to customers before, during, and after their purchase.",
    extendedDefinition: `Excellent customer service differentiates stores and builds loyalty. 86% of customers will pay more for better service.

**Support Channels:**
- Email (most common)
- Live chat (highest satisfaction)
- Phone (complex issues)
- Social media DMs
- Self-service FAQ/help center

**Response Time Expectations (2026):**
- Live chat: Under 1 minute
- Social media: Under 1 hour
- Email: Under 24 hours
- Phone: Under 3 minutes wait

**Customer Service Tools:**
- Gorgias (e-commerce focused)
- Zendesk
- Freshdesk
- Intercom
- Tidio

**Key Metrics:**
- First response time
- Resolution time
- Customer satisfaction (CSAT)
- Net Promoter Score (NPS)

**Dropshipping Challenges:**
- Limited control over shipping
- Supplier communication delays
- Product quality issues
- Managing expectations`,
    relatedTerms: ["returns", "chargeback", "reviews", "retention"],
    category: "customer-experience",
  },
  "gdpr": {
    slug: "gdpr",
    term: "GDPR",
    definition: "General Data Protection Regulation, the EU law governing data privacy and protection for individuals.",
    extendedDefinition: `GDPR affects any business collecting data from EU residents. Non-compliance can result in fines up to €20 million or 4% of global revenue.

**Key Requirements:**
- Cookie consent banners
- Privacy policy
- Data access requests
- Right to deletion
- Data breach notification
- Consent for marketing

**For E-commerce Stores:**
- Cookie consent popup
- Clear privacy policy
- Unsubscribe in all emails
- Secure data storage
- Order data retention limits

**Compliance Checklist:**
- Install cookie consent app
- Update privacy policy
- Review email marketing consent
- Document data practices
- Train team on requirements

**Tools:**
- Cookie consent apps (Pandectes, CookieYes)
- Email platforms with GDPR features
- Data request management`,
    relatedTerms: ["privacy-policy", "compliance", "cookies", "data-protection"],
    category: "legal",
  },
  "trademark": {
    slug: "trademark",
    term: "Trademark",
    definition: "A legal protection for brand names, logos, and slogans that distinguishes goods and services from competitors.",
    extendedDefinition: `Trademarks protect your brand identity. Understanding them also prevents selling counterfeit products.

**Trademark Basics:**
- Protects brand elements
- ® = Registered trademark
- ™ = Unregistered claim
- Lasts as long as in use
- Must be enforced by owner

**For Dropshippers:**
- Don't sell counterfeit products
- Avoid trademark infringement
- Can't use brand names in ads (usually)
- Be careful with product images

**Registering Your Brand:**
- Search existing trademarks
- File with USPTO (US)
- $250-350 per class
- Takes 12-18 months
- Consider attorney help

**Common Issues:**
- Fake branded products (AliExpress)
- Using brand names in Google Ads
- Competitor trademark complaints
- Amazon brand registry requirements`,
    relatedTerms: ["branding", "copyright", "legal", "intellectual-property"],
    category: "legal",
  },
  "sales-tax": {
    slug: "sales-tax",
    term: "Sales Tax",
    definition: "A consumption tax charged on retail sales of goods and services, collected by sellers and remitted to government.",
    extendedDefinition: `Sales tax compliance became complex after the 2018 South Dakota v. Wayfair ruling established economic nexus for online sellers.

**Nexus Types:**
- **Physical:** Warehouse, office, employees
- **Economic:** Sales volume or transaction thresholds
- **Click-through:** Affiliate nexus

**Economic Nexus Thresholds (varies by state):**
- Common: $100,000 sales or 200 transactions
- Some states: $100,000 OR 200 transactions
- Changes regularly—check current rules

**Sales Tax Process:**
1. Determine where you have nexus
2. Register in those states
3. Configure tax collection
4. File and remit on schedule

**Automation Tools:**
- TaxJar
- Avalara
- Shopify Tax
- QuickBooks

**Dropshipping Note:**
Tax applies where customer receives goods, regardless of where supplier ships from.`,
    relatedTerms: ["compliance", "nexus", "accounting", "legal"],
    category: "legal",
  },
  "mcommerce": {
    slug: "mcommerce",
    term: "mCommerce (Mobile Commerce)",
    definition: "Buying and selling products through mobile devices like smartphones and tablets.",
    extendedDefinition: `Mobile commerce accounts for 73% of all e-commerce sales in 2026. Mobile-first design is no longer optional.

**mCommerce Stats (2026):**
- 73% of e-commerce is mobile
- Mobile conversion: 2.5-3%
- Average session: 3-4 minutes
- Social commerce primarily mobile

**Mobile Optimization:**
- Responsive design
- Fast page load (<3 seconds)
- Easy navigation (thumb-friendly)
- Simplified checkout
- Mobile payment options

**Mobile-First Elements:**
- Large tap targets
- Sticky add-to-cart
- Autofill support
- Progressive web app (PWA)
- Mobile search optimization

**Mobile Payment Options:**
- Apple Pay
- Google Pay
- Shop Pay
- Mobile wallets

**Testing:**
- Google Mobile-Friendly Test
- PageSpeed Insights
- Real device testing`,
    relatedTerms: ["conversion-rate", "checkout", "user-experience", "responsive-design"],
    category: "technical",
  },
  "sms-marketing": {
    slug: "sms-marketing",
    term: "SMS Marketing",
    definition: "Using text messages to communicate with customers for promotions, order updates, and engagement.",
    extendedDefinition: `SMS marketing has 98% open rates and 45% response rates, making it one of the most effective e-commerce channels.

**SMS Use Cases:**
- Order confirmations
- Shipping updates
- Abandoned cart recovery
- Flash sales
- Back-in-stock alerts
- Review requests

**SMS Platforms:**
- Postscript (Shopify focused)
- Klaviyo SMS
- Attentive
- SMSBump
- Omnisend

**Compliance Requirements:**
- Explicit opt-in required
- Easy opt-out (STOP)
- TCPA compliance (US)
- Timing restrictions
- Clear sender identification

**Best Practices:**
- Keep messages short
- Include clear CTA
- Personalize when possible
- Don't over-message (2-4/month)
- Segment your list

**Metrics:**
- Delivery rate
- Click rate (typically 10-20%)
- Conversion rate
- Unsubscribe rate`,
    relatedTerms: ["email-marketing", "abandoned-cart", "marketing-automation", "retention"],
    category: "marketing",
  },
  "lookalike-audience": {
    slug: "lookalike-audience",
    term: "Lookalike Audience",
    definition: "A targeting option that finds new people similar to your existing customers or website visitors.",
    extendedDefinition: `Lookalike audiences are powerful for scaling advertising by finding people likely to convert based on your best customers.

**How Lookalikes Work:**
1. Upload source audience (customers, leads)
2. Platform analyzes characteristics
3. Finds similar users to target
4. Percentage controls similarity vs reach

**Platform Options:**
- Meta (Facebook/Instagram)
- Google (Similar Audiences → discontinued)
- TikTok
- Pinterest
- Snapchat

**Best Source Audiences:**
- Purchasers (best)
- High-value customers
- Repeat buyers
- Email subscribers
- Add to cart users

**Lookalike Percentages:**
- 1%: Most similar, smallest reach
- 1-3%: Good balance
- 5-10%: Broader reach, less precise

**Best Practices:**
- Minimum 1,000 source users
- Test different percentages
- Combine with interest targeting
- Refresh periodically`,
    relatedTerms: ["facebook-ads", "retargeting", "audience", "targeting"],
    category: "advertising",
  },
  "creative": {
    slug: "creative",
    term: "Creative (Ad Creative)",
    definition: "The visual and textual elements of an advertisement including images, videos, headlines, and copy.",
    extendedDefinition: `Creative is the most important factor in ad performance. Strong creative can outperform targeting by 3-5x.

**Creative Types:**
- Static images
- Carousel ads
- Video ads (best performing)
- User-generated content
- Story/Reel format
- Collection ads

**High-Performing Creative:**
- Hook in first 3 seconds
- Show product in use
- Clear value proposition
- Strong call to action
- Mobile-optimized
- Native to platform

**Testing Framework:**
- Test hooks/openings first
- Then test offers
- Then test formats
- Then test audiences

**Creative Tools:**
- Canva (images)
- CapCut (video)
- Figma (design)
- Envato (templates)
- Motion Array (video)

**Creative Fatigue:**
- Refresh every 2-4 weeks
- Monitor frequency
- Rotate variations
- Create iterative versions`,
    relatedTerms: ["facebook-ads", "tiktok-ads", "ctr", "conversion-rate"],
    category: "advertising",
  },
  "cta": {
    slug: "cta",
    term: "CTA (Call to Action)",
    definition: "A prompt that encourages users to take a specific action like buying, signing up, or clicking.",
    extendedDefinition: `CTAs guide users toward conversion. Clear, compelling CTAs can significantly improve conversion rates.

**CTA Examples:**
- "Buy Now"
- "Add to Cart"
- "Shop Now"
- "Get Started"
- "Learn More"
- "Claim Your Discount"

**Effective CTA Elements:**
- Action-oriented verb
- Creates urgency
- Clear value/benefit
- Contrasting color
- Prominent placement

**CTA Placement:**
- Above the fold
- End of product descriptions
- Sticky buttons (mobile)
- Pop-ups and exit intent
- Email buttons

**Testing CTAs:**
- Button text
- Color and size
- Placement
- Surrounding copy
- Urgency elements

**Best Practices:**
- One primary CTA per page
- Secondary CTAs smaller
- Mobile-friendly size
- Consistent across site`,
    relatedTerms: ["conversion-rate", "landing-page", "ab-testing", "button"],
    category: "marketing",
  },
  "google-trends": {
    slug: "google-trends",
    term: "Google Trends",
    definition: "A free tool showing the popularity of search terms over time and across regions.",
    extendedDefinition: `Google Trends is essential for product research, validating demand, and identifying seasonal patterns.

**Use Cases:**
- Product demand validation
- Seasonal trend analysis
- Comparing product interest
- Geographic demand
- Related queries discovery

**How to Use:**
1. Enter search term
2. Set time range and location
3. Analyze interest over time
4. Compare multiple terms
5. Explore related queries

**Interpreting Data:**
- Score is relative (0-100)
- Compare terms for context
- "Rising" queries = emerging trends
- Check yearly patterns

**Product Research Tips:**
- Compare potential products
- Identify seasonal peaks
- Find growing vs declining niches
- Validate social media trends
- Discover related keywords

**Limitations:**
- Relative not absolute data
- Minimum search volume required
- Can miss micro-niches
- Regional variations important`,
    relatedTerms: ["product-research", "keyword", "seo", "market-research"],
    category: "strategy",
  },
  "dropshipping-agent": {
    slug: "dropshipping-agent",
    term: "Dropshipping Agent",
    definition: "A sourcing professional or company that handles product procurement, quality control, and shipping on behalf of dropshippers.",
    extendedDefinition: `Dropshipping agents bridge the gap between sellers and Chinese suppliers, offering services beyond basic dropshipping platforms.

**Agent Services:**
- Product sourcing
- Supplier negotiation
- Quality inspection
- Custom packaging
- Branding/labeling
- Warehousing
- Faster shipping

**When to Use an Agent:**
- Scaling past 50-100 orders/day
- Need custom packaging
- Quality issues with suppliers
- Want branded inserts
- Need faster shipping
- Private label products

**Finding Agents:**
- CJ Dropshipping (agent services)
- HyperSKU
- Wiio
- Private agents (Alibaba)
- Facebook groups

**Costs:**
- Free for basic sourcing
- Per-order fees ($0.50-2)
- Custom packaging fees
- Warehouse storage fees

**Due Diligence:**
- Start with small orders
- Test communication
- Verify shipping times
- Check quality samples`,
    relatedTerms: ["dropshipping", "sourcing", "supplier", "fulfillment"],
    category: "sourcing",
  },
  "high-ticket-dropshipping": {
    slug: "high-ticket-dropshipping",
    term: "High-Ticket Dropshipping",
    definition: "Selling expensive products ($500+) through dropshipping, typically from domestic suppliers with higher profit margins.",
    extendedDefinition: `High-ticket dropshipping focuses on premium products with substantial profit per sale, reducing volume requirements.

**Characteristics:**
- Product price: $500-$5000+
- Profit per sale: $100-$1000+
- Fewer sales needed
- Domestic suppliers common
- Lower ad costs per acquisition

**Product Categories:**
- Furniture
- Outdoor equipment (grills, kayaks)
- Fitness equipment
- Electronics
- Luxury home goods
- Business equipment

**Advantages:**
- Higher profit per sale
- Fewer orders to manage
- Domestic shipping (faster)
- Less customer service volume
- Easier to achieve profitability

**Challenges:**
- Longer sales cycle
- Higher customer expectations
- More research required per customer
- Returns more complex
- Higher ad spend to test

**Strategy:**
- Build niche authority sites
- Focus on SEO and content
- Phone sales often needed
- Excellent customer service critical`,
    relatedTerms: ["dropshipping", "profit-margin", "niche", "supplier"],
    category: "business-models",
  },
  "b2b": {
    slug: "b2b",
    term: "B2B (Business to Business)",
    definition: "Commercial transactions between businesses rather than between a business and individual consumers.",
    extendedDefinition: `B2B e-commerce involves selling products or services to other businesses, often with larger order values and longer sales cycles.

**B2B vs B2C:**
- B2B: Larger orders, negotiated pricing, longer cycles
- B2C: Individual consumers, fixed pricing, faster decisions

**B2B E-commerce Features:**
- Wholesale pricing tiers
- Quote requests
- Net payment terms
- Account management
- Bulk ordering
- Custom catalogs

**B2B Platforms:**
- Shopify B2B
- BigCommerce B2B
- Alibaba
- Faire (wholesale marketplace)

**B2B Dropshipping:**
- Sell to retailers
- Private label manufacturing
- Bulk product sourcing
- Trade show connections`,
    relatedTerms: ["b2c", "wholesale", "moq", "net-terms"],
    category: "business-models",
  },
  "b2c": {
    slug: "b2c",
    term: "B2C (Business to Consumer)",
    definition: "Commercial transactions between businesses and individual consumers, the most common e-commerce model.",
    extendedDefinition: `B2C is the standard retail model where businesses sell directly to end consumers through online stores.

**B2C Characteristics:**
- Individual purchases
- Fixed pricing
- Shorter sales cycle
- Emotional buying decisions
- Returns expected

**B2C Marketing:**
- Social media advertising
- Influencer marketing
- Email marketing
- Content marketing
- SEO

**B2C Platforms:**
- Shopify (most popular)
- WooCommerce
- BigCommerce
- Squarespace

**B2C Metrics:**
- Conversion rate
- Average order value
- Customer lifetime value
- Cart abandonment rate`,
    relatedTerms: ["b2b", "ecommerce", "conversion-rate", "aov"],
    category: "business-models",
  },
  "ecommerce": {
    slug: "ecommerce",
    term: "E-commerce",
    definition: "The buying and selling of goods or services over the internet through online stores and marketplaces.",
    extendedDefinition: `E-commerce has grown to over $6 trillion globally in 2026, fundamentally changing how consumers shop and businesses operate.

**E-commerce Models:**
- B2C: Business to consumer
- B2B: Business to business
- C2C: Consumer to consumer (eBay, Poshmark)
- D2C: Direct to consumer

**E-commerce Types:**
- Dropshipping
- Traditional retail
- Print on demand
- Private label
- Wholesale
- Subscription

**Key Statistics (2026):**
- $6+ trillion global market
- 73% mobile commerce
- 7%+ annual growth
- Social commerce: $126B (US)

**Success Factors:**
- Strong product-market fit
- Effective marketing
- User experience
- Customer service
- Operations efficiency`,
    relatedTerms: ["dropshipping", "shopify", "b2c", "mcommerce"],
    category: "business-models",
  },
  "d2c": {
    slug: "d2c",
    term: "D2C (Direct to Consumer)",
    definition: "A business model where brands sell directly to consumers without intermediaries like retailers or distributors.",
    extendedDefinition: `D2C brands bypass traditional retail channels to own the customer relationship and capture higher margins.

**D2C Advantages:**
- Higher profit margins
- Direct customer data
- Brand control
- Customer relationship ownership
- Faster feedback loops

**Famous D2C Brands:**
- Warby Parker (eyewear)
- Dollar Shave Club (razors)
- Casper (mattresses)
- Glossier (beauty)
- Allbirds (footwear)

**D2C Requirements:**
- Strong brand identity
- Quality products
- Marketing expertise
- Customer service focus
- Often requires capital

**D2C vs Dropshipping:**
- D2C: Own products, higher margins
- Dropshipping: Third-party products, lower barriers`,
    relatedTerms: ["b2c", "private-label", "branding", "ecommerce"],
    category: "business-models",
  },
  "affiliate-marketing": {
    slug: "affiliate-marketing",
    term: "Affiliate Marketing",
    definition: "A performance-based marketing model where affiliates earn commissions for driving sales or leads to a merchant.",
    extendedDefinition: `Affiliate marketing allows businesses to expand reach through partners who promote products for a commission.

**How It Works:**
1. Affiliate joins program
2. Gets unique tracking link
3. Promotes products
4. Earns commission on sales

**Commission Structures:**
- Pay per sale (most common): 5-30%
- Pay per lead
- Pay per click
- Recurring commissions

**Affiliate Networks:**
- ShareASale
- CJ Affiliate
- Impact
- Amazon Associates
- Shopify Collabs

**For Merchants:**
- Low-risk marketing
- Pay only for results
- Expanded reach
- Third-party credibility

**For Affiliates:**
- Low startup cost
- Passive income potential
- No product creation
- Flexible schedule`,
    relatedTerms: ["influencer-marketing", "commission", "marketing", "passive-income"],
    category: "marketing",
  },
  "backlink": {
    slug: "backlink",
    term: "Backlink",
    definition: "A link from one website to another, considered a vote of confidence that helps improve search engine rankings.",
    extendedDefinition: `Backlinks are crucial for SEO. Quality backlinks from authoritative sites signal trust to search engines.

**Backlink Quality Factors:**
- Domain authority of linking site
- Relevance to your niche
- Anchor text used
- DoFollow vs NoFollow
- Link placement

**Building Backlinks:**
- Guest posting
- Digital PR
- Resource link building
- Broken link building
- HARO responses
- Partnerships

**Link Types:**
- DoFollow: Passes SEO value
- NoFollow: Doesn't pass SEO value
- Sponsored: Paid placements
- UGC: User-generated content

**Tools:**
- Ahrefs
- Moz
- SEMrush
- Majestic

**Avoid:**
- Buying links (penalty risk)
- Link farms
- Irrelevant sites
- Over-optimized anchors`,
    relatedTerms: ["seo", "domain-authority", "organic-traffic", "link-building"],
    category: "marketing",
  },
  "keyword": {
    slug: "keyword",
    term: "Keyword",
    definition: "Words and phrases that people type into search engines, used to optimize content for search visibility.",
    extendedDefinition: `Keywords are the foundation of SEO and paid search. Understanding what your customers search for guides content and marketing strategy.

**Keyword Types:**
- **Short-tail:** 1-2 words, high volume, high competition
- **Long-tail:** 3+ words, lower volume, higher intent
- **Branded:** Include brand names
- **Commercial:** Buying intent
- **Informational:** Research intent

**Keyword Research:**
1. Brainstorm seed keywords
2. Use research tools
3. Analyze search volume
4. Assess competition
5. Consider intent

**Tools:**
- Google Keyword Planner (free)
- Ahrefs
- SEMrush
- Ubersuggest
- AnswerThePublic

**Keyword Metrics:**
- Search volume
- Keyword difficulty
- CPC (ads cost)
- Click-through rate
- Search intent`,
    relatedTerms: ["seo", "google-ads", "organic-traffic", "content-marketing"],
    category: "marketing",
  },
  "organic-traffic": {
    slug: "organic-traffic",
    term: "Organic Traffic",
    definition: "Website visitors who arrive through unpaid search engine results rather than paid advertising.",
    extendedDefinition: `Organic traffic is free, sustainable, and often converts well because visitors actively searched for related content.

**Organic vs Paid:**
- Organic: Free, takes time, compounds
- Paid: Instant, costs money, stops when budget stops

**Growing Organic Traffic:**
- SEO optimization
- Content marketing
- Technical SEO
- Link building
- User experience

**SEO Best Practices:**
- Keyword-optimized titles
- Meta descriptions
- Header structure (H1, H2, H3)
- Internal linking
- Mobile optimization
- Page speed

**Measuring Organic Traffic:**
- Google Analytics
- Google Search Console
- Ahrefs
- SEMrush

**Benchmarks:**
- New site: 6-12 months to rank
- Blog post: Peaks at 3-6 months
- E-commerce: Product pages rank slower`,
    relatedTerms: ["seo", "keyword", "content-marketing", "backlink"],
    category: "marketing",
  },
  "content-marketing": {
    slug: "content-marketing",
    term: "Content Marketing",
    definition: "Creating and distributing valuable content to attract, engage, and retain a target audience.",
    extendedDefinition: `Content marketing builds brand authority and drives organic traffic through helpful, relevant content.

**Content Types:**
- Blog posts
- Videos
- Podcasts
- Infographics
- Guides and ebooks
- Email newsletters
- Social media posts

**E-commerce Content:**
- Buying guides
- Product comparisons
- How-to tutorials
- Industry news
- Customer stories
- FAQs

**Content Strategy:**
1. Define audience personas
2. Research keywords
3. Create content calendar
4. Produce quality content
5. Distribute and promote
6. Measure and optimize

**Benefits:**
- Organic traffic growth
- Brand authority
- Customer trust
- Email list building
- Social shares`,
    relatedTerms: ["seo", "blog", "organic-traffic", "keyword"],
    category: "marketing",
  },
  "page-speed": {
    slug: "page-speed",
    term: "Page Speed",
    definition: "How quickly a webpage loads and becomes interactive, critical for user experience and search rankings.",
    extendedDefinition: `Page speed directly impacts conversion rates. A 1-second delay can reduce conversions by 7%.

**Speed Metrics (Core Web Vitals):**
- **LCP:** Largest Contentful Paint (<2.5s good)
- **FID:** First Input Delay (<100ms good)
- **CLS:** Cumulative Layout Shift (<0.1 good)

**Impact:**
- Bounce rate increases 32% at 1-3 seconds
- Conversion drops 7% per second delay
- Mobile users especially sensitive
- Google ranking factor

**Speed Optimization:**
- Compress images (WebP format)
- Lazy loading
- Minimize JavaScript/CSS
- Use CDN
- Enable caching
- Optimize server response

**Testing Tools:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse

**Shopify Specific:**
- Theme optimization
- Limit apps
- Optimize images
- Use system fonts`,
    relatedTerms: ["conversion-rate", "seo", "user-experience", "core-web-vitals"],
    category: "technical",
  },
  "cdn": {
    slug: "cdn",
    term: "CDN (Content Delivery Network)",
    definition: "A network of geographically distributed servers that deliver web content to users based on their location.",
    extendedDefinition: `CDNs speed up websites by serving content from servers closest to users, reducing load times globally.

**How CDNs Work:**
1. Original content on origin server
2. CDN caches content across nodes
3. User requests content
4. Nearest node serves content
5. Faster delivery, reduced load

**CDN Benefits:**
- Faster page loads
- Reduced server load
- Global performance
- DDoS protection
- Better uptime

**Popular CDNs:**
- Cloudflare (free tier)
- Fastly
- Amazon CloudFront
- Akamai
- KeyCDN

**What CDNs Cache:**
- Images
- CSS/JavaScript files
- Video content
- Static HTML
- Fonts

**Shopify:**
Uses Fastly CDN automatically for all stores.`,
    relatedTerms: ["page-speed", "hosting", "performance", "caching"],
    category: "technical",
  },
  "ssl": {
    slug: "ssl",
    term: "SSL (Secure Sockets Layer)",
    definition: "A security protocol that encrypts data transmitted between a website and its visitors, shown as HTTPS and a padlock icon.",
    extendedDefinition: `SSL certificates are mandatory for e-commerce. They encrypt payment data and build customer trust.

**Why SSL Matters:**
- Encrypts sensitive data
- Required for payments
- SEO ranking factor
- Browser trust indicators
- PCI compliance requirement

**SSL Indicators:**
- HTTPS in URL
- Padlock icon
- Green address bar (EV certs)
- "Secure" label

**SSL Types:**
- **DV (Domain Validated):** Basic, quick
- **OV (Organization Validated):** Business verified
- **EV (Extended Validation):** Highest trust

**Getting SSL:**
- Shopify: Included free
- WooCommerce: Let's Encrypt (free) or purchased
- Most hosts include free SSL

**What Happens Without SSL:**
- "Not Secure" warning
- Lower search rankings
- Customer distrust
- Payment processing issues`,
    relatedTerms: ["security", "trust-signals", "checkout", "compliance"],
    category: "technical",
  },
  "hosting": {
    slug: "hosting",
    term: "Web Hosting",
    definition: "A service that stores website files on servers and makes them accessible on the internet.",
    extendedDefinition: `Hosting is the foundation of any website. Quality hosting affects speed, uptime, and security.

**Hosting Types:**
- **Shared:** Multiple sites on one server (cheapest)
- **VPS:** Virtual private server (middle ground)
- **Dedicated:** Entire server for you (expensive)
- **Cloud:** Scalable cloud resources
- **Managed:** Handled by experts

**For E-commerce:**
- Shopify: Hosting included
- WooCommerce: Need separate hosting
- BigCommerce: Hosting included

**Hosting Factors:**
- Uptime guarantee (99.9%+)
- Page load speed
- Customer support
- Security features
- Scalability

**WooCommerce Hosts:**
- SiteGround
- Kinsta
- WP Engine
- Bluehost
- Cloudways`,
    relatedTerms: ["shopify", "woocommerce", "page-speed", "uptime"],
    category: "technical",
  },
  "theme": {
    slug: "theme",
    term: "Theme",
    definition: "A pre-designed template that controls the visual appearance and layout of an e-commerce store.",
    extendedDefinition: `Themes provide the design framework for your store without needing to code from scratch.

**Shopify Themes:**
- Dawn (free, default)
- Debut, Brooklyn (classic free)
- Premium themes: $150-350
- Theme store: 100+ options

**Theme Selection Criteria:**
- Mobile responsiveness
- Page speed
- Feature requirements
- Customization options
- Support and updates
- Reviews

**Popular Paid Themes:**
- Prestige
- Impulse
- Turbo
- Warehouse
- Symmetry

**Theme Customization:**
- Theme editor (no code)
- Liquid code (development)
- Third-party apps
- Custom sections

**Theme Best Practices:**
- Choose based on needs, not looks
- Test mobile experience
- Check page speed
- Read reviews
- Consider long-term support`,
    relatedTerms: ["shopify", "design", "customization", "conversion-rate"],
    category: "technical",
  },
  "shopify-app": {
    slug: "shopify-app",
    term: "Shopify App",
    definition: "Third-party software that extends Shopify functionality for features like marketing, shipping, reviews, and more.",
    extendedDefinition: `The Shopify App Store contains 8,000+ apps that add features without custom development.

**Essential App Categories:**
- Email marketing (Klaviyo)
- Reviews (Loox, Judge.me)
- Upsells (ReConvert, Bold)
- SEO (Plug in SEO)
- Shipping (ShipStation)
- Analytics (Lucky Orange)

**App Considerations:**
- Monthly costs add up
- Can slow site speed
- Check reviews and ratings
- Test before committing
- Read privacy policies

**Free vs Paid:**
- Many apps have free tiers
- Premium features require payment
- $5-200+/month typical
- Some charge % of revenue

**App Installation:**
1. Browse App Store
2. Click "Add app"
3. Approve permissions
4. Configure settings
5. Monitor performance

**Managing Apps:**
- Audit regularly
- Remove unused apps
- Check for conflicts
- Monitor site speed`,
    relatedTerms: ["shopify", "integration", "email-marketing", "reviews"],
    category: "platforms",
  },
  "msrp": {
    slug: "msrp",
    term: "MSRP (Manufacturer's Suggested Retail Price)",
    definition: "The price a product's manufacturer recommends retailers charge consumers.",
    extendedDefinition: `MSRP provides a pricing reference point, though retailers can sell above or below this price.

**MSRP Purpose:**
- Consistent pricing expectation
- Brand positioning
- Retailer guidance
- Fair competition baseline

**MSRP in Dropshipping:**
- Use as pricing reference
- Can sell below MSRP
- Check MAP policies (minimum advertised price)
- Understand supplier pricing

**MAP (Minimum Advertised Price):**
- Price you can't advertise below
- Different from minimum selling price
- Enforced by brands
- Protects brand value

**Pricing Strategies:**
- At MSRP: Standard positioning
- Below MSRP: Competitive/discount
- Above MSRP: Premium/bundled

**Legal Considerations:**
- MSRP is a suggestion, not requirement
- MAP violations can end partnerships
- Some brands enforce strictly`,
    relatedTerms: ["pricing", "profit-margin", "wholesale", "supplier"],
    category: "finance",
  },
  "cash-flow": {
    slug: "cash-flow",
    term: "Cash Flow",
    definition: "The movement of money in and out of a business over a specific period of time.",
    extendedDefinition: `Cash flow management is critical for e-commerce survival. Many profitable businesses fail due to poor cash flow.

**Cash Flow Types:**
- **Operating:** Day-to-day business activities
- **Investing:** Asset purchases/sales
- **Financing:** Loans, investments

**E-commerce Cash Flow Cycle:**
1. Pay for inventory/ads
2. Wait for customer orders
3. Receive payment (minus fees)
4. Wait for payout (2-3 days typical)

**Dropshipping Advantage:**
- No inventory investment
- Pay supplier after customer pays
- Lower cash requirements

**Cash Flow Challenges:**
- Ad spend before sales
- Payout delays
- Refund reserves
- Seasonal fluctuations
- Inventory investment

**Improving Cash Flow:**
- Negotiate payment terms
- Reduce ad waste
- Faster payment processing
- Lower inventory levels
- Subscription revenue`,
    relatedTerms: ["profit-margin", "cogs", "inventory", "revenue"],
    category: "finance",
  },
  "gross-profit": {
    slug: "gross-profit",
    term: "Gross Profit",
    definition: "Revenue minus the direct cost of goods sold, before subtracting operating expenses.",
    extendedDefinition: `Gross profit shows how much money is left after product costs to cover operating expenses and generate net profit.

**Gross Profit Formula:**
\`\`\`
Gross Profit = Revenue - COGS

Example:
$100,000 revenue - $40,000 COGS = $60,000 gross profit
\`\`\`

**Gross Margin:**
\`\`\`
Gross Margin = (Gross Profit / Revenue) × 100

$60,000 / $100,000 = 60% gross margin
\`\`\`

**Healthy Gross Margins:**
- Dropshipping: 15-30%
- Private label: 40-60%
- Wholesale: 25-40%
- Digital products: 80-95%

**What's NOT in COGS:**
- Marketing costs
- Software subscriptions
- Salaries
- Rent
- Payment processing (varies)

**Improving Gross Profit:**
- Better supplier pricing
- Higher selling prices
- Lower shipping costs
- Reduce product costs`,
    relatedTerms: ["cogs", "profit-margin", "revenue", "net-profit"],
    category: "finance",
  },
  "net-profit": {
    slug: "net-profit",
    term: "Net Profit",
    definition: "The amount remaining after all expenses are subtracted from revenue, also known as the bottom line.",
    extendedDefinition: `Net profit is what you actually keep after paying all costs. It's the true measure of business profitability.

**Net Profit Formula:**
\`\`\`
Net Profit = Revenue - All Expenses

Revenue: $100,000
- COGS: $40,000
- Marketing: $25,000
- Operations: $15,000
- Other: $5,000
= Net Profit: $15,000
\`\`\`

**Net Margin:**
\`\`\`
Net Margin = (Net Profit / Revenue) × 100

$15,000 / $100,000 = 15% net margin
\`\`\`

**Healthy Net Margins:**
- E-commerce average: 5-10%
- Good: 10-15%
- Excellent: 15%+

**Common Expenses:**
- Product costs (COGS)
- Advertising
- Software and tools
- Shipping
- Payment processing
- Returns and refunds
- Customer service
- Taxes`,
    relatedTerms: ["gross-profit", "profit-margin", "revenue", "expenses"],
    category: "finance",
  },
  "impressions": {
    slug: "impressions",
    term: "Impressions",
    definition: "The number of times an ad or piece of content is displayed to users, regardless of whether it was clicked.",
    extendedDefinition: `Impressions measure reach and visibility, forming the basis for CPM calculations and awareness campaigns.

**Impressions vs Reach:**
- Impressions: Total times shown (can include repeats)
- Reach: Unique people who saw it

**Where Impressions Matter:**
- Social media ads
- Display advertising
- Google Ads
- Email opens
- Organic search

**Frequency Formula:**
\`\`\`
Frequency = Impressions / Reach

Example: 10,000 impressions / 5,000 reach = 2 frequency
\`\`\`

**Optimal Frequency:**
- Awareness: 3-5 times
- Conversion: 5-10 times
- Too high: Ad fatigue

**Impressions in Context:**
- High impressions + low CTR = poor creative
- High impressions + high CTR = good targeting
- Low impressions = budget or targeting issue`,
    relatedTerms: ["cpm", "ctr", "reach", "frequency"],
    category: "metrics",
  },
  "target-audience": {
    slug: "target-audience",
    term: "Target Audience",
    definition: "The specific group of consumers most likely to purchase your products, defined by demographics, interests, and behaviors.",
    extendedDefinition: `Understanding your target audience is fundamental to marketing success. It shapes product selection, messaging, and channel strategy.

**Defining Target Audience:**
- Demographics (age, gender, income, location)
- Psychographics (interests, values, lifestyle)
- Behaviors (shopping habits, brand preferences)
- Pain points and needs

**Creating Buyer Personas:**
- Name and background
- Demographics
- Goals and challenges
- Preferred channels
- Buying objections
- Decision factors

**Research Methods:**
- Customer surveys
- Social media insights
- Google Analytics
- Competitor analysis
- Review mining

**Targeting Applications:**
- Ad platform targeting
- Content creation
- Product development
- Email segmentation
- Website messaging`,
    relatedTerms: ["niche", "buyer-persona", "market-research", "segmentation"],
    category: "strategy",
  },
  "unique-selling-proposition": {
    slug: "unique-selling-proposition",
    term: "USP (Unique Selling Proposition)",
    definition: "The distinct benefit or value that makes your product or brand different from and better than competitors.",
    extendedDefinition: `A strong USP differentiates your store and gives customers a reason to buy from you instead of competitors.

**USP Examples:**
- "30-day money back guarantee"
- "Handmade in the USA"
- "Ships in 24 hours"
- "Eco-friendly materials"
- "Lowest price guaranteed"

**Finding Your USP:**
- What do you do better than competitors?
- What do customers value most?
- What gap exists in the market?
- What's your brand story?

**USP Placement:**
- Homepage hero
- Product pages
- Ad copy
- Email subject lines
- Social bios

**USP Categories:**
- Price (lowest, best value)
- Quality (premium, artisan)
- Speed (fast shipping)
- Service (customer support)
- Selection (widest variety)
- Values (sustainability, ethics)`,
    relatedTerms: ["branding", "competitor-analysis", "positioning", "value-proposition"],
    category: "strategy",
  },
  "branding": {
    slug: "branding",
    term: "Branding",
    definition: "The process of creating a distinctive identity for your business through name, logo, design, messaging, and customer experience.",
    extendedDefinition: `Branding builds recognition and emotional connection. Strong brands command premium prices and customer loyalty.

**Brand Elements:**
- Brand name
- Logo and visual identity
- Color palette
- Typography
- Voice and tone
- Tagline/slogan

**Brand Strategy:**
1. Define brand purpose
2. Research competitors
3. Identify target audience
4. Create positioning
5. Develop visual identity
6. Define brand voice

**Branding for Dropshipping:**
- Create memorable store name
- Design professional logo
- Consistent visual style
- Branded packaging (when possible)
- Brand story and values

**Building Brand Trust:**
- Professional website design
- Quality product images
- Consistent messaging
- Customer reviews
- Social proof`,
    relatedTerms: ["unique-selling-proposition", "logo", "design", "positioning"],
    category: "strategy",
  },
  "product-page": {
    slug: "product-page",
    term: "Product Page",
    definition: "The webpage displaying a specific product with details, images, pricing, and purchase options.",
    extendedDefinition: `Product pages are where buying decisions happen. Optimization directly impacts conversion rates.

**Essential Elements:**
- High-quality images
- Compelling title
- Clear pricing
- Product description
- Add to cart button
- Size/variant options
- Shipping information
- Reviews

**Image Best Practices:**
- Multiple angles
- Zoom capability
- Lifestyle shots
- White background + in-use
- Video if possible
- 1000x1000px minimum

**Description Framework:**
- Open with benefits
- List key features
- Address objections
- Include specifications
- Add social proof

**Conversion Boosters:**
- Urgency (limited stock)
- Trust badges
- Money-back guarantee
- Free shipping threshold
- Recently purchased popup`,
    relatedTerms: ["conversion-rate", "product-photography", "copywriting", "add-to-cart"],
    category: "operations",
  },
  "product-photography": {
    slug: "product-photography",
    term: "Product Photography",
    definition: "Professional images showcasing products to help customers visualize items and make purchase decisions.",
    extendedDefinition: `Quality product photos can increase conversion rates by up to 30%. They're often the difference between a sale and a bounce.

**Photo Types:**
- White background (clean, professional)
- Lifestyle (product in use)
- Scale shots (show size)
- Detail shots (textures, features)
- 360-degree views
- Comparison shots

**DIY Setup:**
- Lightbox or white backdrop
- Natural light or softbox
- Smartphone with good camera
- Tripod for consistency
- Photo editing apps

**Dropshipping Challenges:**
- Relying on supplier images
- Inconsistent quality
- Generic photos
- Copyright concerns

**Solutions:**
- Order samples for photos
- Hire product photographers
- Use Canva for mockups
- Request high-res from suppliers
- Use AI image enhancement`,
    relatedTerms: ["product-page", "conversion-rate", "listing", "visual-content"],
    category: "operations",
  },
  "pricing-strategy": {
    slug: "pricing-strategy",
    term: "Pricing Strategy",
    definition: "The method used to determine product prices based on costs, competition, value, and market positioning.",
    extendedDefinition: `Pricing directly impacts profit margins and brand perception. The right strategy balances profitability with competitiveness.

**Pricing Methods:**
- **Cost-plus:** Cost + markup percentage
- **Competitive:** Match or beat competitors
- **Value-based:** Price based on perceived value
- **Psychological:** $29.99 vs $30
- **Dynamic:** Adjust based on demand

**Dropshipping Pricing Formula:**
\`\`\`
Product cost + shipping + fees + profit margin = Price

Example:
$10 + $3 + $2 + $15 = $30 retail price
\`\`\`

**Markup Guidelines:**
- Low competition: 2-3x markup
- Medium competition: 1.5-2x markup
- High competition: 1.3-1.5x markup

**Price Testing:**
- A/B test different prices
- Monitor conversion rates
- Track profit per order
- Consider bundle pricing`,
    relatedTerms: ["profit-margin", "msrp", "competition", "value-proposition"],
    category: "strategy",
  },
  "supplier-vetting": {
    slug: "supplier-vetting",
    term: "Supplier Vetting",
    definition: "The process of evaluating and qualifying potential suppliers to ensure reliability, quality, and trustworthiness.",
    extendedDefinition: `Proper supplier vetting prevents quality issues, shipping delays, and fraud that can destroy customer trust.

**Vetting Checklist:**
- Response time and communication
- Product quality (order samples)
- Shipping times and methods
- Return and refund policies
- Reviews from other buyers
- Business verification

**Red Flags:**
- No business license
- Stock photos only
- Unrealistic prices
- Poor communication
- No tracking provided
- Negative reviews

**Supplier Questions:**
- What are shipping times to [country]?
- Can you provide product samples?
- What's your return policy?
- Do you offer custom packaging?
- What's your average order processing time?

**Verification Methods:**
- Request business license
- Video call the supplier
- Start with small test order
- Use Trade Assurance (Alibaba)
- Check third-party reviews`,
    relatedTerms: ["supplier", "sourcing", "quality-control", "dropshipping"],
    category: "sourcing",
  },
  "order-tracking": {
    slug: "order-tracking",
    term: "Order Tracking",
    definition: "The ability to monitor shipment progress from dispatch to delivery using tracking numbers and carrier systems.",
    extendedDefinition: `Order tracking reduces support tickets and increases customer confidence. It's expected in modern e-commerce.

**Tracking Components:**
- Tracking number
- Carrier identification
- Status updates
- Estimated delivery date
- Delivery confirmation

**Tracking Tools:**
- 17Track (multi-carrier)
- AfterShip
- ParcelApp
- Shopify Order Status
- Carrier apps/websites

**Customer Communication:**
- Shipping confirmation email
- Tracking link included
- Status update notifications
- Delivery confirmation

**Dropshipping Tracking Issues:**
- Long pre-shipment periods
- Multiple carriers
- Poor international tracking
- Delays not updated

**Solutions:**
- Set realistic expectations
- Proactive delay notifications
- Easy tracking page access
- Customer service prepared`,
    relatedTerms: ["shipping", "fulfillment", "customer-service", "logistics"],
    category: "operations",
  },
  "facebook-pixel": {
    slug: "facebook-pixel",
    term: "Facebook Pixel",
    definition: "A piece of code installed on your website that tracks visitor behavior for Facebook/Meta advertising optimization.",
    extendedDefinition: `The Meta Pixel (formerly Facebook Pixel) is essential for tracking conversions and building retargeting audiences.

**Pixel Functions:**
- Track website visitors
- Record conversion events
- Build custom audiences
- Enable retargeting
- Optimize ad delivery

**Standard Events:**
- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase
- Search
- CompleteRegistration

**Installation:**
- Direct code (in theme)
- Shopify Facebook app
- Google Tag Manager
- Partner integrations

**Conversions API (CAPI):**
- Server-side tracking
- More accurate data
- iOS 14.5+ compatible
- Complements pixel

**Optimization:**
- Verify pixel fires correctly
- Use Event Tester
- Set up all relevant events
- Enable CAPI for redundancy`,
    relatedTerms: ["pixel", "facebook-ads", "retargeting", "conversion-rate"],
    category: "advertising",
  },
  "quality-score": {
    slug: "quality-score",
    term: "Quality Score",
    definition: "A metric used by Google Ads to rate the relevance and quality of your keywords, ads, and landing pages.",
    extendedDefinition: `Quality Score directly affects ad costs and positions. Higher scores mean lower CPCs and better ad placements.

**Quality Score Range:**
- 1-10 scale
- 7+ considered good
- Below 5 needs work

**Factors:**
- Expected CTR
- Ad relevance
- Landing page experience

**Impact on Ads:**
- Higher score = lower CPC
- Better ad positions
- More impressions
- Higher ROI

**Improving Quality Score:**
- Tight keyword grouping
- Relevant ad copy
- Keyword in headlines
- Fast landing page
- Mobile-friendly pages
- Relevant landing page content

**Monitoring:**
- Check in Google Ads
- Historical data available
- Component breakdown visible`,
    relatedTerms: ["google-ads", "cpc", "keyword", "landing-page"],
    category: "advertising",
  },
  "product-feed": {
    slug: "product-feed",
    term: "Product Feed",
    definition: "A structured file containing product information used by shopping platforms, comparison sites, and advertising channels.",
    extendedDefinition: `Product feeds power Google Shopping, Facebook Catalog, and other shopping channels. Feed quality directly impacts ad performance.

**Feed Contents:**
- Product ID
- Title
- Description
- Price
- Images
- Availability
- Brand
- GTIN/UPC
- Category

**Feed Destinations:**
- Google Merchant Center
- Facebook/Instagram Shop
- Pinterest
- TikTok Shop
- Bing Shopping
- Comparison sites

**Feed Optimization:**
- Keyword-rich titles
- Complete attributes
- High-quality images
- Accurate pricing
- Up-to-date inventory

**Shopify Feed Options:**
- Native Google channel
- Facebook channel
- Third-party apps (DataFeedWatch, Simprosys)

**Common Issues:**
- Disapproved products
- Missing attributes
- Image requirements
- Policy violations`,
    relatedTerms: ["google-shopping", "catalog", "google-ads", "facebook-ads"],
    category: "advertising",
  },
  "dynamic-ads": {
    slug: "dynamic-ads",
    term: "Dynamic Ads",
    definition: "Advertisements that automatically show relevant products to users based on their browsing behavior and interests.",
    extendedDefinition: `Dynamic ads personalize ad content for each viewer, showing products they've viewed or are likely to purchase.

**How Dynamic Ads Work:**
1. User browses your site
2. Pixel tracks behavior
3. User leaves site
4. Sees personalized ad with viewed products
5. Returns to complete purchase

**Types:**
- Dynamic Product Ads (Meta)
- Dynamic Remarketing (Google)
- Dynamic Catalog Ads (TikTok)

**Requirements:**
- Product catalog/feed
- Tracking pixel installed
- Minimum audience size
- Ad account setup

**Best Practices:**
- High-quality product images
- Complete product info
- Segment by behavior
- Exclude recent purchasers
- Test different templates

**Performance:**
- Higher CTR than static ads
- Lower CPA typically
- Better ROAS
- Personalized experience`,
    relatedTerms: ["retargeting", "product-feed", "facebook-ads", "personalization"],
    category: "advertising",
  },
  "cro": {
    slug: "cro",
    term: "CRO (Conversion Rate Optimization)",
    definition: "The systematic process of increasing the percentage of website visitors who complete desired actions.",
    extendedDefinition: `CRO focuses on getting more value from existing traffic rather than just driving more visitors.

**CRO Process:**
1. Analyze current data
2. Identify problem areas
3. Form hypotheses
4. Design tests
5. Run A/B tests
6. Analyze results
7. Implement winners

**What to Optimize:**
- Headlines and copy
- Call-to-action buttons
- Product pages
- Checkout flow
- Forms
- Navigation
- Trust signals

**CRO Tools:**
- Google Optimize
- Hotjar (heatmaps)
- Lucky Orange
- Microsoft Clarity
- Optimizely

**Quick Wins:**
- Improve page speed
- Add trust badges
- Simplify checkout
- Better product images
- Clear value proposition

**CRO Benchmarks:**
- 10% improvement: Good test
- 20%+ improvement: Great test`,
    relatedTerms: ["conversion-rate", "ab-testing", "landing-page", "user-experience"],
    category: "strategy",
  },
  "cart-abandonment-rate": {
    slug: "cart-abandonment-rate",
    term: "Cart Abandonment Rate",
    definition: "The percentage of shoppers who add items to their cart but leave without completing the purchase.",
    extendedDefinition: `The average cart abandonment rate is 70%. Reducing it even slightly can significantly impact revenue.

**Calculation:**
\`\`\`
Abandonment Rate = (1 - Completed Orders / Carts Created) × 100

Example: (1 - 30/100) × 100 = 70% abandonment
\`\`\`

**Top Abandonment Reasons:**
- Unexpected costs (shipping, taxes)
- Required account creation
- Complex checkout
- Security concerns
- Just browsing
- Technical issues

**Recovery Strategies:**
- Abandoned cart emails
- SMS reminders
- Exit-intent popups
- Retargeting ads
- Guest checkout
- Free shipping thresholds

**Email Sequence:**
- Email 1 (1 hour): Reminder
- Email 2 (24 hours): Urgency
- Email 3 (72 hours): Discount

**Industry Benchmarks:**
- Overall: 70%
- Mobile: 85%
- Desktop: 70%`,
    relatedTerms: ["abandoned-cart", "checkout", "conversion-rate", "email-marketing"],
    category: "metrics",
  },
  "social-proof": {
    slug: "social-proof",
    term: "Social Proof",
    definition: "The psychological phenomenon where people follow the actions and opinions of others when making decisions.",
    extendedDefinition: `Social proof builds trust by showing that others have purchased and approved of your products.

**Types of Social Proof:**
- Customer reviews and ratings
- User-generated content
- Testimonials
- Case studies
- Media mentions
- Influencer endorsements
- Sales counts ("10,000+ sold")
- Live activity notifications

**Implementation:**
- Review widgets on product pages
- Trust badges (secure checkout)
- "Customers also bought"
- Real-time purchase popups
- Social media follower counts

**Effectiveness:**
- 92% read reviews before buying
- Products with reviews: 270% higher conversion
- 5+ reviews significantly boost trust

**Tools:**
- Loox, Judge.me (reviews)
- FOMO, Sales Pop (notifications)
- Trust badges
- Testimonial widgets`,
    relatedTerms: ["reviews", "ugc", "trust-signals", "conversion-rate"],
    category: "marketing",
  },
  "trust-signals": {
    slug: "trust-signals",
    term: "Trust Signals",
    definition: "Visual and textual elements on a website that establish credibility and reduce purchase anxiety.",
    extendedDefinition: `Trust signals reassure visitors that your store is legitimate and their transaction is safe.

**Common Trust Signals:**
- SSL certificate (HTTPS)
- Payment badges (Visa, PayPal)
- Security badges (Norton, McAfee)
- Money-back guarantee
- Clear contact information
- Physical address
- Phone number
- Live chat
- Professional design

**Where to Place:**
- Header/footer
- Checkout page
- Product pages
- Near add-to-cart button
- Payment section

**Effectiveness:**
- 61% look for trust badges
- Security badges increase conversion 32%
- Money-back guarantees reduce anxiety

**Creating Trust:**
- Display real customer reviews
- Show media mentions
- Include about us page
- Transparent policies
- Fast customer support`,
    relatedTerms: ["social-proof", "ssl", "reviews", "conversion-rate"],
    category: "marketing",
  },
  "supplier-directory": {
    slug: "supplier-directory",
    term: "Supplier Directory",
    definition: "A curated database of vetted suppliers that dropshippers and retailers can use to source products.",
    extendedDefinition: `Supplier directories simplify product sourcing by pre-vetting suppliers and organizing them by category.

**Popular Directories:**
- SaleHoo ($67/year)
- Worldwide Brands (one-time fee)
- Wholesale Central (free)
- ThomasNet (free)
- Doba (subscription)

**Directory Benefits:**
- Pre-vetted suppliers
- Contact information
- Product categories
- Minimum order info
- Location filtering

**What to Look For:**
- Verification process
- Supplier reviews
- Regular updates
- Support resources
- Money-back guarantee

**Beyond Directories:**
- Trade shows
- Alibaba
- Industry associations
- Direct outreach
- Competitor research`,
    relatedTerms: ["supplier", "sourcing", "dropshipping", "wholesale"],
    category: "sourcing",
  },
  "order-management": {
    slug: "order-management",
    term: "Order Management System (OMS)",
    definition: "Software that tracks and manages orders from placement through fulfillment and delivery.",
    extendedDefinition: `An OMS centralizes order processing, inventory, and fulfillment across multiple sales channels.

**OMS Functions:**
- Order capture
- Inventory sync
- Order routing
- Fulfillment management
- Returns processing
- Reporting

**For Dropshipping:**
- Auto-forward orders to suppliers
- Track supplier fulfillment
- Sync tracking numbers
- Handle multiple suppliers

**Popular OMS:**
- Shopify (built-in)
- ShipStation
- Ordoro
- Skubana
- Cin7

**Multi-Channel Benefits:**
- Single inventory view
- Centralized order processing
- Consistent shipping
- Unified reporting

**Key Metrics:**
- Orders processed per day
- Fulfillment accuracy
- Average fulfillment time
- Error rate`,
    relatedTerms: ["fulfillment", "inventory", "multi-channel", "shipping"],
    category: "operations",
  },
  "personalization": {
    slug: "personalization",
    term: "Personalization",
    definition: "Tailoring the shopping experience to individual customers based on their behavior, preferences, and data.",
    extendedDefinition: `Personalization increases engagement and conversions by showing relevant content and products to each visitor.

**Personalization Types:**
- Product recommendations
- Dynamic content
- Personalized emails
- Custom pricing
- Targeted offers
- Recently viewed

**Data Sources:**
- Browsing history
- Purchase history
- Demographics
- Location
- Device type
- Referral source

**Implementation:**
- AI recommendation engines
- Shopify apps (Rebuy, LimeSpot)
- Email platforms (Klaviyo)
- Dynamic content tools

**Personalization Examples:**
- "Recommended for you"
- Location-based shipping
- Return customer discounts
- Abandoned browse reminders
- Birthday offers

**Impact:**
- 80% more likely to buy with personalization
- 10-15% revenue increase
- Higher customer satisfaction`,
    relatedTerms: ["recommendation-engine", "email-marketing", "cross-sell", "customer-experience"],
    category: "marketing",
  },
  "shipping-zones": {
    slug: "shipping-zones",
    term: "Shipping Zones",
    definition: "Geographic regions with specific shipping rates and delivery timeframes.",
    extendedDefinition: `Shipping zones help you set appropriate rates and delivery expectations based on distance from fulfillment locations.

**Zone Configuration:**
- Define geographic areas
- Set rates per zone
- Specify delivery times
- Handle exclusions

**Shopify Shipping Zones:**
- Create zones by country/region
- Add shipping rates per zone
- Carrier-calculated options
- Free shipping rules

**Zone Strategies:**
- Domestic (Zone 1)
- Regional (Zone 2-4)
- National (Zone 5-8)
- International (Zone 9+)

**Pricing Approaches:**
- Flat rate by zone
- Weight-based by zone
- Carrier-calculated
- Free over threshold

**International Considerations:**
- Customs and duties
- Longer delivery times
- Higher shipping costs
- Product restrictions`,
    relatedTerms: ["shipping", "fulfillment", "carrier", "delivery"],
    category: "operations",
  },
  "scalability": { slug: "scalability", term: "Scalability", definition: "The ability of a business to grow and handle increased demand without proportional increases in costs or complexity.", extendedDefinition: `Scalability is crucial for e-commerce success. Building scalable systems allows growth without breaking operations.\n\n**Scalability Factors:**\n- Automated processes\n- Reliable suppliers\n- Flexible fulfillment\n- Scalable marketing\n- Strong tech infrastructure\n\n**Dropshipping Scalability:**\n- No inventory limits\n- Supplier capacity\n- Customer service capacity\n- Ad spend efficiency\n- Order processing speed\n\n**Scaling Challenges:**\n- Supplier reliability at volume\n- Customer service demands\n- Ad costs increase\n- Quality control\n- Cash flow requirements\n\n**Preparing to Scale:**\n- Document processes\n- Automate repetitive tasks\n- Build supplier relationships\n- Hire/outsource support\n- Monitor key metrics`, relatedTerms: ["automation", "growth", "operations", "fulfillment"], category: "strategy" },
  "automation": { slug: "automation", term: "Automation", definition: "Using technology to perform tasks with minimal human intervention, increasing efficiency and reducing errors.", extendedDefinition: `Automation frees up time for strategic work by handling repetitive tasks automatically.\n\n**E-commerce Automation:**\n- Order processing\n- Inventory sync\n- Email marketing flows\n- Customer service (chatbots)\n- Social media posting\n- Price monitoring\n\n**Automation Tools:**\n- Zapier (connects apps)\n- Make (complex workflows)\n- Shopify Flow\n- Klaviyo (email automation)\n- Gorgias (support automation)\n\n**Dropshipping Automation:**\n- Auto-order to suppliers (DSers)\n- Tracking number sync\n- Inventory updates\n- Abandoned cart recovery\n- Review requests\n\n**ROI of Automation:**\n- Time savings\n- Fewer errors\n- Better customer experience\n- Scalability\n- Consistency`, relatedTerms: ["scalability", "workflow", "integration", "efficiency"], category: "operations" },
  "multichannel": { slug: "multichannel", term: "Multichannel Selling", definition: "Selling products across multiple platforms and marketplaces simultaneously.", extendedDefinition: `Multichannel selling expands reach by meeting customers where they shop.\n\n**Common Channels:**\n- Shopify store\n- Amazon\n- eBay\n- Etsy\n- Walmart\n- TikTok Shop\n- Facebook/Instagram Shop\n\n**Benefits:**\n- Increased reach\n- Diversified revenue\n- Brand visibility\n- Customer acquisition\n\n**Challenges:**\n- Inventory sync\n- Order management\n- Pricing consistency\n- Different requirements\n- Support complexity\n\n**Tools:**\n- Sellbrite\n- ChannelAdvisor\n- Linnworks\n- Shopify integrations\n\n**Best Practices:**\n- Centralized inventory\n- Consistent branding\n- Channel-specific optimization\n- Unified customer view`, relatedTerms: ["marketplace", "inventory", "order-management", "integration"], category: "strategy" },
  "marketplace": { slug: "marketplace", term: "Marketplace", definition: "An online platform where multiple sellers list products for customers to browse and purchase.", extendedDefinition: `Marketplaces aggregate sellers, providing built-in traffic but with fees and competition.\n\n**Major Marketplaces:**\n- Amazon (largest)\n- eBay (auctions and fixed)\n- Etsy (handmade/vintage)\n- Walmart (growing)\n- Alibaba/AliExpress\n\n**Marketplace vs Own Store:**\n- Marketplace: Built-in traffic, fees, competition\n- Own store: Control, branding, customer data\n\n**Marketplace Fees:**\n- Listing fees\n- Transaction fees (8-20%)\n- Payment processing\n- Fulfillment fees (FBA)\n\n**Success Factors:**\n- Competitive pricing\n- Fast shipping\n- Great reviews\n- Optimized listings\n- Inventory management`, relatedTerms: ["amazon", "ebay", "multichannel", "platform"], category: "platforms" },
  "kpi": { slug: "kpi", term: "KPI (Key Performance Indicator)", definition: "Measurable values that demonstrate how effectively a business is achieving its key objectives.", extendedDefinition: `KPIs help track progress and make data-driven decisions. Choose metrics that matter most to your goals.\n\n**E-commerce KPIs:**\n- Revenue and growth rate\n- Conversion rate\n- Average order value\n- Customer lifetime value\n- Customer acquisition cost\n- Return on ad spend\n\n**Traffic KPIs:**\n- Sessions/visitors\n- Traffic sources\n- Bounce rate\n- Pages per session\n- Time on site\n\n**Marketing KPIs:**\n- Email open/click rates\n- Social engagement\n- Ad CTR and CPA\n\n**Setting KPIs:**\n- Align with business goals\n- Make them measurable\n- Set benchmarks\n- Track regularly\n- Adjust as needed`, relatedTerms: ["analytics", "metrics", "conversion-rate", "aov"], category: "metrics" },
  "google-analytics": { slug: "google-analytics", term: "Google Analytics", definition: "A free web analytics service that tracks and reports website traffic and user behavior.", extendedDefinition: `Google Analytics is essential for understanding how visitors interact with your store.\n\n**GA4 Features:**\n- Event-based tracking\n- Cross-platform measurement\n- Predictive metrics\n- Privacy-focused design\n\n**Key Reports:**\n- Traffic acquisition\n- User behavior\n- Conversion paths\n- E-commerce analytics\n- Audience demographics\n\n**E-commerce Tracking:**\n- Revenue\n- Transactions\n- Conversion rate\n- Average order value\n- Product performance\n\n**Setup for Shopify:**\n- Native GA4 integration\n- Enhanced e-commerce\n- Google Tag Manager option\n\n**Alternatives:**\n- Shopify Analytics\n- Plausible (privacy-focused)\n- Fathom\n- Mixpanel`, relatedTerms: ["analytics", "tracking", "conversion-rate", "kpi"], category: "technical" },
  "heatmap": { slug: "heatmap", term: "Heatmap", definition: "A visual representation of how users interact with a webpage, showing where they click, scroll, and focus attention.", extendedDefinition: `Heatmaps reveal user behavior patterns that analytics numbers can't show.\n\n**Heatmap Types:**\n- Click maps (where users click)\n- Scroll maps (how far users scroll)\n- Move maps (mouse movement)\n- Attention maps (focus areas)\n\n**Tools:**\n- Hotjar\n- Lucky Orange\n- Microsoft Clarity (free)\n- Crazy Egg\n- Mouseflow\n\n**Insights from Heatmaps:**\n- Are CTAs being clicked?\n- Do users scroll to key content?\n- What elements distract?\n- Where do users get confused?\n\n**Using Heatmaps:**\n- Identify problem areas\n- Test hypotheses\n- Optimize layouts\n- Improve conversions\n- Validate A/B tests`, relatedTerms: ["cro", "user-experience", "analytics", "ab-testing"], category: "technical" },
  "session-recording": { slug: "session-recording", term: "Session Recording", definition: "Video recordings of individual user sessions showing exactly how visitors navigate and interact with your website.", extendedDefinition: `Session recordings provide qualitative insights into user behavior and pain points.\n\n**What Recordings Show:**\n- Navigation paths\n- Hesitation points\n- Form interactions\n- Error encounters\n- Rage clicks (frustration)\n\n**Tools:**\n- Hotjar\n- Lucky Orange\n- FullStory\n- Microsoft Clarity\n- LogRocket\n\n**Use Cases:**\n- Identify UX issues\n- Debug checkout problems\n- Understand drop-offs\n- Improve forms\n- Train support team\n\n**Privacy Considerations:**\n- Exclude sensitive fields\n- Anonymize data\n- Comply with regulations\n- Inform users (privacy policy)`, relatedTerms: ["heatmap", "user-experience", "analytics", "cro"], category: "technical" },
  "attribution": { slug: "attribution", term: "Attribution", definition: "The process of identifying which marketing channels and touchpoints contribute to conversions.", extendedDefinition: `Attribution helps understand which marketing efforts drive sales so you can optimize spend.\n\n**Attribution Models:**\n- Last click (most common)\n- First click\n- Linear (equal credit)\n- Time decay\n- Position-based\n- Data-driven\n\n**Attribution Challenges:**\n- Multiple touchpoints\n- Cross-device journeys\n- Privacy changes (iOS 14.5)\n- Cookie restrictions\n- Walled gardens\n\n**Tools:**\n- Google Analytics\n- Facebook Attribution\n- Triple Whale\n- Northbeam\n- Rockerbox\n\n**Best Practices:**\n- Use multiple models\n- Look at assisted conversions\n- Consider customer journey\n- Test incrementality\n- Don't over-optimize`, relatedTerms: ["conversion-rate", "roas", "analytics", "marketing"], category: "metrics" },
  "supplier-agreement": { slug: "supplier-agreement", term: "Supplier Agreement", definition: "A formal contract between a business and its supplier outlining terms of the business relationship.", extendedDefinition: `Supplier agreements protect both parties and set clear expectations for the relationship.\n\n**Agreement Elements:**\n- Pricing and payment terms\n- Minimum order quantities\n- Quality standards\n- Shipping requirements\n- Return/defect policies\n- Exclusivity clauses\n- Confidentiality\n\n**For Dropshipping:**\n- Blind shipping terms\n- Packaging requirements\n- Processing times\n- Stock notifications\n- Communication protocols\n\n**Getting Agreements:**\n- Request from supplier\n- Create your own template\n- Use platform protections\n- Consult legal if needed\n\n**Importance:**\n- Legal protection\n- Clear expectations\n- Dispute resolution\n- Professional relationship`, relatedTerms: ["supplier", "sourcing", "wholesale", "legal"], category: "sourcing" },
  "import-duties": { slug: "import-duties", term: "Import Duties", definition: "Taxes levied by governments on goods imported from other countries.", extendedDefinition: `Understanding import duties is essential for international sourcing and selling.\n\n**Duty Components:**\n- Tariffs (based on product type)\n- VAT/GST (destination country)\n- Processing fees\n- Brokerage charges\n\n**Who Pays:**\n- DDP (Delivered Duty Paid): Seller pays\n- DDU (Delivered Duty Unpaid): Buyer pays\n- Important for customer experience\n\n**De Minimis Thresholds:**\n- US: $800 (no duties below)\n- UK: £135\n- EU: €150\n- Varies by country\n\n**For Dropshipping:**\n- Know destination country rules\n- Communicate clearly to customers\n- Price accordingly\n- Consider DDP shipping\n\n**Resources:**\n- HS codes for classification\n- Duty calculators\n- Customs brokers`, relatedTerms: ["shipping", "international", "customs", "taxes"], category: "operations" },
  "product-listing": { slug: "product-listing", term: "Product Listing", definition: "The presentation of a product on an e-commerce platform including title, description, images, and details.", extendedDefinition: `Well-optimized product listings increase visibility and conversion rates.\n\n**Listing Elements:**\n- Title/name\n- Product images\n- Price\n- Description\n- Specifications\n- Variants (size, color)\n- Inventory status\n\n**Title Optimization:**\n- Include main keyword\n- Brand name (if applicable)\n- Key features/benefits\n- Avoid keyword stuffing\n\n**Description Best Practices:**\n- Lead with benefits\n- Use bullet points\n- Include specifications\n- Address objections\n- Add social proof\n\n**Image Requirements:**\n- Multiple high-quality images\n- White background option\n- Lifestyle/context shots\n- Size reference\n- Zoom capability`, relatedTerms: ["product-page", "seo", "conversion-rate", "copywriting"], category: "operations" },
  "copywriting": { slug: "copywriting", term: "Copywriting", definition: "Writing persuasive text designed to encourage readers to take a specific action.", extendedDefinition: `Effective copywriting sells products by addressing customer needs and overcoming objections.\n\n**E-commerce Copy Types:**\n- Product descriptions\n- Ad copy\n- Email subject lines\n- Landing pages\n- CTAs\n- Social media posts\n\n**Copywriting Formulas:**\n- AIDA (Attention, Interest, Desire, Action)\n- PAS (Problem, Agitate, Solution)\n- FAB (Features, Advantages, Benefits)\n- 4 P's (Promise, Picture, Proof, Push)\n\n**Best Practices:**\n- Focus on benefits, not features\n- Use customer language\n- Create urgency\n- Include social proof\n- Clear call-to-action\n\n**Testing Copy:**\n- A/B test headlines\n- Test CTAs\n- Measure conversion impact`, relatedTerms: ["product-listing", "cta", "conversion-rate", "marketing"], category: "marketing" },
  "user-experience": { slug: "user-experience", term: "User Experience (UX)", definition: "The overall experience a person has when interacting with a website, including ease of use, accessibility, and satisfaction.", extendedDefinition: `Good UX reduces friction and increases conversions. Bad UX drives customers away.\n\n**UX Elements:**\n- Navigation\n- Page speed\n- Mobile experience\n- Search functionality\n- Checkout flow\n- Visual design\n\n**UX Best Practices:**\n- Intuitive navigation\n- Fast load times\n- Clear CTAs\n- Consistent design\n- Accessible to all users\n- Mobile-first design\n\n**Measuring UX:**\n- Bounce rate\n- Time on site\n- Pages per session\n- Task completion rate\n- Customer feedback\n\n**UX Research:**\n- User testing\n- Session recordings\n- Surveys\n- Heatmaps\n- A/B testing`, relatedTerms: ["conversion-rate", "cro", "page-speed", "mobile"], category: "technical" },
  "cart-page": { slug: "cart-page", term: "Cart Page", definition: "The page where customers review items they've added to their shopping cart before proceeding to checkout.", extendedDefinition: `The cart page is a critical conversion point where many shoppers abandon their purchase.\n\n**Cart Page Elements:**\n- Product list with images\n- Quantities (editable)\n- Prices and subtotal\n- Remove/update options\n- Shipping estimate\n- Continue shopping link\n- Checkout button\n\n**Optimization Tips:**\n- Clear, prominent checkout CTA\n- Show security badges\n- Display return policy\n- Cross-sell related products\n- Show free shipping threshold\n- Save cart for later\n\n**Common Issues:**\n- Hidden fees surprise\n- Slow loading\n- Difficult to edit\n- Unclear shipping costs\n\n**Cart Recovery:**\n- Exit-intent popups\n- Abandoned cart emails\n- Retargeting ads`, relatedTerms: ["checkout", "abandoned-cart", "conversion-rate", "upsell"], category: "operations" },
  "collection-page": { slug: "collection-page", term: "Collection Page", definition: "A page displaying a group of related products, organized by category, type, or theme.", extendedDefinition: `Collection pages help customers browse and discover products within a category.\n\n**Collection Page Elements:**\n- Collection title and description\n- Product grid\n- Filtering options\n- Sorting options\n- Pagination\n- Featured products\n\n**SEO Optimization:**\n- Unique title and meta description\n- Keyword-rich collection description\n- Proper heading structure\n- Internal linking\n\n**Conversion Optimization:**\n- Clear product images\n- Price visibility\n- Quick-add to cart\n- Filter by price, size, color\n- Best sellers highlighted\n\n**Collection Types:**\n- By category\n- By brand\n- By price point\n- By use case\n- Seasonal/trending`, relatedTerms: ["product-page", "navigation", "seo", "filtering"], category: "operations" },
  "navigation": { slug: "navigation", term: "Navigation", definition: "The system of menus, links, and structure that helps users find content on a website.", extendedDefinition: `Good navigation helps customers find products quickly, improving experience and conversions.\n\n**Navigation Types:**\n- Main/header menu\n- Footer menu\n- Mega menus (large dropdowns)\n- Sidebar navigation\n- Breadcrumbs\n- Search\n\n**Best Practices:**\n- Keep main menu simple (7±2 items)\n- Use familiar labels\n- Include search prominently\n- Mobile hamburger menu\n- Show current location\n- Use breadcrumbs\n\n**Common Structure:**\n- Shop by category\n- Shop by brand\n- New arrivals\n- Sale/clearance\n- About/contact\n\n**Testing Navigation:**\n- Card sorting\n- Tree testing\n- Analytics (click paths)\n- User feedback`, relatedTerms: ["user-experience", "collection-page", "search", "mobile"], category: "technical" },
  "search-functionality": { slug: "search-functionality", term: "Site Search", definition: "The internal search feature that allows visitors to find products on your website.", extendedDefinition: `Site search users convert 2-3x more than browsers. Good search is crucial for stores with many products.\n\n**Search Features:**\n- Autocomplete\n- Typo tolerance\n- Filters and facets\n- Synonym handling\n- Popular searches\n- Visual results\n\n**Search Tools:**\n- Shopify native search\n- Algolia\n- SearchSpring\n- Boost Commerce\n- Klevu\n\n**Optimization:**\n- Track search queries\n- Identify zero-result searches\n- Add synonyms\n- Optimize product data\n- Feature best sellers\n\n**Measuring Success:**\n- Search usage rate\n- Click-through rate\n- Conversion from search\n- Zero-result rate`, relatedTerms: ["navigation", "user-experience", "conversion-rate", "product-listing"], category: "technical" },
  "discount-code": { slug: "discount-code", term: "Discount Code", definition: "A promotional code customers enter at checkout to receive a reduction in price.", extendedDefinition: `Discount codes drive sales but must be managed strategically to protect margins.\n\n**Discount Types:**\n- Percentage off (10%, 20%)\n- Fixed amount ($10 off)\n- Free shipping\n- Buy X get Y\n- Minimum purchase threshold\n\n**Strategic Uses:**\n- First-time buyers\n- Abandoned cart recovery\n- Loyalty rewards\n- Seasonal promotions\n- Influencer tracking\n\n**Best Practices:**\n- Set expiration dates\n- Limit uses per customer\n- Exclude sale items if needed\n- Track code performance\n- Don't over-discount\n\n**Psychology:**\n- Urgency (limited time)\n- Exclusivity (VIP codes)\n- Threshold incentives ($50 minimum)`, relatedTerms: ["promotion", "conversion-rate", "abandoned-cart", "pricing"], category: "marketing" },
  "free-shipping": { slug: "free-shipping", term: "Free Shipping", definition: "A promotional offer where the seller covers shipping costs for the customer.", extendedDefinition: `Free shipping is the #1 conversion driver. 66% of consumers expect free shipping on every purchase.\n\n**Free Shipping Strategies:**\n- Threshold-based ($50+ free shipping)\n- Always free (built into price)\n- Membership (like Prime)\n- Promotional periods\n- First order only\n\n**Impact:**\n- Increases conversion 20-30%\n- Increases AOV (threshold)\n- Reduces cart abandonment\n- Competitive necessity\n\n**Implementing:**\n- Calculate shipping cost per order\n- Build into product prices\n- Set profitable threshold\n- Highlight prominently\n\n**Considerations:**\n- Profitability impact\n- International shipping\n- Heavy/oversized items\n- Competitor offerings`, relatedTerms: ["shipping", "conversion-rate", "aov", "cart-abandonment-rate"], category: "marketing" },
  "scarcity": { slug: "scarcity", term: "Scarcity", definition: "A marketing technique that creates urgency by highlighting limited availability of products or offers.", extendedDefinition: `Scarcity triggers FOMO (fear of missing out) and motivates faster purchasing decisions.\n\n**Scarcity Tactics:**\n- Limited stock ("Only 3 left")\n- Limited time ("Sale ends tonight")\n- Exclusive access\n- Countdown timers\n- Flash sales\n\n**Implementation:**\n- Stock counters\n- Countdown timers\n- "Selling fast" badges\n- Limited edition products\n- Early bird pricing\n\n**Best Practices:**\n- Be truthful (fake scarcity backfires)\n- Use sparingly\n- Combine with social proof\n- Test different messaging\n\n**Tools:**\n- Scarcity apps (Shopify)\n- Email countdown timers\n- Dynamic inventory displays`, relatedTerms: ["urgency", "conversion-rate", "fomo", "marketing"], category: "marketing" },
  "urgency": { slug: "urgency", term: "Urgency", definition: "Marketing tactics that encourage customers to act quickly, often through time-limited offers.", extendedDefinition: `Urgency reduces procrastination and increases conversion rates by motivating immediate action.\n\n**Urgency Techniques:**\n- Limited-time offers\n- Countdown timers\n- Expiring discounts\n- "Today only" messaging\n- Flash sales\n\n**Urgency vs Scarcity:**\n- Urgency: Time-based pressure\n- Scarcity: Quantity-based pressure\n- Often used together\n\n**Creating Urgency:**\n- Sale end dates\n- Shipping cutoffs\n- Promotional deadlines\n- Seasonal events\n\n**Best Practices:**\n- Be honest about deadlines\n- Make timers visible\n- Reinforce in emails\n- Don't overuse\n- Combine with value`, relatedTerms: ["scarcity", "conversion-rate", "fomo", "promotion"], category: "marketing" },
  "customer-acquisition": { slug: "customer-acquisition", term: "Customer Acquisition", definition: "The process of attracting and converting new customers to your business.", extendedDefinition: `Customer acquisition is about gaining new customers through marketing and sales efforts.\n\n**Acquisition Channels:**\n- Paid advertising\n- SEO/organic search\n- Social media\n- Email marketing\n- Influencer marketing\n- Referral programs\n- Content marketing\n\n**Customer Acquisition Cost (CAC):**\n\`\`\`\nCAC = Total Marketing Cost / New Customers\n\nExample:\n$10,000 spent / 200 customers = $50 CAC\n\`\`\`\n\n**Healthy CAC:LTV Ratio:**\n- 3:1 or higher\n- LTV should be 3x+ CAC\n\n**Reducing CAC:**\n- Improve conversion rates\n- Optimize ad targeting\n- Organic channels\n- Referral programs\n- Retention focus`, relatedTerms: ["cac", "ltv", "marketing", "conversion-rate"], category: "metrics" },
  "cac": { slug: "cac", term: "CAC (Customer Acquisition Cost)", definition: "The total cost of acquiring a new customer, including all marketing and sales expenses.", extendedDefinition: `CAC is fundamental for understanding marketing efficiency and business sustainability.\n\n**Calculating CAC:**\n\`\`\`\nCAC = (Marketing + Sales Costs) / New Customers\n\nExample:\n($5,000 ads + $2,000 software) / 140 customers = $50 CAC\n\`\`\`\n\n**What to Include:**\n- Advertising spend\n- Marketing software\n- Agency fees\n- Content creation\n- Sales salaries\n\n**CAC by Channel:**\n- Paid social: $30-100\n- Google Ads: $20-80\n- SEO: Lower but takes time\n- Email: Very low\n- Referrals: Very low\n\n**Improving CAC:**\n- Better targeting\n- Higher conversion rates\n- Optimize creatives\n- Organic growth\n- Customer referrals`, relatedTerms: ["customer-acquisition", "ltv", "roas", "marketing"], category: "metrics" },
  "refund": { slug: "refund", term: "Refund", definition: "The return of money to a customer for a product return, order cancellation, or service issue.", extendedDefinition: `Managing refunds properly protects customer relationships and reduces chargebacks.\n\n**Refund Types:**\n- Full refund\n- Partial refund\n- Store credit\n- Exchange\n\n**Refund Policy Elements:**\n- Time limit (30-60 days)\n- Condition requirements\n- Process instructions\n- Exceptions\n- Shipping costs\n\n**Best Practices:**\n- Clear, visible policy\n- Fast processing (3-5 days)\n- Easy return process\n- Communicate status updates\n- Track refund reasons\n\n**Dropshipping Refunds:**\n- Often refund without return\n- Coordinate with supplier\n- Build into margins\n- Have clear policy\n\n**Reducing Refunds:**\n- Accurate descriptions\n- Quality products\n- Size guides\n- Good photos`, relatedTerms: ["returns", "chargeback", "customer-service", "policy"], category: "operations" },
  "fraud-prevention": { slug: "fraud-prevention", term: "Fraud Prevention", definition: "Systems and processes to detect and prevent fraudulent transactions and protect against financial losses.", extendedDefinition: `E-commerce fraud costs billions annually. Prevention protects revenue and reputation.\n\n**Fraud Types:**\n- Stolen credit cards\n- Chargeback fraud\n- Account takeover\n- Identity theft\n- Friendly fraud\n\n**Prevention Tools:**\n- Shopify Fraud Analysis\n- Signifyd\n- NoFraud\n- Sift\n- Address Verification (AVS)\n- CVV verification\n\n**Red Flags:**\n- Mismatched billing/shipping\n- Multiple failed attempts\n- Unusual order sizes\n- Express shipping requests\n- International with US card\n\n**Prevention Steps:**\n- Enable fraud tools\n- Review flagged orders\n- Verify suspicious orders\n- Keep records\n- Know your limits`, relatedTerms: ["chargeback", "payment-gateway", "security", "risk"], category: "operations" },
  "crm": { slug: "crm", term: "CRM (Customer Relationship Management)", definition: "Software and strategies for managing customer interactions, data, and relationships throughout the customer lifecycle.", extendedDefinition: `CRM systems help you understand and serve customers better, driving retention and lifetime value.\n\n**CRM Functions:**\n- Customer data storage\n- Purchase history\n- Communication tracking\n- Segmentation\n- Automation\n- Analytics\n\n**E-commerce CRMs:**\n- Klaviyo (email-focused)\n- HubSpot\n- Drip\n- Omnisend\n- Shopify customer data\n\n**CRM Benefits:**\n- Personalized marketing\n- Better customer service\n- Increased retention\n- Data-driven decisions\n- Automated workflows\n\n**Using CRM Data:**\n- Segment by behavior\n- Personalize emails\n- Identify VIP customers\n- Win-back campaigns\n- Predict churn`, relatedTerms: ["email-marketing", "retention", "personalization", "customer-service"], category: "technical" },
  "omnichannel": { slug: "omnichannel", term: "Omnichannel", definition: "A seamless, integrated customer experience across all channels and touchpoints.", extendedDefinition: `Omnichannel goes beyond multichannel by creating a unified experience regardless of how customers engage.\n\n**Omnichannel vs Multichannel:**\n- Multichannel: Multiple separate channels\n- Omnichannel: Integrated, consistent experience\n\n**Omnichannel Elements:**\n- Consistent branding\n- Unified inventory\n- Cross-channel customer data\n- Seamless transitions\n- Coordinated messaging\n\n**Examples:**\n- Buy online, pick up in store\n- Start cart on mobile, finish on desktop\n- Customer service knows full history\n- Consistent prices across channels\n\n**Benefits:**\n- Higher customer satisfaction\n- Increased loyalty\n- Better data\n- Higher lifetime value`, relatedTerms: ["multichannel", "customer-experience", "integration", "retail"], category: "strategy" },
  "dropship-supplier": { slug: "dropship-supplier", term: "Dropship Supplier", definition: "A manufacturer, wholesaler, or distributor that ships products directly to customers on behalf of retailers.", extendedDefinition: `Dropship suppliers are the backbone of the dropshipping business model, handling inventory and fulfillment.\n\n**Supplier Types:**\n- Manufacturers (best prices, high MOQ)\n- Wholesalers (moderate prices/MOQ)\n- Distributors (higher prices, lower MOQ)\n- Dropship-specific platforms\n\n**Finding Suppliers:**\n- AliExpress/Alibaba\n- Spocket\n- CJ Dropshipping\n- Supplier directories\n- Trade shows\n- Direct outreach\n\n**Evaluating Suppliers:**\n- Product quality\n- Shipping times\n- Communication\n- Returns policy\n- Reviews\n- Pricing\n\n**Building Relationships:**\n- Start with small orders\n- Communicate regularly\n- Pay on time\n- Negotiate over time`, relatedTerms: ["dropshipping", "supplier", "sourcing", "fulfillment"], category: "sourcing" },
  "product-sourcing": { slug: "product-sourcing", term: "Product Sourcing", definition: "The process of finding and acquiring products to sell in your e-commerce store.", extendedDefinition: `Effective product sourcing balances quality, price, reliability, and shipping speed.\n\n**Sourcing Methods:**\n- Dropshipping platforms\n- Alibaba/AliExpress\n- Domestic wholesalers\n- Trade shows\n- Manufacturer direct\n- Sourcing agents\n\n**Sourcing Criteria:**\n- Product quality\n- Price and margins\n- Shipping options\n- Supplier reliability\n- MOQ requirements\n- Customization options\n\n**Sourcing Process:**\n1. Research product demand\n2. Find potential suppliers\n3. Request samples\n4. Evaluate quality/pricing\n5. Negotiate terms\n6. Test order\n7. Build relationship\n\n**Regional Sourcing:**\n- China: Lowest cost, longer shipping\n- US/EU: Faster shipping, higher cost\n- India: Growing options\n- Southeast Asia: Alternative to China`, relatedTerms: ["supplier", "dropshipping", "wholesale", "alibaba"], category: "sourcing" },
  "gross-margin": { slug: "gross-margin", term: "Gross Margin", definition: "The percentage of revenue remaining after subtracting the cost of goods sold.", extendedDefinition: `Gross margin indicates how much profit you make on each product before operating expenses.\n\n**Calculating Gross Margin:**\n\`\`\`\nGross Margin = ((Revenue - COGS) / Revenue) × 100\n\nExample:\n(($100 - $40) / $100) × 100 = 60% gross margin\n\`\`\`\n\n**E-commerce Benchmarks:**\n- Dropshipping: 15-45%\n- Wholesale: 30-50%\n- Private label: 50-80%\n- Print on demand: 20-40%\n\n**Factors Affecting Margin:**\n- Product cost\n- Shipping costs\n- Payment processing\n- Returns\n- Discounts\n\n**Improving Gross Margin:**\n- Negotiate with suppliers\n- Reduce shipping costs\n- Optimize pricing\n- Reduce returns`, relatedTerms: ["profit-margin", "cogs", "pricing-strategy", "net-profit"], category: "finance" },
  "break-even-point": { slug: "break-even-point", term: "Break-Even Point", definition: "The point at which total revenue equals total costs, resulting in neither profit nor loss.", extendedDefinition: `Understanding break-even helps plan pricing, set targets, and evaluate viability.\n\n**Calculating Break-Even:**\n\`\`\`\nBreak-Even Units = Fixed Costs / (Price - Variable Cost)\n\nExample:\n$5,000 / ($50 - $25) = 200 units to break even\n\`\`\`\n\n**Fixed Costs in E-commerce:**\n- Platform subscriptions\n- Software tools\n- Marketing salaries\n- Domain/hosting\n\n**Variable Costs:**\n- Product cost\n- Shipping\n- Payment processing\n- Ads per sale\n\n**Using Break-Even:**\n- Set sales targets\n- Evaluate pricing\n- Plan promotions\n- Assess profitability\n- Make investment decisions`, relatedTerms: ["profit-margin", "cogs", "pricing-strategy", "fixed-costs"], category: "finance" },
  "inventory-management": { slug: "inventory-management", term: "Inventory Management", definition: "The process of ordering, storing, tracking, and controlling inventory to meet customer demand.", extendedDefinition: `Even dropshippers need to track supplier inventory to avoid selling out-of-stock items.\n\n**Inventory Methods:**\n- Just-in-time (JIT)\n- Dropshipping (no inventory)\n- Warehouse storage\n- 3PL fulfillment\n\n**Key Metrics:**\n- Stock levels\n- Reorder points\n- Inventory turnover\n- Days of inventory\n- Stockout rate\n\n**Inventory Software:**\n- Shopify inventory\n- TradeGecko/QuickBooks Commerce\n- Skubana\n- Cin7\n- DSers (dropshipping)\n\n**For Dropshippers:**\n- Sync with supplier stock\n- Monitor availability\n- Have backup suppliers\n- Auto-hide out-of-stock`, relatedTerms: ["fulfillment", "supplier", "warehouse", "operations"], category: "operations" },
  "payment-processor": { slug: "payment-processor", term: "Payment Processor", definition: "A company that handles credit card transactions between merchants and banks.", extendedDefinition: `Payment processors enable you to accept card payments online securely.\n\n**How It Works:**\n1. Customer enters card info\n2. Processor encrypts and sends data\n3. Bank authorizes transaction\n4. Funds transferred to merchant\n\n**Popular Processors:**\n- Stripe\n- PayPal\n- Square\n- Shopify Payments\n- Authorize.net\n\n**Processing Fees:**\n- Typically 2.9% + $0.30\n- Lower rates at volume\n- International cards higher\n- Some monthly fees\n\n**Features to Consider:**\n- Payout speed\n- International support\n- Fraud protection\n- Chargeback handling\n- Integration ease`, relatedTerms: ["payment-gateway", "stripe", "paypal", "checkout"], category: "payments" },
  "conversion-funnel": { slug: "conversion-funnel", term: "Conversion Funnel", definition: "The path customers take from first awareness to completing a purchase.", extendedDefinition: `Understanding your funnel helps identify where customers drop off and optimize accordingly.\n\n**E-commerce Funnel Stages:**\n1. Awareness (see ad/content)\n2. Interest (visit website)\n3. Consideration (view products)\n4. Intent (add to cart)\n5. Purchase (checkout)\n6. Loyalty (repeat purchase)\n\n**Funnel Metrics:**\n- Traffic to site\n- Product page views\n- Add-to-cart rate\n- Cart-to-checkout rate\n- Checkout completion rate\n\n**Optimization:**\n- Top of funnel: Better targeting\n- Middle: Better product pages\n- Bottom: Smoother checkout\n\n**Funnel Analysis:**\n- Google Analytics\n- Shopify analytics\n- Dedicated funnel tools`, relatedTerms: ["conversion-rate", "cart-abandonment-rate", "cro", "analytics"], category: "metrics" },
  "brand-identity": { slug: "brand-identity", term: "Brand Identity", definition: "The collection of visual and messaging elements that define how a brand presents itself to the world.", extendedDefinition: `Strong brand identity builds recognition, trust, and customer loyalty.\n\n**Brand Elements:**\n- Logo\n- Color palette\n- Typography\n- Imagery style\n- Tone of voice\n- Tagline\n\n**Creating Brand Identity:**\n1. Define target audience\n2. Establish brand values\n3. Research competitors\n4. Design visual elements\n5. Develop voice guidelines\n6. Apply consistently\n\n**Brand Consistency:**\n- Website design\n- Packaging\n- Social media\n- Email marketing\n- Customer service\n\n**Why It Matters:**\n- Recognition\n- Trust building\n- Premium pricing\n- Customer loyalty\n- Referrals`, relatedTerms: ["branding", "marketing", "unique-selling-proposition", "customer-experience"], category: "marketing" },
  "shipping-carrier": { slug: "shipping-carrier", term: "Shipping Carrier", definition: "A company that transports and delivers packages from sellers to customers.", extendedDefinition: `Choosing the right carrier affects delivery speed, cost, and customer satisfaction.\n\n**Major Carriers:**\n- USPS (economical for light items)\n- UPS (reliable, good tracking)\n- FedEx (fast options)\n- DHL (international)\n- Regional carriers\n\n**Carrier Selection Factors:**\n- Shipping speed\n- Cost by weight/size\n- Tracking quality\n- Delivery reliability\n- Insurance options\n- Coverage area\n\n**International Shipping:**\n- DHL Express\n- UPS Worldwide\n- FedEx International\n- ePacket (China)\n- PostNL, Royal Mail\n\n**Negotiating Rates:**\n- Volume discounts\n- Third-party shipping apps\n- Multi-carrier strategies`, relatedTerms: ["shipping", "fulfillment", "tracking", "delivery"], category: "operations" },
  "return-policy": { slug: "return-policy", term: "Return Policy", definition: "The rules and procedures a business establishes for customers returning purchased items.", extendedDefinition: `A clear return policy builds trust and can increase conversions by reducing purchase risk.\n\n**Policy Elements:**\n- Timeframe (30, 60, 90 days)\n- Condition requirements\n- Refund vs exchange vs credit\n- Who pays return shipping\n- Exceptions\n- Process instructions\n\n**Best Practices:**\n- Make it easy to find\n- Use clear language\n- Be generous but protect margins\n- Automate the process\n- Track return reasons\n\n**Dropshipping Returns:**\n- Often refund without return\n- Coordinate with supplier\n- Factor into pricing\n\n**Impact on Sales:**\n- Reduces purchase anxiety\n- Increases conversion\n- Builds trust\n- Reduces chargebacks`, relatedTerms: ["refund", "customer-service", "returns", "chargeback"], category: "operations" },
  "customer-support": { slug: "customer-support", term: "Customer Support", definition: "The services and assistance provided to customers before, during, and after their purchase.", extendedDefinition: `Great support turns buyers into loyal customers and reduces returns and chargebacks.\n\n**Support Channels:**\n- Email\n- Live chat\n- Phone\n- Social media\n- Help center/FAQ\n- Chatbots\n\n**Support Tools:**\n- Gorgias\n- Zendesk\n- Freshdesk\n- Help Scout\n- Tidio (chat)\n\n**Key Metrics:**\n- Response time\n- Resolution time\n- Customer satisfaction\n- First contact resolution\n- Ticket volume\n\n**Best Practices:**\n- Fast response (<24 hours)\n- Personalized replies\n- Empowered agents\n- Proactive communication\n- Self-service options`, relatedTerms: ["customer-service", "crm", "retention", "customer-experience"], category: "customer-experience" },
  "product-description": { slug: "product-description", term: "Product Description", definition: "The written content that explains a product's features, benefits, and value proposition.", extendedDefinition: `Effective product descriptions sell by connecting features to customer benefits.\n\n**Description Elements:**\n- Headline/title\n- Key benefits\n- Features list\n- Specifications\n- Use cases\n- Social proof\n\n**Writing Tips:**\n- Focus on benefits first\n- Use sensory words\n- Address objections\n- Include keywords naturally\n- Use bullet points\n- Tell a story\n\n**Structure:**\n1. Hook with main benefit\n2. Key features (3-5 bullets)\n3. Detailed description\n4. Specifications\n5. Call to action\n\n**AI Tools for Descriptions:**\n- ChatGPT\n- Jasper\n- Copy.ai\n- Shopify Magic`, relatedTerms: ["product-listing", "copywriting", "seo", "conversion-rate"], category: "marketing" },
  "split-testing": { slug: "split-testing", term: "Split Testing", definition: "A method of comparing two or more versions of a webpage or element to determine which performs better.", extendedDefinition: `Split testing (A/B testing) removes guesswork from optimization by using data to make decisions.\n\n**What to Test:**\n- Headlines\n- Product images\n- Prices\n- CTAs\n- Page layouts\n- Email subject lines\n\n**Testing Process:**\n1. Identify hypothesis\n2. Create variations\n3. Split traffic\n4. Run test\n5. Analyze results\n6. Implement winner\n\n**Testing Tools:**\n- Google Optimize\n- VWO\n- Optimizely\n- Convert\n- Shopify native testing\n\n**Best Practices:**\n- Test one variable at a time\n- Reach statistical significance\n- Run tests long enough\n- Document learnings\n- Keep testing`, relatedTerms: ["ab-testing", "cro", "conversion-rate", "analytics"], category: "technical" },
  "mobile-commerce": { slug: "mobile-commerce", term: "Mobile Commerce (M-Commerce)", definition: "Buying and selling goods and services through mobile devices like smartphones and tablets.", extendedDefinition: `Mobile commerce accounts for over 70% of e-commerce traffic. Mobile optimization is essential.\n\n**Mobile Commerce Growth:**\n- 70%+ of e-commerce traffic\n- Lower conversion than desktop\n- Growing payment options\n- Social commerce integration\n\n**Mobile Optimization:**\n- Responsive design\n- Fast loading (under 3 seconds)\n- Easy navigation\n- Thumb-friendly buttons\n- Simplified checkout\n- Mobile payments\n\n**Mobile Payments:**\n- Apple Pay\n- Google Pay\n- Shop Pay\n- PayPal\n- Buy now, pay later\n\n**Mobile-First Design:**\n- Design for mobile first\n- Test on real devices\n- Optimize images\n- Minimize form fields`, relatedTerms: ["ecommerce", "checkout", "user-experience", "conversion-rate"], category: "technical" },
  "order-confirmation": { slug: "order-confirmation", term: "Order Confirmation", definition: "A notification sent to customers after they complete a purchase, confirming the order details.", extendedDefinition: `Order confirmations reduce anxiety and set expectations while providing upsell opportunities.\n\n**Confirmation Elements:**\n- Order number\n- Items purchased\n- Prices and total\n- Shipping address\n- Estimated delivery\n- Contact information\n\n**Best Practices:**\n- Send immediately\n- Include tracking link when available\n- Clear next steps\n- Brand consistently\n- Mobile-friendly\n\n**Post-Purchase Sequence:**\n1. Order confirmation\n2. Shipping confirmation\n3. Delivery notification\n4. Review request\n5. Follow-up/upsell\n\n**Upsell Opportunities:**\n- Related products\n- Order add-ons\n- Subscription offers\n- Referral program`, relatedTerms: ["email-marketing", "order-tracking", "customer-experience", "checkout"], category: "operations" },
  "tracking-number": { slug: "tracking-number", term: "Tracking Number", definition: "A unique identifier assigned to a shipment that allows customers to monitor delivery progress.", extendedDefinition: `Providing tracking reduces "where is my order" inquiries and builds customer trust.\n\n**Tracking Benefits:**\n- Reduces support tickets\n- Builds customer trust\n- Reduces anxiety\n- Fewer chargebacks\n- Better experience\n\n**Tracking Sources:**\n- Carrier websites\n- 17Track (multi-carrier)\n- AfterShip\n- ParcelTrack\n- Shopify native\n\n**Dropshipping Tracking:**\n- Auto-sync from suppliers\n- DSers/CJ tracking import\n- Send proactively\n- Set delivery expectations\n\n**Best Practices:**\n- Send as soon as available\n- Include estimated delivery\n- Explain if from overseas\n- Branded tracking pages`, relatedTerms: ["shipping", "order-tracking", "fulfillment", "customer-experience"], category: "operations" },
  "niche-market": { slug: "niche-market", term: "Niche Market", definition: "A specialized segment of a larger market with specific needs, preferences, or identity.", extendedDefinition: `Targeting a niche allows you to compete effectively against larger retailers.\n\n**Niche Benefits:**\n- Less competition\n- Targeted marketing\n- Higher margins\n- Customer loyalty\n- Expert positioning\n\n**Finding a Niche:**\n- Follow your interests\n- Research trends\n- Analyze competition\n- Validate demand\n- Test profitability\n\n**Profitable Niche Criteria:**\n- Passionate audience\n- Willingness to pay\n- Repeat purchase potential\n- Room for differentiation\n- Accessible suppliers\n\n**Niche Examples:**\n- Eco-friendly pet products\n- Gaming accessories\n- Minimalist home decor\n- Plus-size activewear`, relatedTerms: ["target-audience", "product-research", "competitor-analysis", "market-research"], category: "strategy" },
  "quality-control": { slug: "quality-control", term: "Quality Control", definition: "The process of ensuring products meet specified quality standards before reaching customers.", extendedDefinition: `Quality control is challenging in dropshipping but essential for customer satisfaction.\n\n**QC Methods:**\n- Sample testing\n- Supplier audits\n- Third-party inspection\n- Customer feedback\n- Return analysis\n\n**For Dropshipping:**\n- Order samples regularly\n- Monitor reviews\n- Track return reasons\n- Build supplier relationships\n- Have backup suppliers\n\n**Quality Issues:**\n- Defects\n- Wrong items\n- Damaged packaging\n- Size inconsistencies\n- Color variations\n\n**Handling Issues:**\n- Refund/replace quickly\n- Communicate with supplier\n- Document problems\n- Adjust supplier score\n- Remove poor products`, relatedTerms: ["supplier-vetting", "returns", "customer-satisfaction", "product-sourcing"], category: "operations" },
  "price-testing": { slug: "price-testing", term: "Price Testing", definition: "Experimenting with different price points to find the optimal price that maximizes revenue or profit.", extendedDefinition: `Price testing helps find the sweet spot between volume and margin.\n\n**Testing Methods:**\n- A/B testing prices\n- Geographic testing\n- Time-based testing\n- Promotional testing\n\n**Considerations:**\n- Conversion rate impact\n- Revenue vs profit\n- Customer perception\n- Competitor pricing\n- Brand positioning\n\n**Price Psychology:**\n- Charm pricing ($29.99 vs $30)\n- Anchoring (show original price)\n- Bundle pricing\n- Tiered options\n\n**Testing Tips:**\n- Test significant differences\n- Run tests long enough\n- Consider lifetime value\n- Monitor competitors\n- Document results`, relatedTerms: ["pricing-strategy", "ab-testing", "conversion-rate", "profit-margin"], category: "strategy" },
  "customer-review": { slug: "customer-review", term: "Customer Review", definition: "Written feedback from customers about their experience with a product or service.", extendedDefinition: `Reviews are powerful social proof that significantly impact conversion rates.\n\n**Review Impact:**\n- 93% of consumers read reviews\n- Products with reviews convert 270% better\n- Star rating affects click-through\n- User photos increase trust\n\n**Getting Reviews:**\n- Post-purchase email sequence\n- Incentives (discounts, loyalty points)\n- Make it easy\n- Ask at the right time\n- Follow up if needed\n\n**Review Apps:**\n- Judge.me\n- Loox (photo reviews)\n- Stamped.io\n- Yotpo\n- Okendo\n\n**Handling Negative Reviews:**\n- Respond professionally\n- Address issues\n- Offer solutions\n- Learn from feedback`, relatedTerms: ["social-proof", "trust-signals", "conversion-rate", "customer-experience"], category: "customer-experience" },
  "viral-product": { slug: "viral-product", term: "Viral Product", definition: "A product that gains rapid, widespread popularity through social media sharing and word-of-mouth.", extendedDefinition: `Viral products can generate massive sales quickly but require timing and strategy.\n\n**Viral Product Characteristics:**\n- Visual appeal\n- Shareability\n- Problem-solving\n- Unique/novel\n- Affordable impulse buy\n- Emotional trigger\n\n**Finding Viral Products:**\n- TikTok trending\n- Instagram Reels\n- AliExpress hot products\n- Amazon movers and shakers\n- Google Trends\n\n**Capitalizing on Virality:**\n- Move fast\n- Create engaging content\n- Partner with influencers\n- Build email list quickly\n- Prepare for scaling\n\n**Risks:**\n- Short lifespan\n- Sudden competition\n- Supply issues\n- Quality concerns`, relatedTerms: ["product-research", "tiktok-shop", "social-commerce", "trending"], category: "strategy" },
  "wholesale-pricing": { slug: "wholesale-pricing", term: "Wholesale Pricing", definition: "Discounted prices offered to buyers purchasing in bulk, typically 40-60% below retail.", extendedDefinition: `Wholesale pricing offers better margins than dropshipping but requires upfront investment.\n\n**Wholesale vs Retail:**\n- Wholesale: 40-60% off retail\n- Requires minimum orders\n- Must store inventory\n- Better margins\n\n**Finding Wholesale Suppliers:**\n- Trade shows\n- Alibaba\n- Industry directories\n- Direct manufacturer contact\n- Faire marketplace\n\n**Wholesale Terms:**\n- MOQ (minimum order quantity)\n- Payment terms (Net 30, etc.)\n- MAP pricing\n- Exclusivity agreements\n- Volume discounts\n\n**Hybrid Approach:**\n- Test with dropshipping\n- Order wholesale for winners\n- Improve margins and speed`, relatedTerms: ["moq", "supplier", "pricing-strategy", "inventory"], category: "sourcing" },
  "one-product-store": { slug: "one-product-store", term: "One-Product Store", definition: "An e-commerce store focused on selling a single product or closely related product line.", extendedDefinition: `One-product stores allow laser focus on marketing and conversion optimization.\n\n**Benefits:**\n- Simplified operations\n- Focused marketing\n- Clear brand message\n- Easier optimization\n- Lower startup cost\n\n**Success Factors:**\n- Winning product selection\n- Strong value proposition\n- Excellent product page\n- Targeted advertising\n- Social proof focus\n\n**Product Criteria:**\n- Solves clear problem\n- Visual appeal\n- Good margins\n- Not readily available locally\n- Upsell opportunities\n\n**Evolution:**\n- Start one-product\n- Add complementary items\n- Build into brand`, relatedTerms: ["niche-market", "product-research", "conversion-rate", "branding"], category: "business-models" },
  "blind-shipping": { slug: "blind-shipping", term: "Blind Shipping", definition: "Shipping products without supplier branding, making it appear the shipment came directly from your store.", extendedDefinition: `Blind shipping protects your business and creates a professional customer experience.\n\n**Blind Shipping Includes:**\n- No supplier invoice\n- No supplier branding\n- Custom packing slip\n- Your return address\n- Branded packaging\n\n**Requesting Blind Shipping:**\n- Ask supplier before ordering\n- Provide your business info\n- Pay for custom inserts\n- Test with small orders\n\n**Why It Matters:**\n- Protects customer relationship\n- Prevents direct supplier contact\n- Professional appearance\n- Brand consistency\n\n**Suppliers That Offer It:**\n- CJ Dropshipping\n- Spocket suppliers\n- Private agents\n- Some AliExpress sellers`, relatedTerms: ["dropshipping", "supplier", "fulfillment", "branding"], category: "operations" },
  "ad-creative": { slug: "ad-creative", term: "Ad Creative", definition: "The visual and textual elements of an advertisement, including images, video, copy, and design.", extendedDefinition: `Ad creative is often the biggest factor in ad performance. Great creative can dramatically lower costs.\n\n**Creative Elements:**\n- Hook (first 3 seconds)\n- Main message\n- Product showcase\n- Social proof\n- Call to action\n\n**Creative Formats:**\n- Static images\n- Video ads (UGC, lifestyle)\n- Carousels\n- Stories/Reels\n- Collection ads\n\n**High-Performing Creative:**\n- User-generated content\n- Before/after demos\n- Problem-solution format\n- Testimonials\n- Unboxing videos\n\n**Testing Creative:**\n- Test multiple concepts\n- Iterate on winners\n- Refresh frequently\n- Platform-specific formats`, relatedTerms: ["ugc", "facebook-ads", "tiktok-ads", "marketing"], category: "advertising" },
  "customer-journey": { slug: "customer-journey", term: "Customer Journey", definition: "The complete experience a customer has with your brand from awareness through purchase and beyond.", extendedDefinition: `Understanding the customer journey helps optimize each touchpoint for conversion and retention.\n\n**Journey Stages:**\n1. Awareness (discover brand)\n2. Consideration (research)\n3. Decision (purchase)\n4. Retention (repeat buy)\n5. Advocacy (refer others)\n\n**Mapping the Journey:**\n- Identify touchpoints\n- Understand emotions\n- Find pain points\n- Optimize each stage\n- Create seamless experience\n\n**Touchpoints:**\n- Ads\n- Website\n- Emails\n- Social media\n- Customer service\n- Packaging\n\n**Optimization:**\n- Reduce friction\n- Personalize experiences\n- Follow up appropriately\n- Exceed expectations`, relatedTerms: ["conversion-funnel", "customer-experience", "retention", "touchpoint"], category: "customer-experience" },
  "marketplace-fees": { slug: "marketplace-fees", term: "Marketplace Fees", definition: "Charges imposed by online marketplaces for listing and selling products on their platform.", extendedDefinition: `Marketplace fees significantly impact profitability and must be factored into pricing.\n\n**Common Fee Types:**\n- Listing fees\n- Referral/commission fees\n- Fulfillment fees (FBA)\n- Storage fees\n- Payment processing\n\n**Fee Examples:**\n- Amazon: 8-15% referral + FBA\n- eBay: 12.9% + $0.30\n- Etsy: 6.5% + listing fee\n- Walmart: 6-15% referral\n\n**Calculating Profitability:**\n\`\`\`\nProfit = Selling Price - Product Cost - Shipping - Marketplace Fees - Payment Processing\n\`\`\`\n\n**Fee Strategies:**\n- Factor into pricing\n- Compare marketplaces\n- Consider own store\n- Optimize fulfillment`, relatedTerms: ["marketplace", "profit-margin", "amazon", "pricing-strategy"], category: "finance" },
  "landing-page-builder": { slug: "landing-page-builder", term: "Landing Page Builder", definition: "Software that enables creating custom landing pages without coding for marketing campaigns.", extendedDefinition: `Landing page builders help create high-converting pages for specific campaigns and products.\n\n**Popular Builders:**\n- Shogun (Shopify)\n- GemPages\n- PageFly\n- Zipify\n- Unbounce\n\n**Landing Page Elements:**\n- Compelling headline\n- Hero image/video\n- Benefits section\n- Social proof\n- Clear CTA\n- Trust badges\n\n**When to Use:**\n- Product launches\n- Ad campaigns\n- Seasonal promotions\n- Lead generation\n- A/B testing\n\n**Optimization:**\n- Single focus\n- Above-fold CTA\n- Fast loading\n- Mobile-optimized\n- Remove navigation`, relatedTerms: ["landing-page", "cro", "conversion-rate", "shopify-app"], category: "technical" },
  "private-agent": { slug: "private-agent", term: "Private Agent", definition: "A sourcing professional or company that handles product procurement and fulfillment on your behalf.", extendedDefinition: `Private agents offer personalized service and better terms than generic platforms.\n\n**Agent Services:**\n- Product sourcing\n- Quality inspection\n- Private labeling\n- Custom packaging\n- Warehousing\n- Fast shipping\n\n**Benefits Over Platforms:**\n- Better prices\n- Faster processing\n- Quality control\n- Custom branding\n- Dedicated support\n- Local warehousing\n\n**Finding Agents:**\n- Alibaba contacts\n- Industry referrals\n- Sourcing companies\n- CJ Dropshipping agents\n- Freelance platforms\n\n**Working with Agents:**\n- Start with test orders\n- Clear communication\n- Build relationship\n- Negotiate as volume grows`, relatedTerms: ["supplier", "product-sourcing", "fulfillment", "dropshipping"], category: "sourcing" },
  "email-sequence": { slug: "email-sequence", term: "Email Sequence", definition: "A series of automated emails sent to subscribers based on triggers, timing, or behavior.", extendedDefinition: `Email sequences nurture leads and customers automatically, driving sales around the clock.\n\n**Essential Sequences:**\n- Welcome series\n- Abandoned cart\n- Post-purchase\n- Win-back\n- Browse abandonment\n\n**Welcome Series (3-5 emails):**\n1. Welcome + offer\n2. Brand story\n3. Best sellers\n4. Social proof\n5. Urgency offer\n\n**Post-Purchase:**\n1. Order confirmation\n2. Shipping update\n3. Delivery check-in\n4. Review request\n5. Cross-sell\n\n**Email Tools:**\n- Klaviyo\n- Omnisend\n- Mailchimp\n- Drip`, relatedTerms: ["email-marketing", "automation", "retention", "customer-journey"], category: "marketing" },
  "product-validation": { slug: "product-validation", term: "Product Validation", definition: "The process of testing whether a product has market demand before investing heavily.", extendedDefinition: `Validation prevents wasting money on products nobody wants to buy.\n\n**Validation Methods:**\n- Small ad test\n- Landing page test\n- Pre-orders\n- Social engagement\n- Competitor analysis\n\n**Ad Test Validation:**\n- $50-100 budget\n- Test interest/engagement\n- Track add-to-carts\n- Measure cost metrics\n- Quick decision\n\n**Metrics to Watch:**\n- Click-through rate\n- Add-to-cart rate\n- Cost per click\n- Engagement\n- Landing page time\n\n**Go/No-Go Decision:**\n- CTR > 2%: Good interest\n- ATC > 5%: Strong intent\n- CPM reasonable: Scalable\n- Positive comments: Desire`, relatedTerms: ["product-research", "winning-product", "testing", "market-research"], category: "strategy" },
  "temu": { slug: "temu", term: "Temu", definition: "A Chinese e-commerce marketplace owned by PDD Holdings, known for ultra-low prices direct from manufacturers.", extendedDefinition: `Temu disrupted e-commerce in 2023-2024 with aggressive pricing and social shopping features.\n\n**Temu Features:**\n- Direct-from-manufacturer pricing\n- Game-like shopping experience\n- Social sharing rewards\n- Free shipping\n- Aggressive marketing\n\n**Impact on Dropshipping:**\n- Price pressure\n- Consumer expectations\n- Quality concerns\n- Competition for attention\n\n**Competing with Temu:**\n- Niche specialization\n- Better product curation\n- Faster shipping (local)\n- Superior customer service\n- Brand building\n- Quality focus\n\n**For Sourcing:**\n- Not designed for reselling\n- Better to use Alibaba/suppliers\n- Similar products available wholesale`, relatedTerms: ["aliexpress", "marketplace", "competition", "pricing-strategy"], category: "platforms" },
  "shein": { slug: "shein", term: "Shein", definition: "A Chinese fast-fashion e-commerce company known for trendy, affordable clothing with rapid inventory turnover.", extendedDefinition: `Shein revolutionized fast fashion with AI-driven design and ultra-fast production cycles.\n\n**Shein Model:**\n- 1000s of new SKUs daily\n- Small batch production\n- Data-driven design\n- Direct-to-consumer\n- Social media marketing\n\n**Impact on Fashion E-commerce:**\n- Raised speed expectations\n- Lowered price expectations\n- Trend cycle acceleration\n- Influencer-driven discovery\n\n**Lessons for Dropshippers:**\n- Trend monitoring importance\n- Speed to market\n- Social-first marketing\n- Visual content quality\n\n**Competing in Fashion:**\n- Niche specialization\n- Quality positioning\n- Sustainability angle\n- Personalization`, relatedTerms: ["temu", "fast-fashion", "social-commerce", "marketplace"], category: "platforms" },
  "aliexpress-alternatives": { slug: "aliexpress-alternatives", term: "AliExpress Alternatives", definition: "Other platforms and suppliers that can be used instead of or alongside AliExpress for product sourcing.", extendedDefinition: `Diversifying suppliers reduces risk and can improve shipping times and product quality.\n\n**Major Alternatives:**\n- CJ Dropshipping (faster shipping)\n- Spocket (US/EU suppliers)\n- Zendrop (automation)\n- Printful/Printify (POD)\n- Alibaba (wholesale)\n\n**US-Based Options:**\n- Spocket\n- Modalyst\n- Inventory Source\n- Wholesale Central\n\n**Why Diversify:**\n- Faster shipping\n- Better quality control\n- Risk mitigation\n- Local inventory\n- Competitive pricing\n\n**Choosing Alternatives:**\n- Compare shipping times\n- Check product overlap\n- Test quality\n- Evaluate pricing\n- Consider integration`, relatedTerms: ["aliexpress", "cj-dropshipping", "spocket", "supplier"], category: "sourcing" },
  "customer-satisfaction": { slug: "customer-satisfaction", term: "Customer Satisfaction (CSAT)", definition: "A metric measuring how products and services meet or exceed customer expectations.", extendedDefinition: `High customer satisfaction drives repeat purchases, referrals, and positive reviews.\n\n**Measuring CSAT:**\n- Post-purchase surveys\n- Review ratings\n- Net Promoter Score (NPS)\n- Return rate\n- Support tickets\n\n**CSAT Formula:**\n\`\`\`\nCSAT = (Satisfied Customers / Total Respondents) × 100\n\`\`\`\n\n**Improvement Areas:**\n- Product quality\n- Shipping speed\n- Communication\n- Support responsiveness\n- Packaging\n- Problem resolution\n\n**Impact on Business:**\n- Repeat purchases\n- Word of mouth\n- Reviews\n- Lower returns\n- Reduced support costs`, relatedTerms: ["customer-review", "retention", "customer-experience", "nps"], category: "metrics" },
  "facebook-marketplace": { slug: "facebook-marketplace", term: "Facebook Marketplace", definition: "A peer-to-peer selling platform within Facebook where users can buy and sell items locally or with shipping.", extendedDefinition: `Facebook Marketplace expanded to allow business selling, opening new channels for e-commerce.\n\n**Marketplace Features:**\n- Local and shipped listings\n- Business shop integration\n- Messenger communication\n- Facebook Pay\n- Audience targeting\n\n**Selling on Marketplace:**\n- List products\n- Set local or shipped\n- Respond to inquiries\n- Process orders\n- Ship or meetup\n\n**For Dropshippers:**\n- Test products locally\n- Build buyer feedback\n- Low-cost channel\n- Direct communication\n- Cash flow benefits\n\n**Best Practices:**\n- Quality photos\n- Competitive pricing\n- Fast responses\n- Clear descriptions\n- Good seller rating`, relatedTerms: ["marketplace", "multichannel", "social-commerce", "facebook"], category: "platforms" },
  "instagram-shopping": { slug: "instagram-shopping", term: "Instagram Shopping", definition: "Features that allow businesses to tag products in posts and stories, enabling direct purchasing.", extendedDefinition: `Instagram Shopping turns your feed into a shoppable storefront with seamless checkout.\n\n**Shopping Features:**\n- Product tags in posts\n- Shopping tab on profile\n- Stories product stickers\n- Reels shopping\n- Live shopping\n- Shop tab explore\n\n**Setup Requirements:**\n- Business account\n- Connected Facebook catalog\n- Approved for shopping\n- Shopify integration\n\n**Content Strategy:**\n- Lifestyle imagery\n- User-generated content\n- Influencer collaborations\n- Behind-the-scenes\n- Product demos\n\n**Best Practices:**\n- Consistent aesthetic\n- Tag strategically\n- Use all formats\n- Engage with comments`, relatedTerms: ["social-commerce", "tiktok-shop", "live-shopping", "ugc"], category: "platforms" },
  "sustainability-ecommerce": { slug: "sustainability-ecommerce", term: "Sustainable E-commerce", definition: "Environmentally conscious practices in online retail, from product sourcing to packaging and shipping.", extendedDefinition: `Sustainability is increasingly important to consumers and can be a competitive advantage.\n\n**Sustainable Practices:**\n- Eco-friendly products\n- Minimal packaging\n- Carbon-neutral shipping\n- Ethical sourcing\n- Recyclable materials\n\n**Consumer Trends (2026):**\n- 73% willing to pay more for sustainable\n- Gen Z prioritizes sustainability\n- Transparency expected\n- Greenwashing backlash\n\n**Implementation:**\n- Audit supply chain\n- Switch to eco packaging\n- Offer carbon offset\n- Communicate efforts\n- Certifications\n\n**Marketing Sustainability:**\n- Be authentic\n- Show real impact\n- Avoid greenwashing\n- Educate customers`, relatedTerms: ["branding", "customer-experience", "differentiation", "values"], category: "strategy" },
  "generative-ai-commerce": { slug: "generative-ai-commerce", term: "Generative AI in Commerce", definition: "Using AI to create product descriptions, images, marketing copy, and personalized shopping experiences.", extendedDefinition: `Generative AI is transforming how e-commerce businesses create content and engage customers in 2026.\n\n**AI Applications:**\n- Product descriptions\n- Marketing copy\n- Image generation\n- Chatbots\n- Personalization\n- Email content\n\n**Popular Tools:**\n- ChatGPT/Claude\n- Midjourney/DALL-E\n- Shopify Magic\n- Jasper\n- Copy.ai\n\n**Benefits:**\n- Faster content creation\n- Scale personalization\n- Lower costs\n- A/B testing variations\n- 24/7 customer support\n\n**Best Practices:**\n- Human review required\n- Maintain brand voice\n- Don't fully automate\n- Test and refine\n- Disclose AI use where appropriate`, relatedTerms: ["agentic-commerce", "ai-shopping-agent", "automation", "personalization"], category: "ai-commerce" },
  "composable-commerce": { slug: "composable-commerce", term: "Composable Commerce", definition: "A modular approach to building e-commerce stacks by combining best-of-breed components via APIs.", extendedDefinition: `Composable commerce offers flexibility but requires more technical expertise than monolithic platforms.\n\n**Composable vs Monolithic:**\n- Composable: Best-of-breed, API-first\n- Monolithic: All-in-one (Shopify)\n\n**Composable Components:**\n- Commerce engine\n- CMS\n- Search\n- Payments\n- Checkout\n- OMS\n- CRM\n\n**When to Consider:**\n- High customization needs\n- Multi-brand/region\n- Unique requirements\n- Development resources\n\n**For Most Dropshippers:**\n- Shopify is sufficient\n- Lower complexity\n- Faster to market\n- App ecosystem`, relatedTerms: ["ecommerce", "shopify", "api", "technical"], category: "technical" },
  "headless-commerce": { slug: "headless-commerce", term: "Headless Commerce", definition: "An e-commerce architecture where the frontend presentation layer is decoupled from the backend commerce functionality.", extendedDefinition: `Headless enables custom frontends while using established commerce backends.\n\n**Headless Architecture:**\n- Backend (commerce engine)\n- APIs (connect layers)\n- Frontend (custom presentation)\n\n**Benefits:**\n- Custom experiences\n- Omnichannel consistency\n- Faster performance\n- Developer flexibility\n- Future-proof\n\n**Headless Platforms:**\n- Shopify Hydrogen\n- BigCommerce\n- commercetools\n- Medusa\n\n**Considerations:**\n- Higher complexity\n- Development costs\n- Maintenance burden\n- Not needed for most stores\n\n**When to Go Headless:**\n- High-volume stores\n- Unique experiences needed\n- Multi-channel requirements\n- Dev resources available`, relatedTerms: ["composable-commerce", "api", "ecommerce", "technical"], category: "technical" },
  "referral-program": { slug: "referral-program", term: "Referral Program", definition: "A marketing strategy that incentivizes existing customers to refer new customers in exchange for rewards.", extendedDefinition: `Referral programs leverage word-of-mouth marketing, one of the most trusted forms of advertising.\n\n**Referral Types:**\n- Discount for both parties\n- Store credit rewards\n- Cash rewards\n- Free products\n- Tiered rewards\n\n**Referral Apps:**\n- Smile.io\n- ReferralCandy\n- Yotpo Loyalty\n- LoyaltyLion\n- Referral Rock\n\n**Program Design:**\n- Clear value proposition\n- Easy sharing tools\n- Tracking system\n- Quick reward delivery\n- Thank you communication\n\n**Metrics to Track:**\n- Referral rate\n- Conversion of referred customers\n- LTV of referred customers\n- Program ROI\n- Viral coefficient`, relatedTerms: ["customer-acquisition", "marketing", "loyalty", "retention"], category: "marketing" },
  "product-bundling": { slug: "product-bundling", term: "Product Bundling", definition: "Selling multiple products together as a package at a discounted price compared to buying separately.", extendedDefinition: `Bundling increases average order value while providing perceived value to customers.\n\n**Bundle Types:**\n- Pure bundle (only together)\n- Mixed bundle (together or separate)\n- Cross-sell bundle (complementary)\n- Upsell bundle (premium version)\n\n**Benefits:**\n- Higher AOV\n- Clear slow-moving inventory\n- Perceived value\n- Competitive advantage\n- Simplified decisions\n\n**Bundle Strategies:**\n- Starter kits\n- Complete solutions\n- Gift sets\n- Buy more save more\n- Subscribe and save\n\n**Pricing Bundles:**\n- 10-25% discount typical\n- Show individual value\n- Highlight savings\n- Test different combinations`, relatedTerms: ["upsell", "cross-sell", "aov", "pricing-strategy"], category: "strategy" },
  "preorder": { slug: "preorder", term: "Pre-Order", definition: "A sales strategy allowing customers to purchase products before they are available or in stock.", extendedDefinition: `Pre-orders help validate demand and generate cash flow before investing in inventory.\n\n**Benefits:**\n- Validate product demand\n- Generate early revenue\n- Build anticipation\n- Gauge inventory needs\n- Early customer feedback\n\n**Pre-Order Types:**\n- Pay now, ship later\n- Deposit then full payment\n- Pay on shipping\n\n**Implementation:**\n- Clear shipping timeline\n- Regular status updates\n- Honest communication\n- Easy cancellation policy\n- Exclusive pre-order benefits\n\n**For Dropshipping:**\n- Test products risk-free\n- Validate before scaling\n- Build buzz\n- Collect emails`, relatedTerms: ["product-validation", "inventory", "customer-experience", "marketing"], category: "operations" },
  "backorder": { slug: "backorder", term: "Backorder", definition: "An order placed for a product that is currently out of stock, to be fulfilled when inventory becomes available.", extendedDefinition: `Backorders capture sales that would otherwise be lost due to stockouts.\n\n**Backorder Best Practices:**\n- Clear availability messaging\n- Estimated restock date\n- Email notifications\n- Option to cancel\n- Priority fulfillment\n\n**Managing Backorders:**\n- Track expected inventory\n- Communicate proactively\n- Update estimates if delayed\n- Offer alternatives\n- Honor commitments\n\n**For Dropshipping:**\n- Sync with supplier inventory\n- Auto-disable out-of-stock\n- Consider alternatives\n- Communicate transparently\n\n**Avoiding Backorders:**\n- Monitor inventory levels\n- Set reorder points\n- Multiple suppliers\n- Demand forecasting`, relatedTerms: ["inventory-management", "customer-experience", "fulfillment", "supplier"], category: "operations" },
  "virtual-try-on": { slug: "virtual-try-on", term: "Virtual Try-On", definition: "AR/AI technology allowing customers to virtually see how products look on them before purchasing.", extendedDefinition: `Virtual try-on reduces returns and increases conversion by boosting purchase confidence.\n\n**Applications:**\n- Eyewear\n- Makeup/cosmetics\n- Jewelry\n- Apparel\n- Furniture (room view)\n- Hair color\n\n**Technology:**\n- Augmented reality (AR)\n- 3D modeling\n- AI facial mapping\n- Body measurement\n- Room scanning\n\n**Benefits:**\n- Reduced returns (up to 40%)\n- Higher conversion\n- Increased engagement\n- Better customer experience\n- Competitive advantage\n\n**Implementation:**\n- Shopify AR apps\n- Platform-specific tools\n- Third-party solutions\n- Custom development`, relatedTerms: ["customer-experience", "conversion-rate", "returns", "technology"], category: "technical" },
  "social-proof-widget": { slug: "social-proof-widget", term: "Social Proof Widget", definition: "Website elements displaying recent purchases, reviews, or visitor activity to build trust and urgency.", extendedDefinition: `Social proof widgets leverage psychological triggers to increase conversions.\n\n**Widget Types:**\n- Recent sales popups\n- Live visitor count\n- Review highlights\n- Trust badges\n- User-generated photos\n- Stock countdown\n\n**Popular Apps:**\n- Fomo\n- Nudgify\n- ProveSource\n- Sales Pop\n- Fera\n\n**Psychology Behind It:**\n- Social validation\n- Fear of missing out\n- Bandwagon effect\n- Trust building\n- Urgency creation\n\n**Best Practices:**\n- Use real data\n- Don't overdo it\n- Mobile-friendly\n- Test placement\n- Match brand style`, relatedTerms: ["social-proof", "conversion-rate", "trust-signals", "cro"], category: "marketing" },
};

export const getGlossaryTermBySlug = (slug: string): GlossaryTerm | undefined => {
  return glossaryTerms[slug];
};

export const getAllGlossaryTerms = (): GlossaryTerm[] => {
  return Object.values(glossaryTerms).sort((a, b) =>
    a.term.localeCompare(b.term)
  );
};

export const getAllGlossaryTermsForIndex = (): GlossaryTermSummary[] => {
  return Object.values(glossaryTerms)
    .sort((a, b) => a.term.localeCompare(b.term))
    .map(({ slug, term, definition, category }) => ({
      slug,
      term,
      definition,
      category,
    }));
};

export const getGlossaryTermsByCategory = (category: string): GlossaryTerm[] => {
  return getAllGlossaryTerms().filter((term) => term.category === category);
};

export const getGlossaryCategories = (): string[] => {
  const categories = new Set(
    Object.values(glossaryTerms).map((t) => t.category)
  );
  return Array.from(categories).sort();
};

export const getRelatedGlossaryTerms = (
  currentSlug: string
): GlossaryTerm[] => {
  const current = glossaryTerms[currentSlug];
  if (!current) return [];

  return current.relatedTerms
    .map((slug) => glossaryTerms[slug])
    .filter((t): t is GlossaryTerm => t !== undefined);
};
