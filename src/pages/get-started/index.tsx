import Head from "next/head";
import {
  OnboardingProvider,
  OnboardingShell,
  SourceSelectionStep,
  DetailsStep,
  BuildingStep,
  CompleteStep,
  useOnboarding,
} from "@/components/onboarding";

const OnboardingContent = () => {
  const { step } = useOnboarding();

  switch (step) {
    case "source":
      return <SourceSelectionStep />;
    case "details":
      return <DetailsStep />;
    case "building":
      return <BuildingStep />;
    case "complete":
      return <CompleteStep />;
    default:
      return <SourceSelectionStep />;
  }
};

const GetStartedPage = () => {
  return (
    <>
      <Head>
        <title>Get Started | Dropwiz</title>
        <meta name="description" content="Build your AI-powered Shopify store in minutes" />
      </Head>
      <OnboardingProvider>
        <OnboardingShell>
          <OnboardingContent />
        </OnboardingShell>
      </OnboardingProvider>
    </>
  );
};

export default GetStartedPage;
