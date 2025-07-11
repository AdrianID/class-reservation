import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import GuestLayout from "@/components/Layouts/GuestLayout";

export default function FacultySelection({ faculties, user }) {
    const { data, setData, post, processing, errors } = useForm({
        faculty_id: "",
    });

    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const handleFacultySelect = (faculty) => {
        setSelectedFaculty(faculty);
        setData("faculty_id", faculty.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("faculty.selection.store"));
    };

    return (
        <GuestLayout>
            <Head title="Pilih Fakultas" />

            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Pilih Fakultas
                        </h2>
                        <p className="text-gray-600">
                            Silakan pilih fakultas yang ingin Anda kelola
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.faculty_id && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                {errors.faculty_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {faculties.map((faculty) => (
                                    <div
                                        key={faculty.id}
                                        className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                            selectedFaculty?.id === faculty.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => handleFacultySelect(faculty)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {faculty.faculty_name}
                                                    </h3>
                                                </div>
                                            </div>
                                            {selectedFaculty?.id === faculty.id && (
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {faculty.description && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                {faculty.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>ID: {faculty.id}</span>
                                            <span>
                                                {faculty.buildings_count || 0} Gedung
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    <p>
                                        <strong>User:</strong> {user.full_name}
                                    </p>
                                    <p>
                                        <strong>Role:</strong> {user.role?.role_name}
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!selectedFaculty || processing}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? "Memproses..." : "Pilih Fakultas"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
} 