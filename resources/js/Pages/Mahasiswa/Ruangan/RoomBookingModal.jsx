import React, { useEffect, useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import Select from "react-select";
import {
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
    HelpCircle,
} from "lucide-react";
import { format, isToday, isAfter, isBefore } from "date-fns";
import DatePicker from "./components/DatePicker";

// Helper function to get today's date and time
const getToday = () => new Date();

// Constants
const OPERATIONAL_START_HOUR = 7;
const OPERATIONAL_END_HOUR = 21;
const PERSIST_KEY = "roomBooking";
const MAX_PERSIST_MINUTES = 60;

// Utility functions
const isDateAfter = (date1, date2) => isAfter(date1, date2);
const isDateBefore = (date1, date2) => isBefore(date1, date2);
const formatDate = (date, formatStr) => format(date, formatStr);

const RoomBookingModal = ({
    mode = "create",
    initialBookingData = null,
    initialCategory,
    onClose,
    faculties,
    buildings,
    persistKey = PERSIST_KEY,
}) => {
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState("");
    const [selectedActivity, setSelectedActivity] = useState("");
    const [customActivity, setCustomActivity] = useState("");
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [isRangeMode, setIsRangeMode] = useState(false);
    const [endDate, setEndDate] = useState(getToday());
    const [dateRangeError, setDateRangeError] = useState("");

    // Initialize state based on initial booking data if in edit mode
    useEffect(() => {
        if (mode === "edit" && initialBookingData) {
            setBookingType(initialBookingData.bookingType || "");
            setSelectedActivity(initialBookingData.selectedActivity || "");
            setCustomActivity(initialBookingData.customActivity || "");
            setSelectedDate(new Date(initialBookingData.selectedDate));
            setEndDate(
                initialBookingData.endDate
                    ? new Date(initialBookingData.endDate)
                    : new Date()
            );
            setStartTime(initialBookingData.startTime || "");
            setEndTime(initialBookingData.endTime || "");
            /* setCapacity(initialBookingData.capacity || 1); */
            setCapacity(Number(initialBookingData.capacity) || 1);
            setSelectedFaculty(initialBookingData.selectedFaculty || null);
            setSelectedBuilding(initialBookingData.selectedBuilding || null);
            setIsRangeMode(initialBookingData.isRangeMode || false);
        }
    }, [mode, initialBookingData]);

    // Generate time slots
    const timeSlots = useMemo(() => {
        const slots = [];
        for (
            let hour = OPERATIONAL_START_HOUR;
            hour <= OPERATIONAL_END_HOUR;
            hour++
        ) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
        }
        return slots;
    }, []);

    // Filter end time options based on selected start time
    const endTimeOptions = useMemo(() => {
        if (!startTime) return timeSlots;
        const startIndex = timeSlots.indexOf(startTime);
        return timeSlots.filter((_, index) => index > startIndex);
    }, [startTime, timeSlots]);

    // Set initial start and end times based on selected date
    useEffect(() => {
        const now = getToday();
        if (isToday(selectedDate)) {
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            let nextHour = currentHour;
            if (currentMinutes > 0 || currentHour < OPERATIONAL_START_HOUR) {
                nextHour = Math.min(currentHour + 1, OPERATIONAL_END_HOUR - 1);
            }
            const formattedStart = `${nextHour.toString().padStart(2, "0")}:00`;
            setStartTime(formattedStart);
            const endHour = Math.min(nextHour + 2, OPERATIONAL_END_HOUR);
            setEndTime(`${endHour.toString().padStart(2, "0")}:00`);
        } else {
            setStartTime("09:00");
            setEndTime("11:00");
        }
    }, [selectedDate]);

    // Ensure end date is not before start date
    useEffect(() => {
        if (isDateBefore(endDate, selectedDate)) {
            setEndDate(selectedDate);
        }
    }, [selectedDate]);

    // Handle range mode toggle
    const handleRangeModeToggle = (checked) => {
        setIsRangeMode(checked);
        if (checked && isDateBefore(endDate, selectedDate)) {
            setEndDate(selectedDate);
        } else {
            setDateRangeError("");
        }
    };

    // Handle date changes
    const handleStartDateChange = (date) => {
        setSelectedDate(date);
        if (isDateBefore(endDate, date)) {
            setEndDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (dateRangeError) setDateRangeError("");
    };

    // Validate date range
    useEffect(() => {
        if (isRangeMode) {
            setDateRangeError(
                isDateBefore(endDate, selectedDate)
                    ? "End date must be after start date"
                    : ""
            );
        } else {
            setDateRangeError("");
        }
    }, [selectedDate, endDate, isRangeMode]);

    // Handle navigation
    const handleNext = () => {
        if (step < 4) {
            if (
                step === 3 &&
                (!isStep3Valid() || (isRangeMode && dateRangeError))
            )
                return;
            setStep(step + 1);
        } else {
            const bookingData = {
                bookingType,
                selectedActivity,
                customActivity,
                selectedDate,
                endDate,
                isRangeMode,
                startTime,
                endTime,
                capacity,
                selectedFaculty,
                selectedBuilding,
            };

            setIsSubmitting(true);
            setTimeout(() => {
                clearPersistedData();
                const encoded = encodeURIComponent(JSON.stringify(bookingData));

                const currentParams = new URLSearchParams(
                    window.location.search
                );
                const existingBookingParam =
                    currentParams.get("booking") ||
                    localStorage.getItem("roomBooking.lastBookingParam");

                if (mode === "edit") {
                    localStorage.setItem(
                        "roomBooking.lastBookingParam",
                        encoded
                    );
                    router.get(`/ruangan/list?booking=${encoded}`);
                } else {
                    router.get(`/ruangan/list?booking=${encoded}`);
                }

                handleClose();
            }, 1500);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            clearPersistedData();
            const url = new URL(window.location);
            url.searchParams.delete("step");
            window.history.replaceState({}, "", url.pathname);
            onClose();
        }
    };

    /* const handleClose = () => {
        const url = new URL(window.location);
        url.searchParams.delete("step");
        window.history.replaceState({}, "", url.pathname);
        onClose();
    }; */

    const handleClose = () => {
        const url = new URL(window.location);
        url.searchParams.delete("step");
        window.history.replaceState({}, "", url.pathname);
        if (mode === "edit") {
            localStorage.removeItem("roomBooking.lastBookingParam");
        }
        onClose();
    };

    // Progress bar
    const renderProgressBar = () => (
        <div className="h-1 w-full bg-gray-200">
            <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                    width:
                        step === 1
                            ? "30%"
                            : step === 2
                            ? "50%"
                            : step === 3
                            ? "70%"
                            : "100%",
                }}
            />
        </div>
    );

    // Validation for step 3
    const isStep3Valid = () =>
        selectedDate &&
        startTime &&
        endTime &&
        capacity >= 5 &&
        selectedFaculty &&
        (!isRangeMode || (endDate && !dateRangeError));

    // Handle faculty change
    const handleFacultyChange = (selectedOption) => {
        setSelectedFaculty(selectedOption);
        setSelectedBuilding(null);
    };

    // Get available buildings
    const getAvailableBuildings = () =>
        selectedFaculty ? buildings[selectedFaculty.value] || [] : [];

    // Select styles
    const selectStyles = {
        control: (base) => ({
            ...base,
            minHeight: "42px",
            borderRadius: "0.5rem",
            borderColor: "#e5e7eb",
            boxShadow: "none",
            "&:hover": { borderColor: "#365b6d" },
            paddingLeft: "36px",
        }),
        valueContainer: (base) => ({ ...base, padding: "0 8px" }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#374151",
            "&:hover": { backgroundColor: "#f9fafb" },
        }),
        menu: (base) => ({ ...base, zIndex: 30 }),
    };

    // Get step title
    const getStepTitle = () => {
        const titles = {
            1: "Booking - Type",
            2: "Booking - Activity",
            3: "Booking - Schedule & Location",
            4: "Booking - Confirmation",
        };
        return titles[step] || "Booking";
    };

    // Booking types
    const bookingTypes = [
        {
            id: "ruang",
            label: "Room Booking",
            description: "Book a room for your activities",
            icon: <Building size={24} />,
        },
        {
            id: "fasilitas",
            label: "Facility Booking",
            description: "Book campus facilities for your activities",
            icon: <School size={24} />,
        },
    ];

    // Activities
    const activities = [
        { id: "kuliah", label: "Lecture", icon: <BookOpen size={20} /> },
        { id: "seminar", label: "Seminar", icon: <Users size={20} /> },
        { id: "rapat", label: "Meeting", icon: <Users size={20} /> },
        { id: "ukm", label: "Campus Activity", icon: <Users size={20} /> },
        { id: "studi", label: "Study Group", icon: <BookOpen size={20} /> },
        { id: "lainnya", label: "Other", icon: <Info size={20} /> },
    ];

    // Tooltip component
    const Tooltip = ({ text }) => (
        <div className="group relative inline-block">
            <HelpCircle size={16} className="text-gray-400 ml-1 inline" />
            <div className="absolute z-50 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 top-full left-1/2 transform -translate-x-1/2 mt-2 shadow-lg">
                {text}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
            </div>
        </div>
    );

    // Attempt to restore step from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stepParam = parseInt(params.get("step"));

        if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 4) {
            setStep(stepParam);
        }
    }, []);

    // Persist data
    useEffect(() => {
        if (mode === "edit") return;

        const saved = localStorage.getItem(persistKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const savedAt = new Date(data._savedAt);
                const now = getToday();
                const diff = (now - savedAt) / 60000;
                if (diff > MAX_PERSIST_MINUTES) {
                    localStorage.removeItem(persistKey);
                    return;
                }

                setStep(data.step || 1);
                setBookingType(data.bookingType || "");
                setSelectedActivity(data.selectedActivity || "");
                setCustomActivity(data.customActivity || "");
                setSelectedDate(
                    data.selectedDate ? new Date(data.selectedDate) : getToday()
                );
                setEndDate(data.endDate ? new Date(data.endDate) : getToday());
                setStartTime(data.startTime || "");
                setEndTime(data.endTime || "");
                setCapacity(data.capacity !== undefined ? data.capacity : 1);
                setSelectedFaculty(data.selectedFaculty || null);
                setSelectedBuilding(data.selectedBuilding || null);
                setIsRangeMode(data.isRangeMode || false);
            } catch (e) {
                console.error("Restore error:", e);
            }
        }
    }, [persistKey, mode]);

    // Save data
    useEffect(() => {
        const data = {
            step,
            bookingType,
            selectedActivity,
            customActivity,
            selectedDate,
            endDate,
            startTime,
            endTime,
            capacity,
            selectedFaculty,
            selectedBuilding,
            isRangeMode,
            _savedAt: new Date().toISOString(),
        };
        localStorage.setItem(persistKey, JSON.stringify(data));
    }, [
        step,
        bookingType,
        selectedActivity,
        customActivity,
        selectedDate,
        endDate,
        startTime,
        endTime,
        capacity,
        selectedFaculty,
        selectedBuilding,
        isRangeMode,
        persistKey,
    ]);

    // Sync current step to URL
    useEffect(() => {
        if (mode !== "edit") {
            const params = new URLSearchParams(window.location.search);
            params.set("step", step.toString());
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, "", newUrl);
        }
    }, [step, mode]);

    // Clear persisted data
    const clearPersistedData = () => localStorage.removeItem(persistKey);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 text-white bg-primary relative">
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacityنین20 rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-semibold mb-1">
                        {getStepTitle()}
                    </h2>
                    <p className="text-base text-white text-opacity-80">
                        Please complete the information to find available rooms
                        or facilities
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 1 && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {bookingTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                                            bookingType === type.id
                                                ? "border-primary bg-primary-light shadow-lg"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                        onClick={() => setBookingType(type.id)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className={`p-3 rounded-lg ${
                                                    bookingType === type.id
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {React.cloneElement(type.icon, {
                                                    className:
                                                        bookingType === type.id
                                                            ? "text-white"
                                                            : "text-gray-600",
                                                })}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {type.label}
                                                </h4>
                                                <p className="text-base text-gray-600">
                                                    {type.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="bg-primary-light p-4 rounded-lg mt-6">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 mr-3 flex-shrink-0 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm text-primary font-medium mb-1">
                                            Booking Type
                                        </p>
                                        <p className="text-sm text-primary">
                                            Choose the type of booking that fits
                                            your activity. For example, use
                                            "Room Booking" for lectures or
                                            "Facility Booking" for fields,
                                            halls, etc.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {activities.map((activity) => (
                                    <button
                                        key={activity.id}
                                        className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                                            selectedActivity === activity.label
                                                ? "border-primary ring-2 ring-primary ring-opacity-30 bg-primary-light"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            setSelectedActivity(activity.label)
                                        }
                                    >
                                        <div
                                            className={`p-3 rounded-full mb-2 ${
                                                selectedActivity ===
                                                activity.label
                                                    ? "bg-primary-light text-primary"
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
                            {selectedActivity === "Other" && (
                                <div className="mt-4">
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Specify Activity:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary"
                                        placeholder="Enter activity name"
                                        value={customActivity}
                                        onChange={(e) =>
                                            setCustomActivity(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                            <div className="bg-primary-light p-4 rounded-lg mt-6">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 mr-3 flex-shrink-0 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm text-primary font-medium mb-1">
                                            Activity Type
                                        </p>
                                        <p className="text-sm text-primary">
                                            Select the type of activity that
                                            represents your event. If not
                                            listed, choose "Other" and type
                                            manually.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Date Column */}
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-700 mb-4 flex items-center">
                                        <Calendar
                                            size={16}
                                            className="mr-2 text-gray-500"
                                        />
                                        Date & Time
                                        <Tooltip text="Select date and time for your booking. Rooms are operational from 07:00 to 21:00." />
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Calendar
                                                    size={14}
                                                    className="text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    Range Mode
                                                    <Tooltip text="Select a date range to view room availability." />
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="rangeMode"
                                                    checked={isRangeMode}
                                                    onChange={(e) =>
                                                        handleRangeModeToggle(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only"
                                                />
                                                <label
                                                    htmlFor="rangeMode"
                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors duration-200 ${
                                                        isRangeMode
                                                            ? "bg-primary"
                                                            : "bg-gray-300"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                                                            isRangeMode
                                                                ? "translate-x-5"
                                                                : "translate-x-1"
                                                        }`}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                {isRangeMode
                                                    ? "Date Range"
                                                    : "Date"}
                                            </label>
                                            <DatePicker
                                                isRange={isRangeMode}
                                                selectedDate={selectedDate}
                                                setSelectedDate={
                                                    handleStartDateChange
                                                }
                                                endDate={endDate}
                                                setEndDate={handleEndDateChange}
                                                minDate={getToday()}
                                            />
                                            {dateRangeError && (
                                                <p className="mt-1 text-sm text-danger">
                                                    {dateRangeError}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Time
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Start Time
                                                    </label>
                                                    <select
                                                        value={startTime}
                                                        onChange={(e) =>
                                                            setStartTime(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary text-sm"
                                                    >
                                                        {timeSlots
                                                            .filter(
                                                                (time) =>
                                                                    time !==
                                                                    "21:00"
                                                            )
                                                            .map((time) => (
                                                                <option
                                                                    key={time}
                                                                    value={time}
                                                                >
                                                                    {time}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center mt-5">
                                                    <span className="text-gray-400 text-sm">
                                                        to
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        End Time
                                                    </label>
                                                    <select
                                                        value={endTime}
                                                        onChange={(e) =>
                                                            setEndTime(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary text-sm"
                                                        disabled={
                                                            !startTime ||
                                                            startTime ===
                                                                "21:00"
                                                        }
                                                    >
                                                        {endTimeOptions.map(
                                                            (time) => (
                                                                <option
                                                                    key={time}
                                                                    value={time}
                                                                >
                                                                    {time}
                                                                </option>
                                                            )
                                                        )}
                                                        {startTime ===
                                                            "21:00" && (
                                                            <option value="21:00">
                                                                21:00
                                                            </option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Rooms are operational from 07:00
                                                to 21:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Capacity Column */}
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-700 mb-4 flex items-center">
                                        <Users
                                            size={16}
                                            className="mr-2 text-gray-500"
                                        />
                                        Capacity
                                        <Tooltip text="Select appropriate capacity for your participants. System will show rooms matching your needs." />
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Required Capacity:
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
                                                    min="5"
                                                    max="200"
                                                    className="w-full p-2.5 pl-10 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary"
                                                    placeholder="Number of people"
                                                    value={capacity}
                                                    onChange={(e) =>
                                                        setCapacity(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {capacity < 5 && (
                                                    <p className="text-sm text-danger mt-1">
                                                        Minimum room capacity is
                                                        5 people.
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Ensure room size matches your
                                                needs
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Quick Select:
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[5, 15, 30, 100].map(
                                                    (size) => (
                                                        <button
                                                            key={size}
                                                            type="button"
                                                            onClick={() =>
                                                                setCapacity(
                                                                    size.toString()
                                                                )
                                                            }
                                                            className={`p-2 text-sm rounded-lg border transition-colors ${
                                                                capacity ===
                                                                size.toString()
                                                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                                                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                                            }`}
                                                        >
                                                            {size <= 5
                                                                ? "Small"
                                                                : size <= 15
                                                                ? "Medium"
                                                                : size <= 30
                                                                ? "Large"
                                                                : "XL"}{" "}
                                                            ({size})
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Column */}
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-700 mb-4 flex items-center">
                                        <MapPin
                                            size={16}
                                            className="mr-2 text-gray-500"
                                        />
                                        Location
                                        <Tooltip text="You can book rooms across faculties. Select your preferred location." />
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Faculty:
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
                                                    placeholder="Select faculty"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Building:
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
                                                    placeholder="Select building"
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
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary-light p-4 rounded-lg">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 mr-3 flex-shrink-0 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm text-primary font-medium mb-1">
                                            Booking Information
                                        </p>
                                        <p className="text-sm text-primary">
                                            The system will display available
                                            rooms or facilities based on your
                                            selection. Make sure to select the
                                            appropriate capacity and location
                                            for your needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow">
                                <div className="p-4 flex items-center bg-primary">
                                    <Info
                                        size={20}
                                        className="text-white mr-2"
                                    />
                                    <h4 className="text-lg font-medium text-white">
                                        Booking Summary
                                    </h4>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                                Activity Information
                                            </h5>
                                            <dl className="space-y-4">
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Booking Type
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {bookingTypes.find(
                                                            (type) =>
                                                                type.id ===
                                                                bookingType
                                                        )?.label ||
                                                            "Not selected"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Activity
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedActivity ===
                                                        "Other"
                                                            ? customActivity ||
                                                              "Not specified"
                                                            : selectedActivity ||
                                                              "Not specified"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Date
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {isRangeMode
                                                            ? `${formatDate(
                                                                  selectedDate,
                                                                  "d MMM yyyy"
                                                              )} - ${formatDate(
                                                                  endDate,
                                                                  "d MMM yyyy"
                                                              )}`
                                                            : formatDate(
                                                                  selectedDate,
                                                                  "d MMMM yyyy"
                                                              )}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Day
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {formatDate(
                                                            selectedDate,
                                                            "EEEE"
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-100">
                                                Room/Facility Information
                                            </h5>
                                            <dl className="space-y-4">
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Time
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {startTime} - {endTime}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Capacity
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {capacity} people
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Faculty
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedFaculty?.label ||
                                                            "Not selected"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-base text-gray-500">
                                                        Building
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-800">
                                                        {selectedBuilding?.label ||
                                                            "Not selected"}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                    <div className="bg-primary-light p-4 rounded-lg flex items-start">
                                        <Check
                                            className="text-primary mt-0.5 mr-3 flex-shrink-0"
                                            size={20}
                                        />
                                        <p className="text-base text-gray-700">
                                            Please ensure all information is
                                            correct before proceeding!
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
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={
                            isSubmitting ||
                            (step === 1 && !bookingType) ||
                            (step === 2 && !selectedActivity) ||
                            (step === 3 && !isStep3Valid())
                        }
                        className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium ${
                            isSubmitting ||
                            (step === 1 && !bookingType) ||
                            (step === 2 && !selectedActivity) ||
                            (step === 3 && !isStep3Valid())
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                        } ${isSubmitting ? "opacity-75" : ""}`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {mode === "edit" ? "Saving..." : "Searching..."}
                            </span>
                        ) : (
                            <>
                                {step === 4
                                    ? mode === "edit"
                                        ? "Save Changes"
                                        : "Search"
                                    : "Continue"}
                                <ChevronRight size={18} className="ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomBookingModal;
