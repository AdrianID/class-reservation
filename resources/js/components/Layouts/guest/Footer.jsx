import React from "react";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img
                                src="/images/logo-cropped.svg"
                                alt="LOD University Logo"
                                className="h-16 w-auto"
                            />
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Transforming lives through exceptional education and
                            groundbreaking research for over a century.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                    123 University Ave, Campus City
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">
                                    +1 (555) 123-4567
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">
                                    info@loduniversity.edu
                                </span>
                            </div>
                        </div>
                    </div>

                    {[
                        {
                            title: "Academics",
                            links: [
                                "Programs",
                                "Schools & Colleges",
                                "Online Learning",
                                "Research",
                                "Library",
                            ],
                        },
                        {
                            title: "Campus Life",
                            links: [
                                "Student Services",
                                "Housing",
                                "Activities",
                                "Athletics",
                                "Health Services",
                            ],
                        },
                        {
                            title: "Connect",
                            links: [
                                "Contact Us",
                                "Visit Campus",
                                "Alumni",
                                "News & Events",
                                "Careers",
                            ],
                        },
                    ].map((section, index) => (
                        <div key={index} className="md:ml-12">
                            <h3 className="text-lg font-semibold mb-6 text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-accent transition duration-300 hover:translate-x-1 inline-block"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Enhanced footer bottom */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-accent text-center md:text-left">
                            &copy; 2025 LOD University. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-accent transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-accent transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-accent transition-colors"
                            >
                                Accessibility
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
