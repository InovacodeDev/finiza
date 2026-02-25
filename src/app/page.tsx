import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { AgitationSection } from "@/components/sections/AgitationSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { CtaFinalSection } from "@/components/sections/CtaFinalSection";

export default function Home() {
    return (
        <div className="w-full flex flex-col pb-20 relative">
            <HeroSection />
            <ProblemSection />
            <AgitationSection />
            <SolutionSection />
            <FeatureSection />
            <CtaFinalSection />
        </div>
    );
}
