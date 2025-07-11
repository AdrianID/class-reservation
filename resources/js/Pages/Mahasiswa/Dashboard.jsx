import React from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Bell,
    Calendar,
    CalendarSearchIcon,
    CheckCircle,
    CheckSquare,
    ChevronRight,
    ClipboardPlusIcon,
    Clock,
    Edit,
    Eye,
    HelpCircle,
    History,
    Info,
    MapPin,
    Menu,
    Monitor,
    PlusCircle,
    Trash2,
    TrendingUp,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import RoomBookingModal from "./Ruangan/modal/RoomBookingModal";

// Consolidated data imports
import {
    primaryMenuItems,
    secondaryMenuItems,
    pendingRequestsData,
    activitiesData,
    statsData,
} from "../dashboardData";

// Utility Functions
const getStatusColor = (status) => {
    const statusColors = {
        success: "bg-success-light text-success-dark border-success",
        pending: "bg-warning-light text-warning-dark border-warning",
        completed: "bg-primary-light text-primary border-primary/50",
        approved: "bg-success-light text-success-dark border-success",
        rejected: "bg-danger-light text-danger-dark border-danger",
        info: "bg-primary-light text-primary border-primary/50",
    };
    return (
        statusColors[status] ||
        "bg-disable-light text-disable-dark border-disable"
    );
};

const getStatusIcon = (status) => {
    const statusIcons = {
        pending: <Clock className="h-4 w-4" />,
        approved: <CheckCircle className="h-4 w-4" />,
        rejected: <XCircle className="h-4 w-4" />,
        completed: <CheckSquare className="h-4 w-4" />,
    };
    return statusIcons[status] || <AlertTriangle className="h-4 w-4" />;
};

const getPriorityColor = (priority) => {
    const priorityColors = {
        high: "bg-danger",
        medium: "bg-warning",
        low: "bg-success",
    };
    return priorityColors[priority] || "bg-disable";
};

const getPriorityText = (priority) => {
    const priorityTexts = {
        high: "High Priority",
        medium: "Medium Priority",
        low: "Low Priority",
    };
    return priorityTexts[priority] || "Normal";
};

// Main Dashboard Component
export default function Dashboard() {
    const { props } = usePage();
    const { user, faculties, buildings, flash } = props;

    const [showFlash, setShowFlash] = useState(!!flash?.message);
    const [reservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedCategory] = useState("Room Reservation");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Auto-hide flash message after 5 seconds
    useEffect(() => {
        if (flash?.message) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    const handleReservationClick = () => {
        setReservationModalOpen(true);
        setIsMenuOpen(false);
    };

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "MMM dd, yyyy • h:mm a", { locale: enUS });
        } catch {
            return dateString;
        }
    };

    // Reusable Components
    const StatusBadge = ({ status }) => (
        <div
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                status
            )}`}
        >
            <div className="flex items-center">
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </div>
        </div>
    );

    const StatsCard = ({ stat }) => {
        return (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-disable-light hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} shadow-sm`}
                    >
                        {React.createElement(stat.icon, {
                            className: "h-4 w-4 sm:h-6 sm:w-6 text-white",
                        })}
                    </div>
                    <div className="flex items-center">
                        <TrendingUp
                            className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${
                                stat.trend === "up"
                                    ? "text-success"
                                    : stat.trend === "down"
                                    ? "text-danger"
                                    : "text-disable"
                            }`}
                        />
                        <span
                            className={`text-xs sm:text-sm font-semibold ${
                                stat.trend === "up"
                                    ? "text-success-dark"
                                    : stat.trend === "down"
                                    ? "text-danger-dark"
                                    : "text-disable-dark"
                            }`}
                        >
                            {stat.change}
                        </span>
                    </div>
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-disable-dark mb-1 sm:mb-2">
                    {stat.title}
                </h3>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                </p>
                <p className="text-xs text-disable">This month</p>
            </div>
        );
    };

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="xl:hidden mr-3 p-2 text-disable-dark hover:bg-disable-light rounded-lg"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h2 className="text-2xl font-bold text-primary">
                            Dashboard
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="relative p-2.5 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-accent rounded-full"></span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Classroom Dashboard" />

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-10 animate-slideInLeft">
                        <div className="p-6 border-b border-disable-light">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-primary">
                                    Menu
                                </h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-disable-dark hover:text-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={handleReservationClick}
                                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-white font-semibold bg-primary"
                                >
                                    <span>New Reservation</span>
                                    <Calendar className="h-5 w-5" />
                                </button>
                                <div className="space-y-2">
                                    {primaryMenuItems.map((item) => (
                                        <Link
                                            key={item.link}
                                            href={item.link}
                                            className="flex items-center p-3 rounded-lg hover:bg-disable-light text-disable-dark font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5 mr-3" />
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-sm font-medium text-disable-dark uppercase mb-3">
                                Other
                            </h4>
                            <div className="space-y-2">
                                {secondaryMenuItems.map((item) => (
                                    <Link
                                        key={item.link}
                                        href={item.link}
                                        className="flex items-center p-3 rounded-lg hover:bg-disable-light text-disable-dark font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button for Mobile */}
            <button
                onClick={handleReservationClick}
                className="fixed bottom-6 right-6 z-40 xl:hidden p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all"
            >
                <PlusCircle className="h-6 w-6" />
            </button>

            <div className="min-h-screen bg-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Flash Message */}
                    {showFlash && flash?.message && (
                        <div className="mb-8">
                            <div className="bg-white border border-success rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-success-dark flex-shrink-0" />
                                        <p className="ml-3 text-sm font-medium text-gray-800">
                                            {flash.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowFlash(false)}
                                        className="text-disable hover:text-disable-dark transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-primary  to-primary-dark rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <div className="w-2 h-2 bg-success rounded-full mr-3 animate-pulse"></div>
                                        <span className="text-primary-light text-sm font-medium">
                                            System Online
                                        </span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                                        Welcome back, {user?.name || "User"}!
                                    </h1>
                                    <p className="text-lg sm:text-xl text-primary-light mb-6 max-w-2xl leading-relaxed">
                                        Manage your classroom reservations and
                                        schedules all in one place.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-primary-light">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Last updated:{" "}
                                            {format(new Date(), "h:mm a")}
                                        </div>
                                        <div className="flex items-center">
                                            <Activity className="h-4 w-4 mr-2" />
                                            All systems operational
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <Monitor className="h-20 w-20 text-primary-light opacity-80" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions for Mobile */}
                    <div className="xl:hidden mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-disable-light">
                            <div className="p-5">
                                <div className="flex items-center mb-4">
                                    <Zap className="h-5 w-5 text-primary mr-3" />
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Quick Actions
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleReservationClick}
                                        className="py-3 px-4 rounded-xl text-white font-semibold bg-primary hover:bg-primary-dark transition-all duration-200 flex flex-col items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <ClipboardPlusIcon className="h-5 w-5 mb-2" />
                                        <span className="text-sm">
                                            New Reservation
                                        </span>
                                    </button>
                                    <Link
                                        href={route("ruangan.index")}
                                        className="py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center justify-center"
                                    >
                                        <History className="h-5 w-5 mb-2" />
                                        <span className="text-sm">
                                            View History
                                        </span>
                                    </Link>
                                    <Link
                                        empel
                                        href={route("jadwal.index")}
                                        className="py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center justify-center"
                                    >
                                        <CalendarSearchIcon className="h-5 w-5 mb-2" />
                                        <span className="text-sm">
                                            Room Schedules
                                        </span>
                                    </Link>
                                    <button className="py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center justify-center">
                                        <HelpCircle className="h-5 w-5 mb-2" />
                                        <span className="text-sm">
                                            Get Help
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                                {statsData.map((stat) => (
                                    <StatsCard key={stat.title} stat={stat} />
                                ))}
                            </div>

                            {/* Pending Reservations */}
                            <div className="bg-white rounded-xl shadow-sm border border-disable-light overflow-hidden">
                                <div className="p-5 sm:p-6 border-b border-disable-light bg-primary-light/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                        <div className="flex items-center mb-3 sm:mb-0">
                                            <div className="p-2 bg-primary/20 rounded-lg mr-3">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                                    Pending Reservations
                                                </h2>
                                                <p className="text-xs sm:text-sm text-disable-dark">
                                                    Reservations awaiting
                                                    approval
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="bg-warning-light text-warning-dark text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                                                {pendingRequestsData.length}{" "}
                                                pending
                                            </span>
                                            <Link
                                                href={route("ruangan.index")}
                                                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                                            >
                                                View All
                                                <ArrowRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6">
                                    {pendingRequestsData.length > 0 ? (
                                        <div className="space-y-4">
                                            {pendingRequestsData.map(
                                                (request) => (
                                                    <div
                                                        key={request.id}
                                                        className="group bg-disable-light border border-disable rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="flex items-center">
                                                                            <div
                                                                                className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(
                                                                                    request.priority
                                                                                )}`}
                                                                            ></div>
                                                                            <span className="text-xs sm:text-sm font-semibold text-primary">
                                                                                #
                                                                                {
                                                                                    request.id
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <StatusBadge
                                                                            status={
                                                                                request.status
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                        <button className="p-1 sm:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                        </button>
                                                                        <button className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                        </button>
                                                                        <button className="p-1 sm:p-2 text-danger hover:bg-danger-light rounded-lg transition-colors">
                                                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
                                                                    {
                                                                        request.ruangan
                                                                    }
                                                                </h4>
                                                                <p className="text-xs sm:text-sm text-disable-dark mb-4 leading-relaxed">
                                                                    {
                                                                        request.tujuan
                                                                    }
                                                                </p>
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                                                                    <div className="flex items-center text-disable-dark">
                                                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary" />
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                Date
                                                                                &
                                                                                Time
                                                                            </p>
                                                                            <p>
                                                                                {formatDate(
                                                                                    request.tanggal
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center text-disable-dark">
                                                                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary" />
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                Duration
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    request.durasi
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center text-disable-dark">
                                                                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary" />
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                Processing
                                                                                Time
                                                                            </p>
                                                                            <p className="text-primary font-medium">
                                                                                {
                                                                                    request.estimasi
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <div className="bg-disable-light rounded-full p-3 sm:p-4 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4">
                                                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-disable" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                                No pending reservations
                                            </h3>
                                            <p className="text-disable mb-4 text-sm sm:text-base">
                                                All your reservations are up to
                                                date
                                            </p>
                                            <button
                                                onClick={handleReservationClick}
                                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Create New Reservation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-xl shadow-sm border border-disable-light overflow-hidden">
                                <div className="p-5 sm:p-6 border-b border-disable-light bg-primary-light/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                        <div className="flex items-center mb-3 sm:mb-0">
                                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                <Activity className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                                    Recent Activities
                                                </h2>
                                                <p className="text-xs sm:text-sm text-disable-dark">
                                                    Latest reservation
                                                    activities
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route("peminjaman.index")}
                                            className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                                        >
                                            View All
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6">
                                    <div className="space-y-5 sm:space-y-6">
                                        {activitiesData
                                            .slice(0, 4)
                                            .map((activity, index) => (
                                                <div
                                                    key={activity.id}
                                                    className="group relative"
                                                >
                                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                                        <div className="relative">
                                                            <div
                                                                className={`p-2 sm:p-3 rounded-xl ${getStatusColor(
                                                                    activity.type
                                                                )} shadow-sm`}
                                                            >
                                                                {React.createElement(
                                                                    activity.icon,
                                                                    {
                                                                        className:
                                                                            "h-4 w-4 sm:h-5 sm:w-5",
                                                                    }
                                                                )}
                                                            </div>
                                                            {index !== 3 && (
                                                                <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-5 sm:h-6 bg-disable-light"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 pb-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                                                        {
                                                                            activity.message
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs sm:text-sm text-disable-dark mb-2 leading-relaxed">
                                                                        {
                                                                            activity.details
                                                                        }
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center text-xs text-disable gap-2 sm:space-x-4">
                                                                        <span className="flex items-center">
                                                                            <Clock className="h-3 w-3 mr-1" />
                                                                            {formatDate(
                                                                                activity.timestamp
                                                                            )}
                                                                        </span>
                                                                        {activity.location && (
                                                                            <span className="flex items-center">
                                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                                {
                                                                                    activity.location
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-disable hover:text-primary">
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Desktop Only */}
                        <div className="hidden xl:block xl:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-disable-light">
                                    <div className="p-6 border-b border-disable-light">
                                        <div className="flex items-center">
                                            <Zap className="h-5 w-5 text-primary mr-3" />
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Quick Actions
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <button
                                            onClick={handleReservationClick}
                                            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-primary hover:bg-primary-dark transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                                        >
                                            <ClipboardPlusIcon className="h-5 w-5 mr-2" />
                                            New Reservation
                                        </button>
                                        <Link
                                            href={route("ruangan.index")}
                                            className="w-full py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <History className="h-5 w-5 mr-2" />
                                            View History
                                        </Link>
                                        <Link
                                            href={route("jadwal.index")}
                                            className="w-full py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <CalendarSearchIcon className="h-5 w-5 mr-2" />
                                            Room Schedules
                                        </Link>
                                        <button className="w-full py-3 px-4 rounded-xl text-disable-dark font-medium bg-disable-light hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                                            <HelpCircle className="h-5 w-5 mr-2" />
                                            Get Help
                                        </button>
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-primary-light rounded-xl border border-primary/20 p-6">
                                    <div className="flex items-center mb-4">
                                        <Info className="h-5 w-5 text-primary-dark mr-3" />
                                        <h3 className="font-bold text-primary-dark">
                                            Tips & Guidelines
                                        </h3>
                                    </div>
                                    <div className="space-y-3 text-sm text-primary-dark">
                                        {[
                                            "Book rooms up to 7 days in advance",
                                            "Confirmations within 1-2 business days",
                                            "Contact admin for urgent requests",
                                        ].map((tip, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start"
                                            >
                                                <div className="w-2 h-2 bg-primary-dark rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservation Modal */}
            {reservationModalOpen && (
                <RoomBookingModal
                    mode="create"
                    persistKey="roomBooking.dashboard"
                    initialCategory={selectedCategory}
                    onClose={() => setReservationModalOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}
        </UserLayout>
    );
}
