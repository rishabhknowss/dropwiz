import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  SparklesIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "./OnboardingContext";
import { COUNTRIES, CURRENCIES, LANGUAGES, TARGET_AUDIENCES } from "./types";

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
        className="flex h-14 w-full items-center justify-between rounded-2xl border-2 border-[var(--dw-border)] bg-white px-5 text-left text-[15px] transition-all hover:border-[#0A0A0A] focus:border-[#0A0A0A] focus:outline-none"
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
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-[var(--dw-border)] bg-white py-2 shadow-xl"
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

export const CustomizeStep = () => {
  const {
    data,
    setCountry,
    setCurrency,
    setTargetLanguage,
    setTargetAudience,
    goToStep,
  } = useOnboarding();

  const [localCountry, setLocalCountry] = useState(data.country);
  const [localCurrency, setLocalCurrency] = useState(data.currency);
  const [localLanguage, setLocalLanguage] = useState(data.targetLanguage);
  const [localAudience, setLocalAudience] = useState(data.targetAudience);

  const [customCountry, setCustomCountry] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const handleBack = () => {
    goToStep("details");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (localCountry === "OTHER" && !customCountry.trim()) {
      toast.error("Please specify your country");
      return;
    }
    if (localCurrency === "OTHER" && !customCurrency.trim()) {
      toast.error("Please specify your currency");
      return;
    }
    if (localLanguage === "OTHER" && !customLanguage.trim()) {
      toast.error("Please specify your language");
      return;
    }

    setCountry(localCountry === "OTHER" ? customCountry.trim() : localCountry);
    setCurrency(localCurrency === "OTHER" ? customCurrency.trim() : localCurrency);
    setTargetLanguage(localLanguage === "OTHER" ? customLanguage.trim() : localLanguage);
    setTargetAudience(localAudience);

    goToStep("building");
  };

  return (
    <div className="mx-auto max-w-[540px]">
      <div className="mb-10 flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="button"
          onClick={handleBack}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--dw-border)] bg-white text-[#666666] transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--dw-border)] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#0A0A0A]"
        >
          <span className="size-2 rounded-full bg-[var(--dw-accent)]" />
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
        onSubmit={handleSubmit}
        className="mt-10 space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <SelectField
              label="Country"
              value={localCountry}
              onChange={setLocalCountry}
              options={COUNTRIES}
              placeholder="Select country"
            />
            {localCountry === "OTHER" && (
              <Input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                placeholder="Enter country name"
                className="mt-3 h-12 rounded-xl border-2 border-[var(--dw-border)] text-[14px] focus:border-[#0A0A0A]"
              />
            )}
          </div>

          <div>
            <SelectField
              label="Currency"
              value={localCurrency}
              onChange={setLocalCurrency}
              options={CURRENCIES}
              placeholder="Select currency"
            />
            {localCurrency === "OTHER" && (
              <Input
                type="text"
                value={customCurrency}
                onChange={(e) => setCustomCurrency(e.target.value)}
                placeholder="Enter currency code"
                className="mt-3 h-12 rounded-xl border-2 border-[var(--dw-border)] text-[14px] focus:border-[#0A0A0A]"
              />
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <SelectField
              label="Language"
              value={localLanguage}
              onChange={setLocalLanguage}
              options={LANGUAGES}
              placeholder="Select language"
            />
            {localLanguage === "OTHER" && (
              <Input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder="Enter language"
                className="mt-3 h-12 rounded-xl border-2 border-[var(--dw-border)] text-[14px] focus:border-[#0A0A0A]"
              />
            )}
          </div>

          <SelectField
            label="Target Audience"
            value={localAudience}
            onChange={setLocalAudience}
            options={TARGET_AUDIENCES}
            placeholder="Select audience"
          />
        </div>

        <Button
          type="submit"
          className="h-14 w-full gap-2.5 rounded-2xl bg-[#0A0A0A] text-[15px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
        >
          <HugeiconsIcon icon={SparklesIcon} size={18} />
          Generate Store
        </Button>
      </motion.form>
    </div>
  );
};
