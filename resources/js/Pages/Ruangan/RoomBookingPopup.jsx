import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Select from "react-select";
import {
    Clock,
    Users,
    BookOpen,
    X,
    ChevronRight,
    ChevronLeft,
    Info,
    Check,
    Building,
    School,
    MapPin,
    Calendar,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { id } from "date-fns/locale";
import TimeRangePicker from "./components/TimePicker";
import DatePicker from "./components/DatePicker";

export default function RoomBookingPopup({ initialCategory, onClose }) {
    const [step, setStep] = useState(1);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [customActivity, setCustomActivity] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const activities = [
        { id: "kuliah", label: "Kuliah", icon: <BookOpen size={20} /> },
        { id: "seminar", label: "Seminar", icon: <Users size={20} /> },
        { id: "rapat", label: "Rapat Organisasi", icon: <Users size={20} /> },
        { id: "ukm", label: "Kegiatan UKM", icon: <Users size={20} /> },
        { id: "studi", label: "Studi Kelompok", icon: <BookOpen size={20} /> },
        { id: "lainnya", label: "Lainnya", icon: <Info size={20} /> },
    ];

    const faculties = [
        {
            value: "fmipa",
            label: "FMIPA - Fakultas Matematika dan Ilmu Pengetahuan Alam",
        },
        { value: "feb", label: "FEB - Fakultas Ekonomi dan Bisnis" },
        { value: "fib", label: "FIB - Fakultas Ilmu Budaya" },
        { value: "fh", label: "FH - Fakultas Hukum" },
    ];

    const buildings = {
        fmipa: [
            { value: "gd-mipa", label: "Gedung MIPA Terpadu" },
            { value: "gd-chem", label: "Gedung Kimia" },
            { value: "gd-math", label: "Gedung Matematika" },
        ],
        feb: [
            { value: "gd-feb-a", label: "Gedung FEB A" },
            { value: "gd-feb-b", label: "Gedung FEB B" },
        ],
        fib: [
            { value: "gd-fib-a", label: "Gedung FIB A" },
            { value: "gd-fib-b", label: "Gedung FIB B" },
        ],
        fh: [
            { value: "gd-fh", label: "Gedung Hukum Utama" },
            { value: "gd-fh-2", label: "Gedung Hukum 2" },
        ],
    };

    const timeSlots = [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
    ];

    useEffect(() => {
        const now = new Date();
        if (isToday(selectedDate)) {
            const currentHour = now.getHours();
            const nextHour = currentHour + 1;
            const formattedTime = `${nextHour.toString().padStart(2, "0")}:00`;
            setStartTime(formattedTime);

            const endHour = nextHour + 2;
            if (endHour <= 20) {
                setEndTime(`${endHour.toString().padStart(2, "0")}:00`);
            } else {
                setEndTime("20:00");
            }
        } else {
            setStartTime("09:00");
            setEndTime("11:00");
        }
    }, [selectedDate]);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                router.visit("/ruangan/list");
            }, 1500);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            onClose();
        }
    };

    const renderProgressBar = () => {
        return (
            <div className="h-1 w-full">
                <div
                    className="h-full transition-all duration-300 bg-primary"
                    style={{
                        width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                    }}
                />
            </div>
        );
    };

    const handleFacultyChange = (selectedOption) => {
        setSelectedFaculty(selectedOption);
        setSelectedBuilding(null);
    };

    const getAvailableBuildings = () => {
        if (!selectedFaculty) return [];
        return buildings[selectedFaculty.value] || [];
    };

    // Style dropdown
    const selectStyles = {
        control: (base) => ({
            ...base,
            minHeight: "42px",
            borderRadius: "0.5rem",
            borderColor: "#e5e7eb",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#365b6d",
            },
            paddingLeft: "36px",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 8px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#374151",
            "&:hover": {
                backgroundColor: "#f9fafb",
            },
        }),
        menu: (base) => ({
            ...base,
            zIndex: 30,
        }),
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
                {/* Header */}
                <div className="p-5 text-white relative bg-primary">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white hover:bg-opacity-20 hover:bg-white rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-semibold mb-1">
                        {step === 1 && "Peminjaman Ruangan - Tujuan Kegiatan"}
                        {step === 2 && "Peminjaman Ruangan - Jadwal & Lokasi"}
                        {step === 3 && "Peminjaman Ruangan - Konfirmasi"}
                    </h2>
                    <p className="text-white text-opacity-80 text-sm">
                        Silakan lengkapi informasi untuk menemukan ruangan yang
                        tersedia
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="grid grid-cols-1">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Tujuan Kegiatan
                                </h3>
                                <p className="text-gray-600">
                                    Pilih tujuan kegiatan untuk peminjaman
                                    ruangan:
                                </p>

                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {activities.map((activity) => (
                                        <button
                                            key={activity.id}
                                            className={`
                                                p-4 border rounded-lg flex flex-col items-center text-center
                                                ${
                                                    selectedActivity ===
                                                    activity.label
                                                        ? "border-primary ring-2 ring-primary ring-opacity-30"
                                                        : "hover:bg-gray-50"
                                                }
                                                transition-all
                                            `}
                                            style={{
                                                backgroundColor:
                                                    selectedActivity ===
                                                    activity.label
                                                        ? "bg-primaryLight"
                                                        : "",
                                            }}
                                            onClick={() =>
                                                setSelectedActivity(
                                                    activity.label
                                                )
                                            }
                                        >
                                            <div
                                                className={`
                                                    p-3 rounded-full mb-2
                                                    ${
                                                        selectedActivity ===
                                                        activity.label
                                                            ? "bg-[#d0dce2] text-primary"
                                                            : "bg-gray-100 text-gray-500"
                                                    }
                                                `}
                                            >
                                                {activity.icon}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {activity.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {selectedActivity === "Lainnya" && (
                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Tuliskan Kegiatan:
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary"
                                            placeholder="Masukkan nama kegiatan"
                                            value={customActivity}
                                            onChange={(e) =>
                                                setCustomActivity(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                Detail Peminjaman Ruangan
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-700 mb-5 flex items-center">
                                        <Calendar
                                            size={18}
                                            className="mr-2 text-gray-500"
                                        />
                                        Jadwal Peminjaman
                                    </h4>

                                    <div className="space-y-5">
                                        <DatePicker
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                        />

                                        <TimeRangePicker
                                            startTime={startTime}
                                            endTime={endTime}
                                            setStartTime={setStartTime}
                                            setEndTime={setEndTime}
                                            timeSlots={timeSlots}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Kapasitas yang dibutuhkan:
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Users
                                                        size={16}
                                                        className="text-gray-500"
                                                    />
                                                </div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    className="w-full p-2.5 pl-10 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary"
                                                    placeholder="Jumlah orang"
                                                    value={capacity}
                                                    onChange={(e) =>
                                                        setCapacity(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-700 mb-5 flex items-center">
                                        <MapPin
                                            size={18}
                                            className="mr-2 text-gray-500"
                                        />
                                        Lokasi Ruangan
                                    </h4>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Fakultas:
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-3 pointer-events-none">
                                                    <School
                                                        size={16}
                                                        className="text-gray-500"
                                                    />
                                                </div>
                                                <Select
                                                    value={selectedFaculty}
                                                    onChange={
                                                        handleFacultyChange
                                                    }
                                                    options={faculties}
                                                    placeholder="Pilih fakultas"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                    isClearable
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Gedung:
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-3 pointer-events-none">
                                                    <Building
                                                        size={16}
                                                        className="text-gray-500"
                                                    />
                                                </div>
                                                <Select
                                                    value={selectedBuilding}
                                                    onChange={
                                                        setSelectedBuilding
                                                    }
                                                    options={getAvailableBuildings()}
                                                    placeholder="Pilih gedung"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                    isDisabled={
                                                        !selectedFaculty
                                                    }
                                                    isClearable
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                            <p className="text-sm text-blue-700 flex items-start">
                                                <svg
                                                    className="h-5 w-5 mr-2 flex-shrink-0"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Sistem akan menampilkan ruangan
                                                yang tersedia berdasarkan
                                                fakultas, gedung, kapasitas, dan
                                                waktu yang dipilih.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="text-center sm:text-left">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Konfirmasi Peminjaman
                                </h3>
                                <p className="text-gray-600">
                                    Silakan periksa detail peminjaman Anda
                                    sebelum melanjutkan
                                </p>
                            </div>

                            {/* Booking Summary Card */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow">
                                {/* Card Header */}
                                <div className="bg-primary p-4 flex items-center">
                                    <Info
                                        size={20}
                                        className="text-white mr-2"
                                    />
                                    <h4 className="font-medium text-white">
                                        Ringkasan Peminjaman
                                    </h4>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Grid Layout for Booking Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
                                        {/* Left Column */}
                                        <div>
                                            <h5 className="text-gray-700 font-medium mb-4 pb-2 border-b border-gray-100">
                                                Informasi Kegiatan
                                            </h5>
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Kegiatan
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedActivity ===
                                                        "Lainnya"
                                                            ? customActivity ||
                                                              "Belum ditentukan"
                                                            : selectedActivity ||
                                                              "Belum ditentukan"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Tanggal
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {format(
                                                            selectedDate,
                                                            "d MMMM yyyy",
                                                            { locale: id }
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Hari
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {format(
                                                            selectedDate,
                                                            "EEEE",
                                                            { locale: id }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div>
                                            <h5 className="text-gray-700 font-medium mb-4 pb-2 border-b border-gray-100">
                                                Informasi Ruangan
                                            </h5>
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Waktu
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {startTime} - {endTime}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Kapasitas
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {capacity} orang
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Fakultas
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedFaculty?.label ||
                                                            "Belum dipilih"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <span className="text-gray-500 mb-1 sm:mb-0">
                                                        Gedung
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedBuilding?.label ||
                                                            "Belum dipilih"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg flex items-start ">
                                        <Check
                                            className="text-primary mt-0.5 mr-3 flex-shrink-0"
                                            size={20}
                                        />
                                        <p className="text-sm text-gray-700">
                                            Pastikan informasi telah sesuai
                                            dengan kriteria peminjaman Anda
                                            sebelum melanjutkan!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {renderProgressBar()}
                {/* Footer */}
                <div className="flex justify-between items-center border-t p-5 bg-gray-50">
                    <button
                        onClick={handleBack}
                        className="flex items-center px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        <ChevronLeft size={18} className="mr-1" />
                        Kembali
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={
                            isSubmitting ||
                            (step === 1 && !selectedActivity) ||
                            (step === 2 &&
                                (!selectedDate ||
                                    !startTime ||
                                    !endTime ||
                                    !selectedFaculty))
                        }
                        className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium ${
                            (step === 1 && !selectedActivity) ||
                            (step === 2 &&
                                (!selectedDate ||
                                    !startTime ||
                                    !endTime ||
                                    !selectedFaculty))
                                ? "bg-gray-400"
                                : "bg-primary"
                        } ${isSubmitting ? "opacity-75" : ""}`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Mencari Ruangan...
                            </span>
                        ) : (
                            <>
                                {step === 3 ? "Cari Ruangan" : "Lanjutkan"}
                                <ChevronRight size={18} className="ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
