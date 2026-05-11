import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import {
  type OnboardingData,
  type OnboardingStep,
  type OnboardingSource,
  type ScrapedProduct,
  defaultOnboardingData,
  ONBOARDING_STORAGE_KEY,
} from "./types";

type OnboardingContextValue = {
  data: OnboardingData;
  step: OnboardingStep;
  setSource: (source: OnboardingSource) => void;
  setUrl: (url: string) => void;
  setAiPrompt: (prompt: string) => void;
  setCountry: (country: string) => void;
  setCurrency: (currency: string) => void;
  setTargetAudience: (audience: string) => void;
  setTargetLanguage: (language: string) => void;
  setScrapedProduct: (product: ScrapedProduct | null) => void;
  goToStep: (step: OnboardingStep) => void;
  saveToStorage: () => void;
  clearStorage: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const step = (router.query.step as OnboardingStep) || "source";

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as OnboardingData;
        setData(parsed);
      } catch {
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      }
    }
  }, []);

  const goToStep = useCallback(
    (newStep: OnboardingStep) => {
      router.push({ pathname: "/get-started", query: { step: newStep } }, undefined, { shallow: true });
    },
    [router]
  );

  const setSource = useCallback((source: OnboardingSource) => {
    setData((prev) => ({ ...prev, source }));
  }, []);

  const setUrl = useCallback((url: string) => {
    setData((prev) => ({ ...prev, url }));
  }, []);

  const setAiPrompt = useCallback((aiPrompt: string) => {
    setData((prev) => ({ ...prev, aiPrompt }));
  }, []);

  const setCountry = useCallback((country: string) => {
    setData((prev) => ({ ...prev, country }));
  }, []);

  const setCurrency = useCallback((currency: string) => {
    setData((prev) => ({ ...prev, currency }));
  }, []);

  const setTargetAudience = useCallback((targetAudience: string) => {
    setData((prev) => ({ ...prev, targetAudience }));
  }, []);

  const setTargetLanguage = useCallback((targetLanguage: string) => {
    setData((prev) => ({ ...prev, targetLanguage }));
  }, []);

  const setScrapedProduct = useCallback((scrapedProduct: ScrapedProduct | null) => {
    setData((prev) => ({ ...prev, scrapedProduct }));
  }, []);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setData(defaultOnboardingData);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        step,
        setSource,
        setUrl,
        setAiPrompt,
        setCountry,
        setCurrency,
        setTargetAudience,
        setTargetLanguage,
        setScrapedProduct,
        goToStep,
        saveToStorage,
        clearStorage,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
