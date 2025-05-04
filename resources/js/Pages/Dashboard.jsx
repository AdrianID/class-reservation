import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export default function Dashboard() {
    const { props } = usePage();
    const user = props.user;

    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";

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

    // Status peminjaman yang sedang diproses
    const [pendingrequests, setPendingRequests] = useState([
        {
            id: "PMJ567",
            ruangan: "Aula Fakultas Teknik",
            tanggal: "2025-05-10T13:00:00",
            durasi: "2 jam",
            tujuan: "Seminar",
            status: "Menunggu Persetujuan",
            estimasi: "1-2 hari kerja",
        },
        {
            id: "PMJ568",
            ruangan: "R. 301 Gedung B",
            tanggal: "2025-05-15T10:00:00",
            durasi: "3 jam",
            tujuan: "Rapat Organisasi",
            status: "Menunggu Persetujuan",
            estimasi: "1-2 hari kerja",
        },
    ]);

    // Aktivitas terbaru
    const [activities, setActivities] = useState([
        {
            icon: "📦",
            message:
                "Peminjaman #PMJ123 untuk ruang Laboratorium Komputer telah disetujui.",
            timestamp: "2025-05-03T09:30:00",
            type: "success",
        },
        {
            icon: "📅",
            message:
                "Pengajuan peminjaman #PMJ567 untuk Aula Fakultas Teknik sedang diproses.",
            timestamp: "2025-05-02T14:20:00",
            type: "pending",
        },
        {
            icon: "✅",
            message:
                "Peminjaman #PMJ456 untuk ruang Diskusi Perpustakaan telah selesai.",
            timestamp: "2025-05-01T16:45:00",
            type: "info",
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
            case "success":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

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
                                                {flash.message ||
                                                    "Pemesanan Anda berhasil dibuat! Mohon tunggu persetujuan administrator."}
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
                        <div
                            className="p-5 border-b border-gray-200"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <div className="flex items-center justify-between">
                                <h3
                                    className="text-lg font-medium"
                                    style={{ color: primaryLightColor }}
                                >
                                    Selamat datang, {user?.name ?? "User"}
                                </h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600">
                                Berikut adalah ringkasan aktivitas dan
                                peminjaman terbaru Anda.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div
                                className="p-5 border-b border-gray-200"
                                style={{ backgroundColor: primaryLightColor }}
                            >
                                <h3
                                    className="text-sm font-medium"
                                    style={{ color: primaryColor }}
                                >
                                    Total Peminjaman
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: primaryColor }}
                                >
                                    128
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div
                                className="p-5 border-b border-gray-200"
                                style={{ backgroundColor: primaryLightColor }}
                            >
                                <h3
                                    className="text-sm font-medium"
                                    style={{ color: primaryColor }}
                                >
                                    Peminjaman Aktif
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: primaryColor }}
                                >
                                    12
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div
                                className="p-5 border-b border-gray-200"
                                style={{ backgroundColor: primaryLightColor }}
                            >
                                <h3
                                    className="text-sm font-medium"
                                    style={{ color: primaryColor }}
                                >
                                    Peminjaman Diproses
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: "#f59e0b" }}
                                >
                                    {pendingrequests.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section Peminjaman Diproses */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div
                            className="p-5 border-b border-gray-200"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <h3
                                className="text-lg font-medium"
                                style={{ color: primaryLightColor }}
                            >
                                Peminjaman Sedang Diproses
                            </h3>
                        </div>
                        <div className="p-5">
                            {pendingrequests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead
                                            style={{
                                                backgroundColor:
                                                    primaryLightColor,
                                            }}
                                        >
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
                                                    Tujuan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingrequests.map((request) => (
                                                <tr
                                                    key={request.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                        style={{
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        #{request.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {request.ruangan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {formatDate(
                                                            request.tanggal
                                                        )}
                                                        <span className="block text-xs text-gray-500">
                                                            Durasi:{" "}
                                                            {request.durasi}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {request.tujuan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            {request.status}
                                                        </span>
                                                        <span className="block text-xs text-gray-500 mt-1">
                                                            Estimasi:{" "}
                                                            {request.estimasi}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada peminjaman yang sedang diproses
                                    saat ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Aktivitas Terbaru */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                        <div
                            className="p-5 border-b border-gray-200"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <h3
                                className="text-lg font-medium"
                                style={{ color: primaryLightColor }}
                            >
                                Aktivitas Terbaru
                            </h3>
                        </div>
                        <div className="p-5">
                            <ul className="divide-y divide-gray-200">
                                {activities.map((activity, index) => (
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
                                                {activity.type === "success"
                                                    ? "Selesai"
                                                    : activity.type ===
                                                      "pending"
                                                    ? "Diproses"
                                                    : "Info"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                        <div
                            className="p-5 border-b border-gray-200"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <h3
                                className="text-lg font-medium"
                                style={{ color: primaryLightColor }}
                            >
                                Tindakan Cepat
                            </h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                className="w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150 ease-in-out"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Pinjam Ruangan Baru
                            </button>
                            <button className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gray-500 transition duration-150 ease-in-out">
                                Lihat Semua Riwayat
                            </button>
                            <button
                                className="w-full py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out"
                                style={{
                                    backgroundColor: primaryLightColor,
                                    color: primaryColor,
                                }}
                            >
                                Cek Status Peminjaman
                            </button>
                            <button
                                className="w-full py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out"
                                style={{
                                    backgroundColor: primaryLightColor,
                                    color: primaryColor,
                                }}
                            >
                                Bantuan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
