import React from "react";
import { Clock } from "lucide-react";

const TimeRangePicker = ({
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    timeSlots,
}) => {
    const handleStartTimeChange = (time) => {
        setStartTime(time);

        const startIndex = timeSlots.indexOf(time);
        const endIndex = timeSlots.indexOf(endTime);

        if (endTime && endTime <= time) {
            if (startIndex >= 0 && startIndex + 1 < timeSlots.length) {
                setEndTime(timeSlots[startIndex + 1]);
            }
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Waktu:
            </label>
            <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Mulai
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                            <Clock size={16} className="text-gray-500" />
                        </div>
                        <TimePicker
                            value={startTime}
                            onChange={handleStartTimeChange}
                            placeholder="Pilih waktu mulai"
                            timeSlots={timeSlots}
                        />
                    </div>
                </div>

                {/* End Time */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Selesai
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                            <Clock size={16} className="text-gray-500" />
                        </div>
                        <TimePicker
                            value={endTime}
                            onChange={setEndTime}
                            placeholder="Pilih waktu selesai"
                            disabled={!startTime}
                            timeSlots={timeSlots.filter((t) => t > startTime)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimePicker = ({ value, onChange, placeholder, disabled, timeSlots }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className={`w-full flex items-center text-left bg-white border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring focus:ring-[#365b6d] focus:ring-opacity-30 focus:border-[#365b6d] ${
                    disabled
                        ? "bg-gray-100 cursor-not-allowed"
                        : "cursor-pointer"
                }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className={!value ? "text-gray-400" : "text-gray-700"}>
                    {value || placeholder}
                </span>
                <span className="ml-auto">
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-30 max-h-60 overflow-auto">
                    <div className="py-1">
                        {timeSlots.map((time) => (
                            <div
                                key={time}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100
                                  ${
                                      value === time
                                          ? "bg-gray-50 text-[#365b6d] font-medium"
                                          : "text-gray-700"
                                  }`}
                                onClick={() => {
                                    onChange(time);
                                    setIsOpen(false);
                                }}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeRangePicker;
