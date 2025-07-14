import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Activity,
    FileText,
    Users,
    UserPlus,
    BookOpen,
    CalendarCheck,
    RefreshCw,
    ChevronDown,
} from "lucide-react";
import { Menu } from "@headlessui/react";

export default function AdminDashboard() {
    const { props } = usePage();
    const user = props.user;
    const selectedFaculty = props.selectedFaculty;

    // Get data from backend props
    const pendingApprovals = props.pendingApprovals ?? [];
    const upcomingBookings = props.upcomingBookings ?? [];
    const systemActivities = props.systemActivities ?? [];
    const totalBookings = props.totalBookings ?? 0;
    const activeBookings = props.activeBookings ?? 0;
    const totalUsers = props.totalUsers ?? 0;

    // Get flash message from Inertia
    const { flash } = usePage().props;

    // State for showing flash message
    const [showFlash, setShowFlash] = useState(!!flash?.message);

    // Auto-hide flash message after 5 seconds
    useEffect(() => {
        if (flash?.message) {
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "MMM dd, yyyy hh:mm a", { locale: enUS });
        } catch (error) {
            return dateString;
        }
    };

    // Status badge colors
    const getStatusColor = (status) => {
        switch (status) {
            case "approval":
            case "Approved":
                return "bg-green-100 text-green-800";
            case "rejection":
            case "Rejected":
                return "bg-red-100 text-red-800";
            case "Pending Approval":
                return "bg-yellow-100 text-yellow-800";
            case "user":
                return "bg-purple-100 text-purple-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Handle approval/rejection
    const handleRequestAction = (id, action) => {
        if (action === "approve") {
            // Logic to approve booking
            alert(`Booking #${id} has been approved`);
        } else {
            // Logic to reject booking
            alert(`Booking #${id} has been rejected`);
        }
    };

    // Empty state component with Lucide icons
    const EmptyState = ({
        title,
        description,
        icon,
        actionText,
        actionHandler,
    }) => (
        <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
            {actionText && actionHandler && (
                <button
                    onClick={actionHandler}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    {actionText}
                </button>
            )}
        </div>
    );

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6 min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {showFlash && flash?.message && (
                        <div className="mb-6 relative">
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                {flash.message}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-green-500 hover:text-green-700"
                                        onClick={() => setShowFlash(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Welcome Section with Stats Grid */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div className="p-5 border-b border-gray-200 bg-primary text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        Welcome, Admin{" "}
                                        {user?.full_name ?? "User"}
                                    </h3>
                                    <p className="text-sm mt-1 opacity-90">
                                        {selectedFaculty
                                            ? `Managing: ${selectedFaculty.faculty_name}`
                                            : "System-wide administration"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                    <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                        {user?.role?.role_name || "Admin"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions in Subheader */}
                        <div className="bg-primary-light p-4 border-b border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.booking.index")
                                        )
                                    }
                                    className="flex items-center px-3 py-2 bg-white text-primary text-sm font-medium rounded-md shadow-sm hover:bg-white/90"
                                >
                                    <CalendarCheck className="w-4 h-4 mr-2" />
                                    Manage Bookings
                                </button>

                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.ruangan.index")
                                        )
                                    }
                                    className="flex items-center px-3 py-2 bg-white text-primary text-sm font-medium rounded-md shadow-sm hover:bg-white/90"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Manage Classrooms
                                </button>

                                <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                >
                                    <Menu.Button className="flex items-center px-3 py-2 bg-white text-primary text-sm font-medium rounded-md shadow-sm hover:bg-white/90">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Manage Users
                                        <ChevronDown className="ml-2 w-4 h-4" />
                                    </Menu.Button>
                                    <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    "admin.users.mahasiswa"
                                                                )
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-primary`}
                                                    >
                                                        Mahasiswa
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    "admin.users.dosen"
                                                                )
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-primary`}
                                                    >
                                                        Dosen
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    "admin.users.staff"
                                                                )
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-primary`}
                                                    >
                                                        Staff
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex items-center px-3 py-2 bg-white text-primary text-sm font-medium rounded-md shadow-sm hover:bg-white/90"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600">
                                Here's a summary of system activity and pending
                                classroom booking approvals.
                                {selectedFaculty && (
                                    <span className="block mt-2 text-sm font-medium text-primary">
                                        Managing faculty:{" "}
                                        {selectedFaculty.faculty_name}
                                    </span>
                                )}
                            </p>
                            {/* Stats Grid integrated into Welcome Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                    <div className="p-5 border-b border-gray-200 bg-primary-light">
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-primary mr-2" />
                                            <h3 className="text-sm font-medium text-primary">
                                                Total Bookings
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <p className="text-3xl font-bold text-primary">
                                            {totalBookings}
                                        </p>
                                        <div className="bg-primary-light rounded-full p-3">
                                            <Calendar className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                    <div className="p-5 border-b border-gray-200 bg-primary-light">
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                                            <h3 className="text-sm font-medium text-primary">
                                                Pending Approval
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <p className="text-3xl font-bold text-yellow-500">
                                            {pendingApprovals.length}
                                        </p>
                                        <div className="bg-yellow-100 rounded-full p-3">
                                            <Clock className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                    <div className="p-5 border-b border-gray-200 bg-primary-light">
                                        <div className="flex items-center">
                                            <Activity className="w-5 h-5 text-primary mr-2" />
                                            <h3 className="text-sm font-medium text-primary">
                                                Active Bookings
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <p className="text-3xl font-bold text-primary">
                                            {activeBookings}
                                        </p>
                                        <div className="bg-blue-100 rounded-full p-3">
                                            <Activity className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                    <div className="p-5 border-b border-gray-200 bg-primary-light">
                                        <div className="flex items-center">
                                            <Users className="w-5 h-5 text-primary mr-2" />
                                            <h3 className="text-sm font-medium text-primary">
                                                Total Users
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <p className="text-3xl font-bold text-primary">
                                            {totalUsers}
                                        </p>
                                        <div className="bg-purple-100 rounded-full p-3">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2-Column Layout for Desktop */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Left Column - Approval and Upcoming Bookings */}
                        <div className="lg:w-2/3 space-y-8">
                            {/* Section Booking Approvals */}
                            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                <div className="p-5 border-b border-gray-200 bg-primary text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">
                                            Booking Approvals
                                        </h3>
                                        <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                            {pendingApprovals.length} pending
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    {pendingApprovals.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-primary-light">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Classroom
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Date & Time
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            User
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {pendingApprovals.map(
                                                        (request) => (
                                                            <tr
                                                                key={request.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                                    #
                                                                    {request.id}
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        request.classroom
                                                                    }
                                                                    <span className="block text-xs text-gray-500 mt-1">
                                                                        Duration:{" "}
                                                                        {
                                                                            request.duration
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {formatDate(
                                                                        request.date
                                                                    )}
                                                                    <span className="block text-xs text-gray-500 mt-1">
                                                                        Submitted:{" "}
                                                                        {formatDate(
                                                                            request.submitted
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        request.user
                                                                    }
                                                                    <span className="block text-xs text-gray-500 mt-1">
                                                                        {
                                                                            request.email
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                        {
                                                                            request.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRequestAction(
                                                                                request.id,
                                                                                "approve"
                                                                            )
                                                                        }
                                                                        className="text-green-600 hover:text-green-900 flex items-center"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRequestAction(
                                                                                request.id,
                                                                                "reject"
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-900 flex items-center"
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />{" "}
                                                                        Reject
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={
                                                <FileText className="w-8 h-8 text-primary" />
                                            }
                                            title="No Pending Approvals"
                                            description="There are currently no classroom booking requests requiring approval. New requests will appear here."
                                            actionText="View All Bookings"
                                            actionHandler={() =>
                                                console.log(
                                                    "Navigate to bookings"
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Section Upcoming Bookings */}
                            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                <div className="p-5 border-b border-gray-200 bg-primary text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">
                                            Upcoming Bookings
                                        </h3>
                                        <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                            {upcomingBookings.length} upcoming
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    {upcomingBookings.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-primary-light">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Classroom
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Date & Time
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            User
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {upcomingBookings.map(
                                                        (booking) => (
                                                            <tr
                                                                key={booking.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                                    #
                                                                    {booking.id}
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        booking.classroom
                                                                    }
                                                                    <span className="block text-xs text-gray-500 mt-1">
                                                                        Duration:{" "}
                                                                        {
                                                                            booking.duration
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {formatDate(
                                                                        booking.date
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        booking.user
                                                                    }
                                                                    <span className="block text-xs text-gray-500 mt-1">
                                                                        {
                                                                            booking.email
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <span
                                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                                            booking.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            booking.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={
                                                <Calendar className="w-8 h-8 text-primary" />
                                            }
                                            title="No Upcoming Bookings"
                                            description="There are no classroom bookings scheduled in the near future. Approved bookings will appear here."
                                            actionText="View Calendar"
                                            actionHandler={() =>
                                                console.log(
                                                    "Navigate to calendar"
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - System Activity */}
                        <div className="lg:w-1/3">
                            {/* Section System Activity */}
                            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                                <div className="p-5 border-b border-gray-200 bg-primary text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">
                                            Recent System Activity
                                        </h3>
                                        <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                            {systemActivities.length} activities
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    {systemActivities.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                            {systemActivities.map(
                                                (activity, index) => (
                                                    <li
                                                        key={index}
                                                        className="py-4 hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 mt-1">
                                                                <div className="bg-primary-light rounded-full p-2">
                                                                    <Activity className="w-5 h-5 text-primary" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 flex-1 min-w-0">
                                                                <p className="text-sm text-gray-700 truncate">
                                                                    {
                                                                        activity.message
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {formatDate(
                                                                        activity.timestamp
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <EmptyState
                                            icon={
                                                <Activity className="w-8 h-8 text-primary" />
                                            }
                                            title="No System Activity"
                                            description="No system activities have been recorded. Activities like booking approvals will appear here."
                                            actionText="Refresh Data"
                                            actionHandler={() =>
                                                window.location.reload()
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
