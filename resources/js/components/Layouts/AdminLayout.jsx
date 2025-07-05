import ApplicationLogo from "@/components/shared/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import RoleBadge from "@/components/auth/RoleBadge";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Bell,
    User,
    Search,
} from "lucide-react";

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    // Brand color
    const brandColor = "#365b6d";

    // Current route check helper
    const isCurrentRoute = (routeName) => {
        // Get current URL path
        const currentPath = window.location.pathname;

        // For demonstration purposes only - replace with actual route checking when routes are defined
        return currentPath.includes(routeName.split(".").pop());
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setSidebarOpen(true);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSubmenu = (index) => {
        setActiveSubmenu(activeSubmenu === index ? null : index);
    };

    const menuItems = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            route: "dashboard",
            href: "/admin/dashboard",
        },
        {
            name: "Manajemen Ruangan",
            icon: <BookOpen size={20} />,
            route: "ruangan",
            href: "#",
            submenu: [
                {
                    name: "Daftar Ruangan",
                    route: "ruangan.index",
                    href: "/admin/ruangan",
                },
                {
                    name: "Tambah Ruangan",
                    route: "ruangan.create",
                    href: "/admin/ruangan/create",
                },
            ],
        },
        {
            name: "Manajemen Booking",
            icon: <Calendar size={20} />,
            route: "booking",
            href: "#",
            submenu: [
                {
                    name: "Daftar Booking",
                    route: "booking.index",
                    href: "/admin/booking",
                },
                {
                    name: "Kalender",
                    route: "calendar.index",
                    href: "/admin/calendar",
                },
            ],
        },
        {
            name: "Jadwal",
            icon: <Calendar size={20} />,
            route: "jadwal",
            href: "#",
            submenu: [
                {
                    name: "Lihat Jadwal",
                    route: "jadwal.index",
                    href: "/admin/jadwal",
                },
                {
                    name: "Atur Jadwal",
                    route: "jadwal.manage",
                    href: "/admin/jadwal/manage",
                },
                {
                    name: "Kalender",
                    route: "calendar.index",
                    href: "/admin/calendar",
                },
            ],
        },
        {
            name: "Pengguna",
            icon: <Users size={20} />,
            route: "users",
            href: "#",
            submenu: [
                {
                    name: "Mahasiswa",
                    route: "users.mahasiswa",
                    href: "/admin/users/mahasiswa",
                },
                {
                    name: "Dosen",
                    route: "users.dosen",
                    href: "/admin/users/dosen",
                },
                {
                    name: "Staff",
                    route: "users.staff",
                    href: "/admin/users/staff",
                },
            ],
        },
        {
            name: "Pengaturan",
            icon: <Settings size={20} />,
            route: "settings",
            href: "/admin/settings",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex relative">
            {/* Sidebar Overlay for Mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-[#365b6d] text-white fixed inset-y-0 left-0 z-30 w-64 h-screen transform transition-transform duration-300 ease-in-out flex flex-col lg:sticky lg:top-0 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Sidebar Logo - Centered */}
                <div className="h-20 flex items-center justify-center border-b border-opacity-20 border-white">
                    <Link
                        href="/admin/dashboard"
                        className="flex flex-col items-center"
                    >
                        <ApplicationLogo
                            className="h-80 w-auto mb-1"
                            variant="white-logo-text"
                        />
                    </Link>
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="absolute right-2 top-2 text-gray-300 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Sidebar Menu - Takes remaining space */}
                <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto pb-4">
                    {menuItems.map((item, index) => (
                        <div key={item.name} className="mb-1">
                            {item.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(index)}
                                        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md group transition-colors duration-200 ${
                                            activeSubmenu === index
                                                ? "bg-white bg-opacity-20 text-white"
                                                : "text-gray-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-3">
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </div>
                                        {activeSubmenu === index ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </button>
                                    {activeSubmenu === index && (
                                        <div className="pl-10 mt-1 space-y-1">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.name}
                                                    href={subitem.href}
                                                    className={`block px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                        isCurrentRoute(
                                                            subitem.route
                                                        )
                                                            ? "bg-white bg-opacity-20 text-white"
                                                            : "text-gray-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                                                    }`}
                                                >
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                        isCurrentRoute(item.route)
                                            ? "bg-white bg-opacity-20 text-white"
                                            : "text-gray-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Logout fixed at bottom */}
                <div className="mt-auto border-t border-white border-opacity-20 p-4">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-4 py-3 text-sm text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm z-20">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        {/* Left side: Hamburger and Title */}
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-500 focus:outline-none lg:hidden"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="ml-4 text-lg font-medium text-[#365b6d]">
                                Admin Dashboard
                            </h2>
                        </div>

                        {/* Right side: Search and User */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#365b6d] focus:border-[#365b6d]"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none">
                                <Bell size={20} />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserDropdownOpen(!userDropdownOpen)
                                    }
                                    className="flex items-center space-x-2 text-sm focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#365b6d] text-white flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <span className="hidden md:inline-block font-medium text-gray-700">
                                        {user.full_name}
                                    </span>
                                    <RoleBadge user={user} size="sm" variant="outline" />
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-500"
                                    />
                                </button>

                                {/* Dropdown */}
                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setUserDropdownOpen(false)
                                            }
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setUserDropdownOpen(false)
                                            }
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Optional Sub Header */}
                {header && (
                    <div className="bg-white border-b border-gray-200">
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            {header}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
