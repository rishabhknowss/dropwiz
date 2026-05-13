import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  LinkSquare01Icon,
  PackageDeliveredIcon,
  Store01Icon,
  SparklesIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { validateProductUrl } from "@/lib/url-validation";
import { COUNTRIES, CURRENCIES, LANGUAGES, TARGET_AUDIENCES } from "@/components/onboarding/types";

type Source = "supplier" | "competitor" | "shopify";
type Step = "source" | "details" | "customize";

type SourceConfig = {
  id: Source;
  title: string;
  subtitle: string;
  blurb: string;
  icon?: typeof PackageDeliveredIcon;
  image?: string;
  color: string;
  bgColor: string;
};

const SOURCES: SourceConfig[] = [
  {
    id: "shopify",
    title: "Connect Shopify",
    subtitle: "Direct publish",
    blurb: "Link your store to publish AI-generated pages instantly.",
    image: "/shopify-logo.png",
    color: "#5E8E3E",
    bgColor: "#DCFCE7",
  },
  {
    id: "supplier",
    title: "Product URL",
    subtitle: "Most popular",
    blurb: "Paste any product link from AliExpress, Amazon, Etsy, or TikTok Shop.",
    icon: PackageDeliveredIcon,
    color: "#0D9488",
    bgColor: "#CCFBF1",
  },
  {
    id: "competitor",
    title: "Shopify Store",
    subtitle: "Reverse engineer",
    blurb: "Drop a competitor's Shopify URL. We'll analyze and build better.",
    icon: Store01Icon,
    color: "#D97706",
    bgColor: "#FEF3C7",
  },
];

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { code?: string; id?: string; label: string }[];
  placeholder?: string;
};

const SelectField = ({ label, value, onChange, options, placeholder }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => (o.code ?? o.id) === value);

  return (
    <div className="relative">
      <label className="mb-2 block text-[13px] font-medium text-[#666666]">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-full items-center justify-between rounded-2xl border-2 border-[#E5E5E5] bg-white px-5 text-left text-[15px] transition-all hover:border-[#0A0A0A] focus:border-[#0A0A0A] focus:outline-none"
      >
        <span className={selectedOption ? "text-[#0A0A0A]" : "text-[#999999]"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          className={`text-[#999999] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-[#E5E5E5] bg-white py-2 shadow-xl"
          >
            {options.map((option) => {
              const optionValue = option.code ?? option.id ?? "";
              const isSelected = value === optionValue;
              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => {
                    onChange(optionValue);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-5 py-3 text-left text-[14px] transition-colors ${
                    isSelected
                      ? "bg-[#0A0A0A] text-white"
                      : "text-[#0A0A0A] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
};

const BuildNew = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("source");
  const [source, setSource] = useState<Source | null>(null);
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [audience, setAudience] = useState("general");
  const [customCountry, setCustomCountry] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const me = api.auth.me.useQuery();
  const create = api.stores.create.useMutation();
  const shops = api.shopify.listShops.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const handleSelectSource = (id: Source) => {
    if (id === "shopify") {
      const connected = shops.data ?? [];
      if (connected.length === 1) {
        router.push(`/build/shopify/${encodeURIComponent(connected[0].shopDomain)}`);
        return;
      }
      if (connected.length === 0) {
        window.open("https://apps.shopify.com/dropwiz-ai", "_blank");
        return;
      }
    }
    setSource(id);
    setStep("details");
  };

  const handleDetailsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateProductUrl(url);
    if (!validation.valid) {
      toast.error(validation.error ?? "Enter a valid product URL");
      return;
    }
    setUrl(validation.normalizedUrl ?? url.trim());
    setStep("customize");
  };

  const handleCustomizeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (country === "OTHER" && !customCountry.trim()) {
      toast.error("Please specify your country");
      return;
    }
    if (currency === "OTHER" && !customCurrency.trim()) {
      toast.error("Please specify your currency");
      return;
    }
    if (language === "OTHER" && !customLanguage.trim()) {
      toast.error("Please specify your language");
      return;
    }

    const finalCurrency = currency === "OTHER" ? customCurrency.trim() : currency;
    const finalLanguage = language === "OTHER" ? customLanguage.trim() : language;

    const id = toast.loading("Creating your store...");
    create.mutate(
      {
        url: url.trim(),
        targetLanguage: finalLanguage,
        currency: finalCurrency,
        persona: audience,
      },
      {
        onSuccess: (data) => {
          toast.success("Building your store", { id });
          const claim = data.claimToken
            ? `?claim=${encodeURIComponent(data.claimToken)}`
            : "";
          router.push(`/build/${data.storeId}/generating${claim}`);
        },
        onError: (err) => {
          toast.error(err.message, { id });
        },
      }
    );
  };

  const sourceLabels: Record<string, { badge: string; title: string; subtitle: string; placeholder: string }> = {
    supplier: {
      badge: "Product URL",
      title: "Paste your link",
      subtitle: "We'll extract product details and generate your store.",
      placeholder: "https://www.amazon.com/dp/B0...",
    },
    competitor: {
      badge: "Competitor Store",
      title: "Drop the link",
      subtitle: "We'll analyze their listing and build something better.",
      placeholder: "https://competitor.myshopify.com/products/...",
    },
  };

  const labels = sourceLabels[source ?? "supplier"];

  if (!me.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="relative mb-4">
          <div className="relative h-8 w-8 rounded-full border-2 border-[#E5E5E5] border-t-[#0A0A0A] animate-spin" />
        </div>
        <div className="text-[13px] font-medium text-[#666666]">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-5 py-10 md:px-8 md:py-16 lg:px-12">
        {step === "source" && (
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] sm:text-[40px] lg:text-[52px]"
            >
              Let's build
              <br />
              your store
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-[440px] text-[16px] leading-relaxed text-[#666666] lg:text-[18px]"
            >
              Pick a source and we'll take it from there — AI copy, images, design, all done.
            </motion.p>

            <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
              {SOURCES.map((s, i) => (
                <SourceCard
                  key={s.id}
                  source={s}
                  selected={source === s.id}
                  onSelect={() => handleSelectSource(s.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="mx-auto max-w-[540px]">
            <div className="mb-10 flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={() => setStep("source")}
                className="flex size-10 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#666666] transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#0A0A0A]"
              >
                <span className="size-2 rounded-full bg-[#0A0A0A]" />
                {labels.badge}
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[44px]"
            >
              {labels.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-[16px] leading-relaxed text-[#666666]"
            >
              {labels.subtitle}
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleDetailsSubmit}
              className="mt-10 space-y-6"
            >
              <div className="relative">
                <HugeiconsIcon
                  icon={LinkSquare01Icon}
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#999999]"
                />
                <Input
                  type="url"
                  required
                  autoFocus
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={labels.placeholder}
                  className="h-14 rounded-2xl border-2 border-[#E5E5E5] bg-white pl-13 text-[15px] transition-all focus:border-[#0A0A0A] focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="h-14 w-full gap-2.5 rounded-2xl bg-[#0A0A0A] text-[15px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
              >
                <HugeiconsIcon icon={SparklesIcon} size={18} />
                Continue
              </Button>
            </motion.form>
          </div>
        )}

        {step === "customize" && (
          <div className="mx-auto max-w-[540px]">
            <div className="mb-10 flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={() => setStep("details")}
                className="flex size-10 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#666666] transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#0A0A0A]"
              >
                <span className="size-2 rounded-full bg-[#0A0A0A]" />
                Customize
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[44px]"
            >
              Customize your store
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-[16px] leading-relaxed text-[#666666]"
            >
              Tailor your store for your target market and audience.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleCustomizeSubmit}
              className="mt-10 space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <SelectField
                    label="Country"
                    value={country}
                    onChange={setCountry}
                    options={COUNTRIES}
                    placeholder="Select country"
                  />
                  {country === "OTHER" && (
                    <Input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="Enter country name"
                      className="mt-3 h-12 rounded-xl border-2 border-[#E5E5E5] text-[14px] focus:border-[#0A0A0A]"
                    />
                  )}
                </div>

                <div>
                  <SelectField
                    label="Currency"
                    value={currency}
                    onChange={setCurrency}
                    options={CURRENCIES}
                    placeholder="Select currency"
                  />
                  {currency === "OTHER" && (
                    <Input
                      type="text"
                      value={customCurrency}
                      onChange={(e) => setCustomCurrency(e.target.value)}
                      placeholder="Enter currency code"
                      className="mt-3 h-12 rounded-xl border-2 border-[#E5E5E5] text-[14px] focus:border-[#0A0A0A]"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <SelectField
                    label="Language"
                    value={language}
                    onChange={setLanguage}
                    options={LANGUAGES}
                    placeholder="Select language"
                  />
                  {language === "OTHER" && (
                    <Input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Enter language"
                      className="mt-3 h-12 rounded-xl border-2 border-[#E5E5E5] text-[14px] focus:border-[#0A0A0A]"
                    />
                  )}
                </div>

                <SelectField
                  label="Target Audience"
                  value={audience}
                  onChange={setAudience}
                  options={TARGET_AUDIENCES}
                  placeholder="Select audience"
                />
              </div>

              <Button
                type="submit"
                disabled={create.isPending}
                className="h-14 w-full gap-2.5 rounded-2xl bg-[#0A0A0A] text-[15px] font-semibold text-white transition-all hover:bg-[#1a1a1a] disabled:opacity-50"
              >
                {create.isPending ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={SparklesIcon} size={18} />
                    Generate Store
                  </>
                )}
              </Button>
            </motion.form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const SourceCard = ({
  source,
  selected,
  onSelect,
  index,
}: {
  source: SourceConfig;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const isShopify = source.id === "shopify";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col rounded-2xl border bg-white p-7 text-left transition-all duration-200 hover:-translate-y-1 lg:p-8 ${
        selected
          ? "border-[#0A0A0A] shadow-xl"
          : "border-[#E5E5E5] hover:border-[#0A0A0A] hover:shadow-xl"
      }`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className="flex size-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
          style={{ background: source.bgColor }}
        >
          {source.image ? (
            <Image
              src={source.image}
              alt=""
              width={32}
              height={32}
              className="size-8 object-contain"
              unoptimized
            />
          ) : source.icon ? (
            <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.color }} strokeWidth={1.5} />
          ) : null}
        </div>
        <span className="rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#666666]">
          {source.subtitle}
        </span>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="mb-2 text-[18px] font-bold text-[#0A0A0A] lg:text-[20px]">
          {source.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-[#666666]">
          {source.blurb}
        </p>
      </div>

      <div className="border-t border-[#E5E5E5] pt-5">
        <div
          className={`inline-flex items-center gap-2 text-[13px] font-semibold transition-all duration-200 ${
            selected
              ? "text-[#0A0A0A]"
              : "text-[#0A0A0A] group-hover:gap-3"
          }`}
        >
          {isShopify ? "Install app" : "Get started"}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.button>
  );
};

export default BuildNew;
