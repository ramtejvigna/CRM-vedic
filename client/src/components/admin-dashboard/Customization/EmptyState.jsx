import React from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Upload, Image as ImageIcon } from 'lucide-react';

const EmptyState = ({ onUploadClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mb-6"
            >
                {/* Background decorative elements */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute inset-0 bg-blue-100 rounded-full opacity-20 w-32 h-32"
                />

                {/* Main icon group */}
                <div className="relative">
                    <motion.div
                        animate={{
                            y: [-4, 4, -4]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-10"
                    >
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <ImageIcon className="w-12 h-12 text-blue-500" />
                        </div>

                        {/* Floating upload icon */}
                        <motion.div
                            animate={{
                                y: [-8, 0, -8],
                                x: [4, -4, 4],
                                rotate: [-5, 5, -5]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-3 -right-3"
                        >
                            <div className="bg-blue-500 p-2 rounded-full shadow-lg">
                                <ImagePlus className="w-4 h-4 text-white" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No images yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    Get started by uploading your first image. You can add titles and captions to organize your collection.
                </p>

            </motion.div>

            {/* Decorative dots */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-12 left-12"
                >
                    <div className="w-2 h-2 bg-blue-200 rounded-full" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.7 }}
                    className="absolute bottom-12 right-12"
                >
                    <div className="w-3 h-3 bg-blue-300 rounded-full" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EmptyState;