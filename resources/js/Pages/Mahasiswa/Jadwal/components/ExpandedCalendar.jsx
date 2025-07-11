import { useState, useEffect } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    isToday as checkIsToday,
    isBefore,
    isAfter,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";

export default function ExpandedCalendar({
    dateRange,
    isRangeMode = false,
    onDateSelect,
    onClose,
}) {
    const [currentMonth, setCurrentMonth] = useState(
        dateRange?.startDate || new Date()
    );

    const [tempRange, setTempRange] = useState({
        startDate: null,
        endDate: null,
    });

    useEffect(() => {
        const storedRange = localStorage.getItem("calendar-temp-range");
        if (storedRange) {
            const parsed = JSON.parse(storedRange);
            setTempRange({
                startDate: parsed.startDate ? new Date(parsed.startDate) : null,
                endDate: parsed.endDate ? new Date(parsed.endDate) : null,
            });
            if (parsed.startDate) {
                setCurrentMonth(new Date(parsed.startDate));
            }
        } else {
            setTempRange({
                startDate: dateRange?.startDate || null,
                endDate: dateRange?.endDate || null,
            });
        }
    }, []);

    const [hoverDate, setHoverDate] = useState(null);

    // Generate calendar days
    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    };

    // Navigate to previous month
    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // Check if date is selected
    const isSelected = (date) => {
        if (isRangeMode) {
            return (
                (tempRange.startDate && isSameDay(date, tempRange.startDate)) ||
                (tempRange.endDate && isSameDay(date, tempRange.endDate))
            );
        } else {
            return dateRange.startDate && isSameDay(date, dateRange.startDate);
        }
    };

    // Check if date is in range (including hover preview)
    const isInRange = (date) => {
        if (!isRangeMode) return false;

        const start = tempRange.startDate;
        const end = tempRange.endDate || hoverDate;

        if (!start || !end) return false;

        const rangeStart = isBefore(start, end) ? start : end;
        const rangeEnd = isAfter(start, end) ? start : end;

        return isWithinInterval(date, {
            start: rangeStart,
            end: rangeEnd,
        });
    };

    // Check if date is start of range
    const isRangeStart = (date) => {
        if (!isRangeMode || !tempRange.startDate) return false;
        return isSameDay(date, tempRange.startDate);
    };

    // Check if date is end of range
    const isRangeEnd = (date) => {
        if (!isRangeMode || !tempRange.endDate) return false;
        return isSameDay(date, tempRange.endDate);
    };

    // Check if date is today
    const isToday = (date) => {
        return checkIsToday(date);
    };

    // Check if date is in current month
    const isCurrentMonth = (date) => {
        return isSameMonth(date, currentMonth);
    };

    // Handle date click
    const handleDateClick = (date) => {
        if (isRangeMode) {
            if (!tempRange.startDate || tempRange.endDate) {
                // Start new range
                setTempRange({ startDate: date, endDate: null });
            } else {
                // Complete range
                const start = tempRange.startDate;
                const end = date;

                if (isBefore(start, end)) {
                    setTempRange({ startDate: start, endDate: end });
                } else {
                    setTempRange({ startDate: end, endDate: start });
                }
            }
        } else {
            onDateSelect({ startDate: date, endDate: date });
        }
    };

    useEffect(() => {
        if (tempRange.startDate || tempRange.endDate) {
            localStorage.setItem(
                "calendar-temp-range",
                JSON.stringify({
                    startDate: tempRange.startDate
                        ? tempRange.startDate.toISOString()
                        : null,
                    endDate: tempRange.endDate
                        ? tempRange.endDate.toISOString()
                        : null,
                })
            );
        }
    }, [tempRange]);

    // Handle date hover for range preview
    const handleDateHover = (date) => {
        if (isRangeMode && tempRange.startDate && !tempRange.endDate) {
            setHoverDate(date);
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setHoverDate(null);
    };

    // Handle overlay click to close
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle confirm selection
    const handleConfirm = () => {
        if (isRangeMode) {
            onDateSelect(tempRange);
        }
        localStorage.removeItem("calendar-temp-range");
        onClose();
    };

    // Handle cancel selection
    const handleCancel = () => {
        setTempRange({
            startDate: dateRange?.startDate || null,
            endDate: dateRange?.endDate || null,
        });
        localStorage.removeItem("calendar-temp-range");
        onClose();
    };

    // Quick date selections
    const quickSelectToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        if (isRangeMode) {
            setTempRange({ startDate: today, endDate: today });
        } else {
            onDateSelect({ startDate: today, endDate: today });
        }
    };

    const quickSelectWeek = () => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
        setCurrentMonth(today);
        setTempRange({ startDate: weekStart, endDate: weekEnd });
    };

    const quickSelectMonth = () => {
        const today = new Date();
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        setCurrentMonth(today);
        setTempRange({ startDate: monthStart, endDate: monthEnd });
    };

    // Get current month year display
    const getCurrentMonthYear = () => {
        return format(currentMonth, "MMMM yyyy", { locale: enUS });
    };

    // Get date range display text
    const getDateRangeText = () => {
        if (!isRangeMode) {
            return dateRange.startDate
                ? `Selected: ${format(dateRange.startDate, "dd MMMM yyyy", {
                      locale: enUS,
                  })}`
                : "Select date";
        } else {
            if (tempRange.startDate && tempRange.endDate) {
                return `${format(tempRange.startDate, "dd MMM yyyy", {
                    locale: enUS,
                })} - ${format(tempRange.endDate, "dd MMM yyyy", {
                    locale: enUS,
                })}`;
            } else if (tempRange.startDate) {
                return `${format(tempRange.startDate, "dd MMM yyyy", {
                    locale: enUS,
                })} - Select end date`;
            } else {
                return "Select date range";
            }
        }
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-primary">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">
                            {isRangeMode ? "Select Date Range" : "Select Date"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Quick Select Buttons (Range Mode Only) */}
                {isRangeMode && (
                    <div className="p-4 border-b border-gray-100">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={quickSelectToday}
                                className="w-full text-sm font-medium py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-all"
                            >
                                Today
                            </button>
                            <button
                                onClick={quickSelectWeek}
                                className="w-full text-sm font-medium py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-all"
                            >
                                This Week
                            </button>
                            <button
                                onClick={quickSelectMonth}
                                className="w-full text-sm font-medium py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-all"
                            >
                                This Month
                            </button>
                        </div>
                    </div>
                )}

                {/* Calendar Navigation */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={previousMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h4 className="text-lg font-semibold text-primary">
                            {getCurrentMonthYear()}
                        </h4>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Week Days Header */}
                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className="text-center text-xs font-semibold py-2 text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div
                        className="grid grid-cols-7 gap-1"
                        onMouseLeave={handleMouseLeave}
                    >
                        {calendarDays.map((day, index) => {
                            const dayIsSelected = isSelected(day);
                            const dayIsInRange = isInRange(day);
                            const dayIsToday = isToday(day);
                            const dayIsCurrentMonth = isCurrentMonth(day);
                            const dayIsRangeStart = isRangeStart(day);
                            const dayIsRangeEnd = isRangeEnd(day);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(day)}
                                    onMouseEnter={() => handleDateHover(day)}
                                    className={`
                                        relative h-10 w-10 text-sm rounded-lg transition-all duration-200
                                        ${
                                            dayIsCurrentMonth
                                                ? "text-gray-900 hover:bg-gray-100"
                                                : "text-gray-400 hover:bg-gray-50"
                                        }
                                        ${
                                            dayIsSelected
                                                ? "font-semibold shadow-lg"
                                                : ""
                                        }
                                        ${dayIsInRange ? "font-medium" : ""}
                                        ${
                                            dayIsToday && !dayIsSelected
                                                ? "border-2 font-semibold"
                                                : "border-2 border-transparent"
                                        }
                                        ${
                                            dayIsRangeStart || dayIsRangeEnd
                                                ? "z-10"
                                                : ""
                                        }
                                        ${
                                            dayIsSelected
                                                ? "bg-primary text-white"
                                                : dayIsInRange
                                                ? "bg-accent text-white"
                                                : ""
                                        }
                                        ${
                                            dayIsToday && !dayIsSelected
                                                ? "border-primary"
                                                : ""
                                        }
                                    `}
                                >
                                    <span className="relative z-10">
                                        {format(day, "d")}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4">
                    <div className="p-4 rounded-xl mb-4 border border-primary border-opacity-20 bg-primary-light">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0 bg-primary" />
                            <span className="text-sm font-medium text-primary">
                                {getDateRangeText()}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-colors font-medium shadow-lg hover:shadow-xl ${
                                isRangeMode &&
                                (!tempRange.startDate || !tempRange.endDate)
                                    ? "bg-disable cursor-not-allowed shadow-none hover:shadow-none"
                                    : "bg-primary"
                            }`}
                            disabled={
                                isRangeMode &&
                                (!tempRange.startDate || !tempRange.endDate)
                            }
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
