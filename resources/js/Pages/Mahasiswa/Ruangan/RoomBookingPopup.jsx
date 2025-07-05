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

export default function RoomBookingPopup({
    initialCategory,
    onClose,
    faculties,
    buildings,
}) {
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState("");
    const [selectedActivity, setSelectedActivity] = useState("");
    const [customActivity, setCustomActivity] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";

    const bookingTypes = [
        {
            id: "ruang",
            label: "Pinjam Ruang",
            description: "Peminjaman ruangan untuk kegiatan",
            icon: <Building size={24} />,
        },
        {
            id: "fasilitas",
            label: "Pinjam Fasilitas",
            description: "Peminjaman fasilitas kampus untuk kegiatan",
            icon: <School size={24} />,
        },
    ];

    const activities = [
        { id: "kuliah", label: "Kuliah", icon: <BookOpen size={20} /> },
        { id: "seminar", label: "Seminar", icon: <Users size={20} /> },
        { id: "rapat", label: "Rapat Organisasi", icon: <Users size={20} /> },
        { id: "ukm", label: "Kegiatan UKM", icon: <Users size={20} /> },
        { id: "studi", label: "Studi Kelompok", icon: <BookOpen size={20} /> },
        { id: "lainnya", label: "Lainnya", icon: <Info size={20} /> },
    ];

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
        if (step < 4) {
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
                    className="h-full transition-all duration-300"
                    style={{
                        width:
                            step === 1
                                ? "30%"
                                : step === 2
                                ? "50%"
                                : step === 3
                                ? "70%"
                                : "100%",
                        backgroundColor: primaryColor,
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

    const selectStyles = {
        control: (base) => ({
            ...base,
            minHeight: "42px",
            borderRadius: "0.5rem",
            borderColor: "#e5e7eb",
            boxShadow: "none",
            "&:hover": {
                borderColor: primaryColor,
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

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Peminjaman - Jenis Peminjaman";
            case 2:
                return "Peminjaman - Tujuan Kegiatan";
            case 3:
                return "Peminjaman - Jadwal & Lokasi";
            case 4:
                return "Peminjaman - Konfirmasi";
            default:
                return "Peminjaman";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
                {/* Header */}
                <div
                    className="p-5 text-white relative"
                    style={{ backgroundColor: primaryColor }}
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white hover:bg-opacity-20 hover:bg-white rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-semibold mb-1">
                        {getStepTitle()}
                    </h2>
                    <p className="text-base text-white text-opacity-80">
                        Silakan lengkapi informasi untuk menemukan ruangan atau
                        fasilitas yang tersedia
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Pilih Jenis Peminjaman
                            </h3>
                            <p className="text-base text-gray-600">
                                Tentukan jenis peminjaman yang Anda butuhkan
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {bookingTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                                            bookingType === type.id
                                                ? "border-primary bg-blue-50 shadow-lg"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                        onClick={() => setBookingType(type.id)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className={`p-3 rounded-lg ${
                                                    bookingType === type.id
                                                        ? "text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        bookingType === type.id
                                                            ? primaryColor
                                                            : "",
                                                }}
                                            >
                                                {type.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {type.label}
                                                </h4>
                                                <p className="text-base text-gray-600">
                                                    {type.description}
                                                </p>
                                            </div>
                                            {bookingType === type.id && (
                                                <div className="text-primary">
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Tujuan Kegiatan
                            </h3>
                            <p className="text-base text-gray-600">
                                Pilih tujuan kegiatan untuk peminjaman:
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {activities.map((activity) => (
                                    <button
                                        key={activity.id}
                                        className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                                            selectedActivity === activity.label
                                                ? "border-primary ring-2 ring-primary ring-opacity-30"
                                                : "hover:bg-gray-50"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                selectedActivity ===
                                                activity.label
                                                    ? primaryLightColor
                                                    : "",
                                        }}
                                        onClick={() =>
                                            setSelectedActivity(activity.label)
                                        }
                                    >
                                        <div
                                            className={`p-3 rounded-full mb-2 ${
                                                selectedActivity ===
                                                activity.label
                                                    ? "bg-[#d0dce2] text-primary"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {activity.icon}
                                        </div>
                                        <span className="text-base font-medium">
                                            {activity.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {selectedActivity === "Lainnya" && (
                                <div className="mt-4">
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Tuliskan Kegiatan:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary"
                                        placeholder="Masukkan nama kegiatan"
                                        value={customActivity}
                                        onChange={(e) =>
                                            setCustomActivity(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Detail Peminjaman
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-lg font-medium text-gray-700 mb-5 flex items-center">
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
                                            <label className="block text-base font-medium text-gray-600 mb-2">
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
                                    <h4 className="text-lg font-medium text-gray-700 mb-5 flex items-center">
                                        <MapPin
                                            size={18}
                                            className="mr-2 text-gray-500"
                                        />
                                        Lokasi
                                    </h4>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-base font-medium text-gray-600 mb-2">
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
                                            <label className="block text-base font-medium text-gray-600 mb-2">
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
                                            <p className="text-base text-blue-700 flex items-start">
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
                                                atau fasilitas yang tersedia
                                                berdasarkan pilihan Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-left">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Konfirmasi Peminjaman
                                </h3>
                                <p className="text-base text-gray-600">
                                    Silakan periksa detail peminjaman Anda
                                    sebelum melanjutkan
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow">
                                <div
                                    className="p-4 flex items-center"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Info
                                        size={20}
                                        className="text-white mr-2"
                                    />
                                    <h4 className="text-lg font-medium text-white">
                                        Ringkasan Peminjaman
                                    </h4>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                                Informasi Kegiatan
                                            </h5>
                                            <dl className="space-y-4">
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Jenis Peminjaman
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {bookingTypes.find(
                                                            (type) =>
                                                                type.id ===
                                                                bookingType
                                                        )?.label ||
                                                            "Belum dipilih"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Kegiatan
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedActivity ===
                                                        "Lainnya"
                                                            ? customActivity ||
                                                              "Belum ditentukan"
                                                            : selectedActivity ||
                                                              "Belum ditentukan"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Tanggal
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {format(
                                                            selectedDate,
                                                            "d MMMM yyyy",
                                                            { locale: id }
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Hari
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {format(
                                                            selectedDate,
                                                            "EEEE",
                                                            { locale: id }
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div>
                                            <h5 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                                Informasi Ruangan/Fasilitas
                                            </h5>
                                            <dl className="space-y-4">
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Waktu
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {startTime} - {endTime}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Kapasitas
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {capacity} orang
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Fakultas
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedFaculty?.label ||
                                                            "Belum dipilih"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Gedung
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedBuilding?.label ||
                                                            "Belum dipilih"}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                                        <Check
                                            className="text-primary mt-0.5 mr-3 flex-shrink-0"
                                            size={20}
                                        />
                                        <p className="text-base text-gray-700">
                                            Pastikan informasi telah sesuai
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
                            (step === 1 && !bookingType) ||
                            (step === 2 && !selectedActivity) ||
                            (step === 3 &&
                                (!selectedDate ||
                                    !startTime ||
                                    !endTime ||
                                    !selectedFaculty))
                        }
                        className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium`}
                        style={{
                            backgroundColor:
                                (step === 1 && !bookingType) ||
                                (step === 2 && !selectedActivity) ||
                                (step === 3 &&
                                    (!selectedDate ||
                                        !startTime ||
                                        !endTime ||
                                        !selectedFaculty))
                                    ? "#9ca3af"
                                    : primaryColor,
                            opacity: isSubmitting ? "0.75" : "1",
                        }}
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
                                Mencari...
                            </span>
                        ) : (
                            <>
                                {step === 4 ? "Cari" : "Lanjutkan"}
                                <ChevronRight size={18} className="ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
