import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BabyNamesStatus = ({ isRequested, handleClick, employeeId }) => {


    return (
        <div className="flex items-center gap-2">
            {isRequested ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick(employeeId)}
                    className="transition-colors duration-300 disabled:opacity-50"
                >
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-xl hover:bg-green-200">
                        <CheckCircle size={18} className="mr-2" />
                        <span className="text-xs font-semibold">
                            Requested
                        </span>
                    </div>
                </motion.button>
            ) : (
                <div className="flex items-center bg-red-100 text-red-800 px-3 py-1.5 rounded-xl">
                    <XCircle size={18} className="mr-2" />
                    <span className="text-xs font-semibold">Not Requested</span>
                </div>
            )}
        </div>
    );
};

export default BabyNamesStatus;