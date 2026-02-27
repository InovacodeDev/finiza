import { HeroSection } from "@/components/sections/HeroSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CtaFinalSection } from "@/components/sections/CtaFinalSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
    return (
        <div className="w-full flex flex-col relative">
            <HeroSection />
            <SolutionSection />
            <FeatureSection />
            <PricingSection />
            <CtaFinalSection />
            <Footer />
        </div>
    );
}
