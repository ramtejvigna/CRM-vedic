import React from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, ArrowRight, Plus, Wallet } from 'lucide-react';

const EmptyStateExpenses = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const iconCircleVariants = {
        initial: { scale: 0 },
        animate: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10
            }
        }
    };

    const arrowVariants = {
        initial: { x: -10, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                repeat: Infinity,
                duration: 1,
                repeatType: "reverse"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center h-96 text-center px-6"
        >
            <motion.div
                className="flex gap-6 mb-8"
                variants={itemVariants}
            >
                <motion.div
                    variants={iconCircleVariants}
                    initial="initial"
                    animate="animate"
                    className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
                >
                    <Wallet className="w-6 h-6 text-indigo-600" />
                </motion.div>

                <motion.div
                    variants={arrowVariants}
                    initial="initial"
                    animate="animate"
                >
                    <ArrowRight className="w-6 h-6 text-gray-400 mt-3" />
                </motion.div>

                <motion.div
                    variants={iconCircleVariants}
                    initial="initial"
                    animate="animate"
                    className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"
                >
                    <PiggyBank className="w-6 h-6 text-emerald-600" />
                </motion.div>
            </motion.div>

            <motion.h3
                variants={itemVariants}
                className="text-xl font-semibold text-gray-800 mb-3"
            >
                No Expenses Recorded Yet
            </motion.h3>

            <motion.p
                variants={itemVariants}
                className="text-gray-600 mb-8 max-w-sm"
            >
                Start tracking your expenses to get insights into your spending patterns and make better financial decisions.
            </motion.p>
        </motion.div>
    );
};

export default EmptyStateExpenses;