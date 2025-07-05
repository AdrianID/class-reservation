import React from "react";

const StatItem = ({ number, label, numberClass, labelClass, className }) => (
    <div className={`text-center ${className}`}>
        <div className={numberClass}>{number}</div>
        <div className={labelClass}>{label}</div>
    </div>
);

export default StatItem;
