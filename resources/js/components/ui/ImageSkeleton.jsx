import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function ImageSkeleton({ className = "h-52" }) {
    return (
        <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center`}>
            <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No image available</p>
            </div>
        </div>
    );
} 