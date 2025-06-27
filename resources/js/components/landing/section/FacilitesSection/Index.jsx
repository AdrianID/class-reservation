import React, { useState, useCallback } from "react";
import { Building2, ChevronRight } from "lucide-react";
import FacilitiesDetail from "./FacilitiesDetail";
import { facilities } from "@/data";
import SectionHeader from "@/components/landing/SectionHeader";
import Badge from "@/components/landing/Badge";
import { motion, AnimatePresence } from "framer-motion";

const FacilitiesSection = () => {
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Use useCallback to prevent unnecessary re-renders
    const handleImageIndexChange = useCallback((newIndex) => {
        setCurrentImageIndex(newIndex);
    }, []);

    const handleFacilitySelect = useCallback((facility) => {
        setSelectedFacility(facility);
        setCurrentImageIndex(0); // Reset to first image when opening new facility
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedFacility(null);
        setCurrentImageIndex(0); // Reset index when closing
    }, []);

    const FloatingIcon = ({ facility, index }) => {
        const IconComponent = facility.icon;
        const gradientClasses = [
            "from-primary to-primary-dark",
            "from-primary to-accent-light",
            "from-accent to-accent-dark",
            "from-primary-dark to-accent",
            "from-accent-light to-accent",
        ];

        const animationDelays = [
            "delay-0",
            "delay-300",
            "delay-500",
            "delay-700",
        ];

        const truncateDescription = (text, maxLength = 50) => {
            if (!text) return "";
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength).trim() + "...";
        };

        const handleCardClick = useCallback(
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFacilitySelect(facility);
            },
            [facility]
        );

        return (
            <div
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 group animate-float ${animationDelays[index]}`}
                style={facility.position}
            >
                {/* Icon State - visible by default, hidden on hover (desktop only) */}
                <div className="md:transition-all md:duration-300 md:ease-out md:group-hover:opacity-0 md:group-hover:scale-95">
                    {/* Pulse animation background - desktop only */}
                    <div
                        className={`absolute inset-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${gradientClasses[index]} rounded-full opacity-20 md:animate-ping`}
                    />

                    {/* Main icon container */}
                    <div
                        className={`relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${gradientClasses[index]}
                        rounded-full flex items-center justify-center shadow-xl ring-2 md:ring-4 ring-white/60
                        backdrop-blur-md md:hover:shadow-2xl md:transition-all md:duration-300`}
                        onClick={handleCardClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCardClick(e);
                            }
                        }}
                        aria-label={`Open ${facility.name} details`}
                    >
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
                    </div>
                </div>

                {/* Card State - only show on desktop hover */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:transition-all md:duration-300 md:ease-out opacity-0 scale-95 md:group-hover:opacity-100 md:group-hover:scale-100 pointer-events-none md:group-hover:pointer-events-auto hidden md:block"
                    onClick={handleCardClick}
                >
                    <motion.div
                        onClick={handleCardClick}
                        className="w-80 h-48 rounded-xl shadow-2xl overflow-hidden cursor-pointer md:hover:scale-105 md:transition-transform md:duration-300"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCardClick(e);
                            }
                        }}
                        aria-label={`Open ${facility.name} details`}
                    >
                        {/* Full Background Image */}
                        {facility.gallery && facility.gallery.length > 0 ? (
                            <img
                                src={facility.gallery[0]}
                                alt={facility.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className={`w-full h-full bg-gradient-to-br ${gradientClasses[index]} flex items-center justify-center`}
                            >
                                <IconComponent className="w-16 h-16 text-white opacity-50" />
                            </div>
                        )}

                        {/* Strong overlay gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-xl" />

                        {/* Click indicator */}
                        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300">
                            <ChevronRight className="w-4 h-4 text-white" />
                        </div>

                        {/* Text Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="font-bold text-xl mb-2 leading-tight text-white drop-shadow-lg">
                                {facility.name}
                            </h3>
                            <p className="text-white/95 text-sm leading-relaxed drop-shadow-md">
                                {truncateDescription(facility.description)}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };

    // Mobile Card Component
    const MobileCard = ({ facility, index }) => {
        const IconComponent = facility.icon;
        const gradientClasses = [
            "from-primary to-primary-dark",
            "from-primary to-accent-light",
            "from-accent to-accent-dark",
            "from-primary-dark to-accent",
            "from-accent-light to-accent",
        ];

        const handleCardClick = useCallback(
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFacilitySelect(facility);
            },
            [facility]
        );

        return (
            <div
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 active:scale-95 transition-transform duration-150 cursor-pointer"
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(e);
                    }
                }}
                aria-label={`Open ${facility.name} details`}
            >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    {facility.gallery && facility.gallery.length > 0 ? (
                        <img
                            src={facility.gallery[0]}
                            alt={facility.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-br ${gradientClasses[index]} flex items-center justify-center`}
                        >
                            <IconComponent className="w-16 h-16 text-white opacity-50" />
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Icon badge */}
                    <div
                        className={`absolute top-3 left-3 w-12 h-12 bg-gradient-to-r ${gradientClasses[index]} rounded-full flex items-center justify-center shadow-lg`}
                    >
                        <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Click indicator */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>

                    {/* Gallery indicator */}
                    {facility.gallery && facility.gallery.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                            {facility.gallery.length} photos
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                        {facility.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {facility.description?.substring(0, 80)}...
                    </p>

                    {/* Quick stats */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded-full">
                            {facility.capacity}
                        </span>
                        <span className="text-xs text-gray-500">
                            Tap to explore
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <section className="py-16 relative overflow-hidden bg-white/80 backdrop-blur-sm">
                {/* Background decorative elements - keep float animation */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-accent/5 rounded-full blur-3xl md:animate-pulse" />
                    <div className="absolute bottom-32 right-16 w-40 h-40 bg-primary/8 rounded-full blur-3xl md:animate-pulse" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent-light/10 rounded-full blur-2xl animate-float" />
                </div>

                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-8 md:mb-10">
                        <SectionHeader
                            badge={
                                <Badge icon={Building2}>
                                    Campus Facilities
                                </Badge>
                            }
                            title={
                                <>
                                    <span className="bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
                                        Discover Our Campus Space
                                    </span>
                                    <br />
                                </>
                            }
                            description="Experience our thoughtfully designed spaces through an interactive journey."
                        />
                    </div>

                    {/* Desktop: Interactive 3D Campus Map */}
                    <div className="relative mb-16 hidden md:block">
                        <div className="relative w-full max-w-6xl mx-auto">
                            <div className="relative w-full overflow-hidden">
                                <img
                                    src="/images/landing/map-cropped.svg"
                                    alt="Interactive Campus Map"
                                    className="w-full h-auto object-contain"
                                />

                                {/* Floating facility icons */}
                                {facilities.map((facility, index) => (
                                    <FloatingIcon
                                        key={facility.id}
                                        facility={facility}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Desktop instruction */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Hover over the icons to preview, click to
                                explore in detail
                            </p>
                        </div>
                    </div>

                    {/* Mobile: Card Grid */}
                    <div className="block md:hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {facilities.map((facility, index) => (
                                <MobileCard
                                    key={facility.id}
                                    facility={facility}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Mobile instruction */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Tap any facility card to explore details
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedFacility && (
                    <FacilitiesDetail
                        facility={selectedFacility}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={handleImageIndexChange}
                        onClose={handleModalClose}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default FacilitiesSection;
