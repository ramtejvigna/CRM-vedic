import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlusCircle,
    Trash2,
    Loader2,
    AlertCircle,
    X,
    CircleCheck,
    Signature,
    Asterisk,
    Orbit,
    Atom,
    Biohazard,
    NotebookText,
    PartyPopper
} from "lucide-react";


const Customization = () => {
    const [categories, setCategories] = useState({});
    const [newEntries, setNewEntries] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({ type: null, category: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://vedic-backend-neon.vercel.app/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = async (category) => {
        if (!newEntries[category]?.trim()) return;

        try {
            setActionLoading({ type: 'add', category });
            const response = await fetch(`https://vedic-backend-neon.vercel.app/categories/${category}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: newEntries[category] }),
            });

            if (!response.ok) throw new Error('Failed to add entry');

            const updatedCategory = await response.json();
            setCategories(prev => ({
                ...prev,
                [category]: updatedCategory,
            }));

            setNewEntries(prev => ({ ...prev, [category]: "" }));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading({ type: null, category: null });
        }
    };

    const handleDeleteEntry = async (category, index) => {
        try {
            setActionLoading({ type: 'delete', category, index });
            const itemToDelete = categories[category][index];

            const response = await fetch(`https://vedic-backend-neon.vercel.app/categories/${category}/${itemToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete entry');

            const updatedCategory = await response.json();
            setCategories(prev => ({
                ...prev,
                [category]: updatedCategory,
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading({ type: null, category: null });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-8 w-8 text-blue-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 max-w-6xl mx-auto">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(categories).map((category) => {

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-6 w-6" category={category} />
                                    <h2 className="text-xl font-semibold capitalize text-gray-800">{category}</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Add new ${category.toLowerCase()}`}
                                        value={newEntries[category] || ""}
                                        onChange={(e) =>
                                            setNewEntries(prev => ({
                                                ...prev,
                                                [category]: e.target.value
                                            }))
                                        }
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                                        disabled={actionLoading.type === 'add' && actionLoading.category === category}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddEntry(category)}
                                        disabled={actionLoading.type === 'add' && actionLoading.category === category}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading.type === 'add' && actionLoading.category === category ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <PlusCircle className="h-5 w-5" />
                                        )}
                                        <span>Add</span>
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <AnimatePresence>
                                        {categories[category].map((item, index) => (
                                            <motion.div
                                                key={item}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-gray-700">{item}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteEntry(category, index)}
                                                    disabled={
                                                        actionLoading.type === 'delete' &&
                                                        actionLoading.category === category &&
                                                        actionLoading.index === index
                                                    }
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    {actionLoading.type === 'delete' &&
                                                        actionLoading.category === category &&
                                                        actionLoading.index === index ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-5 w-5 text-red-500 transition-opacity" />
                                                    )}
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const Icon = ({ category }) => {
    switch (category) {
        case 'gender':
            return <CircleCheck className="text-blue-500" />
        case 'zodiac':
            return <Signature className="text-blue-500" />
        case 'rashi':
            return <Biohazard className="text-blue-500" />
        case 'nakshatra':
            return <Asterisk className="text-blue-500" />
        case 'planet':
            return <Orbit className="text-blue-500" />
        case 'element':
            return <Atom className="text-blue-500" />
        case 'bookName':
            return <NotebookText className="text-blue-500" />
        case 'festival':
            return <PartyPopper className="text-blue-500" />
        default:
            break;
    }
}

export default Customization;