import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Download, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EmployeePerformanceTable = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [error, setError] = useState(null);

    // Updated columns to focus on PDF generation and role
    const columns = [
        { header: 'Employee Name', key: 'employeeName' },
        { header: 'Role', key: 'role' },
        { header: 'PDFs Generated', key: 'count' }
    ];

    useEffect(() => {
        fetchEmployeeData();
    }, [fromDate, toDate]);

    const fetchEmployeeData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const queryParams = new URLSearchParams();

            if (fromDate) {
                queryParams.append('fromDate', fromDate.toISOString());
            }
            if (toDate) {
                queryParams.append('toDate', toDate.toISOString());
            }

            const response = await fetch(
                `http://localhost:8000/api/reports/api/pdfs/generated-by-employee?${queryParams}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch employee data');
            }

            const data = await response.json();

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setEmployeeData(data);
            } else if (data && typeof data === 'object') {
                // If data is an object, convert it to array
                setEmployeeData(Object.values(data));
            } else {
                // If neither array nor object, set empty array
                setEmployeeData([]);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setError('Failed to load employee data');
            setEmployeeData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!Array.isArray(employeeData) || employeeData.length === 0) {
            return;
        }

        const headers = columns.map(col => col.header);
        const csvContent = [
            headers.join(','),
            ...employeeData.map(employee => [
                employee.employeeName || '',
                employee.role || '',
                employee.count || 0,
                employee.email || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pdf-generation-stats-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleSort = (key) => {
        if (!Array.isArray(employeeData)) {
            return;
        }

        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...employeeData].sort((a, b) => {
            const aValue = a[key] || '';
            const bValue = b[key] || '';

            if (direction === 'ascending') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
        setEmployeeData(sortedData);
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                            <motion.div
                                className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-red-500">
                        {error}
                    </td>
                </tr>
            );
        }

        if (!Array.isArray(employeeData) || employeeData.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No data available
                    </td>
                </tr>
            );
        }

        return employeeData.map((employee, index) => (
            <motion.tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <td className="px-6 py-4 font-medium text-gray-800">
                    {employee.employeeName || 'N/A'}
                </td>
                <td className="px-6 py-4 capitalize">
                    {employee.role || 'N/A'}
                </td>
                <td className="px-6 py-4">
                    {employee.count || 0}
                </td>
            </motion.tr>
        ));
    };

    return (
        <motion.div
            className="w-full bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <motion.h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                    PDF Generation Summary
                </motion.h2>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-4">
                        <div className="relative">
                            <motion.button
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowFromCalendar(!showFromCalendar)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CalendarIcon className="w-4 h-4 text-gray-600" />
                                <span>{fromDate ? format(fromDate, 'PPP') : 'From Date'}</span>
                            </motion.button>

                            <AnimatePresence>
                                {showFromCalendar && (
                                    <motion.div
                                        className="absolute top-12 left-0 z-50"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Calendar
                                            onChange={(date) => {
                                                setFromDate(date);
                                                setShowFromCalendar(false);
                                            }}
                                            value={fromDate}
                                            className="border border-gray-200 rounded-lg shadow-xl"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative">
                            <motion.button
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowToCalendar(!showToCalendar)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CalendarIcon className="w-4 h-4 text-gray-600" />
                                <span>{toDate ? format(toDate, 'PPP') : 'To Date'}</span>
                            </motion.button>

                            <AnimatePresence>
                                {showToCalendar && (
                                    <motion.div
                                        className="absolute top-12 left-0 z-50"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Calendar
                                            onChange={(date) => {
                                                setToDate(date);
                                                setShowToCalendar(false);
                                            }}
                                            value={toDate}
                                            className="border border-gray-200 rounded-lg shadow-xl"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        onClick={exportToCSV}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!Array.isArray(employeeData) || employeeData.length === 0}
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </motion.button>
                    {(fromDate || toDate) && (
                        <motion.button
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
                            onClick={() => {
                                setFromDate(null);
                                setToDate(null);
                                setShowToCalendar(false);
                                setShowFromCalendar(false);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Clear Filters
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <motion.th
                                    key={column.header}
                                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        <motion.div
                                            animate={{
                                                rotate: sortConfig.key === column.key ?
                                                    sortConfig.direction === 'ascending' ? 0 : 180 : 0
                                            }}
                                        >
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </motion.div>
                                    </div>
                                </motion.th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {renderTableContent()}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default EmployeePerformanceTable;