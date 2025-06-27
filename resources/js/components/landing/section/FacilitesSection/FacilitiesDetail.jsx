import React, { useEffect, useRef } from "react";
import {
    Users,
    Camera,
    ArrowRight,
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";

const FacilitiesDetail = ({
    facility,
    currentImageIndex,
    setCurrentImageIndex,
    onClose,
}) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    if (!facility) return null;

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                prevImage();
            } else if (e.key === "ArrowRight") {
                nextImage();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Simplified backdrop click handler
    const handleBackdropClick = (e) => {
        if (e.target === backdropRef.current) {
            onClose();
            return;
        }

        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === facility.gallery.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? facility.gallery.length - 1 : prev - 1
        );
    };

    return (
        <div className="fixed inset-0 z-[200]">
            {/* Backdrop - This is what should be clicked to close */}
            <motion.div
                ref={backdropRef}
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-black/60"
                onClick={handleBackdropClick}
            />

            {/* Modal Container - centered content */}
            <div className="relative z-10 flex items-center justify-center w-full h-full p-4 pointer-events-none">
                <motion.div
                    layoutId={`facility-${facility.id}`}
                    ref={modalRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto"
                >
                    <div className="relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Gallery */}
                        <div className="relative h-80 overflow-hidden">
                            <div className="relative w-full h-full">
                                <img
                                    src={facility.gallery[currentImageIndex]}
                                    alt={`${facility.name} - Image ${
                                        currentImageIndex + 1
                                    }`}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            {facility.gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} /{" "}
                                {facility.gallery.length}
                            </div>

                            {/* Thumbnail dots for navigation */}
                            {facility.gallery.length > 1 &&
                                facility.gallery.length <= 10 && (
                                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {facility.gallery.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentImageIndex(index)
                                                }
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    index === currentImageIndex
                                                        ? "bg-white scale-125"
                                                        : "bg-white/50 hover:bg-white/75"
                                                }`}
                                                aria-label={`Go to image ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1 pr-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {facility.name}
                                    </h3>
                                    <p className="text-lg text-accent italic mb-4">
                                        {facility.subtitle}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        {facility.description}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="bg-accent-light/20 px-4 py-2 rounded-xl border border-accent/20">
                                        <Users className="w-5 h-5 text-accent mx-auto mb-1" />
                                        <span className="text-sm font-medium text-primary whitespace-nowrap">
                                            {facility.capacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Atmosphere */}
                            <div className="mb-6">
                                <div className="inline-flex items-center px-4 py-2 bg-primary-light/30 rounded-lg border border-primary/10">
                                    <span className="text-sm font-medium text-primary">
                                        Atmosphere: {facility.atmosphere}
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    Key Features
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {facility.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 bg-primary-light/20 px-3 py-2 rounded-lg border border-primary/10"
                                        >
                                            <Star className="w-4 h-4 text-accent flex-shrink-0" />
                                            <span className="text-sm text-primary">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    Statistics
                                </h4>
                                <div className="flex flex-wrap gap-6">
                                    {Object.entries(facility.stats).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="text-center"
                                            >
                                                <div className="text-2xl font-bold text-accent">
                                                    {value}
                                                </div>
                                                <div className="text-sm text-gray-500 capitalize">
                                                    {key.replace("_", " ")}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center group">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book This Space
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-6 py-3 border border-accent/30 text-accent rounded-xl font-medium hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center">
                                    <Camera className="w-5 h-5 mr-2" />
                                    Virtual Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FacilitiesDetail;
