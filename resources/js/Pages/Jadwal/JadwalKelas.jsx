import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    format,
    addDays,
    subDays,
    isSameDay,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
} from "date-fns";
import { id } from "date-fns/locale";

export default function JadwalKelasDetail() {
    // Brand colors
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";
    const secondaryColor = "#f59e0b";

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("day");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Time slots from 7:00 to 22:00 (7 AM to 10 PM)
    const timeSlots = Array.from({ length: 16 }, (_, i) => {
        const hour = i + 7;
        return {
            time: `${hour}:00`,
            displayTime: `${hour}:00 - ${hour + 1}:00`,
            hour: hour,
        };
    });

    // Selected classroom data (single classroom)
    const classroom = {
        id: 1,
        name: "Kelas A",
        status: "tersedia",
        image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        location: "Jakarta Pusat",
        capacity: "50 orang",
        facilities: ["AC", "Proyektor", "Sound System"],
        badgeColor: "bg-green-100 text-green-800",
        description:
            "Kelas utama dengan fasilitas lengkap untuk berbagai jenis kegiatan pembelajaran, seminar, dan workshop.",
    };

    // Sample schedule data for the selected classroom
    const sampleSchedules = [
        {
            id: 1,
            classroomId: 1,
            title: "Kelas Matematika",
            instructor: "Bpk. Ahmad",
            date: new Date().toISOString().split("T")[0],
            startTime: "08:00",
            endTime: "10:00",
            status: "confirmed",
            color: "#3b82f6",
        },
        {
            id: 2,
            classroomId: 1,
            title: "Seminar Teknologi",
            instructor: "Tim IT",
            date: new Date().toISOString().split("T")[0],
            startTime: "13:00",
            endTime: "15:00",
            status: "confirmed",
            color: "#10b981",
        },
        {
            id: 3,
            classroomId: 1,
            title: "Rapat Manajemen",
            instructor: "Ibu Sari",
            date: new Date().toISOString().split("T")[0],
            startTime: "16:00",
            endTime: "17:00",
            status: "pending",
            color: "#f59e0b",
        },
        {
            id: 4,
            classroomId: 1,
            title: "Workshop Design",
            instructor: "Tim Kreatif",
            date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
            startTime: "09:00",
            endTime: "12:00",
            status: "confirmed",
            color: "#8b5cf6",
        },
    ];

    // Load schedules
    useEffect(() => {
        setSchedules(sampleSchedules);
    }, []);

    // Get schedules for a specific date
    const getSchedulesForDate = (date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return schedules.filter(
            (schedule) =>
                schedule.date === dateString &&
                schedule.classroomId === classroom.id
        );
    };

    // Format day name
    const formatDayName = (date) => {
        return format(date, "EEEE", { locale: id });
    };

    // Format full date
    const formatFullDate = (date) => {
        return format(date, "dd MMMM yyyy", { locale: id });
    };

    // Navigate to previous day
    const previousDay = () => {
        setSelectedDate(subDays(selectedDate, 1));
    };

    // Navigate to next day
    const nextDay = () => {
        setSelectedDate(addDays(selectedDate, 1));
    };

    // Navigate to previous month
    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // Check if date is today
    const isToday = (date) => {
        return isSameDay(date, new Date());
    };

    // Check if a time slot has a booking
    const getBookingForTimeSlot = (date, hour) => {
        const dateString = format(date, "yyyy-MM-dd");
        return schedules.find(
            (schedule) =>
                schedule.classroomId === classroom.id &&
                schedule.date === dateString &&
                parseInt(schedule.startTime.split(":")[0]) <= hour &&
                parseInt(schedule.endTime.split(":")[0]) > hour
        );
    };

    // Generate days for month view
    const getDaysInMonth = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));

        return eachDayOfInterval({ start, end });
    };

    // Generate days for week view
    const getDaysInWeek = () => {
        const start = startOfWeek(selectedDate);
        const end = endOfWeek(selectedDate);

        return eachDayOfInterval({ start, end });
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

    // Render month view
    const renderMonthView = () => {
        const days = getDaysInMonth();
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        return (
            <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, index) => (
                        <div
                            key={index}
                            className="text-center py-2 text-sm font-medium text-gray-500"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        const isCurrentMonth =
                            day.getMonth() === currentMonth.getMonth();
                        const hasSchedule = schedules.some(
                            (s) =>
                                s.date === format(day, "yyyy-MM-dd") &&
                                s.classroomId === classroom.id
                        );

                        return (
                            <div
                                key={index}
                                className={`h-20 border rounded-lg p-1 ${
                                    isCurrentMonth
                                        ? "bg-white"
                                        : "bg-gray-100 opacity-50"
                                }
                                ${
                                    isSameDay(day, selectedDate)
                                        ? "border-2 border-blue-500"
                                        : "border-gray-200"
                                }
                                ${
                                    isToday(day) ? "bg-blue-50" : ""
                                } cursor-pointer`}
                                onClick={() => {
                                    setSelectedDate(day);
                                    setViewMode("day");
                                }}
                            >
                                <div className="flex justify-between">
                                    <span
                                        className={`text-sm font-medium ${
                                            isCurrentMonth
                                                ? "text-gray-800"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {format(day, "d")}
                                    </span>
                                    {hasSchedule && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    )}
                                </div>
                                <div className="mt-1 overflow-hidden max-h-16">
                                    {schedules
                                        .filter(
                                            (s) =>
                                                s.date ===
                                                    format(day, "yyyy-MM-dd") &&
                                                s.classroomId === classroom.id
                                        )
                                        .slice(0, 2)
                                        .map((schedule, idx) => (
                                            <div
                                                key={idx}
                                                className="text-xs truncate mb-0.5 px-1 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: `${schedule.color}20`,
                                                    color: schedule.color,
                                                }}
                                            >
                                                {schedule.title}
                                            </div>
                                        ))}
                                    {schedules.filter(
                                        (s) =>
                                            s.date ===
                                                format(day, "yyyy-MM-dd") &&
                                            s.classroomId === classroom.id
                                    ).length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +
                                            {schedules.filter(
                                                (s) =>
                                                    s.date ===
                                                        format(
                                                            day,
                                                            "yyyy-MM-dd"
                                                        ) &&
                                                    s.classroomId ===
                                                        classroom.id
                                            ).length - 2}{" "}
                                            lagi
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render week view
    const renderWeekView = () => {
        const days = getDaysInWeek();

        return (
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <div className="grid grid-cols-8 gap-1 border-b pb-2 mb-2">
                        <div className="w-16"></div>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`text-center py-2 ${
                                    isSameDay(day, selectedDate)
                                        ? "bg-blue-50 rounded-lg"
                                        : ""
                                }`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="text-sm font-medium text-gray-500">
                                    {format(day, "EEE", { locale: id })}
                                </div>
                                <div
                                    className={`text-lg font-medium ${
                                        isToday(day)
                                            ? "text-blue-500"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {format(day, "d")}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {timeSlots.map((slot, timeIndex) => (
                            <div
                                key={timeIndex}
                                className="grid grid-cols-8 gap-1 border-b border-gray-100"
                            >
                                <div className="w-16 py-2 text-right pr-2 text-sm text-gray-500">
                                    {slot.time}
                                </div>
                                {days.map((day, dayIndex) => {
                                    const booking = getBookingForTimeSlot(
                                        day,
                                        slot.hour
                                    );

                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`h-12 relative ${
                                                dayIndex % 2 === 0
                                                    ? "bg-gray-50"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {booking && (
                                                <div
                                                    className="absolute left-0 right-0 mx-1 rounded-sm p-1 overflow-hidden"
                                                    style={{
                                                        backgroundColor: `${booking.color}20`,
                                                        borderLeft: `3px solid ${booking.color}`,
                                                        top: "2px",
                                                        bottom: "2px",
                                                    }}
                                                >
                                                    <div
                                                        className="text-xs font-medium"
                                                        style={{
                                                            color: booking.color,
                                                        }}
                                                    >
                                                        {booking.title}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Render day view
    const renderDayView = () => {
        return (
            <div>
                <div className="text-center mb-4">
                    <div className="text-lg font-medium text-gray-800">
                        {formatDayName(selectedDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                        {formatFullDate(selectedDate)}
                    </div>
                </div>

                <div className="relative">
                    {timeSlots.map((slot, index) => {
                        const booking = getBookingForTimeSlot(
                            selectedDate,
                            slot.hour
                        );

                        return (
                            <div
                                key={index}
                                className="flex border-b border-gray-100"
                            >
                                <div className="w-16 py-3 text-right pr-2 text-sm text-gray-500">
                                    {slot.time}
                                </div>
                                <div className="flex-1 min-h-16 py-1 relative">
                                    {booking ? (
                                        <div
                                            className="mx-2 my-1 p-3 rounded-lg shadow-sm"
                                            style={{
                                                backgroundColor: `${booking.color}20`,
                                                borderLeft: `4px solid ${booking.color}`,
                                            }}
                                        >
                                            <div
                                                className="font-medium"
                                                style={{
                                                    color: booking.color,
                                                }}
                                            >
                                                {booking.title}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {booking.instructor} •{" "}
                                                {booking.startTime} -{" "}
                                                {booking.endTime}
                                            </div>
                                            <div
                                                className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                                                ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {booking.status === "confirmed"
                                                    ? "Terkonfirmasi"
                                                    : "Menunggu"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-16 flex items-center justify-center text-gray-400 text-sm border-l-4 border-transparent mx-2">
                                            Tersedia
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Kelas {classroom.name}
                </h2>
            }
        >
            <Head title={`Detail Kelas ${classroom.name}`} />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Classroom Detail */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-6">
                        <div className="md:flex">
                            <div className="md:w-1/3">
                                <img
                                    src={classroom.image}
                                    alt={classroom.name}
                                    className="w-full h-64 md:h-full object-cover"
                                />
                            </div>
                            <div className="p-6 md:w-2/3">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {classroom.name}
                                    </h3>
                                    <span
                                        className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${classroom.badgeColor}`}
                                    >
                                        {getStatusLabel(classroom.status)}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    {classroom.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Lokasi
                                        </h4>
                                        <p className="text-gray-600">
                                            {classroom.location}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Kapasitas
                                        </h4>
                                        <p className="text-gray-600">
                                            {classroom.capacity}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Fasilitas
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {classroom.facilities.map(
                                                (facility, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded"
                                                    >
                                                        {facility}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar and Schedule */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                        {/* Calendar Controls */}
                        <div
                            className="p-5 border-b border-gray-200"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <div className="flex flex-wrap items-center justify-between">
                                <h3
                                    className="text-lg font-medium mb-2 sm:mb-0"
                                    style={{ color: primaryLightColor }}
                                >
                                    Jadwal Kelas {classroom.name}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    {viewMode === "day" && (
                                        <>
                                            <button
                                                onClick={previousDay}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                                {formatFullDate(selectedDate)}
                                            </span>
                                            <button
                                                onClick={nextDay}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                        </>
                                    )}
                                    {viewMode === "week" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setSelectedDate(
                                                        subDays(selectedDate, 7)
                                                    )
                                                }
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                                Minggu{" "}
                                                {format(
                                                    startOfWeek(selectedDate),
                                                    "d MMM",
                                                    { locale: id }
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    endOfWeek(selectedDate),
                                                    "d MMM yyyy",
                                                    { locale: id }
                                                )}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setSelectedDate(
                                                        addDays(selectedDate, 7)
                                                    )
                                                }
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                        </>
                                    )}
                                    {viewMode === "month" && (
                                        <>
                                            <button
                                                onClick={previousMonth}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                                {format(
                                                    currentMonth,
                                                    "MMMM yyyy",
                                                    { locale: id }
                                                )}
                                            </span>
                                            <button
                                                onClick={nextMonth}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                                style={{
                                                    color: primaryLightColor,
                                                }}
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
                                        </>
                                    )}
                                    <div className="flex ml-4 space-x-1">
                                        <button
                                            onClick={() => setViewMode("day")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "day"
                                                    ? "bg-white text-blue-600"
                                                    : "text-white hover:bg-white/20"
                                            }`}
                                        >
                                            Hari
                                        </button>
                                        <button
                                            onClick={() => setViewMode("week")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "week"
                                                    ? "bg-white text-blue-600"
                                                    : "text-white hover:bg-white/20"
                                            }`}
                                        >
                                            Minggu
                                        </button>
                                        <button
                                            onClick={() => setViewMode("month")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "month"
                                                    ? "bg-white text-blue-600"
                                                    : "text-white hover:bg-white/20"
                                            }`}
                                        >
                                            Bulan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Content */}
                        <div className="p-5">
                            {viewMode === "day" && renderDayView()}
                            {viewMode === "week" && renderWeekView()}
                            {viewMode === "month" && renderMonthView()}

                            {/* Schedule List */}
                            <div className="mt-8">
                                <h4
                                    className="text-lg font-medium mb-4"
                                    style={{ color: primaryColor }}
                                >
                                    Daftar Jadwal {formatFullDate(selectedDate)}
                                </h4>

                                {getSchedulesForDate(selectedDate).length ===
                                0 ? (
                                    <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                                        <h5 className="text-lg font-medium text-gray-800 mb-2">
                                            Tidak ada jadwal hari ini
                                        </h5>
                                        <p className="text-gray-600">
                                            Tidak ada jadwal yang terdaftar pada{" "}
                                            {formatFullDate(selectedDate)} untuk
                                            kelas ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {getSchedulesForDate(selectedDate).map(
                                            (schedule) => (
                                                <div
                                                    key={schedule.id}
                                                    className="border rounded-lg overflow-hidden"
                                                    style={{
                                                        borderLeft: `4px solid ${schedule.color}`,
                                                    }}
                                                >
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h5
                                                                    className="font-medium text-lg"
                                                                    style={{
                                                                        color: schedule.color,
                                                                    }}
                                                                >
                                                                    {
                                                                        schedule.title
                                                                    }
                                                                </h5>
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    {
                                                                        schedule.startTime
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        schedule.endTime
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        schedule.instructor
                                                                    }
                                                                </div>
                                                            </div>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    schedule.status ===
                                                                    "confirmed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                            >
                                                                {schedule.status ===
                                                                "confirmed"
                                                                    ? "Terkonfirmasi"
                                                                    : "Menunggu"}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center text-sm text-gray-500">
                                                            <svg
                                                                className="h-4 w-4 mr-1 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            {format(
                                                                new Date(
                                                                    schedule.date
                                                                ),
                                                                "EEEE, d MMMM yyyy",
                                                                {
                                                                    locale: id,
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t">
                                                        <button className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-sm px-3 py-1.5 rounded-md text-white hover:bg-blue-600 transition-colors"
                                                            style={{
                                                                backgroundColor:
                                                                    schedule.color,
                                                            }}
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
