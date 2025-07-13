import React, { useEffect, useState, useRef } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import UserLayout from "@/components/Layouts/UserLayout";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Building,
    School,
    FileText,
    Upload,
    Send,
    Edit,
    Info,
    Zap,
    Image,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Phone,
    Mail,
    User,
    FileCheck,
    MessageSquare,
    Eye,
    EyeOff,
    ChevronUp,
    ChevronDown,
    X,
    Menu,
} from "lucide-react";

export default function Create() {
    const { url } = usePage();
    const [parsedData, setParsedData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [formData, setFormData] = useState({
        responsiblePerson: "",
        contact: "",
        permitLetter: null,
        proposal: null,
        attendanceList: null,
        additionalNotes: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        const raw = urlParams.get("data");
        if (raw) {
            try {
                setParsedData(JSON.parse(decodeURIComponent(raw)));
            } catch (err) {
                console.error("Invalid booking data");
            }
        }
    }, [url]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleFileChange = (field, file) => {
        setFormData((prev) => ({
            ...prev,
            [field]: file,
        }));
        // Clear error when file is selected
        if (formErrors[field]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const responsibleRef = useRef(null);
    const contactRef = useRef(null);
    const permitLetterRef = useRef(null);

    const validateForm = () => {
        const errors = {};

        const contact = formData.contact.trim();
        const isValidEmail = (email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidPhone = (phone) => /^\d{8,15}$/.test(phone);

        if (!formData.responsiblePerson.trim()) {
            errors.responsiblePerson = "Responsible person name is required";
        }

        if (!contact) {
            errors.contact = "Contact information is required";
        } else if (!isValidEmail(contact) && !isValidPhone(contact)) {
            errors.contact =
                "Please enter a valid phone number or email address";
        }

        if (!formData.permitLetter) {
            errors.permitLetter = "Permit letter is required";
        }

        setFormErrors(errors);

        if (errors.responsiblePerson) {
            responsibleRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        } else if (errors.contact) {
            contactRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        } else if (errors.permitLetter) {
            permitLetterRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !parsedData) return;

        // Show loading alert
        Swal.fire({
            title: "Submitting Request...",
            text: "Please wait while we process your booking request",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setIsSubmitting(true);

        // Buat FormData object untuk mengirim file
        const formDataToSend = new FormData();

        // Tambahkan data ruangan dan waktu
        formDataToSend.append("room_id", parsedData.selectedRoom.id);
        formDataToSend.append("booking_date", parsedData.selectedDate);
        formDataToSend.append("start_time", parsedData.startTime);
        formDataToSend.append("end_time", parsedData.endTime);
        formDataToSend.append("purpose", parsedData.selectedActivity);
        formDataToSend.append("number_of_participants", parsedData.capacity);

        // Tambahkan data form
        formDataToSend.append("responsible_person", formData.responsiblePerson);
        formDataToSend.append("contact", formData.contact);
        formDataToSend.append(
            "additional_notes",
            formData.additionalNotes || ""
        );

        // Tambahkan file-file
        if (formData.permitLetter) {
            formDataToSend.append("permit_letter", formData.permitLetter);
        }
        if (formData.proposal) {
            formDataToSend.append("proposal", formData.proposal);
        }
        if (formData.attendanceList) {
            formDataToSend.append("attendance_list", formData.attendanceList);
        }

        try {
            await router.post("/peminjaman", formDataToSend, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Your booking request has been submitted successfully.",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        willClose: () => {
                            // The redirect will be handled by the controller
                            // This is just to show the success message before redirect
                        },
                    });
                },
                onError: (errors) => {
                    Swal.close();
                    setFormErrors(errors);
                    setIsSubmitting(false);

                    // Show error alert
                    Swal.fire({
                        icon: "error",
                        title: "Submission Failed",
                        text: "There was an error submitting your request. Please check the form and try again.",
                        confirmButtonText: "OK",
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
            Swal.close();

            // Show error alert for unexpected errors
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: "An unexpected error occurred. Please try again.",
                confirmButtonText: "OK",
            });
        }
    };

    if (!parsedData) {
        return (
            <UserLayout
                header={
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Room Booking Request
                    </h2>
                }
            >
                <Head title="Create Booking" />
                <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4">
                    <div className="bg-white shadow rounded-lg p-6 sm:p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading booking data...</p>
                    </div>
                </div>
            </UserLayout>
        );
    }

    const {
        selectedRoom,
        selectedDate,
        endDate,
        startTime,
        endTime,
        selectedActivity,
        selectedBuilding,
        selectedFaculty,
        capacity,
        isRangeMode,
    } = parsedData;

    // Mobile Summary Modal Component
    const SummaryModal = () => (
        <div
            className={`fixed inset-0 z-50 ${
                showSummaryModal ? "block" : "hidden"
            } lg:hidden`}
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowSummaryModal(false)}
            ></div>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Booking Summary
                    </h3>
                    <button
                        onClick={() => setShowSummaryModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Date & Time */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-sm mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium text-gray-700">
                                {isRangeMode && endDate
                                    ? `${formatDate(
                                          selectedDate
                                      )} - ${formatDate(endDate)}`
                                    : formatDate(selectedDate)}
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium text-gray-700">
                                {startTime} - {endTime}
                            </span>
                        </div>
                    </div>

                    {/* Room Info */}
                    <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            {selectedRoom?.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                            {selectedRoom?.location}
                        </p>
                        {selectedRoom?.image && (
                            <img
                                src={selectedRoom.image}
                                alt={selectedRoom.name}
                                className="w-full h-24 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center text-sm">
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-gray-600">
                                {selectedActivity}
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <School className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-gray-600">
                                {selectedFaculty?.label}
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-gray-600">
                                {capacity} people
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-gray-600">
                                {selectedBuilding?.label}
                            </span>
                        </div>
                    </div>

                    {/* Facilities */}
                    {selectedRoom?.facilities && (
                        <div className="border-t pt-4">
                            <h5 className="font-medium text-gray-700 mb-2">
                                Available Facilities
                            </h5>
                            <div className="flex flex-wrap gap-1">
                                {selectedRoom.facilities.map(
                                    (facility, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-1 rounded-full bg-primary-light text-primary"
                                        >
                                            {facility}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Link
                            href={
                                route("ruangan.list") +
                                `?booking=${encodeURIComponent(
                                    JSON.stringify(parsedData)
                                )}`
                            }
                            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Booking Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Room Booking Request
                    </h2>
                    {/* Mobile Summary Button */}
                    <button
                        onClick={() => setShowSummaryModal(true)}
                        className="lg:hidden bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Summary
                    </button>
                </div>
            }
        >
            <Head title="Create Booking" />
            <SummaryModal />

            <div className="py-4 sm:py-6 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Mobile Quick Summary Card */}
                    <div className="lg:hidden mb-4 bg-white shadow rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800">
                                    {selectedRoom?.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {formatDate(selectedDate)} • {startTime} -{" "}
                                    {endTime}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSummaryModal(true)}
                                className="text-primary hover:text-primary-dark"
                            >
                                <ChevronUp className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Column - Desktop Booking Summary */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-24">
                                <div className="bg-primary px-4 py-3">
                                    <h3 className="font-medium text-white flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Booking Summary
                                    </h3>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Date & Time */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center text-sm mb-2">
                                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                                            <span className="font-medium text-gray-700">
                                                {isRangeMode && endDate
                                                    ? `${formatDate(
                                                          selectedDate
                                                      )} - ${formatDate(
                                                          endDate
                                                      )}`
                                                    : formatDate(selectedDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 mr-2 text-primary" />
                                            <span className="font-medium text-gray-700">
                                                {startTime} - {endTime}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Room Info */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                                            {selectedRoom?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {selectedRoom?.location}
                                        </p>
                                        {selectedRoom?.image && (
                                            <img
                                                src={selectedRoom.image}
                                                alt={selectedRoom.name}
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Zap className="h-4 w-4 mr-2 text-primary" />
                                            <span className="text-gray-600">
                                                {selectedActivity}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <School className="h-4 w-4 mr-2 text-primary" />
                                            <span className="text-gray-600">
                                                {selectedFaculty?.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Users className="h-4 w-4 mr-2 text-primary" />
                                            <span className="text-gray-600">
                                                {capacity} people
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Building className="h-4 w-4 mr-2 text-primary" />
                                            <span className="text-gray-600">
                                                {selectedBuilding?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    {selectedRoom?.facilities && (
                                        <div className="border-t pt-4">
                                            <h5 className="font-medium text-gray-700 mb-2">
                                                Available Facilities
                                            </h5>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedRoom.facilities.map(
                                                    (facility, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs px-2 py-1 rounded-full bg-primary-light text-primary"
                                                        >
                                                            {facility}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Link
                                            href={
                                                route("ruangan.list") +
                                                `?booking=${encodeURIComponent(
                                                    JSON.stringify(parsedData)
                                                )}`
                                            }
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Booking Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="bg-primary px-4 py-3">
                                    <h3 className="font-medium text-white flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Request Information
                                    </h3>
                                    <p className="text-primary-light text-sm mt-1">
                                        Please provide the required information
                                        to complete your booking
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                                >
                                    {/* Responsible Person */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="h-4 w-4 inline mr-1" />
                                            Responsible Person
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            ref={responsibleRef}
                                            type="text"
                                            required
                                            value={formData.responsiblePerson}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "responsiblePerson",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm sm:text-base ${
                                                formErrors.responsiblePerson
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Enter the name of the person responsible"
                                        />
                                        {formErrors.responsiblePerson && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                {formErrors.responsiblePerson}
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {formData.contact.includes("@") ? (
                                                <Mail className="h-4 w-4 inline mr-1" />
                                            ) : (
                                                <Phone className="h-4 w-4 inline mr-1" />
                                            )}
                                            Contact Information
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            ref={responsibleRef}
                                            type="text"
                                            required
                                            value={formData.contact}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "contact",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm sm:text-base ${
                                                formErrors.contact
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Phone number or email address"
                                        />
                                        {formErrors.contact && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                {formErrors.contact}
                                            </p>
                                        )}
                                    </div>

                                    {/* File Uploads Section */}
                                    <div className="border-t pt-4 sm:pt-6">
                                        <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Required Documents
                                        </h4>

                                        {/* Permit Letter */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FileCheck className="h-4 w-4 inline mr-1" />
                                                Permit Letter
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={responsibleRef}
                                                    type="file"
                                                    required
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            "permitLetter",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white ${
                                                        formErrors.permitLetter
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                />
                                                {formData.permitLetter && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                        <span className="break-all">
                                                            {
                                                                formData
                                                                    .permitLetter
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {formErrors.permitLetter && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                    {formErrors.permitLetter}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Accepted: PDF, DOC, DOCX, JPG,
                                                PNG (Max 10MB)
                                            </p>
                                        </div>

                                        {/* Optional Documents */}
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-4">
                                            <h5 className="font-medium text-gray-700">
                                                Optional Documents
                                            </h5>

                                            {/* Proposal */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Activity Proposal
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            "proposal",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white"
                                                />
                                                {formData.proposal && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                        <span className="break-all">
                                                            {
                                                                formData
                                                                    .proposal
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Attendance List */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Attendance List
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            "attendanceList",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white"
                                                />
                                                {formData.attendanceList && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                        <span className="break-all">
                                                            {
                                                                formData
                                                                    .attendanceList
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MessageSquare className="h-4 w-4 inline mr-1" />
                                            Additional Notes
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.additionalNotes}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "additionalNotes",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all text-sm sm:text-base resize-none"
                                            placeholder="Any additional information or special requirements..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="border-t pt-4 sm:pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-150 ease-in-out flex items-center justify-center text-sm sm:text-base ${
                                                isSubmitting
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-primary hover:bg-primary-dark text-white"
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Submit Booking Request
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Form Info */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-start">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-blue-800 font-medium mb-1">
                                                    Important Information
                                                </p>
                                                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                                                    <li>
                                                        • Your booking request
                                                        will be reviewed by
                                                        administrators
                                                    </li>
                                                    <li>
                                                        • You will receive an
                                                        email notification about
                                                        the approval status
                                                    </li>
                                                    <li>
                                                        • Please ensure all
                                                        required documents are
                                                        uploaded
                                                    </li>
                                                    <li>
                                                        • Contact information
                                                        should be active for
                                                        communication
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
