import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from "axios"
import { Search, Upload, User, Users, Filter } from 'lucide-react';

const BabyDatabase = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [startingLetterFilter, setStartingLetterFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [babyNames, setBabyNames] = useState([]);

    const fetchBabyNames = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/names");
            setBabyNames(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchBabyNames();
    }, []);

    const filteredNames = babyNames.filter(
        (baby) =>
            (baby.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                baby.nameInHindi.includes(searchTerm)) &&
            (genderFilter === 'all' || baby.gender.toLowerCase() === genderFilter) &&
            (startingLetterFilter === '' || baby.name.toLowerCase().startsWith(startingLetterFilter.toLowerCase()))
    );

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleGenderFilter = (gender) => {
        setGenderFilter(gender);
        setPage(0);
    };

    const handleStartingLetterFilter = (event) => {
        setStartingLetterFilter(event.target.value);
        setPage(0);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="p-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-20">Baby Names Database</h1>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search Names"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFilters}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition duration-300"
                    >
                        <Filter className="h-5 w-5 inline-block mr-2" />
                        Filters
                    </motion.button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                    <Upload className="h-5 w-5 inline-block mr-2" />
                    Upload BabyNames
                </motion.button>
            </div>

            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 rounded-lg"
                >
                    <div className="flex flex-wrap items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="gender" className="text-gray-700">Gender:</label>
                            <select
                                id="gender"
                                value={genderFilter}
                                onChange={(e) => handleGenderFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            >
                                <option value="all">All</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="startingLetter" className="text-gray-700">Starting Letter:</label>
                            <input
                                id="startingLetter"
                                type="text"
                                value={startingLetterFilter}
                                onChange={handleStartingLetterFilter}
                                maxLength={1}
                                className="w-12 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Book Name', 'Gender', 'Name', 'Meaning', 'Name in Hindi', 'Meaning in Hindi', 'Shlok No.', 'Page No.'].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredNames
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((baby, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.bookName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.meaning}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.nameInHindi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.meaningInHindi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.shlokNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{baby.pageNo}</td>
                                </motion.tr>
                            ))}
                    </tbody>
                </table>
            </motion.div>

            <div className="mt-4 flex justify-between items-center rounded-lg px-4 py-3">
                <div className="flex items-center">
                    <span className="mr-2">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="border border-gray-300 rounded-2xl pl-2 pr-5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    >
                        {[5, 10, 25].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
                    >
                        Previous
                    </button>
                    <span>{`Page ${page + 1} of ${Math.ceil(filteredNames.length / rowsPerPage)}`}</span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(filteredNames.length / rowsPerPage) - 1}
                        className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BabyDatabase;