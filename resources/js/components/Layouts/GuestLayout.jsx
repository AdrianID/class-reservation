import Navbar from "./guest/Navbar";
import Footer from "./guest/Footer";
import ApplicationLogo from "@/components/shared/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

export default function GuestLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleScroll();
        handleResize();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [scrolled]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
