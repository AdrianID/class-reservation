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
                <h2
                    className="text-xl font-semibold leading-tight"
                    style={{ color: primaryColor }}
                >
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
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

                <h1
                    className="text-2xl font-bold mb-6"
                    style={{ color: primaryColor }}
                >
                    Selamat datang, {user?.name ?? "User"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card Ringkasan */}
                    <div
                        className="bg-white rounded-lg shadow p-5 border-t-4"
                        style={{ borderColor: primaryColor }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Peminjaman
                        </h2>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: primaryColor }}
                        >
                            128
                        </p>
                    </div>

                    <div
                        className="bg-white rounded-lg shadow p-5 border-t-4"
                        style={{ borderColor: primaryColor }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">
                            Peminjaman Aktif
                        </h2>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: primaryColor }}
                        >
                            12
                        </p>
                    </div>

                    <div
                        className="bg-white rounded-lg shadow p-5 border-t-4"
                        style={{ borderColor: primaryColor }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">
                            Peminjaman Diproses
                        </h2>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: "#f59e0b" }}
                        >
                            {pendingrequests.length}
                        </p>
                    </div>
                </div>

                {/* Section Peminjaman Diproses */}
                <div className="mt-10">
                    <h2
                        className="text-xl font-semibold mb-4"
                        style={{ color: primaryColor }}
                    >
                        Peminjaman Sedang Diproses
                    </h2>

                    {pendingrequests.length > 0 ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead
                                    style={{
                                        backgroundColor: primaryLightColor,
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
                                                style={{ color: primaryColor }}
                                            >
                                                #{request.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {request.ruangan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {formatDate(request.tanggal)}
                                                <span className="block text-xs text-gray-500">
                                                    Durasi: {request.durasi}
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
                                                    Estimasi: {request.estimasi}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                            Tidak ada peminjaman yang sedang diproses saat ini.
                        </div>
                    )}
                </div>

                {/* Section Aktivitas Terbaru */}
                <div className="mt-10">
                    <h2
                        className="text-xl font-semibold mb-4"
                        style={{ color: primaryColor }}
                    >
                        Aktivitas Terbaru
                    </h2>
                    <div className="bg-white rounded-lg shadow">
                        <ul className="divide-y divide-gray-200">
                            {activities.map((activity, index) => (
                                <li
                                    key={index}
                                    className="p-4 hover:bg-gray-50"
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
                                                {formatDate(activity.timestamp)}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                                activity.type
                                            )}`}
                                        >
                                            {activity.type === "success"
                                                ? "Selesai"
                                                : activity.type === "pending"
                                                ? "Diproses"
                                                : "Info"}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Ringkasan Peminjaman */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-5">
                        <h2
                            className="text-lg font-semibold mb-4"
                            style={{ color: primaryColor }}
                        >
                            Statistik Peminjaman
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Disetujui
                                </span>
                                <div className="w-2/3">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: "75%",
                                                backgroundColor: primaryColor,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: primaryColor }}
                                >
                                    75%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Ditolak
                                </span>
                                <div className="w-2/3">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full"
                                            style={{ width: "10%" }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-red-500">
                                    10%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Diproses
                                </span>
                                <div className="w-2/3">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 rounded-full"
                                            style={{ width: "15%" }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-yellow-500">
                                    15%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5">
                        <h2
                            className="text-lg font-semibold mb-4"
                            style={{ color: primaryColor }}
                        >
                            Tindakan Cepat
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="p-3 rounded text-white text-sm font-medium"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Pinjam Ruangan Baru
                            </button>
                            <button className="p-3 rounded text-white text-sm font-medium bg-gray-500">
                                Lihat Semua Riwayat
                            </button>
                            <button
                                className="p-3 rounded text-gray-700 text-sm font-medium"
                                style={{ backgroundColor: primaryLightColor }}
                            >
                                Cek Status Peminjaman
                            </button>
                            <button
                                className="p-3 rounded text-gray-700 text-sm font-medium"
                                style={{ backgroundColor: primaryLightColor }}
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
