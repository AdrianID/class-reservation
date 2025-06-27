import React from "react";
import { ArrowUpRight } from "lucide-react";

const limitWords = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords
        ? words.slice(0, maxWords).join(" ") + "..."
        : text;
};

const ProgramCard = ({
    icon,
    title,
    description,
    courses,
    color,
    image,
    isModalOpen,
    onLearnMore,
}) => {
    const shortDescription = limitWords(description, 10);

    return (
        <div className="relative group perspective-1000">
            {/* Floating Image */}
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <img
                    src={image}
                    alt={title}
                    className={`w-64 h-64 object-contain transform transition-all duration-700 scale-90 ${
                        isModalOpen
                            ? "opacity-0"
                            : "opacity-0 md:group-hover:opacity-100 md:group-hover:scale-125 md:group-hover:-rotate-3 md:group-hover:-translate-y-16"
                    }`}
                    style={{
                        filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4))",
                    }}
                />
            </div>

            {/* Learn More Button */}
            {!isModalOpen && (
                <div className="absolute top-5 right-5 md:top-4  md:-right-9 z-[90] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 delay-100">
                    <div
                        className="flex items-center gap-2 bg-primary px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary-dark text-white transform translate-x-0 md:translate-x-14 md:group-hover:translate-x-0 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLearnMore();
                        }}
                    >
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-100/50 rounded-2xl overflow-hidden transition-all duration-500 md:group-hover:shadow-2xl md:group-hover:-translate-y-6 md:group-hover:rotate-1 backdrop-blur-sm h-80 md:group-hover:shadow-black/20">
                {/* Background Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={image}
                        alt={title}
                        className={`w-64 h-64 object-contain transform transition-all duration-700 ${
                            isModalOpen
                                ? "opacity-0"
                                : "opacity-30 md:group-hover:opacity-0 md:group-hover:scale-110 md:group-hover:-rotate-2"
                        }`}
                    />
                </div>

                {/* Color Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r ${color} ${
                        isModalOpen
                            ? "opacity-0"
                            : "opacity-5 md:group-hover:opacity-15"
                    } transition-opacity duration-300`}
                ></div>

                {/* Backdrop Blur */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] md:group-hover:backdrop-blur-0 md:group-hover:bg-transparent transition-all duration-300"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col transition-all duration-500 ease-out transform md:group-hover:translate-y-48">
                    <div className="p-6 space-y-4 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-4 md:group-hover:opacity-0 transition-opacity duration-300">
                            <div
                                className={`p-2 rounded-lg bg-gradient-to-r ${color} text-white shadow-lg transform md:group-hover:scale-110 transition-transform duration-300`}
                            >
                                {icon}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-primary transition-colors md:group-hover:text-primary-dark">
                            {title}
                        </h3>

                        <p className="text-gray-700 leading-relaxed text-sm md:group-hover:opacity-0 transition-opacity duration-300">
                            {shortDescription}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 md:group-hover:opacity-0 transition-opacity duration-300">
                            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                {courses}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ground Shadow */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/15 rounded-full blur-xl opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:group-hover:w-56 md:group-hover:h-16 md:group-hover:-bottom-16"></div>
        </div>
    );
};

export default ProgramCard;
