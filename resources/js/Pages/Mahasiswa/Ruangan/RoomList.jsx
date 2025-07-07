import UserLayout from "@/components/Layouts/UserLayout";
import ExpandedCalendar from "./components/ExpandedCalendar";
import RoomBookingModal from "./RoomBookingModal";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { usePage } from "@inertiajs/react";
import {
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Expand,
    MapPin,
    Users,
    Zap,
    Search,
    Frown,
    Calendar,
    Clock,
    Building,
    UserCircle,
    School,
    BookOpen,
    Edit,
    Filter,
} from "lucide-react";

export default function RoomList() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateRange, setDateRange] = useState(null);
    const [weekDays, setWeekDays] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [showExpandedCalendar, setShowExpandedCalendar] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [buildingFilter, setBuildingFilter] = useState("all");
    const [facilityFilter, setFacilityFilter] = useState("all");

    const [isStickyActive, setIsStickyActive] = useState(false);

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsStickyActive(offset > 320);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Sample class data
    const classRooms = [
        {
            id: 1,
            name: "Room A",
            status: "available",
            image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Central Jakarta",
            capacity: "50 people",
            facilities: ["AC", "Projector", "Sound System"],
        },
        {
            id: 2,
            name: "Room B",
            status: "occupied",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "South Jakarta",
            capacity: "40 people",
            facilities: ["AC", "Sound System"],
        },
        {
            id: 3,
            name: "Room C",
            status: "maintenance",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "West Jakarta",
            capacity: "30 people",
            facilities: ["AC", "Projector", "Wi-Fi"],
        },
        {
            id: 4,
            name: "Room D",
            status: "available",
            image: "https://media.istockphoto.com/id/1087223748/photo/modern-classroom-with-large-panoramic-windows-and-white-desks-bright-interior.webp?a=1&s=612x612&w=0&k=20&c=Ht3bVO3-WL7eGtlLHGYmQIz63AUmiAugflbo-acl7qI=",
            location: "North Jakarta",
            capacity: "45 people",
            facilities: ["AC", "Projector", "Sound System", "Wi-Fi"],
        },
        {
            id: 5,
            name: "Room E",
            status: "available",
            image: "https://images.unsplash.com/photo-1635424239131-32dc44986b56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "East Jakarta",
            capacity: "35 people",
            facilities: ["AC", "Wi-Fi"],
        },
        {
            id: 6,
            name: "Room F",
            status: "occupied",
            image: "https://images.unsplash.com/photo-1617721926586-4eecce739745?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Depok",
            capacity: "40 people",
            facilities: ["AC", "Projector", "Sound System", "Wi-Fi"],
        },
    ];

    const { props, url } = usePage();
    const { buildings, faculties } = props;
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const bookingRaw = urlParams.get("booking");
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        if (!popupOpen && bookingData) {
            if (bookingData.selectedDate) {
                const newDate = new Date(bookingData.selectedDate);
                setSelectedDate(newDate);

                if (bookingData.isRangeMode && bookingData.endDate) {
                    setDateRange({
                        start: newDate,
                        end: new Date(bookingData.endDate),
                    });
                } else {
                    setDateRange(null);
                }
            }
        }
    }, [popupOpen]);

    useEffect(() => {
        if (bookingRaw) {
            try {
                const data = JSON.parse(decodeURIComponent(bookingRaw));
                setBookingData(data);

                if (data.selectedDate) {
                    setSelectedDate(new Date(data.selectedDate));
                }

                if (data.isRangeMode && data.endDate) {
                    setDateRange({
                        start: new Date(data.selectedDate),
                        end: new Date(data.endDate),
                    });
                }

                const filtered = classRooms.filter((room) => {
                    const roomCapacity = parseInt(room.capacity);
                    const requiredCapacity = parseInt(data.capacity || 1);
                    const matchCapacity = roomCapacity >= requiredCapacity;

                    const matchLocation =
                        !data.selectedBuilding ||
                        room.location
                            .toLowerCase()
                            .includes(
                                data.selectedBuilding.label.toLowerCase()
                            );

                    return matchCapacity && matchLocation;
                });

                setFilteredClasses(filtered);
            } catch (e) {
                setFilteredClasses(classRooms);
            }
        } else {
            setFilteredClasses(classRooms);
        }
    }, []);

    // Filter classes based on search term
    useEffect(() => {
        const filtered = classRooms.filter((room) => {
            const matchSearch =
                room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchStatus =
                statusFilter === "all" || room.status === statusFilter;

            const matchBuilding =
                buildingFilter === "all" || room.location === buildingFilter;

            const matchFacility =
                facilityFilter === "all" ||
                room.facilities.includes(facilityFilter);

            return matchSearch && matchStatus && matchBuilding && matchFacility;
        });

        setFilteredClasses(filtered);
    }, [searchTerm, statusFilter, buildingFilter, facilityFilter]);

    // Get status style
    const getStatusStyle = (status) => {
        switch (status) {
            case "available":
                return "bg-success-light text-success-dark";
            case "occupied":
                return "bg-warning-light text-warning-dark";
            case "maintenance":
                return "bg-danger-light text-danger-dark";
            default:
                return "bg-disable-light text-disable-dark";
        }
    };

    // Status label
    const getStatusLabel = (status) => {
        switch (status) {
            case "available":
                return "Available";
            case "occupied":
                return "Occupied";
            case "maintenance":
                return "Maintenance";
            default:
                return status;
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
        return format(date, "EEE", { locale: enUS });
    };

    // Format day number
    const formatDayNumber = (date) => {
        return format(date, "d", { locale: enUS });
    };

    // Check if date is today
    const isToday = (date) => {
        return isSameDay(date, new Date());
    };

    // Get current month and year
    const getCurrentMonthYear = () => {
        if (weekDays.length === 0) return "";
        return format(weekDays[3], "MMMM yyyy", { locale: enUS });
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

    const isInRange = (date) => {
        if (!dateRange || !dateRange.start || !dateRange.end) return false;
        return (
            isSameDay(date, dateRange.start) ||
            isSameDay(date, dateRange.end) ||
            (date > dateRange.start && date < dateRange.end)
        );
    };

    return (
        <UserLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Room Booking
                </h2>
            }
        >
            <Head title="Room Booking" />

            <div className="py-6 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Sidebar */}
                        <div className="md:w-1/4 md:sticky md:top-24 md:self-start">
                            {bookingData ? (
                                <div className="bg-white shadow rounded-lg mb-6">
                                    <div className="bg-primary px-4 py-[22px] rounded-t-lg">
                                        <h3 className="text-lg font-semibold text-primary-light">
                                            Booking Details
                                        </h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Booking Type
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.bookingType ===
                                                    "ruang"
                                                        ? "Room Booking"
                                                        : bookingData.bookingType ===
                                                          "fasilitas"
                                                        ? "Facility Booking"
                                                        : "-"}
                                                </p>
                                            </div>

                                            {bookingData.selectedActivity ===
                                                "Other" && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                        <Info className="h-4 w-4 mr-2" />
                                                        Custom Activity
                                                    </h4>
                                                    <p className="text-sm">
                                                        {bookingData.customActivity ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <School className="h-4 w-4 mr-2" />
                                                    Faculty
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.selectedFaculty
                                                        ?.label || "-"}
                                                </p>
                                            </div>

                                            {/* Date Section */}
                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Date
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.isRangeMode &&
                                                    bookingData.endDate
                                                        ? `${new Date(
                                                              bookingData.selectedDate
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  weekday:
                                                                      "long",
                                                                  day: "numeric",
                                                                  month: "long",
                                                                  year: "numeric",
                                                              }
                                                          )} - ${new Date(
                                                              bookingData.endDate
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  weekday:
                                                                      "long",
                                                                  day: "numeric",
                                                                  month: "long",
                                                                  year: "numeric",
                                                              }
                                                          )}`
                                                        : new Date(
                                                              bookingData.selectedDate
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  weekday:
                                                                      "long",
                                                                  day: "numeric",
                                                                  month: "long",
                                                                  year: "numeric",
                                                              }
                                                          )}
                                                </p>
                                            </div>

                                            {/* Time Section */}
                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Time
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.startTime} -{" "}
                                                    {bookingData.endTime}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <UserCircle className="h-4 w-4 mr-2" />
                                                    Activity
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.selectedActivity ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Capacity
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData.capacity}{" "}
                                                    people
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-primary mb-1 flex items-center">
                                                    <Building className="h-4 w-4 mr-2" />
                                                    Building
                                                </h4>
                                                <p className="text-sm">
                                                    {bookingData
                                                        .selectedBuilding
                                                        ?.label || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setPopupOpen(true)}
                                            className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Booking Details
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white shadow rounded-lg p-5 text-center border border-primary-light">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                                        No Booking Information
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Please fill in your booking requirements
                                        to see available rooms.
                                    </p>
                                    <button
                                        onClick={() => setPopupOpen(true)}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out"
                                    >
                                        Fill Booking Requirements
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Content */}
                        <div className="md:w-3/4">
                            {/* Calendar Section */}
                            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
                                <div className="p-5 border-b border-gray-200 bg-primary">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-primary-light">
                                            Booking Date
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={previousWeek}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-primary-light"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium text-primary-light">
                                                {getCurrentMonthYear()}
                                            </span>
                                            <button
                                                onClick={nextWeek}
                                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-primary-light"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                            {!bookingData && (
                                                <button
                                                    onClick={() =>
                                                        setShowExpandedCalendar(
                                                            true
                                                        )
                                                    }
                                                    className="ml-4 p-1.5 rounded-full hover:bg-white/20 transition-colors text-primary-light"
                                                    title="Expand calendar"
                                                >
                                                    <Expand className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-7 gap-3">
                                        {weekDays.map((day, index) => (
                                            <div
                                                key={index}
                                                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all
${
    isSameDay(day, selectedDate)
        ? "border-primary bg-primary text-white"
        : isInRange(day)
        ? "bg-primary text-white border-primary"
        : isToday(day)
        ? "bg-primary-light border-primary"
        : "hover:bg-gray-50 border-transparent"
}
${bookingData ? "cursor-default" : "cursor-pointer"}`}
                                                onClick={() => {
                                                    if (!bookingData)
                                                        setSelectedDate(day);
                                                }}
                                            >
                                                <span
                                                    className={`text-xs font-medium mb-1 ${
                                                        isSameDay(
                                                            day,
                                                            selectedDate
                                                        ) || isInRange(day)
                                                            ? "text-white"
                                                            : isToday(day)
                                                            ? "text-primary"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {formatDayName(day)}
                                                </span>
                                                <span
                                                    className={`text-xl font-medium ${
                                                        isSameDay(
                                                            day,
                                                            selectedDate
                                                        ) || isInRange(day)
                                                            ? "text-white"
                                                            : isToday(day)
                                                            ? "text-primary"
                                                            : "text-gray-800"
                                                    }`}
                                                >
                                                    {formatDayNumber(day)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 p-3 rounded-lg bg-primary-light">
                                        <div className="flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full mr-2 bg-primary"></div>
                                            <span className="text-sm font-medium text-primary text">
                                                {dateRange &&
                                                dateRange.start &&
                                                dateRange.end
                                                    ? `Selected range: ${format(
                                                          dateRange.start,
                                                          "MMMM dd, yyyy",
                                                          { locale: enUS }
                                                      )} - ${format(
                                                          dateRange.end,
                                                          "MMMM dd, yyyy",
                                                          { locale: enUS }
                                                      )}`
                                                    : `Selected date: ${format(
                                                          selectedDate,
                                                          "MMMM dd, yyyy",
                                                          { locale: enUS }
                                                      )}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Rooms Section */}
                            <div>
                                <div
                                    className={`sticky top-24 z-20 py-4 px-4 mb-6 rounded-lg shadow transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                                        isStickyActive
                                            ? "bg-primary"
                                            : "bg-white"
                                    }`}
                                >
                                    <p
                                        className={`text-md font-medium ${
                                            isStickyActive
                                                ? "text-white"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        Showing {filteredClasses.length} of{" "}
                                        {classRooms.length} rooms
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                        {/* Search */}
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search rooms..."
                                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Filter Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setShowFilterDropdown(
                                                        !showFilterDropdown
                                                    )
                                                }
                                                className={`flex items-center gap-2 px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all ${
                                                    statusFilter !== "all" ||
                                                    buildingFilter !== "all" ||
                                                    facilityFilter !== "all"
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Filter className="h-4 w-4" />
                                                Filter
                                                {(statusFilter !== "all" ||
                                                    buildingFilter !== "all" ||
                                                    facilityFilter !==
                                                        "all") && (
                                                    <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                                                        {
                                                            [
                                                                statusFilter,
                                                                buildingFilter,
                                                                facilityFilter,
                                                            ].filter(
                                                                (f) =>
                                                                    f !== "all"
                                                            ).length
                                                        }
                                                    </span>
                                                )}
                                            </button>

                                            {showFilterDropdown && (
                                                <>
                                                    {/* Backdrop */}
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() =>
                                                            setShowFilterDropdown(
                                                                false
                                                            )
                                                        }
                                                    />

                                                    {/* Dropdown Menu */}
                                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                                        <div className="p-4 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-medium text-gray-900">
                                                                    Filters
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        setStatusFilter(
                                                                            "all"
                                                                        );
                                                                        setBuildingFilter(
                                                                            "all"
                                                                        );
                                                                        setFacilityFilter(
                                                                            "all"
                                                                        );
                                                                    }}
                                                                    className="text-xs text-primary hover:text-primary-dark"
                                                                >
                                                                    Clear All
                                                                </button>
                                                            </div>

                                                            {/* Status Filter */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Status
                                                                </label>
                                                                <select
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setStatusFilter(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    value={
                                                                        statusFilter
                                                                    }
                                                                >
                                                                    <option value="all">
                                                                        All
                                                                        Status
                                                                    </option>
                                                                    <option value="available">
                                                                        Available
                                                                    </option>
                                                                    <option value="occupied">
                                                                        Occupied
                                                                    </option>
                                                                    <option value="maintenance">
                                                                        Maintenance
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            {/* Building Filter */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Location
                                                                </label>
                                                                <select
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setBuildingFilter(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    value={
                                                                        buildingFilter
                                                                    }
                                                                >
                                                                    <option value="all">
                                                                        All
                                                                        Locations
                                                                    </option>
                                                                    {[
                                                                        ...new Set(
                                                                            classRooms.map(
                                                                                (
                                                                                    room
                                                                                ) =>
                                                                                    room.location
                                                                            )
                                                                        ),
                                                                    ].map(
                                                                        (
                                                                            loc
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    loc
                                                                                }
                                                                                value={
                                                                                    loc
                                                                                }
                                                                            >
                                                                                {
                                                                                    loc
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Facility Filter */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Facilities
                                                                </label>
                                                                <select
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setFacilityFilter(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    value={
                                                                        facilityFilter
                                                                    }
                                                                >
                                                                    <option value="all">
                                                                        All
                                                                        Facilities
                                                                    </option>
                                                                    {[
                                                                        ...new Set(
                                                                            classRooms.flatMap(
                                                                                (
                                                                                    r
                                                                                ) =>
                                                                                    r.facilities
                                                                            )
                                                                        ),
                                                                    ].map(
                                                                        (f) => (
                                                                            <option
                                                                                key={
                                                                                    f
                                                                                }
                                                                                value={
                                                                                    f
                                                                                }
                                                                            >
                                                                                {
                                                                                    f
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {filteredClasses.length === 0 ? (
                                    <div className="bg-white shadow rounded-lg p-8 text-center">
                                        <Frown className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <h4 className="text-lg font-medium text-gray-800 mb-2">
                                            No rooms found
                                        </h4>
                                        <p className="text-gray-600">
                                            Try different keywords for your
                                            search.
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
                                                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
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
                                                            "has schedule"
                                                                ? "Has Schedule"
                                                                : "No Schedule"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1">
                                                    <h4 className="text-lg font-medium mb-2 text-primary">
                                                        {classRoom.name}
                                                    </h4>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                            {classRoom.location}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                                                            {classRoom.capacity}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-start">
                                                                <Zap className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="block mb-1">
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
                                                                                    className="text-xs px-2 py-1 rounded-full mr-1 mb-1 bg-primary-light text-primary"
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
                                                        href={route(
                                                            "ruangan.detail"
                                                        )}
                                                        className={`w-full block text-center py-2.5 px-4 rounded-lg text-white text-md font-medium transition duration-150 ease-in-out ${
                                                            classRoom.status ===
                                                            "available"
                                                                ? "bg-primary hover:bg-primary-dark"
                                                                : "bg-disable cursor-not-allowed"
                                                        }`}
                                                    >
                                                        {classRoom.status ===
                                                        "available"
                                                            ? "Book Now"
                                                            : "Not Available"}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* {filteredClasses.length > 0 && (
                                    <div className="mt-6 text-center text-sm text-gray-600">
                                        Showing {filteredClasses.length} of{" "}
                                        {classRooms.length} rooms
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showExpandedCalendar && (
                <ExpandedCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onClose={() => setShowExpandedCalendar(false)}
                    locale={enUS}
                />
            )}

            {popupOpen && (
                <RoomBookingModal
                    mode="edit"
                    persistKey="roomBooking.room-list"
                    initialBookingData={bookingData}
                    onClose={() => setPopupOpen(false)}
                    faculties={faculties}
                    buildings={buildings}
                />
            )}

            {isStickyActive && (
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg transition duration-300"
                    title="Back to Top"
                >
                    <ArrowUp />
                </button>
            )}
        </UserLayout>
    );
}
