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
import { enUS } from "date-fns/locale";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    MapPin,
    Users,
    Award,
    Search,
    Frown,
} from "lucide-react";

export default function Schedule() {
    const [dateRange, setDateRange] = useState(() => {
        const savedRange = localStorage.getItem("schedule-date-range");
        if (savedRange) {
            const parsed = JSON.parse(savedRange);
            return {
                startDate: parsed.startDate ? new Date(parsed.startDate) : null,
                endDate: parsed.endDate ? new Date(parsed.endDate) : null,
            };
        }
        return { startDate: null, endDate: null };
    });
    const [selectedDate, setSelectedDate] = useState(() => {
        const savedRange = localStorage.getItem("schedule-date-range");
        if (savedRange) {
            const parsed = JSON.parse(savedRange);
            return parsed.startDate ? new Date(parsed.startDate) : new Date();
        }
        return new Date();
    });

    useEffect(() => {
        if (dateRange.startDate || dateRange.endDate) {
            localStorage.setItem(
                "schedule-date-range",
                JSON.stringify({
                    startDate: dateRange.startDate
                        ? dateRange.startDate.toISOString()
                        : null,
                    endDate: dateRange.endDate
                        ? dateRange.endDate.toISOString()
                        : null,
                })
            );
        }
    }, [dateRange]);

    const [weekDays, setWeekDays] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [showExpandedCalendar, setShowExpandedCalendar] = useState(false);

    // Sample class data
    const classRooms = [
        {
            id: 1,
            name: "Class A",
            status: "available",
            image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Central Jakarta",
            capacity: "50 people",
            facilities: ["AC", "Projector", "Sound System"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "has schedule",
        },
        {
            id: 2,
            name: "Class B",
            status: "in use",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "South Jakarta",
            capacity: "40 people",
            facilities: ["AC", "Sound System"],
            badgeColor: "bg-yellow-100 text-yellow-800",
            scheduleStatus: "has schedule",
        },
        {
            id: 3,
            name: "Class C",
            status: "maintenance",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "West Jakarta",
            capacity: "30 people",
            facilities: ["AC", "Projector", "Wi-Fi"],
            badgeColor: "bg-red-100 text-red-800",
            scheduleStatus: "no schedule",
        },
        {
            id: 4,
            name: "Class D",
            status: "available",
            image: "https://media.istockphoto.com/id/1087223748/photo/modern-classroom-with-large-panoramic-windows-and-white-desks-bright-interior.webp?a=1&s=612x612&w=0&k=20&c=Ht3bVO3-WL7eGtlLHGYmQIz63AUmiAugflbo-acl7qI=",
            location: "North Jakarta",
            capacity: "45 people",
            facilities: ["AC", "Projector", "Sound System", "Wi-Fi"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "has schedule",
        },
        {
            id: 5,
            name: "Class E",
            status: "available",
            image: "https://images.unsplash.com/photo-1635424239131-32dc44986b56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "East Jakarta",
            capacity: "35 people",
            facilities: ["AC", "Wi-Fi"],
            badgeColor: "bg-green-100 text-green-800",
            scheduleStatus: "no schedule",
        },
        {
            id: 6,
            name: "Class F",
            status: "in use",
            image: "https://images.unsplash.com/photo-1617721926586-4eecce739745?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Depok",
            capacity: "40 people",
            facilities: ["AC", "Projector", "Sound System", "Wi-Fi"],
            badgeColor: "bg-yellow-100 text-yellow-800",
            scheduleStatus: "has schedule",
        },
    ];

    // Initialize filtered classes
    const [statusFilter, setStatusFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [facilityFilter, setFacilityFilter] = useState("all");

    // Filter class rooms based on search and filters
    useEffect(() => {
        let filtered = classRooms.filter((classRoom) => {
            const matchSearch =
                classRoom.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                classRoom.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchStatus =
                statusFilter === "all" || classRoom.status === statusFilter;

            const matchLocation =
                locationFilter === "all" ||
                classRoom.location === locationFilter;

            const matchFacility =
                facilityFilter === "all" ||
                classRoom.facilities.includes(facilityFilter);

            return matchSearch && matchStatus && matchLocation && matchFacility;
        });

        setFilteredClasses(filtered);
    }, [searchTerm, statusFilter, locationFilter, facilityFilter]);

    // Generate week days for calendar
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
            case "available":
                return "bg-green-100 text-green-800";
            case "in use":
                return "bg-yellow-100 text-yellow-800";
            case "maintenance":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "available":
                return "Available";
            case "in use":
                return "In Use";
            case "maintenance":
                return "Maintenance";
            default:
                return status;
        }
    };

    const getScheduleStatusBadge = (status) => {
        switch (status) {
            case "has schedule":
                return "bg-blue-100 text-blue-800";
            case "no schedule":
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
    const formatDayName = (date) => format(date, "EEE", { locale: enUS });
    const formatDayNumber = (date) => format(date, "d", { locale: enUS });
    const isToday = (date) => isSameDay(date, new Date());
    const getCurrentMonthYear = () => {
        if (dateRange?.startDate && dateRange?.endDate) {
            return format(dateRange.startDate, "MMMM yyyy", { locale: enUS });
        } else if (selectedDate) {
            return format(selectedDate, "MMMM yyyy", { locale: enUS });
        }
        return "";
    };

    const getDateRangeText = () => {
        if (dateRange.startDate && dateRange.endDate) {
            const sameDay = isSameDay(dateRange.startDate, dateRange.endDate);
            if (sameDay) {
                return format(dateRange.startDate, "dd MMMM yyyy", {
                    locale: enUS,
                });
            }
            return `${format(dateRange.startDate, "dd MMMM yyyy", {
                locale: enUS,
            })} - ${format(dateRange.endDate, "dd MMMM yyyy", {
                locale: enUS,
            })}`;
        } else if (dateRange.startDate) {
            return `${format(dateRange.startDate, "dd MMMM yyyy", {
                locale: enUS,
            })} - Select end date`;
        }
        return format(selectedDate, "dd MMMM yyyy", { locale: enUS });
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
                    Class Schedule
                </h2>
            }
        >
            <Head title="Class Schedule" />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Calendar Section */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-200 bg-primary">
                                <div className="flex items-center justify-between">
                                    {/* Left: Label */}
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-white" />
                                        <h3 className="text-lg font-semibold text-white">
                                            Schedule Date
                                        </h3>
                                    </div>

                                    {/* Right: Navigation and actions */}
                                    <div className="flex items-center gap-4">
                                        {/* Week navigation */}
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

                                        {/* Actions: Today & Calendar */}
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
                                                Today
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
                                                Select Date Range
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                {getRangeDuration() > 7 ? (
                                    <div className="p-4 rounded-xl border flex items-center justify-between gap-3 bg-primary-light border-primary/20">
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                            <span>
                                                {format(
                                                    dateRange.startDate,
                                                    "dd MMMM yyyy",
                                                    { locale: enUS }
                                                )}
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-primary">
                                            {format(
                                                dateRange.endDate,
                                                "dd MMMM yyyy",
                                                { locale: enUS }
                                            )}
                                        </span>
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
                                                            ? "bg-accent text-white shadow-md"
                                                            : isToday(day)
                                                            ? "border-2 border-primary font-semibold text-primary"
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
                                        <div className="mt-5 p-4 rounded-xl border bg-primary-light border-primary/20">
                                            <div className="flex items-center w-full justify-center">
                                                <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0 bg-primary"></div>
                                                <span className="text-sm font-semibold text-primary">
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
                            <div className="mb-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Left: Title */}
                                <h3 className="text-lg lg:text-xl font-semibold text-primary">
                                    Class List
                                </h3>

                                {/* Right: Search + Filters */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search class..."
                                            className="w-[180px] lg:w-[200px] px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                    </div>

                                    {/* Status Filter */}
                                    <select
                                        className="text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                    >
                                        <option value="all">All Status</option>
                                        <option value="available">
                                            Available
                                        </option>
                                        <option value="in use">In Use</option>
                                        <option value="maintenance">
                                            Maintenance
                                        </option>
                                    </select>

                                    {/* Location Filter */}
                                    <select
                                        className="text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={locationFilter}
                                        onChange={(e) =>
                                            setLocationFilter(e.target.value)
                                        }
                                    >
                                        <option value="all">
                                            All Locations
                                        </option>
                                        {[
                                            ...new Set(
                                                classRooms.map(
                                                    (c) => c.location
                                                )
                                            ),
                                        ].map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Facility Filter */}
                                    <select
                                        className="text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={facilityFilter}
                                        onChange={(e) =>
                                            setFacilityFilter(e.target.value)
                                        }
                                    >
                                        <option value="all">
                                            All Facilities
                                        </option>
                                        {[
                                            ...new Set(
                                                classRooms.flatMap(
                                                    (c) => c.facilities
                                                )
                                            ),
                                        ].map((facility) => (
                                            <option
                                                key={facility}
                                                value={facility}
                                            >
                                                {facility}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {filteredClasses.length === 0 ? (
                                <div className="bg-white shadow rounded-lg p-8 text-center">
                                    <Frown className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        No classes found
                                    </h4>
                                    <p className="text-gray-600">
                                        Try using different keywords for your
                                        search.
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
                                                        "has schedule"
                                                            ? "Has Schedule"
                                                            : "No Schedule"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1">
                                                <h4 className="text-lg font-semibold mb-3 text-primary">
                                                    {classRoom.name}
                                                </h4>
                                                <div className="space-y-3 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        {classRoom.location}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        {classRoom.capacity}
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Award className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="block mb-1 font-semibold">
                                                                Facilities:
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
                                                                            className="text-xs px-2 py-1 rounded-full bg-primary-light text-primary"
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
                                                    className={`block w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center transition duration-150 ${
                                                        classRoom.scheduleStatus ===
                                                        "has schedule"
                                                            ? "bg-primary text-white"
                                                            : "bg-gray-300 text-gray-500"
                                                    }`}
                                                >
                                                    {classRoom.scheduleStatus ===
                                                    "has schedule"
                                                        ? "View Schedule"
                                                        : "No Schedule"}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filteredClasses.length > 0 && (
                                <div className="mt-6 text-center text-sm text-gray-600">
                                    Showing {filteredClasses.length} of{" "}
                                    {classRooms.length} classes
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
