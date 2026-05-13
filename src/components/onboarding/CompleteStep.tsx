import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MagicWand01Icon,
  Tick02Icon,
  Image01Icon,
  TextIcon,
  HelpCircleIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "./OnboardingContext";

const FEATURES = [
  { icon: Image01Icon, label: "Hero images" },
  { icon: TextIcon, label: "Product copy" },
  { icon: HelpCircleIcon, label: "FAQ section" },
  { icon: UserMultiple02Icon, label: "Testimonials" },
];

export const CompleteStep = () => {
  const router = useRouter();
  const { data, saveToStorage } = useOnboarding();

  const isAiMode = data.source === "ai";
  const productImage = data.scrapedProduct?.images?.[0];
  const productTitle = isAiMode
    ? data.aiPrompt?.slice(0, 50) + (data.aiPrompt && data.aiPrompt.length > 50 ? "..." : "")
    : data.scrapedProduct?.title ?? "Your store";

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const handleOpenStore = () => {
    router.push("/auth/signup?redirect=/build/claim");
  };

  return (
    <div className="mx-auto max-w-[520px] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500">
          <HugeiconsIcon icon={Tick02Icon} size={12} className="text-white" />
        </span>
        <span className="text-[13px] font-semibold text-emerald-700">Store Ready</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[36px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[44px]"
      >
        Your store is built<span className="text-[#0A0A0A]">.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-[16px] leading-relaxed text-[#666666]"
      >
        Create a free account to customize your store and export it to Shopify.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-10 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm"
      >
        <div className="flex items-center gap-4 border-b border-[#E5E5E5] p-5">
          {isAiMode ? (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
              <HugeiconsIcon icon={MagicWand01Icon} size={24} className="text-amber-600" />
            </div>
          ) : productImage ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
              <Image
                src={productImage}
                alt="Product"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F5]">
              <HugeiconsIcon icon={Image01Icon} size={24} className="text-[#999999]" />
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-[15px] font-semibold text-[#0A0A0A]">
              {productTitle}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-[#666666]">
              <span className="rounded bg-[#F5F5F5] px-2 py-0.5 font-medium">{data.currency}</span>
              <span>·</span>
              <span>{data.country}</span>
              <span>·</span>
              <span className="uppercase">{data.targetLanguage}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#E5E5E5]">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-3 bg-[#FAFAFA] px-4 py-3.5"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-white border border-[#E5E5E5]">
                <HugeiconsIcon icon={feature.icon} size={14} className="text-[#0A0A0A]" />
              </span>
              <span className="text-[13px] font-medium text-[#333333]">{feature.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8"
      >
        <Button
          onClick={handleOpenStore}
          className="group h-14 w-full gap-2.5 rounded-xl bg-[#0A0A0A] text-[15px] font-semibold text-white shadow-lg shadow-black/10 transition-all hover:bg-[#1a1a1a] hover:shadow-black/20"
        >
          Open my store
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-[13px] text-[#999999]"
      >
        Free forever · No credit card required
      </motion.p>
    </div>
  );
};
