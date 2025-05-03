import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { format } from "date-fns";

export default function RoomDetail() {
    // Brand colors
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";

    // Mock data for room details
    const roomDetail = {
        id: 1,
        name: "Kelas A",
        status: "tersedia",
        image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        location: "Jakarta Pusat",
        capacity: "50 orang",
        facilities: ["AC", "Proyektor", "Sound System", "Wi-Fi"],
        description:
            "Ruangan kelas yang nyaman dengan fasilitas lengkap untuk kegiatan belajar mengajar dan presentasi. Tersedia meja dan kursi yang dapat diatur sesuai kebutuhan.",
    };

    const preselectedData = {
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "08:00",
        endTime: "10:00",
        purpose: "Seminar Akademik",
        participant: "50",
    };

    // Booking form state
    const [formData, setFormData] = useState({
        attendees: "",
        responsible_person: "",
        responsible_contact: "",
        notes: "",
        files: {
            permission_letter: null,
            activity_proposal: null,
            attendance_list: null,
        },
    });

    // Form validation state
    const [errors, setErrors] = useState({});

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;

        setFormData({
            ...formData,
            files: {
                ...formData.files,
                [name]: files[0],
            },
        });

        // Clear error for this field when user selects a file
        if (errors[`files.${name}`]) {
            setErrors({
                ...errors,
                [`files.${name}`]: null,
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        const newErrors = {};
        if (!formData.attendees)
            newErrors.attendees = "Jumlah peserta wajib diisi";
        if (!formData.responsible_person)
            newErrors.responsible_person = "Penanggung jawab wajib diisi";
        if (!formData.responsible_contact)
            newErrors.responsible_contact =
                "Kontak penanggung jawab wajib diisi";
        if (!formData.files.permission_letter)
            newErrors["files.permission_letter"] = "Surat izin wajib diunggah";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // In a real application, you would use router.post to submit the form and proceed
        // router.post('/ruangan/booking/confirm', {...preselectedData, ...formData});

        // For demo purposes
        alert("Menuju ke halaman konfirmasi pemesanan");
        // Navigate to next page
        // router.get('/ruangan/booking/confirm');
    };

    return (
        <MahasiswaLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Kelas
                </h2>
            }
        >
            <Head title={`Detail ${roomDetail.name}`} />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href={route("ruangan.list")}
                        className="flex items-center text-sm mb-6 hover:underline"
                        style={{ color: primaryColor }}
                    >
                        <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Kembali ke Daftar Kelas
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Room Details Section */}
                        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="h-80 bg-gray-200 relative">
                                <img
                                    src={roomDetail.image}
                                    alt={roomDetail.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3
                                    className="text-2xl font-medium mb-4"
                                    style={{ color: primaryColor }}
                                >
                                    {roomDetail.name}
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="text-lg font-medium mb-3 text-gray-700">
                                            Informasi Kelas
                                        </h4>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg
                                                    className="h-5 w-5 mr-2 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    Lokasi:{" "}
                                                    {roomDetail.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg
                                                    className="h-5 w-5 mr-2 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    Kapasitas:{" "}
                                                    {roomDetail.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-medium mb-3 text-gray-700">
                                            Fasilitas
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {roomDetail.facilities.map(
                                                (facility, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-3 py-1.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                primaryLightColor,
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        {facility}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-lg font-medium mb-2 text-gray-700">
                                        Deskripsi
                                    </h4>
                                    <p className="text-gray-600">
                                        {roomDetail.description}
                                    </p>
                                </div>

                                <div
                                    className="p-4 rounded-lg"
                                    style={{
                                        backgroundColor: primaryLightColor,
                                    }}
                                >
                                    <div className="flex items-center">
                                        <svg
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: primaryColor }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: primaryColor }}
                                        >
                                            Pastikan untuk membersihkan ruangan
                                            setelah digunakan dan melaporkan
                                            jika ada kerusakan fasilitas.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form Section */}
                        <div className="bg-white shadow rounded-lg border border-gray-200 h-fit sticky top-6">
                            <div
                                className="p-5 border-b border-gray-200"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <h3 className="text-lg font-medium text-white">
                                    Lengkapi Pemesanan
                                </h3>
                            </div>
                            <div className="p-6">
                                {/* Pre-selected information display */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Informasi Pemesanan
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center justify-between">
                                            <span>Tanggal:</span>
                                            <span className="font-medium">
                                                {preselectedData.date}
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>Waktu:</span>
                                            <span className="font-medium">
                                                {preselectedData.startTime} -{" "}
                                                {preselectedData.endTime}
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>Kegiatan:</span>
                                            <span className="font-medium">
                                                {preselectedData.purpose}
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>Jumlah Peserta:</span>
                                            <span className="font-medium">
                                                {preselectedData.participant}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        {/* Responsible Person field */}
                                        <div>
                                            <label
                                                htmlFor="responsible_person"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Penanggung Jawab{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="responsible_person"
                                                name="responsible_person"
                                                value={
                                                    formData.responsible_person
                                                }
                                                onChange={handleChange}
                                                placeholder="Nama penanggung jawab"
                                                className={`w-full px-3 py-2 border ${
                                                    errors.responsible_person
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm`}
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            />
                                            {errors.responsible_person && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.responsible_person}
                                                </p>
                                            )}
                                        </div>

                                        {/* Contact Information field */}
                                        <div>
                                            <label
                                                htmlFor="responsible_contact"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Kontak Penanggung Jawab{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                id="responsible_contact"
                                                name="responsible_contact"
                                                value={
                                                    formData.responsible_contact
                                                }
                                                onChange={handleChange}
                                                placeholder="No. HP atau Email"
                                                className={`w-full px-3 py-2 border ${
                                                    errors.responsible_contact
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm`}
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            />
                                            {errors.responsible_contact && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.responsible_contact}
                                                </p>
                                            )}
                                        </div>

                                        {/* File Upload - Permission Letter */}
                                        <div>
                                            <label
                                                htmlFor="permission_letter"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Surat Izin{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="file"
                                                id="permission_letter"
                                                name="permission_letter"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className={`w-full px-3 py-2 border ${
                                                    errors[
                                                        "files.permission_letter"
                                                    ]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm`}
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            />
                                            {errors[
                                                "files.permission_letter"
                                            ] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {
                                                        errors[
                                                            "files.permission_letter"
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Format: PDF, DOC, DOCX (Max:
                                                2MB)
                                            </p>
                                        </div>

                                        {/* File Upload - Activity Proposal */}
                                        <div>
                                            <label
                                                htmlFor="activity_proposal"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Proposal Kegiatan
                                            </label>
                                            <input
                                                type="file"
                                                id="activity_proposal"
                                                name="activity_proposal"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Format: PDF, DOC, DOCX (Max:
                                                5MB)
                                            </p>
                                        </div>

                                        {/* File Upload - Attendance List */}
                                        <div>
                                            <label
                                                htmlFor="attendance_list"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Daftar Hadir
                                            </label>
                                            <input
                                                type="file"
                                                id="attendance_list"
                                                name="attendance_list"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Format: PDF, DOC, DOCX, XLS,
                                                XLSX (Max: 2MB)
                                            </p>
                                        </div>

                                        {/* Notes field */}
                                        <div>
                                            <label
                                                htmlFor="notes"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Catatan Tambahan (Opsional)
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="3"
                                                placeholder="Tambahkan catatan khusus atau permintaan tambahan"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                                                style={{
                                                    focusRing:
                                                        primaryLightColor,
                                                }}
                                            ></textarea>
                                        </div>

                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium transition duration-150 ease-in-out"
                                            style={{
                                                backgroundColor: primaryColor,
                                            }}
                                        >
                                            Ajukan Pemesanan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
