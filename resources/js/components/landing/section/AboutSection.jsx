import React from "react";
import { Award, CheckCircle, Globe, Target, Users } from "lucide-react";
import Badge from "../Badge";
import Button from "../Button";
import StatCard from "../StatCard";

const AboutSection = () => (
    <section
        id="about"
        className="py-20 bg-gradient-to-br from-primary-light to-[#f8fafc] relative overflow-hidden"
    >
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1">
                    <div className="relative group">
                        <img
                            src="/images/landing/about.svg"
                            alt="Research Laboratory"
                            className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                        />
                        <StatCard
                            number="150+"
                            label="Countries Represented"
                            icon={Globe}
                            className="top-2 md:top-16 md:-left-2"
                        />
                        <StatCard
                            number="$2.5B"
                            label="Research Funding"
                            icon={Target}
                            className="bottom-12 right-4 md:bottom-48 md:right-4"
                        />
                        <StatCard
                            number="98%"
                            label="Graduation Rate"
                            icon={Award}
                            className="top-8 md:top-28 right-2 md:-right-16"
                        />
                        <StatCard
                            number="500K+"
                            label="Alumni Worldwide"
                            icon={Users}
                            className="bottom-20 md:bottom-1/4 left-4 md:left-16"
                        />
                    </div>
                </div>
                <div className="space-y-8 order-1 lg:order-2 md:ml-12">
                    <div>
                        <Badge icon={Award}>Excellence Since 2020</Badge>
                        <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                            Why Choose LOD University?
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            For over a century, LOD University has been at the
                            forefront of academic excellence, research
                            innovation, and student success.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-8">
                            {[
                                "World-renowned faculty",
                                "State-of-the-art facilities",
                                "Industry connections",
                                "Diverse campus community",
                                "Comprehensive support",
                                "Research opportunities",
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
                                >
                                    <div className="w-6 h-6 bg-gradient-to-br from-accent-dark to-primary rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium text">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Button variant="primary">Learn More About Us</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;
