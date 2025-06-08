import React from "react";

const FeatureCard = ({ icon, title, description, color }) => (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
        <div
            className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 group-hover:opacity-15 transition-opacity rounded-3xl`}
        ></div>
        <div className="relative space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                {icon}
            </div>
            <div className="relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -bottom-2 left-1/4">
                    <div className="w-1 h-1 bg-primary/30 rounded-full animate-ping"></div>
                </div>
                <div className="absolute -bottom-1 right-1/4">
                    <div className="w-1 h-1 bg-primary/20 rounded-full animate-bounce"></div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
            <div
                className={`h-1 w-12 bg-gradient-to-r ${color} rounded-full mx-auto opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-300`}
            ></div>
        </div>
    </div>
);

export default FeatureCard;
