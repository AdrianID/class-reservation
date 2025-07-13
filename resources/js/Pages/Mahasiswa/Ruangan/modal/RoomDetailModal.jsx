import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import ImageSkeleton from "@/components/ui/ImageSkeleton";
import Swal from "sweetalert2";
import {
    X,
    MapPin,
    Users,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Wrench,
    Building,
    Info,
    ArrowRight,
    Thermometer,
    Monitor,
    Volume2,
    Wifi,
    Car,
    Coffee,
} from "lucide-react";

const RoomDetailModal = ({ room, isOpen, onClose, onBook, bookingData }) => {
    const [scrollY, setScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const modalContentRef = useRef(null);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle scroll detection
    useEffect(() => {
        if (!isOpen || !modalContentRef.current) return;

        const handleScroll = () => {
            const scrollTop = modalContentRef.current?.scrollTop ?? 0;
            setScrollY(scrollTop);
            setIsScrolled(scrollTop > 20);
        };

        const modalElement = modalContentRef.current;
        modalElement.addEventListener("scroll", handleScroll);
        return () => modalElement.removeEventListener("scroll", handleScroll);
    }, [isOpen]);

    // Handle body scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Reset states when modal closes
    useEffect(() => {
        if (!isOpen) {
            setScrollY(0);
            setIsScrolled(false);
            setIsClosing(false);
        }
    }, [isOpen]);

    // Handle close with animation
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    // Handle booking
    const handleBook = useCallback(() => {
        if (!bookingData) {
            Swal.fire({
                icon: "warning",
                title: "Booking Info Required",
                text: "You need to fill in the booking information before booking a room.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-xl",
                },
                didClose: () => {
                    handleClose();
                },
            });

            return;
        }

        if (!room || room.status !== "available") return;

        const fullData = {
            ...bookingData,
            selectedRoom: room,
        };
        const encoded = encodeURIComponent(JSON.stringify(fullData));
        router.visit(route("peminjaman.create") + `?data=${encoded}`);
        handleClose();
    }, [bookingData, room, handleClose]);

    // Handle drag end for mobile
    const handleDragEnd = useCallback(
        (event, info) => {
            if (info.offset.y > 50 || info.velocity.y > 500) {
                handleClose();
            }
        },
        [handleClose]
    );

    if (!room) return null;

    // Status configuration
    const getStatusConfig = (status) => {
        const configs = {
            available: {
                style: "bg-emerald-50 text-emerald-800 border-emerald-200",
                label: "Available",
                icon: CheckCircle,
            },
            occupied: {
                style: "bg-orange-50 text-orange-800 border-orange-200",
                label: "Occupied",
                icon: AlertCircle,
            },
            maintenance: {
                style: "bg-red-50 text-red-800 border-red-200",
                label: "Maintenance",
                icon: Wrench,
            },
            default: {
                style: "bg-gray-50 text-gray-800 border-gray-200",
                label: status,
                icon: Info,
            },
        };
        return configs[status] || configs.default;
    };

    const statusConfig = getStatusConfig(room.status);

    // Facility icons
    const facilityIcons = {
        AC: Thermometer,
        Projector: Monitor,
        "Sound System": Volume2,
        "Wi-Fi": Wifi,
        Parking: Car,
        Coffee: Coffee,
    };

    // Room details
    const roomDetails = {
        description: `${room.name} is a modern, well-equipped space perfect for meetings, presentations, and collaborative work. The room features contemporary design with excellent natural lighting and state-of-the-art facilities.`,
        rules: [
            "No smoking inside the room",
            "Keep the room clean and tidy",
            "Return furniture to original position",
            "Report any damage immediately",
            "Maximum capacity must be respected",
        ],
    };

    // Animation variants
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

    const modalVariants = {
        hidden: {
            y: isMobile ? "100%" : "50%",
            opacity: 0,
            scale: isMobile ? 1 : 0.95,
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            y: isMobile ? "100%" : "50%",
            opacity: 0,
            scale: isMobile ? 1 : 0.95,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/50 z-[190]"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        key={room.id}
                        variants={modalVariants}
                        initial="hidden"
                        animate={isClosing ? "exit" : "visible"}
                        exit="exit"
                        className={`fixed z-[200] bg-white shadow-2xl overflow-hidden ${
                            isMobile
                                ? "inset-0 rounded-t-3xl"
                                : "left-6 right-6 sm:left-12 sm:right-12 md:left-16 md:right-16 lg:left-24 lg:right-24 xl:left-32 xl:right-32 2xl:left-48 2xl:right-48 bottom-0 max-w-6xl mx-auto rounded-t-3xl"
                        }`}
                        style={{
                            height: isMobile ? "100vh" : "90vh",
                            maxHeight: isMobile ? "100vh" : "90vh",
                        }}
                        drag={isMobile ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 100 }}
                        dragElastic={{ top: 0, bottom: 0.1 }}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Drag Handle (Mobile Only) */}
                        {isMobile && (
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full z-10" />
                        )}

                        {/* Header */}
                        <motion.div
                            className={`sticky top-0 z-30 transition-all duration-300 ${
                                isScrolled
                                    ? "bg-white/95 backdrop-blur-md shadow-sm"
                                    : "bg-transparent"
                            }`}
                        >
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 truncate">
                                            {room.name}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.style}`}
                                            >
                                                {statusConfig.label}
                                            </span>
                                            <span className="text-sm text-gray-500 truncate">
                                                {room.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Actions in Header */}
                                <div className="flex items-center gap-3">
                                    {!isMobile && (
                                        <>
                                            <button className="px-4 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors duration-200">
                                                View Schedule
                                            </button>
                                            <button
                                                onClick={handleBook}
                                                disabled={
                                                    room.status !== "available"
                                                }
                                                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                                    room.status === "available"
                                                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-xl"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                <Calendar className="w-4 h-4" />
                                                {room.status === "available"
                                                    ? "Book Now"
                                                    : "Unavailable"}
                                            </button>
                                        </>
                                    )}

                                    {/* Close Button */}
                                    <button
                                        onClick={handleClose}
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scrollable Content */}
                        <div
                            ref={modalContentRef}
                            className={`overflow-y-auto h-full ${
                                isMobile ? "pb-24" : "pb-8"
                            }`}
                            style={{
                                height: isMobile
                                    ? "calc(100vh - 80px)"
                                    : "calc(90vh - 80px)",
                            }}
                        >
                            <div className="p-4 space-y-6">
                                {/* Room Image */}
                                <div className="relative h-64 md:h-96 bg-gray-200 rounded-2xl overflow-hidden">
                                    {room.image ? (
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}
                                    <ImageSkeleton
                                        className={`h-full w-full absolute inset-0 ${
                                            room.image ? "hidden" : "flex"
                                        }`}
                                    />
                                </div>

                                {/* Room Overview */}
                                <div className="bg-gradient-to-r from-primary-light to-primary-light/70 p-6 rounded-2xl">
                                    <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        Room Overview
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {roomDetails.description}
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3">
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
                                                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                                            >
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <item.icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
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

                                {/* Facilities & Rules Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Facilities */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                                            Facilities & Equipment
                                        </h3>
                                        {room.facilities &&
                                        room.facilities.length > 0 ? (
                                            <div className="space-y-3">
                                                {room.facilities.map(
                                                    (facility, idx) => {
                                                        const IconComponent =
                                                            facilityIcons[
                                                                facility
                                                            ] || Info;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-3 p-3 bg-primary-light/20 rounded-xl border border-primary-light/30"
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
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                                    <Info className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">
                                                    No facilities listed
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Contact admin for more
                                                    information
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rules */}
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
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">
                                                            {rule}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Call to Action - Mobile Only */}
                                {isMobile && (
                                    <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-2xl text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">
                                                    Ready to Book {room.name}?
                                                </h3>
                                                <p className="text-white/90 text-sm">
                                                    {room.status === "available"
                                                        ? "Reserve this room for your next meeting or event"
                                                        : `This room is currently ${statusConfig.label.toLowerCase()}`}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-white/30" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Bottom Actions (Mobile Only) */}
                        {isMobile && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors duration-200">
                                        View Schedule
                                    </button>
                                    <button
                                        onClick={handleBook}
                                        disabled={room.status !== "available"}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                            room.status === "available"
                                                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {room.status === "available"
                                            ? "Book Now"
                                            : "Unavailable"}
                                    </button>
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
