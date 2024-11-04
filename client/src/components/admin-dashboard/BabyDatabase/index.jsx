import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { Search, Upload, Edit, Save, Filter, Download, Loader2, Plus } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import 'react-toastify/dist/ReactToastify.css';

const AddNameModal = ({ isOpen, onClose, onAdd }) => {
    const [newName, setNewName] = useState({
        bookName: '',
        gender: 'male',
        name: '',
        meaning: '',
        nameInHindi: '',
        meaningInHindi: '',
        shlokNo: '',
        pageNo: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onAdd(newName);
            onClose();
            setNewName({
                bookName: '',
                gender: '',
                name: '',
                meaning: '',
                nameInHindi: '',
                meaningInHindi: '',
                shlokNo: '',
                pageNo: ''
            });
        } catch (error) {
            console.error('Error adding name:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-lg w-full max-w-2xl"
            >
                <h2 className="text-2xl font-bold mb-4">Add New Name</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Book Name</label>
                            <input
                                type="text"
                                value={newName.bookName}
                                onChange={(e) => setNewName({ ...newName, bookName: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                value={newName.gender}
                                onChange={(e) => setNewName({ ...newName, gender: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={newName.name}
                                onChange={(e) => setNewName({ ...newName, name: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meaning</label>
                            <input
                                type="text"
                                value={newName.meaning}
                                onChange={(e) => setNewName({ ...newName, meaning: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name in Hindi</label>
                            <input
                                type="text"
                                value={newName.nameInHindi}
                                onChange={(e) => setNewName({ ...newName, nameInHindi: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meaning in Hindi</label>
                            <input
                                type="text"
                                value={newName.meaningInHindi}
                                onChange={(e) => setNewName({ ...newName, meaningInHindi: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Shlok No.</label>
                            <input
                                type="text"
                                value={newName.shlokNo}
                                onChange={(e) => setNewName({ ...newName, shlokNo: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Page No.</label>
                            <input
                                type="text"
                                value={newName.pageNo}
                                onChange={(e) => setNewName({ ...newName, pageNo: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Name
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


const BabyDatabase = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [startingLetterFilter, setStartingLetterFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [babyNames, setBabyNames] = useState([]);
    const [editingName, setEditingName] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchBabyNames = async () => {
        try {
            const response = await axios.get("https://vedic-backend-neon.vercel.app/api/names");
            setBabyNames(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch baby names", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'fetch-error' // Unique ID to prevent duplicate toasts
            });
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchBabyNames();

        // Cleanup function to dismiss all toasts when component unmounts
        return () => {
            toast.dismiss();
        };
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

    const handleAddName = async (newName) => {
        try {
            await axios.post("https://vedic-backend-neon.vercel.app/api/names", newName);
            await fetchBabyNames();
            toast.success("Name added successfully!", {
                onClose: () => { },
                toastId: 'add-success'
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add name", {
                onClose: () => { },
                toastId: 'add-error'
            });
            throw err;
        }
    };

    const handleStartingLetterFilter = (event) => {
        setStartingLetterFilter(event.target.value);
        setPage(0);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Handle CSV upload
    const handleCsvUpload = async (event) => {
        const file = event.target.files[0];

        // Ensure a file is selected and is of type CSV
        if (!file || file.type !== "text/csv") {
            toast.error("Please upload a valid CSV file.", {
                toastId: 'invalid-file-type'
            });
            return;
        }

        const formData = new FormData();
        formData.append('csv', file);

        try {
            // Send the POST request with the formData
            await axios.post("https://vedic-backend-neon.vercel.app/uploadCsvNames", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Fetch updated data and notify the user
            fetchBabyNames();
            toast.success("File uploaded successfully!", {
                onClose: () => { },
                toastId: 'upload-success'
            });
        } catch (err) {
            console.error("File upload error:", err);
            toast.error("Failed to upload the file", {
                onClose: () => { },
                toastId: 'upload-error'
            });
        }
    };


    // Handle editing
    const startEdit = (baby) => {
        setEditingName(baby);
    };

    const saveEdit = async () => {
        try {
            await axios.put(`https://vedic-backend-neon.vercel.app/updateBabyName/${editingName._id}`, editingName);
            setEditingName(null);
            fetchBabyNames();
            toast.success("Baby name updated successfully!", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'update-success'
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update the baby name", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'update-error'
            });
        }
    };

    const csvData = filteredNames.map(({ _id, _v, ...rest }) => rest);

    return (
        <div className="p-8 min-h-screen">
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={3} // Limit number of toasts shown at once
                enableMultiContainer={false} // Disable multi-container feature
                containerId="main-toast" // Unique container ID
            />
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
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white transition duration-300"
                    >
                        <Plus className="h-5 w-5 inline-block mr-2" />
                        Add Name
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFilters}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white transition duration-300"
                    >
                        <Filter className="h-5 w-5 inline-block mr-2" />
                        Filters
                    </motion.button>
                </div>
                <div className="flex space-x-4">
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" />
                        Upload Baby Names
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className="hidden"
                        />
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CSVLink
                            data={csvData}
                            filename="filtered_baby_names.csv"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center"
                        >
                            <Download className="h-5 w-5 inline-block mr-2" />
                            Export Names
                        </CSVLink>
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-slate-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center"
                    >
                        <a
                            href="/baby_names_records.csv" // Update the path accordingly
                            download="baby_names_template.csv"
                            className="flex items-center"
                        >
                            <Download className="h-5 w-5 inline-block mr-2" />
                            Template
                        </a>
                    </motion.label>

                </div>
            </div>

            <AddNameModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddName}
            />

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
                className="bg-white rounded-lg shadow-xl"
            >
                <table className="min-w-full divide-y min-h-full divide-gray-200">
                    {loading ? (
                        <div className="absolute inset-0 top-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                            <div className="text-center">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Book Name', 'Gender', 'Name', 'Meaning', 'Name in Hindi', 'Meaning in Hindi', 'Shlok No.', 'Page No.', 'Edit'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y text-sm divide-gray-200">
                                {filteredNames
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((baby, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="hover:bg-gray-50"
                                        >
                                            {editingName && editingName._id === baby._id ? (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.bookName}
                                                            onChange={(e) => setEditingName({ ...editingName, bookName: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.gender}
                                                            onChange={(e) => setEditingName({ ...editingName, gender: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.name}
                                                            onChange={(e) => setEditingName({ ...editingName, name: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.meaning}
                                                            onChange={(e) => setEditingName({ ...editingName, meaning: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.nameInHindi}
                                                            onChange={(e) => setEditingName({ ...editingName, nameInHindi: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.meaningInHindi}
                                                            onChange={(e) => setEditingName({ ...editingName, meaningInHindi: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.shlokNo}
                                                            onChange={(e) => setEditingName({ ...editingName, shlokNo: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            value={editingName.pageNo}
                                                            onChange={(e) => setEditingName({ ...editingName, pageNo: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className="px-4 py-2 rounded-lg"
                                                            onClick={saveEdit}
                                                        >
                                                            <Save className="h-5 w-5 text-green-600 inline-block mr-2" />
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.bookName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.gender}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.meaning}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.nameInHindi}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.meaningInHindi}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.shlokNo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{baby.pageNo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className="px-4 py-2 rounded-lg"
                                                            onClick={() => startEdit(baby)}
                                                        >
                                                            <Edit className="h-5 w-5 text-blue-800 inline-block mr-2" />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </motion.tr>
                                    ))}
                            </tbody>
                        </>
                    )}
                </table>

                {filteredNames.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No baby names found matching your criteria.</p>
                    </div>
                )}
            </motion.div>

            {!loading && (
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
            )}
        </div>
    );
};

export default BabyDatabase;