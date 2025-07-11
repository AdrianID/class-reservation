import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import {
    X,
    MapPin,
    Users,
    Zap,
    Calendar,
    Clock,
    Star,
    Wifi,
    Car,
    Coffee,
    Monitor,
    Volume2,
    Thermometer,
    Building,
    Info,
    CheckCircle,
    AlertCircle,
    Wrench,
    BookOpen,
    ArrowRight,
    Image,
} from "lucide-react";

const RoomDetailModal = ({ room, isOpen, onClose, onBook, bookingData }) => {
    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
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
    }, [isOpen, room]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setScrollY(0);
            setIsScrolled(false);
            setIsClosing(false);
            setActiveImageIndex(0);
        }
    }, [isOpen]);

    if (!room) return null;

    // Sample additional images for gallery
    const roomImages = [
        room.image,
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    // Get status style and icons
    const getStatusConfig = (status) => {
        switch (status) {
            case "available":
                return {
                    style: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    label: "Available",
                    icon: CheckCircle,
                    color: "from-emerald-400 to-teal-500",
                };
            case "occupied":
                return {
                    style: "bg-orange-50 text-orange-800 border-orange-200",
                    label: "Occupied",
                    icon: AlertCircle,
                    color: "from-orange-400 to-amber-500",
                };
            case "maintenance":
                return {
                    style: "bg-red-50 text-red-800 border-red-200",
                    label: "Maintenance",
                    icon: Wrench,
                    color: "from-red-400 to-rose-500",
                };
            default:
                return {
                    style: "bg-gray-50 text-gray-800 border-gray-200",
                    label: status,
                    icon: Info,
                    color: "from-gray-400 to-slate-500",
                };
        }
    };

    const statusConfig = getStatusConfig(room.status);

    // Facility icons mapping
    const facilityIcons = {
        AC: Thermometer,
        Projector: Monitor,
        "Sound System": Volume2,
        "Wi-Fi": Wifi,
        Parking: Car,
        Coffee: Coffee,
    };

    // Sample room details
    const roomDetails = {
        description: `${room.name} is a modern, well-equipped space perfect for meetings, presentations, and collaborative work. The room features contemporary design with excellent natural lighting and state-of-the-art facilities.`,
        specifications: [
            { label: "Room Size", value: "8m × 6m" },
            { label: "Ceiling Height", value: "3.2m" },
            { label: "Natural Light", value: "Yes" },
            { label: "Accessibility", value: "Wheelchair accessible" },
        ],
        amenities: [
            "High-speed Wi-Fi",
            "Whiteboard",
            "Flipchart",
            "Power outlets",
            "Climate control",
            "Natural lighting",
        ],
        rules: [
            "No smoking inside the room",
            "Keep the room clean and tidy",
            "Return furniture to original position",
            "Report any damage immediately",
            "Maximum capacity must be respected",
        ],
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

    return (
        <AnimatePresence mode="wait">
            {(isOpen || isClosing) && (
                <>
                    {/* Backdrop */}
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

                    {/* Modal Content */}
                    <motion.div
                        key={room.id}
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
                                setIsClosing(true);
                                setTimeout(() => {
                                    onClose();
                                    setIsClosing(false);
                                }, 300);
                            }
                        }}
                    >
                        {/* Header */}
                        <motion.div
                            layout
                            className={`sticky top-0 z-30 transition-all duration-300 ease-in-out ${
                                isScrolled
                                    ? "bg-gradient-to-r from-primary to-primary-dark px-5 py-3 rounded-xl shadow-lg"
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
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-disable rounded-full" />

                            <div
                                className={`flex items-center mt-2 transition-all duration-300 ${
                                    isScrolled
                                        ? "justify-between"
                                        : "justify-start gap-3"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg transition-colors duration-300 ${
                                            isScrolled
                                                ? "bg-transparent"
                                                : "bg-gradient-to-br from-primary to-primary-dark"
                                        }`}
                                    >
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1 -space-y-1">
                                        <h2
                                            className={`text-xl font-bold transition-colors duration-300 leading-none flex items-center gap-2 flex-wrap ${
                                                isScrolled
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {room.name}
                                            {isScrolled && (
                                                <span className="text-sm font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-md">
                                                    {statusConfig.label}
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
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.style}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                                <span className="text-sm text-disable">
                                                    {room.location}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Action buttons in header */}
                                <div className="flex items-center gap-2">
                                    {/* Book Now Button */}
                                    <button
                                        /* onClick={() => {
                                            onBook();
                                            setIsClosing(true);
                                            setTimeout(() => {
                                                onClose();
                                                setIsClosing(false);
                                            }, 300);
                                        }} */
                                        onClick={() => {
                                            if (!bookingData || !room) return;

                                            const fullData = {
                                                ...bookingData,
                                                selectedRoom: room,
                                            };
                                            const encoded = encodeURIComponent(
                                                JSON.stringify(fullData)
                                            );
                                            router.visit(
                                                route("peminjaman.create") +
                                                    `?data=${encoded}`
                                            );

                                            setIsClosing(true);
                                            setTimeout(() => {
                                                onClose();
                                                setIsClosing(false);
                                            }, 300);
                                        }}
                                        disabled={room.status !== "available"}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-md flex items-center gap-2 ${
                                            room.status === "available"
                                                ? isScrolled
                                                    ? "bg-white text-primary hover:bg-gray-100"
                                                    : "bg-gradient-to-r from-primary to-primary-dark text-white "
                                                : "bg-disable-light text-disable cursor-not-allowed"
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {room.status === "available"
                                            ? "Book Now"
                                            : "Unavailable"}
                                    </button>

                                    {/* Close Button */}
                                    <button
                                        onClick={() => {
                                            setIsClosing(true);
                                            setTimeout(() => {
                                                onClose();
                                                setIsClosing(false);
                                            }, 300);
                                        }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                                            isScrolled
                                                ? "bg-white hover:bg-gray-100"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scrollable Content */}
                        {isOpen && (
                            <div
                                ref={(el) => (modalContentRef.current = el)}
                                className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                style={{
                                    height:
                                        isScrolled || isMobile
                                            ? "calc(100vh - 80px)"
                                            : "calc(90vh - 80px)",
                                }}
                            >
                                <div className="p-6 space-y-8">
                                    {/* Image Gallery */}
                                    <div className="space-y-4">
                                        <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden">
                                            <img
                                                key={activeImageIndex}
                                                src={
                                                    roomImages[activeImageIndex]
                                                }
                                                alt={`${room.name} - View ${
                                                    activeImageIndex + 1
                                                }`}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                                                <span className="text-white text-sm flex items-center gap-1">
                                                    <Image className="w-4 h-4" />
                                                    {activeImageIndex + 1} /{" "}
                                                    {roomImages.length}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Thumbnail Navigation */}
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {roomImages.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setActiveImageIndex(
                                                            index
                                                        )
                                                    }
                                                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                                        activeImageIndex ===
                                                        index
                                                            ? "border-primary shadow-lg"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Room Overview */}
                                    <div className="bg-gradient-to-r from-primary-light to-primary-light/70 p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                            <Building className="w-6 h-6 text-primary" />
                                            Room Overview
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            {roomDetails.description}
                                        </p>

                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                {
                                                    icon: MapPin,
                                                    label: "Location",
                                                    value: room.location,
                                                },
                                                {
                                                    icon: Users,
                                                    label: "Capacity",
                                                    value: `${room.capacity} people`,
                                                },
                                                {
                                                    icon: statusConfig.icon,
                                                    label: "Status",
                                                    value: statusConfig.label,
                                                },
                                                {
                                                    icon: Clock,
                                                    label: "Available",
                                                    value: "24/7",
                                                },
                                            ].map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
                                                >
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <item.icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-disable font-medium">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Content Grid */}
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        {/* Facilities */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                                Facilities & Equipment
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {room.facilities.map(
                                                    (facility, idx) => {
                                                        const IconComponent =
                                                            facilityIcons[
                                                                facility
                                                            ] || Info;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-3 p-4 bg-primary-light/20 rounded-xl border border-primary-light/30"
                                                            >
                                                                <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                                                                    <IconComponent className="w-4 h-4 text-primary-dark" />
                                                                </div>
                                                                <span className="font-medium text-gray-800">
                                                                    {facility}
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        {/* Specifications */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                                Room Specifications
                                            </h3>
                                            <div className="space-y-3">
                                                {roomDetails.specifications.map(
                                                    (spec, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                                                        >
                                                            <span className="text-gray-600 font-medium">
                                                                {spec.label}
                                                            </span>
                                                            <span className="font-bold text-primary">
                                                                {spec.value}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities & Rules */}
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                                Additional Amenities
                                            </h3>
                                            <div className="space-y-3">
                                                {roomDetails.amenities.map(
                                                    (amenity, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                                        >
                                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                                            <span className="text-gray-700">
                                                                {amenity}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                                Room Rules
                                            </h3>
                                            <div className="space-y-3">
                                                {roomDetails.rules.map(
                                                    (rule, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                                                        >
                                                            <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                                                            <span className="text-gray-700 text-sm">
                                                                {rule}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="bg-gradient-to-r from-primary to-primary-dark p-8 rounded-2xl text-white">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">
                                                    Ready to Book {room.name}?
                                                </h3>
                                                <p className="text-white/90">
                                                    {room.status === "available"
                                                        ? "Reserve this room for your next meeting or event"
                                                        : `This room is currently ${statusConfig.label.toLowerCase()}`}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-8 h-8 text-white/30" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="px-6 py-4 border-2 border-background text-background font-bold rounded-xl hover:bg-white/10 transition-colors duration-200">
                                                View Schedule
                                            </button>
                                            <button
                                                /* onClick={() => {
                                                    onBook();
                                                    setIsClosing(true);
                                                    setTimeout(() => {
                                                        onClose();
                                                        setIsClosing(false);
                                                    }, 300);
                                                }} */
                                                onClick={() => {
                                                    const fullData = {
                                                        ...bookingData,
                                                        selectedRoom: room,
                                                    };
                                                    const encoded =
                                                        encodeURIComponent(
                                                            JSON.stringify(
                                                                fullData
                                                            )
                                                        );
                                                    router.visit(
                                                        route(
                                                            "peminjaman.create"
                                                        ) + `?data=${encoded}`
                                                    );

                                                    setIsClosing(true);
                                                    setTimeout(() => {
                                                        onClose();
                                                        setIsClosing(false);
                                                    }, 300);
                                                }}
                                                disabled={
                                                    room.status !== "available"
                                                }
                                                className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                                                    room.status === "available"
                                                        ? "bg-transparent border border-background hover:bg-background text-background hover:text-primary-dark"
                                                        : "bg-white/20 text-white/60 cursor-not-allowed"
                                                }`}
                                            >
                                                <Calendar className="w-5 h-5" />
                                                {room.status === "available"
                                                    ? "Book This Room"
                                                    : "Not Available"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoomDetailModal;
