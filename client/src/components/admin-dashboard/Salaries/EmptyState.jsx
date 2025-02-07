import React from 'react';
import { Box, FileQuestion, MoveUpRight } from 'lucide-react';

const EmptyState = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 gap-6">
            {/* Animated Icons Container */}
            <div className="relative w-32 h-32 mb-4">
                {/* Floating boxes animation */}
                <div className="absolute animate-bounce delay-100">
                    <Box className="text-gray-300 w-8 h-8" />
                </div>
                <div className="absolute left-12 top-6 animate-bounce delay-300">
                    <Box className="text-gray-300 w-6 h-6" />
                </div>
                <div className="absolute right-0 top-4 animate-bounce delay-500">
                    <Box className="text-gray-300 w-7 h-7" />
                </div>
                {/* Central Question Mark Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-6 animate-pulse">
                        <FileQuestion className="w-12 h-12 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <h3 className="text-2xl font-bold text-gray-700 tracking-wide animate-fade-in">
                No Data Found
            </h3>

            {/* Description with fade-in animation */}
            <p className="text-gray-500 text-center max-w-md animate-fade-in delay-150">
                Looks like there's nothing here yet. Start adding some data to see it appear in this space.
            </p>
        </div>
    );
};

export default EmptyState;