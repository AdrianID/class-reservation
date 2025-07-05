import React from "react";

const Button = ({
    variant = "primary",
    className = "",
    children,
    ...props
}) => {
    const baseClasses =
        "px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300";
    const variants = {
        primary:
            "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:-translate-y-1",
        secondary:
            "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg",
        accent: "bg-accent text-white hover:bg-accent-dark",
    };
    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
