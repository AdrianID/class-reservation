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
} from "lucide-react";
import UserLayout from "@/components/Layouts/UserLayout";
import RoomBookingPopup from "./RoomBookingPopup";

export default function Ruangan({ faculties, buildings }) {
    const primaryColor = "#365b6d";

    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // Dummy data untuk tabel peminjaman ruangan
    const [bookingData] = useState([
        {
            id: 1,
            ruangan: "Ruang Kuliah A101",
            gedung: "Gedung Teknik Informatika",
            tanggal: "2025-07-10",
            waktu: "08:00 - 10:00",
            keperluan: "Kuliah Pemrograman Web",
            peminjam: "Dr. Ahmad Susanto",
            status: "Disetujui",
            tanggal_pengajuan: "2025-07-05",
        },
        {
            id: 2,
            ruangan: "Lab Komputer 2",
            gedung: "Gedung Teknik Informatika",
            tanggal: "2025-07-12",
            waktu: "13:00 - 15:00",
            keperluan: "Praktikum Database",
            peminjam: "Siti Nurhaliza, M.Kom",
            status: "Menunggu",
            tanggal_pengajuan: "2025-07-06",
        },
        {
            id: 3,
            ruangan: "Aula Serbaguna",
            gedung: "Gedung Rektorat",
            tanggal: "2025-07-15",
            waktu: "09:00 - 12:00",
            keperluan: "Seminar Nasional IT",
            peminjam: "Budi Santoso",
            status: "Disetujui",
            tanggal_pengajuan: "2025-07-01",
        },
        {
            id: 4,
            ruangan: "Ruang Meeting B203",
            gedung: "Gedung Ekonomi",
            tanggal: "2025-07-08",
            waktu: "14:00 - 16:00",
            keperluan: "Rapat Koordinasi",
            peminjam: "Andi Pratama",
            status: "Ditolak",
            tanggal_pengajuan: "2025-07-03",
        },
        {
            id: 5,
            ruangan: "Lab Multimedia",
            gedung: "Gedung Teknik Informatika",
            tanggal: "2025-07-20",
            waktu: "10:00 - 12:00",
            keperluan: "Workshop Video Editing",
            peminjam: "Maya Sari, S.Kom",
            status: "Menunggu",
            tanggal_pengajuan: "2025-07-07",
        },
        {
            id: 6,
            ruangan: "Ruang Diskusi C301",
            gedung: "Gedung Fakultas Hukum",
            tanggal: "2025-07-18",
            waktu: "15:00 - 17:00",
            keperluan: "Diskusi Kelompok Mahasiswa",
            peminjam: "Rahmat Hidayat",
            status: "Disetujui",
            tanggal_pengajuan: "2025-07-04",
        },
    ]);

    const handleBookingClick = () => {
        setSelectedCategory("Pinjam Ruangan");
        setPopupOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Disetujui":
                return "bg-green-100 text-green-800";
            case "Menunggu":
                return "bg-yellow-100 text-yellow-800";
            case "Ditolak":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Disetujui":
                return <CheckCircle className="text-green-500 w-5 h-5" />;
            case "Menunggu":
                return <Clock className="text-yellow-500 w-5 h-5" />;
            case "Ditolak":
                return <XCircle className="text-red-500 w-5 h-5" />;
            default:
                return <HelpCircle className="text-gray-400 w-5 h-5" />;
        }
    };

    return (
        <UserLayout
            header={
                <h2
                    className="text-xl font-semibold leading-tight"
                    style={{ color: primaryColor }}
                >
                    Ruangan
                </h2>
            }
        >
            <Head title="Ruangan" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div
                        className="mb-8 p-6 rounded-xl shadow-md"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Peminjaman Ruangan
                                </h1>
                                <p className="text-gray-100">
                                    Kelola dan pantau semua peminjaman ruangan
                                    Anda
                                </p>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg text-white">
                                <Clock className="h-5 w-5 mr-2" />
                                <p className="text-sm">
                                    Proses persetujuan: 1x24 jam kerja
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Table with sticky header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        {/* Sticky Section Header */}
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2
                                    className="text-xl font-semibold"
                                    style={{ color: primaryColor }}
                                >
                                    Daftar Peminjaman Ruangan
                                </h2>
                                <button
                                    onClick={handleBookingClick}
                                    className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-200"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Pinjam Ruang
                                </button>
                            </div>
                        </div>

                        {/* Table Content */}
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
                                                    Ruangan & Gedung
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Keperluan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Peminjam
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Aksi
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
                                                                            booking.ruangan
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            booking.gedung
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
                                                                        {new Date(
                                                                            booking.tanggal
                                                                        ).toLocaleDateString(
                                                                            "id-ID",
                                                                            {
                                                                                weekday:
                                                                                    "long",
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            }
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            booking.waktu
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 max-w-xs">
                                                                {
                                                                    booking.keperluan
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        booking.peminjam
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
                                                                Detail
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
                                        Belum ada data peminjaman ruangan
                                    </p>
                                    <p className="text-sm mb-6">
                                        Mulai buat peminjaman ruangan untuk
                                        kebutuhan Anda
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={handleBookingClick}
                                            className="flex items-center px-6 py-3 rounded-lg border-2 font-medium hover:bg-gray-50 transition-colors duration-200"
                                            style={{
                                                borderColor: primaryColor,
                                                color: primaryColor,
                                            }}
                                        >
                                            <Building className="h-4 w-4 mr-2" />
                                            Eksplor Ruang
                                        </button>
                                        <button
                                            onClick={handleBookingClick}
                                            className="flex items-center px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity duration-200"
                                            style={{
                                                backgroundColor: primaryColor,
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Pinjam Ruang
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="p-5 border border-blue-200 rounded-lg bg-blue-50">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-1">
                                            Informasi Penting
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Waktu pemrosesan persetujuan
                                            peminjaman ruangan bisa memakan
                                            waktu hingga 1x24 jam kerja.
                                            Pastikan untuk mengajukan peminjaman
                                            minimal 2 hari sebelum tanggal
                                            penggunaan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {popupOpen && (
                <RoomBookingPopup
                    initialCategory={selectedCategory}
                    onClose={() => setPopupOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}
        </UserLayout>
    );
}
