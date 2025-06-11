import ApplicationLogo from "@/components/shared/ApplicationLogo";
import React, { useState, useEffect } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        handleResize(); // Check initial size

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const navItems = [
        { name: "Home", href: "#home" },
        { name: "Programs", href: "#programs" },
        { name: "About", href: "#about" },
        { name: "Admissions", href: "#admissions" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <nav
            className={`bg-[#365b6d] border-b border-gray-200 sticky top-0 z-[180] transition-all duration-300 ${
                scrolled ? "shadow-lg" : ""
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo Banner Section */}
                        <div className="relative lg:ml-5">
                            {!isMobile && (
                                <div
                                    className={`absolute bg-white rounded-b-3xl shadow-md transition-all duration-500 ease-in-out overflow-hidden
                                        ${
                                            scrolled
                                                ? "h-0 w-36 opacity-0 translate-y-[-100%]"
                                                : "h-36 w-36 opacity-100 translate-y-0"
                                        }
                                    `}
                                >
                                    <div className="flex justify-center pt-2">
                                        <a href="#home">
                                            <ApplicationLogo
                                                className={`transition-all duration-500 ${
                                                    scrolled
                                                        ? "h-12 w-auto"
                                                        : "h-32 w-auto"
                                                }`}
                                                variant="default"
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div
                                className={`flex items-center h-16 transition-all duration-300 ${
                                    scrolled || isMobile
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <a href="#home">
                                    <ApplicationLogo
                                        className="h-28 w-[144px] flex justify-center"
                                        variant="white-logo-box"
                                    />
                                </a>
                            </div>

                            <div
                                className={`transition-all duration-300 ${
                                    !scrolled && !isMobile ? "w-36" : "w-16"
                                }`}
                            ></div>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-300 hover:border-accent hover:text-accent transition-all duration-300"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Auth Buttons */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <a
                            href="/login"
                            className="bg-white text-[#365b6d] px-4 py-2 rounded-full hover:bg-accent transition-all duration-300 hover:shadow-lg font-semibold"
                        >
                            Classroom
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 text-white hover:text-accent transition-colors"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        isMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="sm:hidden bg-[#365b6d] border-t border-gray-600">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="border-t border-gray-600 pt-3 mt-3">
                                <a
                                    href="/login"
                                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="block mx-3 mt-2 bg-white text-[#365b6d] px-4 py-2 rounded-full hover:bg-gray-100 transition-all font-semibold text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
