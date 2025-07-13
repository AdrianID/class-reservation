import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Building2, CheckCircle, Shield, Users, Settings } from "lucide-react";

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
        <>
            <Head title="Select Faculty - Super Admin" />

            <div className="min-h-screen bg-gradient-to-br from-background via-primary-light to-background">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h1 className="ml-3 text-xl font-semibold text-gray-900">
                                        Super Admin Portal
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.full_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.role?.role_name}
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                            <Settings className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Select Faculty to Manage
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose which faculty you want to access and manage.
                            You'll be redirected to the admin dashboard for the
                            selected faculty.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <form
                            id="faculty-selection-form"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Action Bar - Desktop */}
                            <div className="hidden md:flex items-center justify-between pb-6 border-b border-gray-200">
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1">
                                        <span className="font-medium">
                                            Total Faculties:
                                        </span>{" "}
                                        {faculties.length}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Selected:
                                        </span>{" "}
                                        {selectedFaculty
                                            ? selectedFaculty.faculty_name
                                            : "None"}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            (window.location.href =
                                                route("logout"))
                                        }
                                        className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            !selectedFaculty || processing
                                        }
                                        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Enter Admin Dashboard
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errors.faculty_id && (
                                <div className="bg-danger-light border border-danger rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-danger rounded-full flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-danger-dark">
                                                {errors.faculty_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {faculties.map((faculty) => (
                                    <div
                                        key={faculty.id}
                                        className={`relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                                            selectedFaculty?.id === faculty.id
                                                ? "border-primary bg-primary-light/30 ring-2 ring-primary"
                                                : "border-gray-200 bg-white"
                                        }`}
                                        onClick={() =>
                                            handleFacultySelect(faculty)
                                        }
                                    >
                                        {/* Selection indicator */}
                                        {selectedFaculty?.id === faculty.id && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {/* Faculty Icon */}
                                        <div className="text-center mb-4">
                                            <div
                                                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                                                    selectedFaculty?.id ===
                                                    faculty.id
                                                        ? "bg-primary text-white"
                                                        : "bg-primary-light text-primary"
                                                }`}
                                            >
                                                <Building2 className="w-8 h-8" />
                                            </div>
                                        </div>

                                        {/* Faculty Name */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {faculty.faculty_name}
                                            </h3>
                                            {faculty.description && (
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {faculty.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Faculty Stats */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 flex items-center">
                                                    <Building2 className="w-4 h-4 mr-1" />
                                                    Total Buildings
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {faculty.buildings_count ??
                                                        0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Fixed Bottom Bar */}
                            <div className="md:hidden">
                                <div className="pb-20">
                                    {/* Spacer for fixed bottom bar */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Mobile Fixed Bottom Action Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs text-gray-600">
                                <p>
                                    <span className="font-medium">
                                        Selected:
                                    </span>{" "}
                                    {selectedFaculty
                                        ? selectedFaculty.faculty_name
                                        : "None"}
                                </p>
                            </div>
                            <div className="text-xs text-gray-500">
                                {faculties.length} faculties
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() =>
                                    (window.location.href = route("logout"))
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                Logout
                            </button>
                            <button
                                type="submit"
                                form="faculty-selection-form"
                                disabled={!selectedFaculty || processing}
                                className="flex-1 px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Enter Dashboard
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
