import React from 'react';

const ImageSkeleton = ({ className = "", alt = "Placeholder" }) => {
    return (
        <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden ${className}`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
            
            <div className="text-center z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 mb-3 inline-block shadow-sm animate-pulse">
                    <svg
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-gray-500 font-medium bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    Tidak ada gambar
                </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
    );
};

export default ImageSkeleton; 