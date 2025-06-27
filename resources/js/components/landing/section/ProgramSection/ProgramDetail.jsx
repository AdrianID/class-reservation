import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Clock,
    Users,
    Award,
    BookOpen,
    MapPin,
    ArrowRight,
    FileText,
    Phone,
} from "lucide-react";

const ProgramDetail = ({
    program,
    programs,
    isOpen,
    onClose,
    onProgramSwitch,
}) => {
    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const scrollCheckRef = useRef(null);
    const modalContentRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!isOpen || !modalContentRef.current) return;

        let frameId = null;

        const startPollingScroll = () => {
            const checkScroll = () => {
                const scrollTop = modalContentRef.current?.scrollTop ?? 0;
                setScrollY(scrollTop);
                setIsScrolled(scrollTop > 50);
                frameId = requestAnimationFrame(checkScroll);
            };

            frameId = requestAnimationFrame(checkScroll);
            scrollCheckRef.current = frameId;
        };

        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(startPollingScroll);
            scrollCheckRef.current = raf2;
        });
        scrollCheckRef.current = raf1;

        return () => {
            if (scrollCheckRef.current)
                cancelAnimationFrame(scrollCheckRef.current);
            if (frameId) cancelAnimationFrame(frameId);
            scrollCheckRef.current = null;
        };
    }, [isOpen, program]);

    /**
     * Memulai ulang polling scroll setelah beralih program
     */
    const restartScrollPolling = () => {
        if (!modalContentRef.current) return;

        let frameId = null;

        const checkScroll = () => {
            const scrollTop = modalContentRef.current?.scrollTop ?? 0;
            setScrollY(scrollTop);
            setIsScrolled(scrollTop > 50);
            frameId = requestAnimationFrame(checkScroll);
        };

        frameId = requestAnimationFrame(checkScroll);
        scrollCheckRef.current = frameId;
    };

    /**
     * Mengatur overflow body agar tidak scroll saat modal terbuka
     */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    /**
     * Reset state scroll saat modal ditutup
     */
    useEffect(() => {
        if (!isOpen) {
            setScrollY(0);
            setIsScrolled(false);
            setIsClosing(false);
        }
    }, [isOpen]);

    /**
     * Menangani pergantian program dengan animasi
     * - Menunggu 300ms untuk animasi keluar
     * - Mengatur ulang scroll dan memulai polling baru
     */
    const handleProgramSwitch = async (newProgram) => {
        setIsAnimating(true);

        await new Promise((resolve) => setTimeout(resolve, 300)); // Animasi keluar
        onProgramSwitch(newProgram);

        await new Promise((resolve) => requestAnimationFrame(resolve)); // Frame berikutnya

        if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
        setScrollY(0);
        setIsScrolled(false);
        setIsAnimating(false);

        // Bersihkan polling lama
        if (scrollCheckRef.current) {
            cancelAnimationFrame(scrollCheckRef.current);
            scrollCheckRef.current = null;
        }

        // Mulai ulang polling setelah delay kecil
        setTimeout(restartScrollPolling, 100);
    };

    if (!program) return null;

    const otherPrograms = programs.filter((p) => p.id !== program.id);

    // Definisi animasi untuk modal, backdrop, dan konten
    const modalVariants = {
        hidden: {
            y: "100%",
            opacity: 0,
            scale: 0.95,
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "easeOut",
                duration: 0.4,
            },
        },
        exit: {
            y: "100%",
            opacity: 0,
            scale: 0.95,
            transition: {
                type: "easeIn",
                duration: 0.3,
            },
        },
    };

    const backdropVariants = {
        hidden: { opacity: 0, backdropFilter: "blur(0px)" },
        visible: {
            opacity: 1,
            backdropFilter: "blur(8px)",
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            backdropFilter: "blur(0px)",
            transition: { duration: 0.2 },
        },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.4, staggerChildren: 0.1 },
        },
        exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <AnimatePresence mode="wait">
            {(isOpen || isClosing) && !isAnimating && (
                <>
                    {/* Backdrop dengan animasi untuk latar belakang modal */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/50 z-[190]"
                        onClick={() => {
                            setIsClosing(true);
                            setTimeout(() => {
                                onClose();
                                setIsClosing(false);
                            }, 300);
                        }}
                    />

                    {/* Konten modal dengan animasi dan fungsi drag */}
                    <motion.div
                        key={program.id}
                        initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                        animate={
                            isClosing
                                ? {
                                      y: "100%",
                                      opacity: 0,
                                      scale: 0.95,
                                      transition: {
                                          duration: 0.3,
                                          ease: "easeInOut",
                                      },
                                  }
                                : {
                                      y: 0,
                                      opacity: 1,
                                      scale: 1,
                                      top: isScrolled || isMobile ? 0 : "auto",
                                      height:
                                          isScrolled || isMobile
                                              ? "100vh"
                                              : "90vh",
                                      borderRadius:
                                          isScrolled || isMobile
                                              ? "0px"
                                              : "24px 24px 0 0",
                                  }
                        }
                        exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            ...(isClosing && { duration: 0.3, ease: "easeIn" }),
                        }}
                        layout
                        className={`fixed z-[200] bg-white shadow-2xl overflow-hidden ${
                            isMobile
                                ? "inset-0"
                                : "left-6 right-6 sm:left-12 sm:right-12 md:left-16 md:right-16 lg:left-24 lg:right-24 xl:left-32 xl:right-32 2xl:left-48 2xl:right-48 bottom-0 max-w-6xl mx-auto"
                        }`}
                        style={{ bottom: 0 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 100 }}
                        dragElastic={{ top: 0, bottom: 0.1 }}
                        dragMomentum={false}
                        onDragEnd={(event, info) => {
                            if (info.offset.y > 10 || info.velocity.y > 400) {
                                // Close with small drag (10px) regardless of scroll state
                                setIsClosing(true);
                                setTimeout(() => {
                                    onClose();
                                    setIsClosing(false);
                                }, 300);
                            }
                        }}
                    >
                        {/* Header  */}
                        <motion.div
                            layout
                            className={`sticky top-0 z-30 transition-all duration-300 ease-in-out ${
                                isScrolled
                                    ? `bg-gradient-to-br ${program.color} px-5 py-3 rounded-xl shadow-md`
                                    : "bg-white/0 px-6 py-4"
                            }`}
                            style={{
                                backdropFilter: "blur(12px)",
                                margin: isScrolled ? "0.5rem 1rem" : "0",
                                borderBottom: isScrolled
                                    ? "1px solid rgba(0,0,0,0.05)"
                                    : "none",
                            }}
                        >
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />

                            {/* Konten header dengan layout dinamis */}
                            <div
                                className={`flex items-center mt-2 transition-all duration-300 ${
                                    isScrolled
                                        ? "justify-between"
                                        : "justify-start gap-3"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <motion.div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg transition-colors duration-300 ${
                                            isScrolled
                                                ? "bg-transparent"
                                                : `bg-gradient-to-br ${program.color}`
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{
                                            type: "easeOut",
                                            stiffness: 400,
                                            damping: 10,
                                        }}
                                    >
                                        {program.icon}
                                    </motion.div>
                                    <div className="flex flex-col min-w-0 flex-1 -space-y-1">
                                        <h2
                                            className={`text-xl font-bold transition-colors duration-300 leading-none flex items-center gap-2 flex-wrap ${
                                                isScrolled
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {program.title}
                                            {isScrolled && (
                                                <span className="text-sm font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-md">
                                                    {program.category}
                                                </span>
                                            )}
                                        </h2>
                                        <motion.div
                                            animate={{
                                                height: isScrolled ? 0 : "auto",
                                                opacity: isScrolled ? 0 : 1,
                                                marginTop: isScrolled ? 0 : 4,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-sm text-gray-500 leading-none">
                                                {program.category}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setIsClosing(true);
                                        setTimeout(() => {
                                            onClose();
                                            setIsClosing(false);
                                        }, 300);
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ml-2 ${
                                        isScrolled
                                            ? "bg-white hover:bg-gray-100"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Area konten yang dapat discroll */}
                        {isOpen && (
                            <div
                                key={program.id}
                                ref={(el) => (modalContentRef.current = el)}
                                data-program-id={program.id}
                                className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                style={{
                                    height:
                                        isScrolled || isMobile
                                            ? "calc(100vh - 80px)"
                                            : "calc(90vh - 80px)",
                                }}
                            >
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="p-6 space-y-6"
                                >
                                    {/* Bagian utama: Deskripsi dan gambar */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="grid lg:grid-cols-5 gap-6 items-start"
                                    >
                                        <div className="lg:col-span-3 space-y-4">
                                            <motion.div
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.01 }}
                                                className="bg-gradient-to-r from-gray-50 to-gray-50/50 p-5 rounded-xl"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                    About This Program
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-sm">
                                                    {program.description}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                variants={itemVariants}
                                                className="grid grid-cols-2 gap-3"
                                            >
                                                {[
                                                    {
                                                        icon: Clock,
                                                        label: "Duration",
                                                        value: program.duration,
                                                    },
                                                    {
                                                        icon: Users,
                                                        label: "Students",
                                                        value: program.students,
                                                    },
                                                    {
                                                        icon: Award,
                                                        label: "Degree",
                                                        value: program.degree,
                                                    },
                                                    {
                                                        icon: MapPin,
                                                        label: "Mode",
                                                        value: program.mode,
                                                    },
                                                ].map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{
                                                            scale: 1.03,
                                                            y: -1,
                                                        }}
                                                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200"
                                                    >
                                                        <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-xs text-gray-500">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-sm font-medium truncate">
                                                                {item.value}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.11 }}
                                            className="lg:col-span-2 relative flex items-center justify-center"
                                        >
                                            <img
                                                src={program.image}
                                                alt={program.title}
                                                className="w-full h-60 object-contain drop-shadow-lg"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Informasi tambahan */}
                                    <div className="space-y-6">
                                        <motion.div variants={itemVariants}>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                Curriculum Highlights
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {program.curriculum?.map(
                                                    (item, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -20,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.05,
                                                            }}
                                                            whileHover={{
                                                                scale: 1.01,
                                                                x: 3,
                                                            }}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 leading-snug">
                                                                {item}
                                                            </span>
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                Career Opportunities
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {program.careers?.map(
                                                    (career, idx) => (
                                                        <motion.span
                                                            key={idx}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.05,
                                                            }}
                                                            whileHover={{
                                                                scale: 1.05,
                                                                y: -1,
                                                            }}
                                                            className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-medium border border-primary/20 cursor-default"
                                                        >
                                                            {career}
                                                        </motion.span>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                Entry Requirements
                                            </h3>
                                            <div className="space-y-2 ">
                                                {program.requirements?.map(
                                                    (req, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -20,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.05,
                                                            }}
                                                            whileHover={{
                                                                scale: 1.01,
                                                                x: 3,
                                                            }}
                                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                            <span className="text-sm text-gray-600 leading-snug">
                                                                {req}
                                                            </span>
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>

                                        {otherPrograms.length > 0 && (
                                            <motion.div
                                                variants={itemVariants}
                                                className="bg-gradient-to-r from-gray-50 to-gray-50/50 p-5 rounded-xl"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                    Other Programs
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {otherPrograms.map(
                                                        (otherProgram, idx) => (
                                                            <motion.div
                                                                key={
                                                                    otherProgram.id
                                                                }
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        idx *
                                                                        0.05,
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.02,
                                                                    y: -2,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.98,
                                                                }}
                                                                onClick={() =>
                                                                    handleProgramSwitch(
                                                                        otherProgram
                                                                    )
                                                                }
                                                                className="group flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
                                                            >
                                                                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 rounded-lg flex items-center justify-center text-primary transition-all duration-200 flex-shrink-0">
                                                                    {
                                                                        otherProgram.icon
                                                                    }
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors duration-200 text-sm">
                                                                        {
                                                                            otherProgram.title
                                                                        }
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                                                        {
                                                                            otherProgram.category
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-gradient-to-r from-primary to-accent p-5 rounded-xl text-white shadow-lg"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-1">
                                                        Ready to Begin?
                                                    </h3>
                                                    <p className="text-white/90 text-sm">
                                                        Start your journey in{" "}
                                                        {program.title.toLowerCase()}
                                                    </p>
                                                </div>
                                                <div className="text-white/20">
                                                    <ArrowRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.02,
                                                        y: -1,
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center justify-center gap-2 bg-white text-primary font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm text-sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Apply Now
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.02,
                                                        y: -1,
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center justify-center gap-2 border border-white/30 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-sm"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    Brochure
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.02,
                                                        y: -1,
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center justify-center gap-2 border border-white/30 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-sm"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    Contact
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProgramDetail;
