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
    Building,
    Home,
    MapPin,
} from "lucide-react";

export default function AdminLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth.user;
    const selectedFaculty = props.selectedFaculty;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    // Current route check helper
    const isCurrentRoute = (routeName) => {
        const currentPath = window.location.pathname;
        return currentPath.includes(routeName.split(".").pop());
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            const tablet = width >= 768 && width < 1024;
            const desktop = width >= 1024;

            setIsMobile(mobile);
            setIsTablet(tablet);

            // Auto-close sidebar on mobile, auto-open on desktop
            if (mobile) {
                setSidebarOpen(false);
            } else if (desktop) {
                setSidebarOpen(true);
            }

            // Close mobile search when resizing
            if (!mobile) {
                setMobileSearchOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (userDropdownOpen && !event.target.closest(".user-dropdown")) {
                setUserDropdownOpen(false);
            }
            if (
                facultyDropdownOpen &&
                !event.target.closest(".faculty-dropdown")
            ) {
                setFacultyDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [userDropdownOpen, facultyDropdownOpen]);

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
            icon: <Building size={20} />,
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
            icon: <BookOpen size={20} />,
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

    // Filter menu items based on search
    const filteredMenuItems = menuItems.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSubmenu = item.submenu?.some((sub) =>
            sub.name.toLowerCase().includes(query)
        );
        return matchesName || matchesSubmenu;
    });

    const sidebarTransform = sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full";

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Sidebar Overlay for Mobile/Tablet */}
            {(isMobile || isTablet) && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-primary text-white fixed inset-y-0 left-0 z-30 w-64 h-screen transform transition-all duration-300 ease-in-out flex flex-col lg:sticky lg:top-0 lg:translate-x-0 shadow-2xl ${sidebarTransform}`}
            >
                {/* Sidebar Header */}
                <div className="h-16 sm:h-20 flex items-center justify-between px-3 sm:px-4 border-b border-primary-light border-opacity-20">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
                    >
                        <ApplicationLogo
                            className="h-10 md:h-full w-auto flex-shrink-0"
                            variant="white-logo-cropped"
                        />
                    </Link>
                    {(isMobile || isTablet) && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary-light hover:bg-opacity-20 transition-colors duration-200 flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Search in Sidebar */}
                <div className="px-3 py-3 sm:py-4 border-b border-primary-light border-opacity-20">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light opacity-70"
                        />
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-primary-dark bg-opacity-30 border border-primary-light border-opacity-20 rounded-lg placeholder-primary-light placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-3 sm:py-4 space-y-1 sm:space-y-2 overflow-y-auto">
                    {filteredMenuItems.map((item, index) => (
                        <div key={item.name}>
                            {item.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(index)}
                                        className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-lg group transition-all duration-200 ${
                                            activeSubmenu === index
                                                ? "bg-primary-light bg-opacity-20 text-white shadow-sm"
                                                : "text-gray-100 hover:bg-primary-light hover:bg-opacity-10 hover:text-white"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                            <span className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
                                                {item.icon}
                                            </span>
                                            <span className="truncate">
                                                {item.name}
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className={`transition-transform duration-200 flex-shrink-0 ${
                                                activeSubmenu === index
                                                    ? "rotate-90"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            activeSubmenu === index
                                                ? "max-h-96 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="pl-8 sm:pl-12 pr-3 sm:pr-4 py-2 space-y-1">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.name}
                                                    href={subitem.href}
                                                    className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                                                        isCurrentRoute(
                                                            subitem.route
                                                        )
                                                            ? "bg-white bg-opacity-15 text-white font-medium shadow-sm"
                                                            : "text-gray-200 hover:bg-primary-light hover:bg-opacity-10 hover:text-white"
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {subitem.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-lg group transition-all duration-200 ${
                                        isCurrentRoute(item.route)
                                            ? "bg-primary-light bg-opacity-20 text-white shadow-sm"
                                            : "text-gray-100 hover:bg-primary-light hover:bg-opacity-10 hover:text-white"
                                    }`}
                                >
                                    <span className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
                                        {item.icon}
                                    </span>
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="mt-auto border-t border-primary-light border-opacity-20 p-3 sm:p-4">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-danger-dark rounded-lg transition-colors duration-200"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            {/* Left side: Hamburger, Title, and Faculty */}
                            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 lg:hidden transition-colors duration-200 flex-shrink-0"
                                >
                                    <Menu size={20} />
                                </button>

                                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                                    <div className="min-w-0">
                                        <h1 className="text-lg sm:text-xl font-bold text-primary truncate">
                                            Admin Panel
                                        </h1>
                                    </div>

                                    {/* Faculty Selector - Hide on mobile */}
                                    {selectedFaculty && (
                                        <div className="relative faculty-dropdown hidden sm:block">
                                            <button
                                                onClick={() =>
                                                    setFacultyDropdownOpen(
                                                        !facultyDropdownOpen
                                                    )
                                                }
                                                className="flex items-center space-x-2 px-3 py-2 bg-primary-light bg-opacity-10 rounded-lg hover:bg-primary-light hover:bg-opacity-20 transition-colors duration-200 border border-primary-light border-opacity-20"
                                            >
                                                <MapPin
                                                    size={16}
                                                    className="text-primary flex-shrink-0"
                                                />
                                                <div className="text-left min-w-0">
                                                    <p className="text-xs text-primary opacity-80">
                                                        Fakultas
                                                    </p>
                                                    <p className="text-sm font-medium text-primary truncate max-w-24 lg:max-w-32">
                                                        {
                                                            selectedFaculty.faculty_name
                                                        }
                                                    </p>
                                                </div>
                                                <ChevronDown
                                                    size={14}
                                                    className="text-primary flex-shrink-0"
                                                />
                                            </button>

                                            {facultyDropdownOpen && (
                                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Fakultas Aktif
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {
                                                                selectedFaculty.faculty_name
                                                            }
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={route(
                                                            "faculty.selection"
                                                        )}
                                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors duration-200"
                                                        onClick={() =>
                                                            setFacultyDropdownOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Building size={16} />
                                                        <span>
                                                            Ganti Fakultas
                                                        </span>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right side: Search, Notifications, and User */}
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {/* Mobile Search Toggle */}
                                <button
                                    onClick={() =>
                                        setMobileSearchOpen(!mobileSearchOpen)
                                    }
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200 md:hidden"
                                >
                                    <Search size={20} />
                                </button>

                                {/* Desktop Search */}
                                <div className="relative hidden md:block">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari ruangan, booking..."
                                        className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                                    />
                                </div>

                                {/* Notifications */}
                                <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200">
                                    <Bell size={20} />
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                                        3
                                    </span>
                                </button>

                                {/* User Menu */}
                                <div className="relative user-dropdown">
                                    <button
                                        onClick={() =>
                                            setUserDropdownOpen(
                                                !userDropdownOpen
                                            )
                                        }
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                            <User size={16} />
                                        </div>
                                        <div className="hidden sm:block text-left min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-24 lg:max-w-32">
                                                {user.full_name}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className="text-gray-500 hidden sm:block"
                                        />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100 space-y-2">
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {user.full_name}
                                                    </p>
                                                    <RoleBadge
                                                        user={user}
                                                        size="sm"
                                                        variant="outline"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            {/* Mobile Faculty Selector */}
                                            {selectedFaculty && (
                                                <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <MapPin
                                                            size={14}
                                                            className="text-primary"
                                                        />
                                                        <p className="text-xs text-gray-500">
                                                            Fakultas
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {
                                                            selectedFaculty.faculty_name
                                                        }
                                                    </p>
                                                    <Link
                                                        href={route(
                                                            "faculty.selection"
                                                        )}
                                                        className="text-xs text-primary hover:underline"
                                                        onClick={() =>
                                                            setUserDropdownOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Ganti Fakultas
                                                    </Link>
                                                </div>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <User size={16} />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                href="/admin/settings"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <Settings size={16} />
                                                <span>Pengaturan</span>
                                            </Link>
                                            <hr className="my-1" />
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-danger hover:bg-danger-light hover:text-danger-dark transition-colors duration-200"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Search Bar */}
                        {mobileSearchOpen && (
                            <div className="mt-3 md:hidden">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari ruangan, booking..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Breadcrumb/Sub Header */}
                {header && (
                    <div className="bg-white border-b border-gray-200">
                        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3">
                            {header}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-3 sm:p-4 lg:p-6 xl:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
