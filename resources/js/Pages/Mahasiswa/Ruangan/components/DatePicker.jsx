import { useState } from "react";
import { format, isBefore, isAfter, isToday, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";

export default function DatePicker({ selectedDate, setSelectedDate }) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getMonthDays = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
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

    const isDateSelectable = (day) => {
        if (!day) return false;

        const date = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            day
        );
        const today = new Date();

        return (
            isAfter(date, addDays(today, -1)) &&
            isBefore(date, addDays(today, 30))
        );
    };

    const renderDatePicker = () => {
        const days = getMonthDays();
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        return (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 w-full">
                <div className="flex justify-between items-center mb-3">
                    <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setSelectedDate(newDate);
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="font-medium">
                        {format(selectedDate, "MMMM yyyy", { locale: id })}
                    </div>
                    <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setSelectedDate(newDate);
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-xs font-medium text-gray-500"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        const isSelectable = isDateSelectable(day);
                        const isSelected =
                            day && day === selectedDate.getDate();

                        return (
                            <button
                                key={index}
                                disabled={!isSelectable}
                                className={`
    h-8 w-8 rounded-full flex items-center justify-center text-sm
    ${!day ? "invisible" : ""}
    ${isSelected ? "bg-primary text-white" : ""}
    ${!isSelected && isSelectable ? "hover:bg-gray-100" : ""}
    ${!isSelectable && day ? "text-gray-300 cursor-not-allowed" : ""}
  `}
                                onClick={() => {
                                    if (isSelectable) {
                                        const newDate = new Date(selectedDate);
                                        newDate.setDate(day);
                                        setSelectedDate(newDate);
                                        setShowDatePicker(false);
                                    }
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const formatDate = (date) => {
        const days = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        const day = days[date.getDay()];
        const dateNum = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}, ${dateNum} ${month} ${year}`;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Tanggal:
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                </div>
                <button
                    type="button"
                    className="w-full text-left bg-white border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring focus:ring-[#365b6d] focus:ring-opacity-30 focus:border-[#365b6d]"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                >
                    {formatDate(selectedDate)}
                </button>
                {showDatePicker && renderDatePicker()}
            </div>
        </div>
    );
}
