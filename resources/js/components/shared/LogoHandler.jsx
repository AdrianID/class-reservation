import React from "react";

export default function LogoHandler({ className, scrolled }) {
    // Memilih logo berdasarkan status scroll
    // - Saat scrolled: Gunakan logo yang lebih compact
    // - Saat tidak scrolled: Gunakan logo dengan background banner

    if (scrolled) {
        return (
            <div className={`flex items-center ${className}`}>
                <img
                    src="/images/logos.svg"
                    alt="LOD University"
                    className="h-full"
                />
            </div>
        );
    }

    // Versi banner: logo dengan background putih
    return (
        <div className={`relative ${className}`}>
            <div className="absolute bg-white h-full w-auto sm:w-32 sm:h-20 shadow-md flex items-center justify-center px-3 rounded-b-lg">
                <img
                    src="/images/logo.svg"
                    alt="LOD University"
                    className="h-full max-h-16"
                />
            </div>
        </div>
    );
}
