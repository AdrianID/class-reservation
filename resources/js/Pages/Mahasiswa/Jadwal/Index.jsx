import clsx from "clsx";
import UserLayout from "@/components/Layouts/UserLayout";
import ExpandedCalendar from "./components/ExpandedCalendar";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    format,
    addDays,
    subDays,
    isSameDay,
    startOfWeek,
    endOfWeek,
    differenceInDays,
} from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function Jadwal() {
    // Brand colors
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";
    const accentColor = "#4a90a4";

    // State fused States
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });

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
            scheduleStatus: "ada jadwal",
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
            scheduleStatus: "ada jadwal",
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
            scheduleStatus: "tidak ada jadwal",
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
            scheduleStatus: "ada jadwal",
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
            scheduleStatus: "tidak ada jadwal",
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
            scheduleStatus: "ada jadwal",
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

    // Generate week days for calendar
    /* useEffect(() => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const days = [];

        // Generate 7 days starting from week start
        for (let i = 0; i < 7; i++) {
            days.push(addDays(weekStart, i));
        }

        setWeekDays(days);
    }, []); */
    useEffect(() => {
        const isValidRange =
            dateRange.startDate &&
            dateRange.endDate &&
            differenceInDays(dateRange.endDate, dateRange.startDate) <= 6;

        const baseDate = isValidRange ? dateRange.startDate : new Date();

        const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
        const days = [];

        for (let i = 0; i < 7; i++) {
            days.push(addDays(weekStart, i));
        }

        setWeekDays(days);
    }, [dateRange]);

    // Status utilities
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

    // Navigation handlers
    const previousWeek = () => {
        setWeekDays(weekDays.map((day) => subDays(day, 7)));
    };

    const nextWeek = () => {
        setWeekDays(weekDays.map((day) => addDays(day, 7)));
    };

    // Date formatting utilities
    const formatDayName = (date) => format(date, "EEE", { locale: id });
    const formatDayNumber = (date) => format(date, "d", { locale: id });
    const isToday = (date) => isSameDay(date, new Date());
    const getCurrentMonthYear = () =>
        weekDays.length ? format(weekDays[3], "MMMM yyyy", { locale: id }) : "";
    const getDateRangeText = () => {
        if (dateRange.startDate && dateRange.endDate) {
            const sameDay = isSameDay(dateRange.startDate, dateRange.endDate);
            if (sameDay) {
                return format(dateRange.startDate, "dd MMM yyyy", {
                    locale: id,
                });
            }
            return `${format(dateRange.startDate, "dd MMM yyyy", {
                locale: id,
            })} - ${format(dateRange.endDate, "dd MMM yyyy", { locale: id })}`;
        } else if (dateRange.startDate) {
            return `${format(dateRange.startDate, "dd MMM yyyy", {
                locale: id,
            })} - Pilih tanggal akhir`;
        }
        return format(selectedDate, "dd MMM yyyy", { locale: id });
    };

    // Check if date is in selected range
    const isInRange = (date) => {
        if (!dateRange.startDate || !dateRange.endDate) return false;
        return (
            isSameDay(date, dateRange.startDate) ||
            isSameDay(date, dateRange.endDate) ||
            (date >= dateRange.startDate && date <= dateRange.endDate)
        );
    };

    // Calculate date range duration
    const getRangeDuration = () => {
        if (!dateRange.startDate || !dateRange.endDate) return 0;
        return (
            Math.abs(differenceInDays(dateRange.startDate, dateRange.endDate)) +
            1
        );
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
                                    {/* Kiri: Label */}
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-white" />
                                        <h3 className="text-lg font-semibold text-white">
                                            Tanggal Jadwal
                                        </h3>
                                    </div>

                                    {/* Kanan: Navigasi dan aksi */}
                                    <div className="flex items-center gap-4">
                                        {/* Navigasi minggu */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={previousWeek}
                                                className="p-2 rounded-full hover:bg-white/20 transition"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-white" />
                                            </button>
                                            <span className="text-white font-semibold">
                                                {getCurrentMonthYear()}
                                            </span>
                                            <button
                                                onClick={nextWeek}
                                                className="p-2 rounded-full hover:bg-white/20 transition"
                                            >
                                                <ChevronRight className="w-5 h-5 text-white" />
                                            </button>
                                        </div>

                                        {/* Aksi: Hari Ini & Kalender */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const today = new Date();
                                                    setSelectedDate(today);
                                                    setDateRange({
                                                        startDate: today,
                                                        endDate: today,
                                                    });
                                                }}
                                                className="px-3 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition"
                                            >
                                                Hari Ini
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShowExpandedCalendar(
                                                        true
                                                    )
                                                }
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition"
                                            >
                                                <Calendar className="w-4 h-4" />
                                                Lihat Kalender
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                {getRangeDuration() > 7 ? (
                                    <div
                                        className="p-4 rounded-xl border text-center"
                                        style={{
                                            backgroundColor: primaryLightColor,
                                            borderColor: primaryColor + "20",
                                        }}
                                    >
                                        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#365b6d] bg-[#e9eff2] px-4 py-3 rounded-xl border border-[#365b6d]/20">
                                            <Calendar className="w-4 h-4" />
                                            <span>{getDateRangeText()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-7 gap-3">
                                            {weekDays.map((day, index) => (
                                                <button
                                                    key={index}
                                                    className={clsx(
                                                        "flex flex-col items-center p-3 rounded-xl transition-all duration-150",
                                                        isInRange(day)
                                                            ? "bg-[#4a90a4] text-white shadow-md"
                                                            : isToday(day)
                                                            ? "border-2 border-[#365b6d] font-semibold text-[#365b6d]"
                                                            : "hover:bg-gray-100 text-gray-800"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedDate(day);
                                                        setDateRange({
                                                            startDate: day,
                                                            endDate: day,
                                                        });
                                                    }}
                                                >
                                                    <span className="text-xs uppercase tracking-wide">
                                                        {formatDayName(day)}
                                                    </span>
                                                    <span className="text-lg font-semibold">
                                                        {formatDayNumber(day)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <div
                                            className="mt-5 p-4 rounded-xl border"
                                            style={{
                                                backgroundColor:
                                                    primaryLightColor,
                                                borderColor:
                                                    primaryColor + "20",
                                            }}
                                        >
                                            <div className="flex items-center w-full justify-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            primaryColor,
                                                    }}
                                                ></div>
                                                <span
                                                    className="text-sm font-semibold"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    {getDateRangeText()}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Class Rooms Section */}
                        <div>
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                                <h3
                                    className="text-xl font-semibold"
                                    style={{ color: primaryColor }}
                                >
                                    Daftar Kelas
                                </h3>
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Cari kelas..."
                                        className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[${primaryColor}] focus:border-transparent transition-all"
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
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
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
                                            className="bg-white shadow rounded-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="h-52 relative">
                                                <img
                                                    src={classRoom.image}
                                                    alt={classRoom.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                            classRoom.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            classRoom.status
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getScheduleStatusBadge(
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
                                                    className="text-lg font-semibold mb-3"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    {classRoom.name}
                                                </h4>
                                                <div className="space-y-3 text-sm text-gray-600">
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
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 0114 0z"
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
                                                            <span className="block mb-1 font-semibold">
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
                                                                            className="text-xs px-2 py-1 rounded-full"
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
                                            <div className="px-5 py-4 border-t border-gray-200">
                                                <Link
                                                    href={`/jadwal/detail`}
                                                    className="block w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center transition duration-150"
                                                    style={{
                                                        backgroundColor:
                                                            classRoom.scheduleStatus ===
                                                            "ada jadwal"
                                                                ? primaryColor
                                                                : "gray",
                                                        color: "white",
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
                    dateRange={dateRange}
                    isRangeMode={true}
                    onDateSelect={(range) => {
                        setDateRange(range);
                        setSelectedDate(range.startDate);
                        setShowExpandedCalendar(false);
                    }}
                    onClose={() => setShowExpandedCalendar(false)}
                />
            )}
        </UserLayout>
    );
}
