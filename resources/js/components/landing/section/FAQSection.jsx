import React from "react";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../SectionHeader";
import Badge from "../Badge";
import Button from "../Button";
import FAQAccordion from "@/components/landing/FAQAccordion";

const FAQSection = () => (
    <section className="py-20 bg-gradient-to-br from-[#f8fafc] to-primary-light relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-24 h-24 bg-accent/15 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-light/25 rounded-full blur-xl animate-bounce"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <SectionHeader
                badge={
                    <Badge
                        icon={() => (
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                    >
                        Frequently Asked Questions
                    </Badge>
                }
                title={
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Got Questions? We've Got Answers
                    </span>
                }
                description="Everything you need to know about LOD University admissions, programs, and campus life"
            />
            <FAQAccordion />
            <div className="text-center mt-12">
                <p className="text-gray-600 mb-6">
                    Still have questions? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        className="flex items-center justify-center group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                    >
                        Contact Admissions
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="secondary"
                        className="border-accent text-accent hover:bg-accent hover:text-white"
                    >
                        Live Chat Support
                    </Button>
                </div>
            </div>
        </div>
    </section>
);

export default FAQSection;
