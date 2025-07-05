import React from "react";

const StatCard = ({ number, label, icon: Icon, className }) => (
    <div
        className={`absolute ${className} bg-white/80 backdrop-brightness-110 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50`}
    >
        <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-primary">{number}</div>
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="text-gray-600 text-sm">{label}</div>
    </div>
);

export default StatCard;
