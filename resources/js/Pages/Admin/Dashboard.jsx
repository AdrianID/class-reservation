import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminDashboard() {
    const { props } = usePage();
    const user = props.user;
    const selectedFaculty = props.selectedFaculty;

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

    // Status peminjaman yang perlu persetujuan admin
    const [pendingApprovals, setPendingApprovals] = useState([
        {
            id: "PMJ567",
            ruangan: "Aula Fakultas Teknik",
            tanggal: "2025-05-10T13:00:00",
            durasi: "2 jam",
            tujuan: "Seminar",
            peminjam: "John Doe",
            email: "john.doe@example.com",
            status: "Menunggu Persetujuan",
            diajukan: "2025-05-02T14:20:00",
        },
        {
            id: "PMJ568",
            ruangan: "R. 301 Gedung B",
            tanggal: "2025-05-15T10:00:00",
            durasi: "3 jam",
            tujuan: "Rapat Organisasi",
            peminjam: "Jane Smith",
            email: "jane.smith@example.com",
            status: "Menunggu Persetujuan",
            diajukan: "2025-05-03T09:15:00",
        },
        {
            id: "PMJ569",
            ruangan: "Laboratorium Komputer",
            tanggal: "2025-05-12T08:00:00",
            durasi: "5 jam",
            tujuan: "Pelatihan Programming",
            peminjam: "Robert Johnson",
            email: "robert.j@example.com",
            status: "Menunggu Persetujuan",
            diajukan: "2025-05-04T11:30:00",
        },
    ]);

    // Peminjaman yang akan datang
    const [upcomingBookings, setUpcomingBookings] = useState([
        {
            id: "PMJ123",
            ruangan: "Laboratorium Komputer",
            tanggal: "2025-05-08T09:00:00",
            durasi: "4 jam",
            tujuan: "Workshop Web Development",
            peminjam: "Alice Brown",
            email: "alice.b@example.com",
            status: "Disetujui",
        },
        {
            id: "PMJ456",
            ruangan: "Ruang Diskusi Perpustakaan",
            tanggal: "2025-05-09T14:00:00",
            durasi: "2 jam",
            tujuan: "Diskusi Kelompok",
            peminjam: "Michael Wilson",
            email: "michael.w@example.com",
            status: "Disetujui",
        },
    ]);

    // Aktivitas sistem terbaru
    const [systemActivities, setSystemActivities] = useState([
        {
            icon: "📝",
            message:
                "Admin menyetujui peminjaman #PMJ123 untuk Laboratorium Komputer",
            timestamp: "2025-05-03T10:30:00",
            type: "approval",
        },
        {
            icon: "❌",
            message:
                "Admin menolak peminjaman #PMJ111 untuk Auditorium karena jadwal bentrok",
            timestamp: "2025-05-03T09:45:00",
            type: "rejection",
        },
        {
            icon: "👤",
            message: "User baru 'David Lee' (david.lee@example.com) mendaftar",
            timestamp: "2025-05-02T16:20:00",
            type: "user",
        },
        {
            icon: "📅",
            message:
                "Peminjaman #PMJ456 untuk Ruang Diskusi Perpustakaan telah selesai",
            timestamp: "2025-05-01T18:45:00",
            type: "completed",
        },
    ]);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
        } catch (error) {
            return dateString;
        }
    };

    // Status badge colors
    const getStatusColor = (status) => {
        switch (status) {
            case "approval":
            case "Disetujui":
                return "bg-green-100 text-green-800";
            case "rejection":
            case "Ditolak":
                return "bg-red-100 text-red-800";
            case "Menunggu Persetujuan":
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
            // Logic untuk menyetujui peminjaman
            alert(`Peminjaman #${id} telah disetujui`);
            setPendingApprovals(
                pendingApprovals.filter((req) => req.id !== id)
            );
        } else {
            // Logic untuk menolak peminjaman
            alert(`Peminjaman #${id} telah ditolak`);
            setPendingApprovals(
                pendingApprovals.filter((req) => req.id !== id)
            );
        }
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {showFlash && flash?.message && (
                        <div className="mb-6 relative">
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-green-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
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
                                        <span className="sr-only">Tutup</span>
                                        <svg
                                            className="h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Welcome Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div className="p-5 border-b border-gray-200 bg-primary text-primaryLight">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">
                                    Selamat datang, Admin {user?.full_name ?? "User"}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {selectedFaculty && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {selectedFaculty.faculty_name}
                                        </span>
                                    )}
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {user?.role?.role_name || "Admin"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600">
                                Berikut adalah ringkasan aktivitas sistem dan
                                permintaan peminjaman yang perlu persetujuan.
                                {selectedFaculty && (
                                    <span className="block mt-2 text-sm font-medium text-blue-600">
                                        Mengelola fakultas: {selectedFaculty.faculty_name}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-200 bg-primaryLight">
                                <h3 className="text-sm font-medium text-primary">
                                    Total Peminjaman
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-3xl font-bold text-primary">
                                    342
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-200 bg-primaryLight">
                                <h3 className="text-sm font-medium text-primary">
                                    Perlu Persetujuan
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-3xl font-bold text-yellow-500">
                                    {pendingApprovals.length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-200 bg-primaryLight">
                                <h3 className="text-sm font-medium text-primary">
                                    Peminjaman Aktif
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-3xl font-bold text-primary">
                                    28
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-200 bg-primaryLight">
                                <h3 className="text-sm font-medium text-primary">
                                    Total Pengguna
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p className="text-3xl font-bold text-primary">
                                    156
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section Persetujuan Peminjaman */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div className="p-5 border-b border-gray-200 bg-primary text-primaryLight">
                            <h3 className="text-lg font-medium">
                                Persetujuan Peminjaman
                            </h3>
                        </div>
                        <div className="p-5">
                            {pendingApprovals.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-primaryLight">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Ruangan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Peminjam
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingApprovals.map((request) => (
                                                <tr
                                                    key={request.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                        #{request.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {request.ruangan}
                                                        <span className="block text-xs text-gray-500">
                                                            Durasi:{" "}
                                                            {request.durasi}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {formatDate(
                                                            request.tanggal
                                                        )}
                                                        <span className="block text-xs text-gray-500">
                                                            Diajukan:{" "}
                                                            {formatDate(
                                                                request.diajukan
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {request.peminjam}
                                                        <span className="block text-xs text-gray-500">
                                                            {request.email}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handleRequestAction(
                                                                    request.id,
                                                                    "approve"
                                                                )
                                                            }
                                                            className="mr-2 text-green-600 hover:text-green-900"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRequestAction(
                                                                    request.id,
                                                                    "reject"
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada permintaan peminjaman yang perlu
                                    persetujuan saat ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Peminjaman Akan Datang */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div className="p-5 border-b border-gray-200 bg-primary text-primaryLight">
                            <h3 className="text-lg font-medium">
                                Peminjaman Akan Datang
                            </h3>
                        </div>
                        <div className="p-5">
                            {upcomingBookings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-primaryLight">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Ruangan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Peminjam
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {upcomingBookings.map((booking) => (
                                                <tr
                                                    key={booking.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                        #{booking.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {booking.ruangan}
                                                        <span className="block text-xs text-gray-500">
                                                            Durasi:{" "}
                                                            {booking.durasi}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {formatDate(
                                                            booking.tanggal
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {booking.peminjam}
                                                        <span className="block text-xs text-gray-500">
                                                            {booking.email}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                                booking.status
                                                            )}`}
                                                        >
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada peminjaman yang akan datang dalam
                                    waktu dekat.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Aktivitas Sistem */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div className="p-5 border-b border-gray-200 bg-primary text-white">
                            <h3 className="text-lg font-medium">
                                Aktivitas Sistem Terbaru
                            </h3>
                        </div>
                        <div className="p-5">
                            <ul className="divide-y divide-gray-200">
                                {systemActivities.map((activity, index) => (
                                    <li
                                        key={index}
                                        className="py-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start">
                                            <span className="text-xl mr-3">
                                                {activity.icon}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700">
                                                    {activity.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(
                                                        activity.timestamp
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                                    activity.type
                                                )}`}
                                            >
                                                {activity.type === "approval"
                                                    ? "Persetujuan"
                                                    : activity.type ===
                                                      "rejection"
                                                    ? "Penolakan"
                                                    : activity.type === "user"
                                                    ? "Pengguna"
                                                    : "Selesai"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Admin Quick Actions */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                        <div className="p-5 border-b border-gray-200 bg-primary text-primaryLight">
                            <h3 className="text-lg font-medium">
                                Tindakan Cepat Admin
                            </h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150 ease-in-out bg-primary hover:bg-primary/90">
                                Kelola Ruangan
                            </button>
                            <button className="w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150 ease-in-out bg-gray-600 hover:bg-gray-700">
                                Kelola Pengguna
                            </button>
                            <button className="w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150 ease-in-out bg-green-600 hover:bg-green-700">
                                Buat Pengumuman
                            </button>
                            <button className="w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150 ease-in-out bg-red-600 hover:bg-red-700">
                                Laporan Sistem
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
