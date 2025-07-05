import UserLayout from "@/components/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale"; // Changed to English locale
import {
    CheckCircle,
    X,
    Calendar,
    Clock,
    MapPin,
    Users,
    BookOpen,
    Settings,
    Activity,
    PlusCircle,
    History,
    HelpCircle,
    AlertCircle,
    ChevronRight,
    Bell,
    TrendingUp,
    FileText,
    Monitor,
} from "lucide-react";
import RoomBookingPopup from "./Ruangan/RoomBookingPopup";

export default function Dashboard() {
    const { props } = usePage();
    const user = props.user;
    const faculties = props.faculties || [];
    const buildings = props.buildings || [];

    // Get flash message from Inertia
    const { flash } = usePage().props;

    // State for showing flash message
    const [showFlash, setShowFlash] = useState(!!flash?.message);

    // State for reservation modal
    const [reservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // Auto-hide flash message after 5 seconds
    useEffect(() => {
        if (flash?.message) {
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    // Function to handle reservation menu click
    const handleReservationClick = () => {
        setSelectedCategory("Room Reservation");
        setReservationModalOpen(true);
    };

    // Menu items for classroom universal - Updated with custom color scheme
    const primaryMenuItems = [
        {
            id: "reservasi",
            name: "Room Reservation",
            icon: Calendar,
            description: "Book classrooms and campus facilities",
            active: true,
            onClick: handleReservationClick,
            bgColor: "bg-primary",
            hoverColor: "hover:bg-primary-dark",
        },
        {
            id: "jadwal",
            name: "Class Schedule",
            icon: Clock,
            description: "Manage and view class schedules",
            active: true,
            route: "jadwal.index",
            bgColor: "bg-accent",
            hoverColor: "hover:bg-accent-dark",
        },
        {
            id: "ruangan",
            name: "Room List",
            icon: MapPin,
            description: "Complete information on available rooms",
            active: true,
            route: "ruangan.index",
            bgColor: "bg-primary-dark",
            hoverColor: "hover:bg-primary",
        },
    ];

    const secondaryMenuItems = [
        {
            id: "presensi",
            name: "Attendance",
            icon: Users,
            description: "Attendance and presence system",
            active: false,
            route: null,
        },
        {
            id: "materi",
            name: "Class Materials",
            icon: BookOpen,
            description: "Upload and access learning materials",
            active: false,
            route: null,
        },
        {
            id: "pengaturan",
            name: "Settings",
            icon: Settings,
            description: "Classroom system configuration",
            active: false,
            route: null,
        },
    ];

    // Pending reservation requests
    const [pendingrequests, setPendingRequests] = useState([
        {
            id: "RSV567",
            ruangan: "Engineering Faculty Auditorium",
            tanggal: "2025-05-10T13:00:00",
            durasi: "2 hours",
            tujuan: "Technology Seminar",
            status: "Awaiting Approval",
            estimasi: "1-2 working days",
            priority: "high",
        },
        {
            id: "RSV568",
            ruangan: "Room 301 Building B",
            tanggal: "2025-05-15T10:00:00",
            durasi: "3 hours",
            tujuan: "Student Organization Meeting",
            status: "Awaiting Approval",
            estimasi: "1-2 working days",
            priority: "medium",
        },
    ]);

    // Recent activities - Updated with better structure
    const [activities, setActivities] = useState([
        {
            icon: CheckCircle,
            message:
                "Reservation #RSV123 for Computer Laboratory has been approved",
            timestamp: "2025-05-03T09:30:00",
            type: "success",
            details: "Computer Lab A - 2:00 PM-5:00 PM",
        },
        {
            icon: Calendar,
            message: "Reservation #RSV567 is being processed",
            timestamp: "2025-05-02T14:20:00",
            type: "pending",
            details: "Engineering Faculty Auditorium",
        },
        {
            icon: CheckCircle,
            message: "Reservation #RSV456 has been completed",
            timestamp: "2025-05-01T16:45:00",
            type: "completed",
            details: "Library Discussion Room",
        },
        {
            icon: Clock,
            message: "Web Programming class schedule has been updated",
            timestamp: "2025-04-30T11:20:00",
            type: "info",
            details: "Time change: Monday 8:00 AM-10:00 AM",
        },
    ]);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "MMMM dd, yyyy, h:mm a", { locale: enUS }); // Updated to English format
        } catch (error) {
            return dateString;
        }
    };

    // Status badge colors - Updated with custom colors
    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "bg-accent-light text-primary border border-accent";
            case "pending":
                return "bg-accent text-white border border-accent";
            case "completed":
                return "bg-primary-light text-primary border border-primary";
            case "info":
                return "bg-primary-light text-primary border border-primary-light";
            default:
                return "bg-primary-light text-primary border border-primary-light";
        }
    };

    // Priority colors - Updated with custom colors
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "bg-red-500";
            case "medium":
                return "bg-accent";
            case "low":
                return "bg-accent-light";
            default:
                return "bg-gray-400";
        }
    };

    // Stats data - Enhanced with custom colors
    const statsData = [
        {
            icon: Calendar,
            title: "Total Reservations",
            value: "128",
            change: "+12%",
            trend: "up",
            bgColor: "bg-primary",
        },
        {
            icon: CheckCircle,
            title: "Active Reservations",
            value: "12",
            change: "+3",
            trend: "up",
            bgColor: "bg-accent",
        },
        {
            icon: Clock,
            title: "Pending Processing",
            value: pendingrequests.length,
            change: "0",
            trend: "neutral",
            bgColor: "bg-accent-dark",
        },
        {
            icon: AlertCircle,
            title: "Needs Attention",
            value: "3",
            change: "-1",
            trend: "down",
            bgColor: "bg-red-500",
        },
    ];

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-primary">
                        Classroom Dashboard
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-primary hover:text-primary-dark hover:bg-primary-light rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Classroom Dashboard" />

            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Flash Message */}
                    {showFlash && flash?.message && (
                        <div className="mb-6">
                            <div className="bg-white border-l-4 border-accent p-4 rounded-r-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <p className="ml-3 text-sm text-primary">
                                            {flash.message ||
                                                "Operation successfully completed!"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowFlash(false)}
                                        className="text-primary hover:text-primary-dark transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content - 3 columns */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Welcome Section */}
                            <div className="bg-primary text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl lg:text-3xl font-bold">
                                                Welcome, {user?.name ?? "User"}
                                            </h2>
                                            <p className="mt-2 text-primary-light max-w-2xl">
                                                Integrated classroom management
                                                system for room reservations,
                                                class schedules, attendance, and
                                                learning materials.
                                            </p>
                                            <div className="mt-4 flex items-center text-sm text-primary-light">
                                                <div className="flex items-center mr-6">
                                                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                                                    System Online
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    Last updated:{" "}
                                                    {format(
                                                        new Date(),
                                                        "h:mm a"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden lg:flex items-center">
                                            <Monitor className="h-16 w-16 text-primary-light" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {statsData.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-sm border border-primary-light overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div
                                                    className={`p-3 rounded-lg ${stat.bgColor}`}
                                                >
                                                    <stat.icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center">
                                                        <TrendingUp
                                                            className={`h-4 w-4 mr-1 ${
                                                                stat.trend ===
                                                                "up"
                                                                    ? "text-accent"
                                                                    : stat.trend ===
                                                                      "down"
                                                                    ? "text-red-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                stat.trend ===
                                                                "up"
                                                                    ? "text-accent"
                                                                    : stat.trend ===
                                                                      "down"
                                                                    ? "text-red-500"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {stat.change}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-primary mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl lg:text-3xl font-bold text-primary">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-primary opacity-70 mt-1">
                                                This month
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Menu Classroom - Unified Menu */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-primary">
                                        Classroom Features
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Active Menu Items */}
                                    {primaryMenuItems.map((item) => {
                                        const IconComponent = item.icon;
                                        const CardContent = (
                                            <div className="group relative bg-white rounded-lg shadow-sm border border-primary-light overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                                <div
                                                    className={`h-1 ${item.bgColor}`}
                                                ></div>
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div
                                                            className={`p-3 rounded-lg ${item.bgColor} shadow-lg`}
                                                        >
                                                            <IconComponent className="h-6 w-6 text-white" />
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-primary opacity-40 group-hover:opacity-70 transition-opacity" />
                                                    </div>
                                                    <h3 className="text-lg font Steven text-primary mb-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-primary opacity-80">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );

                                        if (item.onClick) {
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={item.onClick}
                                                    className="text-left w-full"
                                                >
                                                    {CardContent}
                                                </button>
                                            );
                                        } else if (item.route) {
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={route(item.route)}
                                                >
                                                    {CardContent}
                                                </Link>
                                            );
                                        }
                                        return CardContent;
                                    })}

                                    {/* Coming Soon Items */}
                                    {secondaryMenuItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-lg shadow-sm border border-primary-light opacity-60 relative"
                                            >
                                                <div className="h-1 bg-gray-300"></div>
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 rounded-lg bg-primary-light">
                                                            <IconComponent className="h-6 w-6 text-primary opacity-60" />
                                                        </div>
                                                        <span className="text-xs bg-accent-light text-primary px-2 py-1 rounded-full font-medium">
                                                            Coming Soon
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-primary opacity-70 mb-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-primary opacity-50">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Pending Reservations */}
                            <div className="bg-white rounded-lg shadow-sm border border-primary-light">
                                <div className="px-6 py-4 border-b border-primary-light bg-primary-light">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 text-primary mr-2" />
                                            <h2 className="text-lg font-semibold text-primary">
                                                Pending Reservations
                                            </h2>
                                        </div>
                                        <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                            {pendingrequests.length} active
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {pendingrequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {pendingrequests.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="border border-primary-light rounded-lg p-4 hover:bg-primary-light transition-colors"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-2">
                                                                <div
                                                                    className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(
                                                                        request.priority
                                                                    )}`}
                                                                ></div>
                                                                <span className="text-sm font-medium text-accent">
                                                                    #
                                                                    {request.id}
                                                                </span>
                                                                <span className="ml-2 px-2 py-1 text-xs bg-accent-light text-primary rounded-full">
                                                                    {
                                                                        request.status
                                                                    }
                                                                </span>
                                                            </div>
                                                            <h4 className="font-medium text-primary mb-1">
                                                                {
                                                                    request.ruangan
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-primary opacity-80 mb-2">
                                                                {request.tujuan}
                                                            </p>
                                                            <div className="flex items-center text-sm text-primary opacity-70 space-x-4">
                                                                <div className="flex items-center">
                                                                    <Clock className="h-4 w-4 mr-1" />
                                                                    {formatDate(
                                                                        request.tanggal
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span>
                                                                        Duration:{" "}
                                                                        {
                                                                            request.durasi
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-primary opacity-60">
                                                                Estimation
                                                            </p>
                                                            <p className="text-sm font-medium text-primary">
                                                                {
                                                                    request.estimasi
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 text-primary opacity-30" />
                                            <p className="text-primary opacity-70">
                                                No reservations currently being
                                                processed
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-lg shadow-sm border border-primary-light">
                                <div className="px-6 py-4 border-b border-primary-light bg-primary-light">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Activity className="h-5 w-5 text-primary mr-2" />
                                            <h2 className="text-lg font-semibold text-primary">
                                                Recent Activities
                                            </h2>
                                        </div>
                                        <Link
                                            href={route("peminjaman.index")}
                                            className="text-sm text-accent hover:text-accent-dark font-medium"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {activities
                                            .slice(0, 4)
                                            .map((activity, index) => {
                                                const IconComponent =
                                                    activity.icon;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-start space-x-3 py-3 border-b border-primary-light last:border-b-0"
                                                    >
                                                        <div
                                                            className={`p-2 rounded-full ${getStatusColor(
                                                                activity.type
                                                            )}`}
                                                        >
                                                            <IconComponent className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-primary">
                                                                {
                                                                    activity.message
                                                                }
                                                            </p>
                                                            <p className="text-xs text-primary opacity-70 mt-1">
                                                                {
                                                                    activity.details
                                                                }
                                                            </p>
                                                            <p className="text-xs text-primary opacity-50 mt-1">
                                                                {formatDate(
                                                                    activity.timestamp
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-sm border border-primary-light">
                                    <div className="px-6 py-4 border-b border-primary-light bg-primary-light">
                                        <div className="flex items-center">
                                            <PlusCircle className="h-5 w-5 text-primary mr-2" />
                                            <h3 className="text-lg font-semibold text-primary">
                                                Quick Actions
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <button
                                            onClick={handleReservationClick}
                                            className="w-full py-3 px-4 rounded-lg text-white font-medium bg-primary hover:bg-primary-dark transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                                        >
                                            <Calendar className="h-5 w-5 mr-2" />
                                            Room Reservation
                                        </button>
                                        <Link
                                            href={route("peminjaman.index")}
                                            className="w-full py-3 px-4 rounded-lg text-primary font-medium bg-primary-light hover:bg-accent-light transition-colors duration-200 flex items-center justify-center shadow-sm"
                                        >
                                            <History className="h-5 w-5 mr-2" />
                                            View History
                                        </Link>
                                        <Link
                                            href={route("ruangan.index")}
                                            className="w-full py-3 px-4 rounded-lg text-primary font-medium bg-primary-light hover:bg-accent-light transition-colors duration-200 flex items-center justify-center shadow-sm"
                                        >
                                            <MapPin className="h-5 w-5 mr-2" />
                                            Room List
                                        </Link>
                                        <button className="w-full py-3 px-4 rounded-lg text-primary font-medium bg-primary-light hover:bg-accent-light transition-colors duration-200 flex items-center justify-center shadow-sm">
                                            <HelpCircle className="h-5 w-5 mr-2" />
                                            Help
                                        </button>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-primary-light rounded-lg border border-primary p-6">
                                    <div className="flex items-center mb-3">
                                        <FileText className="h-5 w-5 text-primary mr-2" />
                                        <h3 className="font-semibold text-primary">
                                            Tips & Information
                                        </h3>
                                    </div>
                                    <ul className="space-y-2 text-sm text-primary">
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                            Reservations can be made up to 7
                                            days in advance
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                            Automatic confirmation within 1-2
                                            working days
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                            Contact admin for urgent
                                            reservations
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reservation Modal */}
            {reservationModalOpen && (
                <RoomBookingPopup
                    initialCategory={selectedCategory}
                    onClose={() => setReservationModalOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}
        </UserLayout>
    );
}
