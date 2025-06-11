import React from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    ArrowRight,
    BookOpen,
    Award,
    Star,
    Users,
} from "lucide-react";
import Button from "../Button";
import StatItem from "../StatItem";

const CTASection = () => {
    const isHoverSupported = window.matchMedia("(hover: hover)").matches;
    const [isHovered, setIsHovered] = React.useState(!isHoverSupported);
    const [hoveredIcon, setHoveredIcon] = React.useState(null);

    // Timer untuk delayed floating animation
    React.useEffect(() => {
        let timer;
        if (isHovered) {
            timer = setTimeout(() => {
                setHoveredIcon("floating");
            }, 600); // Delay sebelum mulai floating
        } else {
            setHoveredIcon(null);
        }
        return () => clearTimeout(timer);
    }, [isHovered]);

    const handleHoverStart = () => {
        if (isHoverSupported) {
            setIsHovered(true);
        }
    };

    const handleHoverEnd = () => {
        if (isHoverSupported) {
            setIsHovered(false);
        }
    };

    const stats = [
        { number: "25K+", label: "Students" },
        { number: "95%", label: "Success Rate" },
        { number: "50+", label: "Programs" },
    ];

    // Variants untuk container utama - tidak berputar
    const containerVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    };

    // Variants untuk graduation cap dengan efek bounce
    const capVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.0,
            rotate: 3,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    };

    // Variants untuk floating icons dengan transisi smooth
    const floatingIconVariants = {
        award: {
            initial: { y: 0, x: 0, scale: 1 },
            hover: {
                y: -10,
                x: 0,
                scale: 1.2,
                transition: {
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                },
            },
            hoverFloat: {
                y: [-8, -12, -8],
                x: 0,
                scale: 1.2,
                transition: {
                    y: {
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                },
            },
            floating: {
                y: [-5, 8, -5],
                x: [-3, 4, -3],
                transition: {
                    duration: 3.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                },
            },
        },
        book: {
            initial: { y: 0, x: 0, scale: 1 },
            hover: {
                y: -8,
                x: -8,
                scale: 1.2,
                transition: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                },
            },
            hoverFloat: {
                y: [-6, -10, -6],
                x: -8,
                scale: 1.2,
                transition: {
                    y: {
                        duration: 1.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                },
            },
            floating: {
                y: [6, -8, 6],
                x: [2, -4, 2],
                transition: {
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.5,
                },
            },
        },
        star: {
            initial: { y: 0, x: 0, scale: 1 },
            hover: {
                y: 6,
                x: 8,
                scale: 1.3,
                transition: {
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                },
            },
            hoverFloat: {
                y: [4, 8, 4],
                x: 8,
                scale: 1.3,
                transition: {
                    y: {
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                },
            },
            floating: {
                y: [-4, 7, -4],
                x: [4, -3, 4],
                transition: {
                    duration: 3.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1.2,
                },
            },
        },
        users: {
            initial: { y: 0, x: 0, scale: 1 },
            hover: {
                y: -7,
                x: -8,
                scale: 1.2,
                transition: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                },
            },
            hoverFloat: {
                y: [-5, -9, -5],
                x: -8,
                scale: 1.2,
                transition: {
                    y: {
                        duration: 2.0,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                },
            },
            floating: {
                y: [7, -5, 7],
                x: [-4, 3, -4],
                transition: {
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.8,
                },
            },
        },
    };

    // Variants untuk tooltip dengan transisi yang lebih smooth
    const tooltipVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 8,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
            },
        },
    };

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-dark via-primary to-accent-dark text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-16 right-16 w-48 h-48 bg-accent-light/15 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-primary-light/20 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-accent/30 text-white text-sm font-medium backdrop-blur-sm border border-accent/40 shadow-lg">
                            <Calendar className="w-4 h-4 mr-2 text-accent-light" />
                            <span className="text-accent-light font-semibold">
                                •
                            </span>
                            <span className="ml-2">Applications Open Now</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-normal tracking-tight">
                                Ready to Start Your
                                <span className="block bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent md:pb-1">
                                    Academic Journey?
                                </span>
                            </h2>
                            <p className="text-lg lg:text-xl text-primary-light leading-relaxed max-w-xl">
                                Join the LOD University community and unlock
                                your potential. Applications are now open for
                                the upcoming academic year with
                                <span className="font-semibold text-accent-light">
                                    {" "}
                                    early bird benefits
                                </span>
                                .
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start py-6">
                            {stats.map((stat, index) => (
                                <StatItem
                                    key={index}
                                    number={stat.number}
                                    label={stat.label}
                                    numberClass="text-accent-light"
                                    labelClass="text-primary-light"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button
                                variant="accent"
                                className="bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent transition-all flex items-center justify-center group"
                            >
                                Apply Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center border border-accent/30 text-white hover:bg-accent/20 transition-colors"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Request Information
                            </Button>
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end">
                        <motion.div
                            className="relative group"
                            onHoverStart={handleHoverStart}
                            onHoverEnd={handleHoverEnd}
                        >
                            {/* Main container */}
                            <motion.div
                                variants={containerVariants}
                                animate={isHovered ? "hover" : "initial"}
                                className="relative w-[380px] h-[380px] lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-white/10 to-accent/5 rounded-full backdrop-blur-sm border border-accent/30 flex items-center justify-center shadow-2xl"
                            >
                                <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                                    <div className="w-full h-full bg-gradient-to-br from-accent/30 to-primary/20 rounded-full flex items-center justify-center">
                                        <motion.div
                                            variants={capVariants}
                                            animate={
                                                isHovered ? "hover" : "initial"
                                            }
                                        >
                                            <img
                                                src="/images/landing/graduation.svg"
                                                alt="graduation"
                                                className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Floating icons dengan tooltip yang lebih dekat */}
                                <motion.div
                                    variants={floatingIconVariants.award}
                                    initial="initial"
                                    animate={
                                        hoveredIcon === "floating"
                                            ? "hoverFloat"
                                            : isHovered
                                            ? "hover"
                                            : "floating"
                                    }
                                    className="absolute -top-12 right-12 -translate-x-1/2"
                                >
                                    <div className="relative group">
                                        <div className="bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-4 shadow-xl border border-accent/30 transition-all duration-300">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <motion.div
                                            initial="hidden"
                                            animate={
                                                isHovered ? "visible" : "hidden"
                                            }
                                            variants={tooltipVariants}
                                            className="absolute -bottom-12 -right-11 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-accent/20 min-w-max"
                                        >
                                            <p className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                                Excellence Recognition
                                            </p>
                                            <div className="absolute top-0 left-20 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-white/95 rotate-45 border-l border-t border-accent/20"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={floatingIconVariants.book}
                                    initial="initial"
                                    animate={
                                        hoveredIcon === "floating"
                                            ? "hoverFloat"
                                            : isHovered
                                            ? "hover"
                                            : "floating"
                                    }
                                    className="absolute bottom-0 left-0 -translate-y-1/2 -translate-x-1/2"
                                >
                                    <div className="relative group">
                                        <div className="bg-gradient-to-r from-primary-dark to-accent rounded-2xl p-4 shadow-xl border border-accent/30 transition-all duration-300">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <motion.div
                                            initial="hidden"
                                            animate={
                                                isHovered ? "visible" : "hidden"
                                            }
                                            variants={tooltipVariants}
                                            className="absolute -top-12 -left-12 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-accent/20 min-w-max"
                                        >
                                            <p className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                                World-Class Curriculum
                                            </p>
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-accent/20"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={floatingIconVariants.star}
                                    initial="initial"
                                    animate={
                                        hoveredIcon === "floating"
                                            ? "hoverFloat"
                                            : isHovered
                                            ? "hover"
                                            : "floating"
                                    }
                                    className="absolute bottom-2 right-12 2xl:bottom-12 2xl:right-0 translate-x-1/2 translate-y-1/2"
                                >
                                    <div className="relative group">
                                        <div className="bg-gradient-to-r from-accent-light to-accent rounded-full p-3 shadow-xl border border-accent/30 transition-all duration-300">
                                            <Star className="w-5 h-5 text-white" />
                                        </div>
                                        <motion.div
                                            initial="hidden"
                                            animate={
                                                isHovered ? "visible" : "hidden"
                                            }
                                            variants={tooltipVariants}
                                            className="absolute -bottom-12 -right-10 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-accent/20 min-w-max"
                                        >
                                            <p className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                                Premium Quality
                                            </p>
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-white/95 rotate-45 border-l border-t border-accent/20"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={floatingIconVariants.users}
                                    initial="initial"
                                    animate={
                                        hoveredIcon === "floating"
                                            ? "hoverFloat"
                                            : isHovered
                                            ? "hover"
                                            : "floating"
                                    }
                                    className="absolute top-12 left-0 -translate-y-1/2 translate-x-1/2"
                                >
                                    <div className="relative group">
                                        <div className="bg-gradient-to-r from-primary to-accent-dark rounded-full p-3 shadow-xl border border-accent/30 transition-all duration-300">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <motion.div
                                            initial="hidden"
                                            animate={
                                                isHovered ? "visible" : "hidden"
                                            }
                                            variants={tooltipVariants}
                                            className="absolute -top-12 -left-9 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-accent/20 min-w-max"
                                        >
                                            <p className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                                Alumni Network
                                            </p>
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-accent/20"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Decorative rings */}
                            <div className="absolute inset-0 rounded-full border border-accent/20 scale-110"></div>
                            <div className="absolute inset-0 rounded-full border border-accent/10 scale-125"></div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-accent/30">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-primary-light">
                        <div className="flex items-center text-sm">
                            <span className="text-accent-light mr-2">🏆</span>
                            Accredited Institution
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-accent mr-2">📚</span>
                            Online & On-Campus
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-accent-light mr-2">💼</span>
                            Career Support
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-accent mr-2">🌍</span>
                            Global Community
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
