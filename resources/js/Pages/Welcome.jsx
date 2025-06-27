import React, { useState, useEffect } from "react";
import GuestLayout from "@/components/Layouts/GuestLayout";
import HeroSection from "@/components/landing/section/HeroSection";
import ProgramsSection from "@/components/landing/section/ProgramSection/Index";
import AboutSection from "@/components/landing/section/AboutSection";
import InnovationSection from "@/components/landing/section/InnovationSection";
import FacilitiesSection from "@/components/landing/section/FacilitesSection/Index";
import CTASection from "@/components/landing/section/CTASection";
import FAQSection from "@/components/landing/section/FAQSection/Index";

// Wave Divider Component
const WaveDivider = () => (
    <div className="relative h-16 -mb-px overflow-hidden">
        <svg
            className="absolute w-full h-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
        >
            <path
                d="M0,40 C320,80 720,20 1440,60 L1440,100 L0,100 Z"
                fill="#f8fafc"
                opacity="0.8"
            />
        </svg>
    </div>
);

// Divider CTA Section (before CTA)
const DividerCTA = () => (
    <div className="relative z-10 text-center py-20 bg-gradient-to-b from-white via-white to-primary/5">
        <p className="text-sm font-semibold text-accent/70 uppercase tracking-wide mb-3">
            Ready to Take the Next Step?
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Start Your Journey with LOD University
        </h3>
        <p className="text-md text-gray-500 max-w-2xl mx-auto">
            You've explored our campus, now it's time to shape your future. Join
            our community, schedule a visit, or take a virtual tour.
        </p>
    </div>
);

// Main Component
export default function Welcome() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <GuestLayout>
            <div className="min-h-screen bg-gradient-to-b from-primary-light via-white to-accent-light">
                <HeroSection />
                <WaveDivider />

                <section id="programs">
                    <ProgramsSection />
                </section>
                <WaveDivider />

                <section id="about">
                    <AboutSection />
                </section>
                <WaveDivider />

                <section id="innovation">
                    <InnovationSection />
                </section>
                <WaveDivider />

                <section
                    id="facilities"
                    className="relative bg-gradient-to-b from-white via-accent-light to-[#ecf9f9]"
                >
                    <FacilitiesSection />
                </section>

                <DividerCTA />
                <CTASection />
                <WaveDivider />

                <section id="faq">
                    <FAQSection />
                </section>
            </div>
        </GuestLayout>
    );
}
