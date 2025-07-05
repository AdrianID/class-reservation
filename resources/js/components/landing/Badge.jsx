import React from "react";

const Badge = ({ icon: Icon, children }) => (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
        <Icon className="w-4 h-4 mr-2" />
        {children}
    </div>
);

export default Badge;
