import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Building,
    Clock,
    Info,
    Plus,
    Eye,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    HelpCircle,
    ChevronRight,
} from "lucide-react";
import UserLayout from "@/components/Layouts/UserLayout";
import RoomBookingModal from "./RoomBookingModal";

export default function Rooms({ faculties, buildings }) {
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [bookingData] = useState([
        {
            id: 1,
            room: "Lecture Room A101",
            building: "Computer Science Building",
            date: "2025-07-10",
            time: "08:00 - 10:00",
            purpose: "Web Programming Lecture",
            borrower: "Dr. Ahmad Susanto",
            status: "Approved",
            submissionDate: "2025-07-05",
        },
        {
            id: 2,
            room: "Computer Lab 2",
            building: "Computer Science Building",
            date: "2025-07-12",
            time: "13:00 - 15:00",
            purpose: "Database Practicum",
            borrower: "Siti Nurhaliza, M.Kom",
            status: "Pending",
            submissionDate: "2025-07-06",
        },
        {
            id: 3,
            room: "Multipurpose Hall",
            building: "Rectorate Building",
            date: "2025-07-15",
            time: "09:00 - 12:00",
            purpose: "National IT Seminar",
            borrower: "Budi Santoso",
            status: "Approved",
            submissionDate: "2025-07-01",
        },
        {
            id: 4,
            room: "Meeting Room B203",
            building: "Economics Building",
            date: "2025-07-08",
            time: "14:00 - 16:00",
            purpose: "Coordination Meeting",
            borrower: "Andi Pratama",
            status: "Rejected",
            submissionDate: "2025-07-03",
        },
        {
            id: 5,
            room: "Multimedia Lab",
            building: "Computer Science Building",
            date: "2025-07-20",
            time: "10:00 - 12:00",
            purpose: "Video Editing Workshop",
            borrower: "Maya Sari, S.Kom",
            status: "Pending",
            submissionDate: "2025-07-07",
        },
        {
            id: 6,
            room: "Discussion Room C301",
            building: "Law Faculty Building",
            date: "2025-07-18",
            time: "15:00 - 17:00",
            purpose: "Student Group Discussion",
            borrower: "Rahmat Hidayat",
            status: "Approved",
            submissionDate: "2025-07-04",
        },
    ]);

    const handleBookingClick = () => {
        setSelectedCategory("Book Room");
        setPopupOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved":
                return <CheckCircle className="text-green-500 w-5 h-5" />;
            case "Pending":
                return <Clock className="text-yellow-500 w-5 h-5" />;
            case "Rejected":
                return <XCircle className="text-red-500 w-5 h-5" />;
            default:
                return <HelpCircle className="text-gray-400 w-5 h-5" />;
        }
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Rooms
                </h2>
            }
        >
            <Head title="Rooms" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8 p-6 rounded-xl shadow-md bg-primary">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Room Booking
                                </h1>
                                <p className="text-gray-100">
                                    Manage and monitor all your room bookings
                                </p>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg text-white">
                                <Clock className="h-5 w-5 mr-2" />
                                <p className="text-sm">
                                    Approval process: 1 business day
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-primary">
                                    Room Booking List
                                </h2>
                                <button
                                    onClick={handleBookingClick}
                                    className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-200 bg-primary"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Book Room
                                </button>
                            </div>
                        </div>

                        <div>
                            {bookingData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky z-10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Room & Building
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Date & Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Purpose
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Borrower
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookingData.map(
                                                (booking, index) => (
                                                    <tr
                                                        key={booking.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <Building className="h-4 w-4 text-gray-400 mr-2" />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            booking.room
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            booking.building
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {formatDate(
                                                                            booking.date
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            booking.time
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 max-w-xs">
                                                                {
                                                                    booking.purpose
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        booking.borrower
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                    booking.status
                                                                )}`}
                                                            >
                                                                <span className="mr-1">
                                                                    {getStatusIcon(
                                                                        booking.status
                                                                    )}
                                                                </span>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                                onClick={() =>
                                                                    console.log(
                                                                        `View details for booking ${booking.id}`
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Building className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-2">
                                        No room booking data available
                                    </p>
                                    <p className="text-sm mb-6">
                                        Start creating room bookings for your
                                        needs
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={handleBookingClick}
                                            className="flex items-center px-6 py-3 rounded-lg border-2 font-medium hover:bg-gray-50 transition-colors duration-200 border-primary text-primary"
                                        >
                                            <Building className="h-4 w-4 mr-2" />
                                            Explore Rooms
                                        </button>
                                        <button
                                            onClick={handleBookingClick}
                                            className="flex items-center px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-200 bg-primary"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Book Room
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="p-5 border border-blue-200 rounded-lg bg-blue-50">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-1">
                                            Important Information
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Room booking approval processing may
                                            take up to 1 business day. Please
                                            submit your booking at least 2 days
                                            before the intended use date.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {popupOpen && (
                <RoomBookingModal
                    persistKey="roomBooking.index"
                    initialCategory={selectedCategory}
                    onClose={() => setPopupOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}
        </UserLayout>
    );
}
