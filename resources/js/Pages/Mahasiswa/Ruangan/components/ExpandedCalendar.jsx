import {
    format,
    addMonths,
    subMonths,
    isSameDay,
    isSameMonth,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
} from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

export default function ExpandedCalendar({
    selectedDate,
    onDateSelect,
    onClose,
}) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const primaryColor = "#365b6d";
    const primaryLightColor = "#e9eff2";

    // Get all days in current month
    const monthDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Format day name
    const formatDayName = (date) => {
        return format(date, "EEE", { locale: id });
    };

    // Format month and year
    const formatMonthYear = (date) => {
        return format(date, "MMMM yyyy", { locale: id });
    };

    // Navigate to previous month
    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3
                        className="text-lg font-medium"
                        style={{ color: primaryColor }}
                    >
                        Pilih Tanggal
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={previousMonth}
                            className="p-2 rounded-full hover:bg-gray-100"
                            style={{ color: primaryColor }}
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
                        <span className="font-medium text-gray-700">
                            {formatMonthYear(currentMonth)}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-full hover:bg-gray-100"
                            style={{ color: primaryColor }}
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
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-medium text-gray-500 py-1"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {monthDays.map((day) => {
                            const isSelected = isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(
                                day,
                                currentMonth
                            );

                            return (
                                <button
                                    key={day.toString()}
                                    onClick={() => {
                                        onDateSelect(day);
                                        onClose();
                                    }}
                                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                        !isCurrentMonth ? "text-gray-300" : ""
                                    } ${
                                        isSelected
                                            ? "text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                    style={{
                                        backgroundColor: isSelected
                                            ? primaryColor
                                            : "",
                                        color: isSelected
                                            ? "white"
                                            : isCurrentMonth
                                            ? "inherit"
                                            : "",
                                    }}
                                    disabled={!isCurrentMonth}
                                >
                                    {format(day, "d", { locale: id })}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
