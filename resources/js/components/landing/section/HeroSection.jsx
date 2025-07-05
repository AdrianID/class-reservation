import React from "react";
import {
    Star,
    ArrowRight,
    Play,
    GraduationCap,
    BookOpen,
    Award,
    Globe,
} from "lucide-react";
import Badge from "../Badge";
import Button from "../Button";
import StatItem from "../StatItem";
import { stats } from "@/data";

const HeroSection = () => {
    return (
        <section
            id="home"
            className="relative py-16 lg:py-24 overflow-hidden bg-white/80 backdrop-blur-sm"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary/15 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-light/30 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Badge icon={Star}>Ranked #1 University</Badge>
                            <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-normal">
                                Shape Your Future at
                                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent md:pb-1">
                                    LOD University
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                Join thousands of students who have transformed
                                their lives through world-class education,
                                innovative research, and unparalleled
                                opportunities for growth.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="primary"
                                className="flex items-center justify-center group bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                            >
                                Explore Programs
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center border-accent text-accent hover:bg-accent hover:text-white"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Virtual Tour
                            </Button>
                        </div>
                        <div className="w-full px-8 md:px-0 flex justify-between md:justify-start items-center space-x-8 pt-6">
                            {stats.map((stat, index) => (
                                <StatItem
                                    key={index}
                                    number={stat.number}
                                    label={stat.label}
                                    numberClass="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all"
                                    labelClass="text-sm text-gray-600"
                                    className="group hover:scale-105 transition-transform"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="relative group w-fit">
                            <img
                                src="/images/landing/campus.svg"
                                alt="LOD University Campus"
                                className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl h-auto transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                            />
                            <div className="absolute top-14 md:top-28 right-16 md:right-20 bg-gradient-to-r from-primary to-accent rounded-2xl p-3 shadow-lg animate-float">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-5 md:top-12 left-40 md:left-56 bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-3 shadow-lg animate-float">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-14 left-16 md:top-28 md:left-24 bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-3 shadow-lg animate-float">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-36 right-24 md:top-40 md:right-40 bg-gradient-to-r from-accent-light to-accent rounded-2xl p-3 shadow-lg animate-float">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
