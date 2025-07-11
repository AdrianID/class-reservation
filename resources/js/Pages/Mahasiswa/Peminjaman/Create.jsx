import React, { useEffect, useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
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
} from "lucide-react";

export default function Create() {
    const { url } = usePage();
    const [parsedData, setParsedData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
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

    const validateForm = () => {
        const errors = {};
        if (!formData.responsiblePerson.trim()) {
            errors.responsiblePerson = "Responsible person name is required";
        }
        if (!formData.contact.trim()) {
            errors.contact = "Contact information is required";
        }
        if (!formData.permitLetter) {
            errors.permitLetter = "Permit letter is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !parsedData) return;

        setIsSubmitting(true);

        // Buat FormData object untuk mengirim file
        const formDataToSend = new FormData();
        
        // Tambahkan data ruangan dan waktu
        formDataToSend.append('room_id', parsedData.selectedRoom.id);
        formDataToSend.append('booking_date', parsedData.selectedDate);
        formDataToSend.append('start_time', parsedData.startTime);
        formDataToSend.append('end_time', parsedData.endTime);
        formDataToSend.append('purpose', parsedData.selectedActivity);
        formDataToSend.append('number_of_participants', parsedData.capacity);

        // Tambahkan data form
        formDataToSend.append('responsible_person', formData.responsiblePerson);
        formDataToSend.append('contact', formData.contact);
        formDataToSend.append('additional_notes', formData.additionalNotes || '');

        // Tambahkan file-file
        if (formData.permitLetter) {
            formDataToSend.append('permit_letter', formData.permitLetter);
        }
        if (formData.proposal) {
            formDataToSend.append('proposal', formData.proposal);
        }
        if (formData.attendanceList) {
            formDataToSend.append('attendance_list', formData.attendanceList);
        }

        try {
            await router.post('/peminjaman', formDataToSend, {
                forceFormData: true,
                onSuccess: () => {
                    router.visit(route('peminjaman.index'), {
                        replace: true
                    });
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
        }
    };

    if (!parsedData) {
        return (
            <UserLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        Room Booking Request
                    </h2>
                }
            >
                <Head title="Create Booking" />
                <div className="py-12 max-w-4xl mx-auto px-4">
                    <div className="bg-white shadow rounded-lg p-8 text-center">
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

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Room Booking Request
                    </h2>
                    {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Step 3 of 3</span>
                        </div>
                    </div> */}
                </div>
            }
        >
            <Head title="Create Booking" />

            <div className="py-6 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Progress Bar */}
                    {/* <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Almost there! Complete your booking request
                            </span>
                            <span className="text-sm text-gray-500">3/3</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-full transition-all duration-500"></div>
                        </div>
                    </div> */}

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Booking Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-24">
                                {/* Header with toggle button */}
                                <div className="bg-primary px-4 py-3 flex items-center justify-between">
                                    <h3 className="font-medium text-white flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Booking Summary
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                        className="lg:hidden text-white hover:text-primary-light transition-colors"
                                    >
                                        {showDetails ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Booking Details */}
                                <div
                                    className={`${
                                        showDetails ? "block" : "hidden"
                                    } lg:block`}
                                >
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
                                                        : formatDate(
                                                              selectedDate
                                                          )}
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

                                         <div className="flex mt-4">
                                    <Link
                                        href={
                                            route("ruangan.list") +
                                            `?booking=${encodeURIComponent(
                                                JSON.stringify(parsedData)
                                            )}`
                                        }
                                        className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Booking Details
                                    </Link>
                                </div>
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
                                    className="p-6 space-y-6"
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
                                            type="text"
                                            required
                                            value={formData.responsiblePerson}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "responsiblePerson",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all ${
                                                formErrors.responsiblePerson
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Enter the name of the person responsible for this booking"
                                        />
                                        {formErrors.responsiblePerson && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {formErrors.responsiblePerson}
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="h-4 w-4 inline mr-1" />
                                            Contact Information
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contact}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "contact",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all ${
                                                formErrors.contact
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Phone number or email address"
                                        />
                                        {formErrors.contact && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {formErrors.contact}
                                            </p>
                                        )}
                                    </div>

                                    {/* File Uploads Section */}
                                    <div className="border-t pt-6">
                                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
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
                                                    type="file"
                                                    required
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            "permitLetter",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white ${
                                                        formErrors.permitLetter
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                />
                                                {formData.permitLetter && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        {
                                                            formData
                                                                .permitLetter
                                                                .name
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            {formErrors.permitLetter && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {formErrors.permitLetter}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Accepted formats: PDF, DOC,
                                                DOCX, JPG, PNG (Max 10MB)
                                            </p>
                                        </div>

                                        {/* Optional Documents */}
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
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
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white"
                                                />
                                                {formData.proposal && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        {formData.proposal.name}
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
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white"
                                                />
                                                {formData.attendanceList && (
                                                    <div className="mt-2 text-sm text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        {
                                                            formData
                                                                .attendanceList
                                                                .name
                                                        }
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
                                            value={formData.additionalNotes}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "additionalNotes",
                                                    e.target.value
                                                )
                                            }
                                            rows="4"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all resize-none"
                                            placeholder="Any special requirements, setup instructions, or additional information..."
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                        <Link
                                            href={
                                                route("ruangan.list") +
                                                `?booking=${encodeURIComponent(
                                                    JSON.stringify(parsedData)
                                                )}`
                                            }
                                            type="button"
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Room Selection
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                                </form>
                            </div>

                            {/* Important Information */}
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                    <Info className="h-4 w-4 mr-2" />
                                    What happens next?
                                </h4>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                        <span>
                                            Your request will be reviewed within
                                            2-3 business days
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                        <span>
                                            You'll receive email confirmation
                                            once approved
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                        <span>
                                            Make sure all required documents are
                                            properly uploaded
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
