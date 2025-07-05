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
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";

export default function ExpandedCalendar({
    selectedDate,
    dateRange,
    isRangeMode = false,
    onDateSelect,
    onClose,
}) {
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";
    const accentColor = "#4a90a4";

    const [currentMonth, setCurrentMonth] = useState(
        selectedDate || new Date()
    );

    const [tempRange, setTempRange] = useState({
        startDate: dateRange?.startDate || null,
        endDate: dateRange?.endDate || null,
    });

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
            return selectedDate && isSameDay(date, selectedDate);
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
            onDateSelect(date);
        }
    };

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
        onClose();
    };

    // Quick date selections
    const quickSelectToday = () => {
        const today = new Date();
        if (isRangeMode) {
            setTempRange({ startDate: today, endDate: today });
        } else {
            onDateSelect(today);
        }
    };

    const quickSelectWeek = () => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
        setTempRange({ startDate: weekStart, endDate: weekEnd });
    };

    const quickSelectMonth = () => {
        const today = new Date();
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        setTempRange({ startDate: monthStart, endDate: monthEnd });
    };

    // Get current month year display
    const getCurrentMonthYear = () => {
        return format(currentMonth, "MMMM yyyy", { locale: id });
    };

    // Get date range display text
    const getDateRangeText = () => {
        if (!isRangeMode) {
            return selectedDate
                ? `Terpilih: ${format(selectedDate, "dd MMMM yyyy", {
                      locale: id,
                  })}`
                : "Pilih tanggal";
        } else {
            if (tempRange.startDate && tempRange.endDate) {
                return `${format(tempRange.startDate, "dd MMM yyyy", {
                    locale: id,
                })} - ${format(tempRange.endDate, "dd MMM yyyy", {
                    locale: id,
                })}`;
            } else if (tempRange.startDate) {
                return `${format(tempRange.startDate, "dd MMM yyyy", {
                    locale: id,
                })} - Pilih tanggal akhir`;
            } else {
                return "Pilih rentang tanggal";
            }
        }
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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
                <div
                    className="p-6 border-b flex items-center justify-between"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">
                            {isRangeMode
                                ? "Pilih Rentang Tanggal"
                                : "Pilih Tanggal"}
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
                        <div className="flex gap-2">
                            <button
                                onClick={quickSelectToday}
                                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Hari Ini
                            </button>
                            <button
                                onClick={quickSelectWeek}
                                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Minggu Ini
                            </button>
                            <button
                                onClick={quickSelectMonth}
                                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Bulan Ini
                            </button>
                        </div>
                    </div>
                )}

                {/* Calendar Navigation */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={previousMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            style={{ color: primaryColor }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h4
                            className="text-lg font-semibold"
                            style={{ color: primaryColor }}
                        >
                            {getCurrentMonthYear()}
                        </h4>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            style={{ color: primaryColor }}
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
                                                ? "text-white font-semibold shadow-lg"
                                                : ""
                                        }
                                        ${
                                            dayIsInRange && !dayIsSelected
                                                ? "font-medium text-white"
                                                : ""
                                        }
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
                                    `}
                                    style={{
                                        backgroundColor: dayIsSelected
                                            ? primaryColor
                                            : dayIsInRange
                                            ? accentColor
                                            : "transparent",
                                        borderColor:
                                            dayIsToday && !dayIsSelected
                                                ? primaryColor
                                                : "transparent",
                                    }}
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
                    <div
                        className="p-4 rounded-xl mb-4 border"
                        style={{
                            backgroundColor: primaryLightColor,
                            borderColor: primaryColor + "20",
                        }}
                    >
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <span
                                className="text-sm font-medium"
                                style={{ color: primaryColor }}
                            >
                                {getDateRangeText()}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2.5 rounded-lg text-white transition-colors font-medium shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: primaryColor }}
                            disabled={
                                isRangeMode &&
                                (!tempRange.startDate || !tempRange.endDate)
                            }
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
