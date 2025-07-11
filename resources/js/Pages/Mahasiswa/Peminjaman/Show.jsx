import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Building,
    Calendar,
    Clock,
    Users,
    FileText,
    ChevronLeft,
    Download,
} from "lucide-react";
import UserLayout from "@/components/Layouts/UserLayout";

export default function Show({ booking }) {
    const formatDate = (dateString) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

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

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Detail Peminjaman
                </h2>
            }
        >
            <Head title="Detail Peminjaman" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route("peminjaman.index")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Daftar Peminjaman
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informasi Ruangan */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informasi Ruangan
                                    </h3>
                                    <div className="flex items-start space-x-3">
                                        <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {booking.room.room_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {booking.room.building.building_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Peminjaman */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Status Peminjaman
                                    </h3>
                                    <div>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Waktu Peminjaman */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Waktu Peminjaman
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900">
                                                {formatDate(booking.booking_date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900">
                                                {new Date(
                                                    booking.start_time
                                                ).toLocaleTimeString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    booking.end_time
                                                ).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Kegiatan */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informasi Kegiatan
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-gray-900">
                                            {booking.purpose}
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <Users className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900">
                                                {booking.number_of_participants}{" "}
                                                orang
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Dokumen Pendukung
                                </h3>
                                <div className="space-y-4">
                                    {booking.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {doc.type.type_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {doc.document_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={`/storage/${doc.document_path}`}
                                                target="_blank"
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
} 