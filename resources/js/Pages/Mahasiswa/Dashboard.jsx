import React, { useState, useEffect } from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { format, parseISO } from "date-fns";
import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    ChevronRight,
    Building,
    Users,
    FileText,
    Info,
} from "lucide-react";
import RoomBookingModal from "./Ruangan/modal/RoomBookingModal";

export default function Dashboard({ auth, bookings, upcomingBookings, stats }) {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return <CheckCircle className="h-4 w-4" />;
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString) => {
        return format(parseISO(dateString), "EEEE, MMMM dd yyyy");
    };

    const formatTime = (timeString) => {
        return format(parseISO(timeString), "HH:mm");
    };

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Greeting & Quick Action */}
                    <div className="mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-24">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            Welcome, {auth.user.name}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Manage your room bookings here
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setBookingModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Book Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {stats.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Pending Approval</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {stats.pending}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Approved</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {stats.approved}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Rejected</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {stats.rejected}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Upcoming Bookings */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Upcoming Bookings
                                        </h3>
                                        <Link
                                            href={route("ruangan.index")}
                                            className="text-sm text-primary hover:text-primary-dark"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {upcomingBookings.length > 0 ? (
                                            upcomingBookings.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                    booking.status
                                                                )}`}
                                                            >
                                                                {getStatusIcon(booking.status)}
                                                                <span className="ml-1">
                                                                    {booking.status}
                                                                </span>
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(booking.booking_date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">
                                                                    {booking.room.room_name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {booking.room.building.building_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                                            <div className="flex items-center text-gray-500">
                                                                <Clock className="h-4 w-4 mr-2" />
                                                                {formatTime(booking.start_time)} -{" "}
                                                                {formatTime(booking.end_time)}
                                                            </div>
                                                            <div className="flex items-center text-gray-500">
                                                                <Users className="h-4 w-4 mr-2" />
                                                                {booking.number_of_participants} participants
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={route("ruangan.booking.show", booking.id)}
                                                        className="flex items-center text-primary hover:text-primary-dark"
                                                    >
                                                        <span className="text-sm mr-1">Detail</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500">
                                                    No upcoming bookings
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <Info className="h-5 w-5 text-primary mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Important Information
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-primary/5 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-2">
                                                Booking Guidelines
                                            </h4>
                                            <ul className="text-sm text-gray-600 space-y-2">
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                                                    <span>Bookings can be made up to 7 days before usage</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                                                    <span>Approval process takes 1-2 working days</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                                                    <span>Must attach booking request letter</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                                                Attention
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Please ensure all booking details are filled completely and correctly to expedite the approval process.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {bookingModalOpen && (
                <RoomBookingModal
                    mode="create"
                    persistKey="roomBooking.dashboard"
                    onClose={() => setBookingModalOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}
        </UserLayout>
    );
}
