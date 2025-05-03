import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Building,
    ArrowRight,
    Clock,
    Bookmark,
    History,
    Info,
    ChevronRight,
} from "lucide-react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import RoomBookingPopup from "./RoomBookingPopup";

export default function Ruangan() {
    const primaryColor = "#365b6d";

    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategoryClick = (categoryTitle) => {
        setSelectedCategory(categoryTitle);
        setPopupOpen(true);
    };

    const categories = [
        {
            id: "fakultas-sendiri",
            title: "Pinjam Ruang Fakultas Sendiri",
            description: "Pinjam ruangan yang tersedia di fakultas Anda",
            icon: <Building className="h-10 w-10" />,
            route: "/ruangan/fakultas-sendiri",
            bgClass: "bg-blue-50",
            borderClass: "border-blue-200",
        },
        {
            id: "lintas-fakultas",
            title: "Pinjam Ruang Lintas Fakultas",
            description: "Pinjam ruangan yang berada di fakultas lain",
            icon: <ArrowRight className="h-10 w-10" />,
            route: "/ruangan/lintas-fakultas",
            bgClass: "bg-teal-50",
            borderClass: "border-teal-200",
        },
        {
            id: "umum-kampus",
            title: "Pinjam Ruang Umum Kampus",
            description:
                "Pinjam ruangan umum yang dapat digunakan oleh seluruh civitas akademika",
            icon: <Building className="h-10 w-10" />,
            route: "/ruangan/umum-kampus",
            bgClass: "bg-purple-50",
            borderClass: "border-purple-200",
        },
        {
            id: "khusus",
            title: "Pinjam Ruang Khusus",
            description:
                "Pinjam ruangan khusus seperti laboratorium, studio, dll",
            icon: <Bookmark className="h-10 w-10" />,
            route: "/ruangan/khusus",
            bgClass: "bg-amber-50",
            borderClass: "border-amber-200",
        },
    ];

    return (
        <MahasiswaLayout
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
                                    Pilih kategori peminjaman ruangan sesuai
                                    kebutuhan Anda
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

                    {/* Category Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h2
                                className="text-xl font-semibold mb-6"
                                style={{ color: primaryColor }}
                            >
                                Kategori Peminjaman
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            handleCategoryClick(category.title)
                                        }
                                        className={`text-left w-full p-5 border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${category.bgClass} ${category.borderClass}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className="p-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        primaryColor,
                                                }}
                                            >
                                                <div className="text-white">
                                                    {category.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <h3
                                                    className="text-lg font-medium"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    {category.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {category.description}
                                                </p>
                                                <div
                                                    className="mt-3 flex items-center"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    <span className="text-sm font-medium">
                                                        Pilih
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <Link
                                href="/ruangan/riwayat"
                                className="block p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className="p-3 rounded-full mr-4"
                                            style={{
                                                backgroundColor: primaryColor,
                                            }}
                                        >
                                            <History className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                className="text-lg font-medium"
                                                style={{ color: primaryColor }}
                                            >
                                                Riwayat Peminjaman Saya
                                            </h3>
                                            <p className="text-gray-600">
                                                Lihat daftar dan status
                                                peminjaman ruangan Anda
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        className="h-6 w-6"
                                        style={{ color: primaryColor }}
                                    />
                                </div>
                            </Link>
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
                />
            )}
        </MahasiswaLayout>
    );
}
