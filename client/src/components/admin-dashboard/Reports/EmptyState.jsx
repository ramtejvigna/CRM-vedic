import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, AlertCircle } from 'lucide-react';

const EmptyState = ({ isFiltered = false }) => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const iconContainerVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: [0, -10, 10, -10, 10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center py-16 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="w-20 h-20 mb-6 relative"
                variants={iconContainerVariants}
                initial="initial"
                animate="animate"
            >
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {isFiltered ? (
                        <Calendar className="w-20 h-20 text-gray-300" />
                    ) : (
                        <FileText className="w-20 h-20 text-gray-300" />
                    )}
                </motion.div>
            </motion.div>

            <motion.h3
                className="text-xl font-semibold text-gray-700 mb-2"
                variants={itemVariants}
            >
                {isFiltered ? "No Results Found" : "No Reports Generated Yet"}
            </motion.h3>

            <motion.p
                className="text-gray-500 text-center max-w-md mb-6"
                variants={itemVariants}
            >
                {isFiltered
                    ? "Try adjusting your date range or clearing the filters to see more results."
                    : "When employees generate PDF reports, their performance statistics will appear here."}
            </motion.p>

            {isFiltered && (
                <motion.div
                    className="flex items-center p-4 bg-blue-50 rounded-lg text-blue-700 max-w-md"
                    variants={itemVariants}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                        Tip: You can click the "Clear Filters" button above to reset the date range.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default EmptyState;