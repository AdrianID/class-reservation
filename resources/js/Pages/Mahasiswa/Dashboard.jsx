// Dashboard.jsx
import UserLayout from "@/components/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
    CheckCircle,
    X,
    Calendar,
    Clock,
    MapPin,
    Users,
    BookOpen,
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
    Zap,
    ArrowRight,
    Info,
    Eye,
    Edit,
    Trash2,
    CheckSquare,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import RoomBookingPopup from "./Ruangan/RoomBookingPopup";

// Import data statis
import {
    primaryMenuItems,
    secondaryMenuItems,
    pendingRequestsData,
    activitiesData,
    statsData,
} from "../dashboardData";

export default function Dashboard() {
    const { props } = usePage();
    const user = props.user;
    const faculties = props.faculties || [];
    const buildings = props.buildings || [];
    const { flash } = usePage().props;

    const [showFlash, setShowFlash] = useState(!!flash?.message);
    const [reservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pendingrequests, setPendingRequests] = useState(pendingRequestsData);
    const [activities, setActivities] = useState(activitiesData);

    // Auto-hide flash message
    useEffect(() => {
        if (flash?.message) {
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    // Mapping untuk ikon
    const iconMap = {
        CheckCircle,
        X,
        Calendar,
        Clock,
        MapPin,
        Users,
        BookOpen,
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
        Zap,
        ArrowRight,
        Info,
        Eye,
        Edit,
        Trash2,
        CheckSquare,
        AlertTriangle,
        XCircle,
    };

    const handleReservationClick = () => {
        setSelectedCategory("Room Reservation");
        setReservationModalOpen(true);
    };

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "MMM dd, yyyy • h:mm a", { locale: enUS });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "completed":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "approved":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";
            case "info":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "approved":
                return <CheckCircle className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            case "completed":
                return <CheckSquare className="h-4 w-4" />;
            default:
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "bg-red-400";
            case "medium":
                return "bg-amber-400";
            case "low":
                return "bg-emerald-400";
            default:
                return "bg-gray-400";
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case "high":
                return "High Priority";
            case "medium":
                return "Medium Priority";
            case "low":
                return "Low Priority";
            default:
                return "Normal";
        }
    };

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">
                        Dashboard
                    </h2>
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

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Flash Message */}
                    {showFlash && flash?.message && (
                        <div className="mb-8">
                            <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <p className="ml-3 text-sm font-medium text-gray-800">
                                            {flash.message ||
                                                "Operation successfully completed!"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowFlash(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-primary via-primary to-primary-dark rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                                        <span className="text-primary-light text-sm font-medium">
                                            System Online
                                        </span>
                                    </div>
                                    <h1 className="text-4xl font-bold text-white mb-3">
                                        Welcome back, {user?.name ?? "User"}!
                                    </h1>
                                    <p className="text-xl text-primary-light mb-6 max-w-2xl leading-relaxed">
                                        Manage your classroom reservations and
                                        schedules all in one place.
                                    </p>
                                    <div className="flex items-center space-x-6 text-sm text-primary-light">
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

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {statsData.map((stat, index) => {
                                    const IconComponent = iconMap[stat.icon];
                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div
                                                    className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}
                                                >
                                                    <IconComponent className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="flex items-center">
                                                    <TrendingUp
                                                        className={`h-4 w-4 mr-1 ${
                                                            stat.trend === "up"
                                                                ? "text-emerald-500"
                                                                : stat.trend ===
                                                                  "down"
                                                                ? "text-red-500"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                    <span
                                                        className={`text-sm font-semibold ${
                                                            stat.trend === "up"
                                                                ? "text-emerald-600"
                                                                : stat.trend ===
                                                                  "down"
                                                                ? "text-red-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {stat.change}
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">
                                                {stat.title}
                                            </h3>
                                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                This month
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pending Reservations */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-primary/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-primary/20 rounded-lg mr-3">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Pending Reservations
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    Reservations awaiting
                                                    approval
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                                                {pendingrequests.length} pending
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
                                <div className="p-6">
                                    {pendingrequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {pendingrequests.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="group bg-gray-50/30 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex items-center">
                                                                            <div
                                                                                className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(
                                                                                    request.priority
                                                                                )}`}
                                                                            ></div>
                                                                            <span className="text-sm font-semibold text-primary">
                                                                                #
                                                                                {
                                                                                    request.id
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                                                request.status
                                                                            )}`}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                {getStatusIcon(
                                                                                    request.status
                                                                                )}
                                                                                <span className="ml-1">
                                                                                    {
                                                                                        request.status
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                            {getPriorityText(
                                                                                request.priority
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                                        <Eye className="h-4 w-4" />
                                                                    </button>
                                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                        <Edit className="h-4 w-4" />
                                                                    </button>
                                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <h4 className="font-bold text-lg text-gray-900 mb-2">
                                                                {
                                                                    request.ruangan
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                                {request.tujuan}
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                                <div className="flex items-center text-gray-600">
                                                                    <Clock className="h-4 w-4 mr-2 text-primary" />
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
                                                                <div className="flex items-center text-gray-600">
                                                                    <Activity className="h-4 w-4 mr-2 text-primary" />
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
                                                                <div className="flex items-center text-gray-600">
                                                                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
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
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                                <Calendar className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No pending reservations
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                All your reservations are up to
                                                date
                                            </p>
                                            <button
                                                onClick={handleReservationClick}
                                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Create New Reservation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                <Activity className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Recent Activities
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    Latest reservation
                                                    activities
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route("peminjaman.index")}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                        >
                                            View All
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {activities
                                            .slice(0, 4)
                                            .map((activity, index) => {
                                                const IconComponent =
                                                    iconMap[activity.icon];
                                                return (
                                                    <div
                                                        key={index}
                                                        className="group relative"
                                                    >
                                                        <div className="flex items-start space-x-4">
                                                            <div className="relative">
                                                                <div
                                                                    className={`p-3 rounded-xl ${getStatusColor(
                                                                        activity.type
                                                                    )} shadow-sm`}
                                                                >
                                                                    <IconComponent className="h-5 w-5" />
                                                                </div>
                                                                {index !==
                                                                    activities.slice(
                                                                        0,
                                                                        4
                                                                    ).length -
                                                                        1 && (
                                                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
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
                                                                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                                                            {
                                                                                activity.details
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center text-xs text-gray-500 space-x-4">
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
                                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-400 hover:text-primary">
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="xl:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-6 border-b border-gray-100">
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
                                            <Calendar className="h-5 w-5 mr-2" />
                                            New Reservation
                                        </button>
                                        <Link
                                            href={route("ruangan.index")}
                                            className="w-full py-3 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <History className="h-5 w-5 mr-2" />
                                            View History
                                        </Link>
                                        <Link
                                            href={route("peminjaman.index")}
                                            className="w-full py-3 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <MapPin className="h-5 w-5 mr-2" />
                                            Browse Rooms
                                        </Link>
                                        <button className="w-full py-3 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                                            <HelpCircle className="h-5 w-5 mr-2" />
                                            Get Help
                                        </button>
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                                    <div className="flex items-center mb-4">
                                        <Info className="h-5 w-5 text-blue-600 mr-3" />
                                        <h3 className="font-bold text-blue-900">
                                            Tips & Guidelines
                                        </h3>
                                    </div>
                                    <div className="space-y-3 text-sm text-blue-800">
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>
                                                Book rooms up to 7 days in
                                                advance
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>
                                                Confirmations within 1-2
                                                business days
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>
                                                Contact admin for urgent
                                                requests
                                            </span>
                                        </div>
                                    </div>
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
