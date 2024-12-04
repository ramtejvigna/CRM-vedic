import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, employeeId }) => {

    console.log(employeeId);

    const handleClick = async () => {
        await onConfirm(employeeId);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
                            >
                                <AlertTriangle className="h-8 w-8 text-green-600" />
                            </motion.div>

                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Baby Names Access</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to grant baby names access?
                            </p>

                            <div className="flex justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClick}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Access
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;