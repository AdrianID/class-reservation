import React from "react";

const SectionHeader = ({ badge, title, description }) => (
    <div className="text-center mb-16">
        {badge}
        <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            {title}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
    </div>
);

export default SectionHeader;
