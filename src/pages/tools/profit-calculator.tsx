import { useState, useMemo } from "react";
import Link from "next/link";
import { SEOHead, PageLayout, CTASidebar, RelatedLinks } from "@/components/seo";
import { toolMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, softwareAppSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";

const faqs = [
  {
    question: "What is a good profit margin for dropshipping?",
    answer:
      "A healthy profit margin for dropshipping is typically 15-30%. However, this varies by niche. High-ticket items often have lower percentage margins but higher dollar profits, while low-ticket items need higher margins to be viable.",
  },
  {
    question: "How do I calculate my break-even point?",
    answer:
      "Your break-even point is reached when total revenue equals total costs. In dropshipping, this means: (Selling Price × Units) = (Product Cost × Units) + Fixed Costs + (Advertising Cost × Units). Our calculator handles this automatically.",
  },
  {
    question: "Should I include shipping in the product price?",
    answer:
      "Free shipping typically increases conversions by 10-30%. Many successful dropshippers include shipping costs in the product price and offer 'free shipping' to customers.",
  },
  {
    question: "What advertising cost per sale is normal?",
    answer:
      "A good target is keeping ad costs under 30% of your selling price. This varies by niche and platform. Start with a smaller budget and optimize based on your actual data.",
  },
];

const ProfitCalculator = () => {
  const [sellingPrice, setSellingPrice] = useState<string>("49.99");
  const [productCost, setProductCost] = useState<string>("15.00");
  const [shippingCost, setShippingCost] = useState<string>("3.00");
  const [adCost, setAdCost] = useState<string>("10.00");
  const [processingFee, setProcessingFee] = useState<string>("2.9");
  const [transactionFee, setTransactionFee] = useState<string>("0.30");

  const calculations = useMemo(() => {
    const selling = parseFloat(sellingPrice) || 0;
    const product = parseFloat(productCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const ads = parseFloat(adCost) || 0;
    const processingPct = parseFloat(processingFee) || 0;
    const transaction = parseFloat(transactionFee) || 0;

    const paymentFees = selling * (processingPct / 100) + transaction;
    const totalCost = product + shipping + ads + paymentFees;
    const profit = selling - totalCost;
    const profitMargin = selling > 0 ? (profit / selling) * 100 : 0;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const breakEvenUnits = profit > 0 ? Math.ceil(ads / profit) : 0;

    return {
      paymentFees: paymentFees.toFixed(2),
      totalCost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
      roi: roi.toFixed(1),
      breakEvenUnits,
      isProfit: profit > 0,
    };
  }, [sellingPrice, productCost, shippingCost, adCost, processingFee, transactionFee]);

  const sidebar = (
    <div className="space-y-6">
      <CTASidebar />
      <RelatedLinks
        title="Helpful Resources"
        links={[
          {
            title: "Dropshipping Guide",
            href: "/guides",
            description: "Learn the basics of dropshipping",
          },
          {
            title: "Find Products",
            href: "/products",
            description: "Discover winning products",
          },
          {
            title: "Glossary",
            href: "/glossary",
            description: "E-commerce terms explained",
          },
        ]}
      />
    </div>
  );

  return (
    <>
      <SEOHead
        meta={toolMetadata(
          "profit-calculator",
          "Dropshipping Profit Calculator",
          "Calculate your dropshipping profit margins, ROI, and break-even point. Free tool for e-commerce entrepreneurs.",
        )}
        schemas={[
          breadcrumbSchema([
            { name: "Tools", url: `${SITE_URL}/tools` },
            {
              name: "Profit Calculator",
              url: `${SITE_URL}/tools/profit-calculator`,
            },
          ]),
          faqSchema(faqs),
          softwareAppSchema(),
        ]}
      />
      <PageLayout
        breadcrumbs={[{ label: "Tools", href: "/tools" }]}
        sidebar={sidebar}
      >
        <header className="not-prose mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Dropshipping Profit Calculator
          </h1>
          <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
            Calculate your profit margins, ROI, and break-even point instantly.
            Make data-driven pricing decisions for your products.
          </p>
        </header>

        <div className="not-prose mb-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Enter Your Numbers</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Selling Price ($)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Cost ($)
                </label>
                <input
                  type="number"
                  value={productCost}
                  onChange={(e) => setProductCost(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Shipping Cost ($)
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Ad Cost Per Sale ($)
                </label>
                <input
                  type="number"
                  value={adCost}
                  onChange={(e) => setAdCost(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Payment Fee (%)
                  </label>
                  <input
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Transaction Fee ($)
                  </label>
                  <input
                    type="number"
                    value={transactionFee}
                    onChange={(e) => setTransactionFee(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-3 text-sm focus:border-[color:var(--dw-accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Your Results</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-[color:var(--dw-bg)] p-4">
                <div className="text-sm text-[color:var(--dw-text-muted)]">
                  Profit Per Sale
                </div>
                <div
                  className={`text-3xl font-bold ${calculations.isProfit ? "text-green-600" : "text-red-600"}`}
                >
                  ${calculations.profit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[color:var(--dw-bg)] p-4">
                  <div className="text-sm text-[color:var(--dw-text-muted)]">
                    Profit Margin
                  </div>
                  <div
                    className={`text-2xl font-bold ${parseFloat(calculations.profitMargin) >= 20 ? "text-green-600" : parseFloat(calculations.profitMargin) >= 10 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {calculations.profitMargin}%
                  </div>
                </div>
                <div className="rounded-lg bg-[color:var(--dw-bg)] p-4">
                  <div className="text-sm text-[color:var(--dw-text-muted)]">
                    ROI
                  </div>
                  <div
                    className={`text-2xl font-bold ${parseFloat(calculations.roi) >= 50 ? "text-green-600" : parseFloat(calculations.roi) >= 20 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {calculations.roi}%
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[color:var(--dw-border)] p-4">
                <div className="text-sm font-medium">Cost Breakdown</div>
                <div className="mt-2 space-y-1 text-sm text-[color:var(--dw-text-muted)]">
                  <div className="flex justify-between">
                    <span>Product Cost:</span>
                    <span>${productCost || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingCost || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ad Cost:</span>
                    <span>${adCost || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Fees:</span>
                    <span>${calculations.paymentFees}</span>
                  </div>
                  <div className="flex justify-between border-t border-[color:var(--dw-border)] pt-1 font-medium">
                    <span>Total Cost:</span>
                    <span>${calculations.totalCost}</span>
                  </div>
                </div>
              </div>

              {calculations.breakEvenUnits > 0 && (
                <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
                  <span className="font-medium text-blue-600">
                    Break-even:
                  </span>{" "}
                  <span className="text-[color:var(--dw-text-muted)]">
                    Sell {calculations.breakEvenUnits} units to cover your ad spend
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <section>
          <h2>Understanding Your Profit Metrics</h2>
          <p>
            Making informed pricing decisions is crucial for dropshipping
            success. Here&apos;s what each metric means:
          </p>
          <ul>
            <li>
              <strong>Profit Margin:</strong> Percentage of selling price that&apos;s
              profit. Aim for 20%+ for healthy margins.
            </li>
            <li>
              <strong>ROI (Return on Investment):</strong> How much you earn
              relative to your costs. Higher is better.
            </li>
            <li>
              <strong>Break-even Point:</strong> Units needed to cover your
              advertising investment.
            </li>
          </ul>
        </section>

        <section>
          <h2>Tips for Better Margins</h2>
          <ul>
            <li>Negotiate better rates with suppliers as volume increases</li>
            <li>Optimize ad campaigns to lower cost per acquisition</li>
            <li>Bundle products to increase average order value</li>
            <li>Test different price points to find optimal conversion rates</li>
          </ul>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="not-prose space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]"
              >
                <summary className="cursor-pointer list-none p-4 font-medium">
                  <span className="flex items-center justify-between">
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180">
                      ↓
                    </span>
                  </span>
                </summary>
                <div className="border-t border-[color:var(--dw-border)] p-4 text-sm text-[color:var(--dw-text-muted)]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-[color:var(--dw-text)] sm:text-2xl">Found a Profitable Product?</h3>
          <p className="mt-2 text-sm text-[color:var(--dw-text-muted)] sm:text-base">
            Build a high-converting product page in seconds with AI.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Start Building →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default ProfitCalculator;
