import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function MahasiswaLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Current route check helper
    const isCurrentRoute = (routeName) => route().current(routeName);

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
            <nav
                className={`bg-[#365b6d] border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
                    scrolled ? "shadow-md" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo Banner Section */}
                            <div className="relative">
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
                                            <Link href={route("dashboard")}>
                                                <ApplicationLogo
                                                    className={`transition-all duration-500 ${
                                                        scrolled
                                                            ? "h-12 w-auto"
                                                            : "h-32 w-auto"
                                                    }`}
                                                    variant="default"
                                                />
                                            </Link>
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
                                    <Link href={route("dashboard")}>
                                        <ApplicationLogo
                                            className="h-28 w-[144px] flex justify-center"
                                            variant="white-logo-box"
                                        />
                                    </Link>
                                </div>

                                <div
                                    className={`transition-all duration-300 ${
                                        !scrolled && !isMobile ? "w-36" : "w-16"
                                    }`}
                                ></div>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href={route("dashboard")}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isCurrentRoute("dashboard")
                                            ? "border-indigo-500 text-white"
                                            : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-100"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("ruangan.index")}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isCurrentRoute("ruangan.index")
                                            ? "border-indigo-500 text-white"
                                            : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-100"
                                    }`}
                                >
                                    Ruangan
                                </Link>
                                {/* <Link
                                    href={route("peminjaman.index")}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isCurrentRoute("peminjaman.index")
                                            ? "border-indigo-500 text-white"
                                            : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-100"
                                    }`}
                                >
                                    Peminjaman
                                </Link> */}
                                {/* tambahkan menu lain di sini */}
                            </div>
                        </div>

                        {/* Right: User Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-white hover:text-gray-200">
                                        <div>{user.name}</div>
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414
                        1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center justify-center p-2 text-white hover:text-gray-200">
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
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("dashboard")}>
                                        Dashboard
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("peminjaman.index")}
                                    >
                                        Peminjaman
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional Header */}
            {header && (
                <header className="bg-transparent">
                    <div className="max-w-7xl mx-auto flex justify-end p-7 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
