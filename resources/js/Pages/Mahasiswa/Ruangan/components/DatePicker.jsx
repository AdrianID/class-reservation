import { useState, useEffect } from "react";
import { format, isBefore, isAfter, isToday, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";

export default function DatePicker({
    selectedDate,
    setSelectedDate,
    minDate,
    isRange = false,
    endDate,
    setEndDate,
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(selectedDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);
    const [selectingStart, setSelectingStart] = useState(true);

    useEffect(() => {
        setTempStartDate(selectedDate);
        setTempEndDate(endDate);
    }, [selectedDate, endDate]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getMonthDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = getDaysInMonth(year, month);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const isDateSelectable = (day, date) => {
        if (!day) return false;
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        return (
            !minDate ||
            isAfter(currentDate, minDate) ||
            isSameDay(currentDate, minDate)
        );
    };

    const handleDateClick = (day, date) => {
        if (!day) return;

        const clickedDate = new Date(date.getFullYear(), date.getMonth(), day);
        if (!isDateSelectable(day, date)) return;

        if (isRange) {
            if (selectingStart) {
                setTempStartDate(clickedDate);
                setTempEndDate(null);
                setSelectingStart(false);
            } else {
                if (isBefore(clickedDate, tempStartDate)) {
                    setTempStartDate(clickedDate);
                    setTempEndDate(null);
                    setSelectingStart(false);
                } else {
                    setTempEndDate(clickedDate);
                    setSelectedDate(tempStartDate);
                    setEndDate(clickedDate);
                    setShowDatePicker(false);
                    setSelectingStart(true);
                }
            }
        } else {
            setSelectedDate(clickedDate);
            setShowDatePicker(false);
        }
    };

    const renderDay = (day, date) => {
        if (!day) return <div className="h-8 w-8"></div>;

        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        const isSelectable = isDateSelectable(day, date);

        let isInRange = false;
        let isStart = false;
        let isEnd = false;

        if (isRange) {
            if (tempStartDate && tempEndDate) {
                isInRange =
                    isAfter(currentDate, tempStartDate) &&
                    isBefore(currentDate, tempEndDate);
                isStart = isSameDay(currentDate, tempStartDate);
                isEnd = isSameDay(currentDate, tempEndDate);
            } else if (tempStartDate) {
                isStart = isSameDay(currentDate, tempStartDate);
            }
        }

        return (
            <button
                key={`${date.getMonth()}-${day}`}
                disabled={!isSelectable}
                className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm
                    ${isStart || isEnd ? "bg-primary text-white" : ""}
                    ${isInRange ? "bg-primary-light" : ""}
                    ${
                        !isSelectable
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-100"
                    }
                `}
                onClick={() => handleDateClick(day, date)}
            >
                {day}
            </button>
        );
    };

    const formatDisplayDate = () => {
        if (isRange) {
            return `${format(tempStartDate, "d MMM yyyy")} - ${
                tempEndDate ? format(tempEndDate, "d MMM yyyy") : "..."
            }`;
        }
        return format(selectedDate, "EEEE, d MMMM yyyy", { locale: id });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(tempStartDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setTempStartDate(newDate);
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                <Calendar size={16} className="text-gray-500" />
            </div>
            <button
                type="button"
                className="w-full text-left bg-white border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring focus:ring-primary focus:ring-opacity-30 focus:border-primary text-base text-gray-800"
                onClick={() => setShowDatePicker(!showDatePicker)}
            >
                {formatDisplayDate()}
            </button>

            {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 w-72">
                    <div className="flex justify-between items-center mb-3">
                        <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => navigateMonth(-1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="font-medium text-base text-gray-800">
                            {format(tempStartDate, "MMMM yyyy", { locale: id })}
                        </div>
                        <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => navigateMonth(1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {isRange && (
                        <div className="text-sm text-center mb-2 text-gray-600">
                            {selectingStart
                                ? "Select start date"
                                : "Select end date"}
                        </div>
                    )}

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-xs font-medium text-gray-500"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {getMonthDays(tempStartDate).map((day, index) =>
                            renderDay(day, tempStartDate)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
