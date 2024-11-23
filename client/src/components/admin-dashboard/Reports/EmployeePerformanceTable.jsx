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

    // Define column configuration
    const columns = [
        { header: 'Employee Name', key: 'employeeName' },
        { header: 'PDFs Generated', key: 'pdfsGenerated' },
        { header: 'Expenses', key: 'expenses' },
        { header: 'Revenue Generated', key: 'revenue' },
        { header: 'Net Profit', key: 'netProfit', calculated: true }
    ];

    useEffect(() => {
        fetchEmployeeData();
    }, [fromDate, toDate]);

    const fetchEmployeeData = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();

            if (fromDate) {
                queryParams.append('fromDate', fromDate.toISOString());
            }
            if (toDate) {
                queryParams.append('toDate', toDate.toISOString());
            }

            const [pdfsRes, expensesRes, revenueRes] = await Promise.all([
                fetch(`http://localhost:8000/api/reports/api/pdfs/generated-by-employee?${queryParams}`),
                fetch(`http://localhost:8000/api/reports/api/expenses/by-employee?${queryParams}`),
                fetch(`http://localhost:8000/api/reports/api/revenue/by-employee?${queryParams}`)
            ]);

            const [pdfsData, expensesData, revenueData] = await Promise.all([
                pdfsRes.json(),
                expensesRes.json(),
                revenueRes.json()
            ]);

            const combinedData = pdfsData.map(employee => ({
                employeeName: employee.employeeName,
                pdfsGenerated: employee.count,
                expenses: expensesData.find(e => e.employeeName === employee.employeeName)?.totalAmount || 0,
                revenue: revenueData.find(e => e.employeeName === employee.employeeName)?.totalRevenue || 0
            }));

            setEmployeeData(combinedData);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = columns.map(col => col.header);
        const csvContent = [
            headers.join(','),
            ...employeeData.map(employee => [
                employee.employeeName,
                employee.pdfsGenerated,
                employee.expenses,
                employee.revenue,
                employee.revenue - employee.expenses
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employee-performance-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...employeeData].sort((a, b) => {
            let aValue = key === 'netProfit' ? a.revenue - a.expenses : a[key];
            let bValue = key === 'netProfit' ? b.revenue - b.expenses : b[key];
            
            if (direction === 'ascending') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
        setEmployeeData(sortedData);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="w-full bg-white rounded-lg shadow-lg p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-4 md:mb-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Employee Performance Summary
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
                                        transition={{ duration: 0.2 }}
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
                                        transition={{ duration: 0.2 }}
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
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </motion.button>
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
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
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
                            {isLoading ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="5" className="px-6 py-8 text-center">
                                        <div className="flex justify-center items-center">
                                            <motion.div
                                                className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : employeeData.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No data available
                                    </td>
                                </motion.tr>
                            ) : (
                                employeeData.map((employee, index) => (
                                    <motion.tr
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        variants={tableRowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800">{employee.firstName}</td>
                                        <td className="px-6 py-4">{employee.pdfsGenerated}</td>
                                        <td className="px-6 py-4">₹{employee.expenses.toLocaleString()}</td>
                                        <td className="px-6 py-4">₹{employee.revenue.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`${employee.revenue - employee.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ₹{(employee.revenue - employee.expenses).toLocaleString()}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default EmployeePerformanceTable;