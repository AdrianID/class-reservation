import UserLayout from "@/components/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";
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
import { enUS } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function ScheduleDetail() {
    const { props } = usePage();
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get("date");
    const roomIdParam = urlParams.get("roomId");

    useEffect(() => {
        if (dateParam) setSelectedDate(new Date(dateParam));
        // Bisa gunakan roomIdParam jika ingin dynamic classroom nanti
    }, []);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("day");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    const timeSlots = Array.from({ length: 16 }, (_, i) => {
        const hour = i + 7;
        return {
            time: `${hour}:00`,
            displayTime: `${hour}:00 - ${hour + 1}:00`,
            hour: hour,
        };
    });

    const classroom = {
        id: 1,
        name: "Class A",
        status: "available",
        image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        location: "Central Jakarta",
        capacity: "50 people",
        facilities: ["AC", "Projector", "Sound System"],
        badgeColor: "bg-success/20 text-success",
        description:
            "Main classroom with complete facilities for various learning activities, seminars, and workshops.",
    };

    const sampleSchedules = [
        {
            id: 1,
            classroomId: 1,
            title: "Mathematics Class",
            instructor: "Mr. Ahmad",
            date: new Date().toISOString().split("T")[0],
            startTime: "08:00",
            endTime: "10:00",
            status: "confirmed",
        },
        {
            id: 2,
            classroomId: 1,
            title: "Technology Seminar",
            instructor: "IT Team",
            date: new Date().toISOString().split("T")[0],
            startTime: "13:00",
            endTime: "15:00",
            status: "confirmed",
        },
        {
            id: 3,
            classroomId: 1,
            title: "Management Meeting",
            instructor: "Ms. Sari",
            date: new Date().toISOString().split("T")[0],
            startTime: "16:00",
            endTime: "17:00",
            status: "pending",
        },
        {
            id: 4,
            classroomId: 1,
            title: "Design Workshop",
            instructor: "Creative Team",
            date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
            startTime: "09:00",
            endTime: "12:00",
            status: "confirmed",
        },
    ];

    useEffect(() => {
        setSchedules(sampleSchedules);
    }, []);

    const getSchedulesForDate = (date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return schedules.filter(
            (schedule) =>
                schedule.date === dateString &&
                schedule.classroomId === classroom.id
        );
    };

    const formatDayName = (date) => {
        return format(date, "EEEE", { locale: enUS });
    };

    const formatFullDate = (date) => {
        return format(date, "MMMM d, yyyy", { locale: enUS });
    };

    const previousDay = () => {
        setSelectedDate(subDays(selectedDate, 1));
    };

    const nextDay = () => {
        setSelectedDate(addDays(selectedDate, 1));
    };

    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const isToday = (date) => {
        return isSameDay(date, new Date());
    };

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

    const getDaysInMonth = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    };

    const getDaysInWeek = () => {
        const start = startOfWeek(selectedDate);
        const end = endOfWeek(selectedDate);
        return eachDayOfInterval({ start, end });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "available":
                return "Available";
            case "in-use":
                return "In Use";
            case "maintenance":
                return "Maintenance";
            default:
                return status;
        }
    };

    const renderMonthView = () => {
        const days = getDaysInMonth();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
                                } ${
                                    isSameDay(day, selectedDate)
                                        ? "border-2 border-primary"
                                        : "border-gray-200"
                                } ${
                                    isToday(day) ? "bg-primary-light" : ""
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
                                        <span className="h-2 w-2 rounded-full bg-primary"></span>
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
                                                className={`text-xs truncate mb-0.5 px-1 py-0.5 rounded ${
                                                    schedule.status ===
                                                    "confirmed"
                                                        ? "bg-success/20 text-success"
                                                        : "bg-warning/20 text-warning"
                                                }`}
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
                                            more
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
                                        ? "bg-primary-light rounded-lg"
                                        : ""
                                }`}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="text-sm font-medium text-gray-500">
                                    {format(day, "EEE", { locale: enUS })}
                                </div>
                                <div
                                    className={`text-lg font-medium ${
                                        isToday(day)
                                            ? "text-primary"
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
                                                    className={`absolute left-0 right-0 mx-1 rounded-sm p-1 overflow-hidden ${
                                                        booking.status ===
                                                        "confirmed"
                                                            ? "bg-success/20 border-l-3 border-success"
                                                            : "bg-warning/20 border-l-3 border-warning"
                                                    }`}
                                                >
                                                    <div
                                                        className={`text-xs font-medium ${
                                                            booking.status ===
                                                            "confirmed"
                                                                ? "text-success"
                                                                : "text-warning"
                                                        }`}
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
                                            className={`mx-2 my-1 p-3 rounded-lg shadow-sm ${
                                                booking.status === "confirmed"
                                                    ? "bg-success/20 border-l-4 border-success"
                                                    : "bg-warning/20 border-l-4 border-warning"
                                            }`}
                                        >
                                            <div
                                                className={`font-medium ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "text-success"
                                                        : "text-warning"
                                                }`}
                                            >
                                                {booking.title}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {booking.instructor} •{" "}
                                                {booking.startTime} -{" "}
                                                {booking.endTime}
                                            </div>
                                            <div
                                                className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "bg-success/20 text-success"
                                                        : "bg-warning/20 text-warning"
                                                }`}
                                            >
                                                {booking.status === "confirmed"
                                                    ? "Confirmed"
                                                    : "Pending"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-16 flex items-center justify-center mx-2">
                                            <button
                                                onClick={() => {
                                                    const data = {
                                                        from: "schedule",
                                                        selectedRoom: classroom,
                                                        selectedDate: format(
                                                            selectedDate,
                                                            "yyyy-MM-dd"
                                                        ),
                                                        startTime: slot.time,
                                                        endTime: `${
                                                            slot.hour + 1
                                                        }:00`,
                                                        selectedActivity: "",
                                                        selectedBuilding: null,
                                                        selectedFaculty: null,
                                                        capacity:
                                                            classroom.capacity,
                                                        isRangeMode: false,
                                                    };
                                                    const encoded =
                                                        encodeURIComponent(
                                                            JSON.stringify(data)
                                                        );
                                                    window.location.href = `/peminjaman/create?data=${encoded}`;
                                                }}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Book this slot
                                            </button>
                                        </div>

                                        // <div className="h-16 flex items-center justify-center mx-2">
                                        //     <button
                                        //         onClick={() => {
                                        //             const url = `/peminjaman/create?roomId=${
                                        //                 classroom.id
                                        //             }&date=${format(
                                        //                 selectedDate,
                                        //                 "yyyy-MM-dd"
                                        //             )}&start=${slot.time}&end=${
                                        //                 slot.hour + 1
                                        //             }:00`;
                                        //             window.location.href = url;
                                        //         }}
                                        //         className="text-sm text-primary hover:underline"
                                        //     >
                                        //         Book this slot
                                        //     </button>
                                        // </div>
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
                    Class {classroom.name} Detail
                </h2>
            }
        >
            <Head title={`Class ${classroom.name} Detail`} />

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
                                    <h3 className="text-2xl font-bold text-primary mb-2">
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
                                            Location
                                        </h4>
                                        <p className="text-gray-600">
                                            {classroom.location}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Capacity
                                        </h4>
                                        <p className="text-gray-600">
                                            {classroom.capacity}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Facilities
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
                        <div className="p-5 border-b border-gray-200 bg-primary">
                            <div className="flex flex-wrap items-center justify-between">
                                <h3 className="text-lg font-medium mb-2 sm:mb-0 text-primary-light">
                                    Schedule for {classroom.name}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    {viewMode === "day" && (
                                        <>
                                            <button
                                                onClick={previousDay}
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium text-primary-light">
                                                {formatFullDate(selectedDate)}
                                            </span>
                                            <button
                                                onClick={nextDay}
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronRight className="h-5 w-5" />
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
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium text-primary-light">
                                                Week{" "}
                                                {format(
                                                    startOfWeek(selectedDate),
                                                    "d MMM",
                                                    { locale: enUS }
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    endOfWeek(selectedDate),
                                                    "d MMM yyyy",
                                                    { locale: enUS }
                                                )}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setSelectedDate(
                                                        addDays(selectedDate, 7)
                                                    )
                                                }
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                    {viewMode === "month" && (
                                        <>
                                            <button
                                                onClick={previousMonth}
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium text-primary-light">
                                                {format(
                                                    currentMonth,
                                                    "MMMM yyyy",
                                                    { locale: enUS }
                                                )}
                                            </span>
                                            <button
                                                onClick={nextMonth}
                                                className="p-1.5 rounded-full hover:bg-primary-light/20 transition-colors text-primary-light"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                    <div className="flex ml-4 space-x-1">
                                        <button
                                            onClick={() => setViewMode("day")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "day"
                                                    ? "bg-accent text-white"
                                                    : "text-primary-light hover:bg-primary-light/20"
                                            }`}
                                        >
                                            Day
                                        </button>
                                        <button
                                            onClick={() => setViewMode("week")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "week"
                                                    ? "bg-accent text-white"
                                                    : "text-primary-light hover:bg-primary-light/20"
                                            }`}
                                        >
                                            Week
                                        </button>
                                        <button
                                            onClick={() => setViewMode("month")}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                viewMode === "month"
                                                    ? "bg-accent text-white"
                                                    : "text-primary-light hover:bg-primary-light/20"
                                            }`}
                                        >
                                            Month
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

                            <div className="text-center text-sm text-gray-500 mb-4">
                                Viewing schedule for:{" "}
                                <strong>{formatFullDate(selectedDate)}</strong>
                            </div>

                            {/* Schedule List */}
                            <div className="mt-8">
                                <h4 className="text-lg font-medium mb-4 text-primary">
                                    Schedule List for{" "}
                                    {formatFullDate(selectedDate)}
                                </h4>

                                {getSchedulesForDate(selectedDate).length ===
                                0 ? (
                                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <h5 className="text-lg font-medium text-gray-800 mb-2">
                                            No schedules for today
                                        </h5>
                                        <p className="text-gray-600">
                                            There are no schedules on{" "}
                                            {formatFullDate(selectedDate)} for
                                            this class.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {getSchedulesForDate(selectedDate).map(
                                            (schedule) => (
                                                <div
                                                    key={schedule.id}
                                                    className={`border rounded-lg overflow-hidden ${
                                                        schedule.status ===
                                                        "confirmed"
                                                            ? "border-l-4 border-success"
                                                            : "border-l-4 border-warning"
                                                    }`}
                                                >
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h5
                                                                    className={`font-medium text-lg ${
                                                                        schedule.status ===
                                                                        "confirmed"
                                                                            ? "text-success"
                                                                            : "text-warning"
                                                                    }`}
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
                                                                        ? "bg-success/20 text-success"
                                                                        : "bg-warning/20 text-warning"
                                                                }`}
                                                            >
                                                                {schedule.status ===
                                                                "confirmed"
                                                                    ? "Confirmed"
                                                                    : "Pending"}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            {format(
                                                                new Date(
                                                                    schedule.date
                                                                ),
                                                                "EEEE, MMMM d, yyyy",
                                                                { locale: enUS }
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t">
                                                        <button className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button
                                                            className={`text-sm px-3 py-1.5 rounded-md text-white hover:bg-opacity-90 transition-colors ${
                                                                schedule.status ===
                                                                "confirmed"
                                                                    ? "bg-success"
                                                                    : "bg-warning"
                                                            }`}
                                                        >
                                                            View Detail
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
