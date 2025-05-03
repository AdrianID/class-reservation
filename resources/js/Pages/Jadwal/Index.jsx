import UserLayout from "@/Layouts/UserLayout";
import ExpandedCalendar from "./components/ExpandedCalendar";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "@inertiajs/react";

export default function Jadwal() {
    // Brand colors
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);

    const [showExpandedCalendar, setShowExpandedCalendar] = useState(false);

    // Sample class data
    const classRooms = [
        {
            id: 1,
            name: "Kelas A",
            status: "tersedia",
            image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Jakarta Pusat",
            capacity: "50 orang",
            facilities: ["AC", "Proyektor", "Sound System"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "ada jadwal", // Added schedule status
        },
        {
            id: 2,
            name: "Kelas B",
            status: "digunakan",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Jakarta Selatan",
            capacity: "40 orang",
            facilities: ["AC", "Sound System"],
            badgeColor: "bg-yellow-100 text-yellow-800",
            scheduleStatus: "ada jadwal", // Added schedule status
        },
        {
            id: 3,
            name: "Kelas C",
            status: "maintenance",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Jakarta Barat",
            capacity: "30 orang",
            facilities: ["AC", "Proyektor", "Wi-Fi"],
            badgeColor: "bg-red-100 text-red-800",
            scheduleStatus: "tidak ada jadwal", // Added schedule status
        },
        {
            id: 4,
            name: "Kelas D",
            status: "tersedia",
            image: "https://media.istockphoto.com/id/1087223748/photo/modern-classroom-with-large-panoramic-windows-and-white-desks-bright-interior.webp?a=1&s=612x612&w=0&k=20&c=Ht3bVO3-WL7eGtlLHGYmQIz63AUmiAugflbo-acl7qI=",
            location: "Jakarta Utara",
            capacity: "45 orang",
            facilities: ["AC", "Proyektor", "Sound System", "Wi-Fi"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "ada jadwal", // Added schedule status
        },
        {
            id: 5,
            name: "Kelas E",
            status: "tersedia",
            image: "https://images.unsplash.com/photo-1635424239131-32dc44986b56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Jakarta Timur",
            capacity: "35 orang",
            facilities: ["AC", "Wi-Fi"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "tidak ada jadwal", // Added schedule status
        },
        {
            id: 6,
            name: "Kelas F",
            status: "digunakan",
            image: "https://images.unsplash.com/photo-1617721926586-4eecce739745?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Depok",
            capacity: "40 orang",
            facilities: ["AC", "Proyektor", "Sound System", "Wi-Fi"],
            badgeColor: "bg-yellow-100 text-yellow-800",
            scheduleStatus: "ada jadwal", // Added schedule status
        },
    ];

    // Filter classes based on search term
    useEffect(() => {
        const filtered = classRooms.filter(
            (classRoom) =>
                classRoom.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                classRoom.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setFilteredClasses(filtered);
    }, [searchTerm]);

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "tersedia":
                return "bg-green-100 text-green-800";
            case "digunakan":
                return "bg-yellow-100 text-yellow-800";
            case "maintenance":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Status label
    const getStatusLabel = (status) => {
        switch (status) {
            case "tersedia":
                return "Tersedia";
            case "digunakan":
                return "Digunakan";
            case "maintenance":
                return "Maintenance";
            default:
                return status;
        }
    };

    // Schedule status badge color
    const getScheduleStatusBadge = (status) => {
        switch (status) {
            case "ada jadwal":
                return "bg-blue-100 text-blue-800";
            case "tidak ada jadwal":
                return "bg-gray-100 text-gray-500";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Generate week days
    useEffect(() => {
        const today = new Date();
        const days = [];

        // Generate 3 days before today
        for (let i = 3; i > 0; i--) {
            days.push(subDays(today, i));
        }

        // Add today
        days.push(today);

        // Generate 3 days after today
        for (let i = 1; i <= 3; i++) {
            days.push(addDays(today, i));
        }

        setWeekDays(days);
    }, []);

    // Navigate to previous week
    const previousWeek = () => {
        const newDays = weekDays.map((day) => subDays(day, 7));
        setWeekDays(newDays);
    };

    // Navigate to next week
    const nextWeek = () => {
        const newDays = weekDays.map((day) => addDays(day, 7));
        setWeekDays(newDays);
    };

    // Format day name
    const formatDayName = (date) => {
        return format(date, "EEE", { locale: id });
    };

    // Format day number
    const formatDayNumber = (date) => {
        return format(date, "d", { locale: id });
    };

    // Check if date is today
    const isToday = (date) => {
        return isSameDay(date, new Date());
    };

    // Get current month and year
    const getCurrentMonthYear = () => {
        if (weekDays.length === 0) return "";
        return format(weekDays[3], "MMMM yyyy", { locale: id });
    };

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Jadwal Kelas
                </h2>
            }
        >
            <Head title="Jadwal Kelas" />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Calendar Section */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div
                                className="p-5 border-b border-gray-200"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="text-lg font-medium"
                                        style={{ color: primaryLightColor }}
                                    >
                                        Tanggal Jadwal
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={previousWeek}
                                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                                            style={{ color: primaryLightColor }}
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <span className="font-medium text-[#e9eff2]">
                                            {getCurrentMonthYear()}
                                        </span>
                                        <button
                                            onClick={nextWeek}
                                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                                            style={{ color: primaryLightColor }}
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowExpandedCalendar(true)
                                            }
                                            className="ml-4 p-1.5 rounded-full hover:bg-white/50 transition-colors"
                                            style={{ color: primaryLightColor }}
                                            title="Expand calendar"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-7 gap-3">
                                    {weekDays.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border-2 transition-all ${
                                                isSameDay(day, selectedDate)
                                                    ? "border-2"
                                                    : isToday(day)
                                                    ? "bg-opacity-20 border-opacity-50"
                                                    : "hover:bg-gray-50 border-transparent"
                                            }`}
                                            style={{
                                                backgroundColor: isSameDay(
                                                    day,
                                                    selectedDate
                                                )
                                                    ? primaryColor
                                                    : isToday(day)
                                                    ? primaryLightColor
                                                    : "",
                                                borderColor: isSameDay(
                                                    day,
                                                    selectedDate
                                                )
                                                    ? primaryColor
                                                    : isToday(day)
                                                    ? primaryColor
                                                    : "transparent",
                                            }}
                                            onClick={() => setSelectedDate(day)}
                                        >
                                            <span
                                                className={`text-xs font-medium mb-1 ${
                                                    isSameDay(day, selectedDate)
                                                        ? "text-white"
                                                        : isToday(day)
                                                        ? `text-[${primaryColor}]`
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {formatDayName(day)}
                                            </span>
                                            <span
                                                className={`text-xl font-medium ${
                                                    isSameDay(day, selectedDate)
                                                        ? "text-white"
                                                        : isToday(day)
                                                        ? `text-[${primaryColor}]`
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {formatDayNumber(day)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="mt-5 p-3 rounded-lg"
                                    style={{
                                        backgroundColor: primaryLightColor,
                                    }}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                                backgroundColor: primaryColor,
                                            }}
                                        ></div>
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: primaryColor }}
                                        >
                                            Tanggal terpilih:{" "}
                                            {format(
                                                selectedDate,
                                                "dd MMMM yyyy",
                                                { locale: id }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Class Rooms Section */}
                        <div>
                            <div className="mb-6 flex flex-wrap items-center justify-between">
                                <h3
                                    className="text-xl font-medium mb-2 sm:mb-0"
                                    style={{ color: primaryColor }}
                                >
                                    Daftar Kelas
                                </h3>
                                <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
                                    <input
                                        type="text"
                                        placeholder="Cari kelas..."
                                        className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        style={{
                                            focusRing: primaryLightColor,
                                        }}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <svg
                                        className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {filteredClasses.length === 0 ? (
                                <div className="bg-white shadow rounded-lg p-8 text-center">
                                    <svg
                                        className="h-12 w-12 mx-auto mb-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                                        Tidak ada kelas ditemukan
                                    </h4>
                                    <p className="text-gray-600">
                                        Coba gunakan kata kunci lain untuk
                                        pencarian Anda.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredClasses.map((classRoom) => (
                                        <div
                                            key={classRoom.id}
                                            className="bg-white shadow rounded-lg overflow-hidden flex flex-col transition-transform hover:translate-y-[-4px] hover:shadow-md"
                                        >
                                            <div className="h-52 bg-gray-200 relative">
                                                <img
                                                    src={classRoom.image}
                                                    alt={classRoom.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            classRoom.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            classRoom.status
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getScheduleStatusBadge(
                                                            classRoom.scheduleStatus
                                                        )}`}
                                                    >
                                                        {classRoom.scheduleStatus ===
                                                        "ada jadwal"
                                                            ? "Ada Jadwal"
                                                            : "Tidak Ada Jadwal"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1">
                                                <h4
                                                    className="text-lg font-medium mb-2"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    {classRoom.name}
                                                </h4>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 mr-2 flex-shrink-0"
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
                                                        {classRoom.location}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 mr-2 flex-shrink-0"
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
                                                        {classRoom.capacity}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-start">
                                                            <svg
                                                                className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                                                />
                                                            </svg>
                                                            <div>
                                                                <span className="block mb-1">
                                                                    Fasilitas:
                                                                </span>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {classRoom.facilities.map(
                                                                        (
                                                                            facility,
                                                                            idx
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        primaryLightColor,
                                                                                    color: primaryColor,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    facility
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-5 py-4 border-t border-gray-200">
                                                <Link
                                                    href={`/jadwal/kelas/${classRoom.id}`}
                                                    className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium transition duration-150 ease-in-out block text-center"
                                                    style={{
                                                        backgroundColor:
                                                            classRoom.scheduleStatus ===
                                                            "ada jadwal"
                                                                ? primaryColor
                                                                : "gray",
                                                        opacity:
                                                            classRoom.scheduleStatus ===
                                                            "ada jadwal"
                                                                ? 1
                                                                : 0.6,
                                                    }}
                                                >
                                                    {classRoom.scheduleStatus ===
                                                    "ada jadwal"
                                                        ? "Lihat Jadwal"
                                                        : "Tidak Ada Jadwal"}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filteredClasses.length > 0 && (
                                <div className="mt-6 text-center text-sm text-gray-600">
                                    Menampilkan {filteredClasses.length} dari{" "}
                                    {classRooms.length} kelas
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showExpandedCalendar && (
                <ExpandedCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onClose={() => setShowExpandedCalendar(false)}
                />
            )}
        </UserLayout>
    );
}
