import AuthenticatedLayout from "@/Layouts/MahasiswaLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Selamat datang di Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Ringkasan */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Peminjaman
                        </h2>
                        <p className="text-3xl font-bold text-indigo-600">
                            128
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Pengguna Aktif
                        </h2>
                        <p className="text-3xl font-bold text-green-600">54</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Notifikasi Baru
                        </h2>
                        <p className="text-3xl font-bold text-red-500">7</p>
                    </div>
                </div>

                {/* Section Tambahan */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Aktivitas Terbaru
                    </h2>
                    <ul className="space-y-2">
                        <li className="bg-white p-4 rounded shadow text-sm text-gray-700">
                            📦 Peminjaman #PMJ123 oleh Budi telah dikembalikan.
                        </li>
                        <li className="bg-white p-4 rounded shadow text-sm text-gray-700">
                            📅 Jadwal peminjaman baru oleh Sinta.
                        </li>
                        <li className="bg-white p-4 rounded shadow text-sm text-gray-700">
                            🛠️ Admin menambahkan item baru ke daftar inventaris.
                        </li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
