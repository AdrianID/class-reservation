import React, { useState, useEffect } from "react";
import GuestLayout from "@/components/Layouts/GuestLayout"; // Import GuestLayout
import HeroSection from "@/components/landing/section/HeroSection";
import ProgramsSection from "@/components/landing/section/ProgramsSection";
import AboutSection from "@/components/landing/section/AboutSection";
import InnovationSection from "@/components/landing/section/InnovationSection";
import CTASection from "@/components/landing/section/CTASection";
import FAQSection from "@/components/landing/section/FAQSection";

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
            <HeroSection />
            <ProgramsSection />
            <AboutSection />
            <InnovationSection />
            <CTASection />
            <FAQSection />
        </GuestLayout>
    );
}
