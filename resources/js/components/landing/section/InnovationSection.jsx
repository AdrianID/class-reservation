import React from "react";
import { Lightbulb } from "lucide-react";
import SectionHeader from "../SectionHeader";
import Badge from "../Badge";
import FeatureCard from "../FeaturedCard";
import { features } from "@/data";

const InnovationSection = () => (
    <section className="py-20 relative overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <SectionHeader
                badge={<Badge icon={Lightbulb}>Innovation & Research</Badge>}
                title={
                    <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        Innovation & Research
                    </span>
                }
                description="Discover breakthrough research and cutting-edge facilities that shape the future"
            />
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="text-center group">
                        <FeatureCard {...feature} />
                    </div>
                ))}
            </div>
            <div className="absolute top-20 left-10 w-4 h-4 bg-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-6 h-6 bg-primary/15 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-5 w-2 h-2 bg-accent-light/30 rounded-full animate-ping"></div>
        </div>
    </section>
);

export default InnovationSection;
