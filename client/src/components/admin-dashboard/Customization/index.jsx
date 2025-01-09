import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlusCircle,
    Trash2,
    Loader2,
    AlertCircle,
    X,
    CircleCheck,
    Edit3,
    Check,
    Signature,
    Asterisk,
    Orbit,
    Atom,
    Biohazard,
    NotebookText,
    Image as ImageIcon,
    Edit,
    Upload,
    PartyPopper
} from "lucide-react";
import EmptyState from "./EmptyState";

const ImageManagement = ({ onError }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({ type: null, id: null });
    const [newImage, setNewImage] = useState({
        title: "",
        caption: "",
        base64: "",
        file: null
    });
    const [editMode, setEditMode] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://vedic-backend-neon.vercel.app/images');
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            setImages(data);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(prev => ({
                    ...prev,
                    base64: reader.result,
                    file: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = async () => {
        if (!newImage.base64 || !newImage.caption) return;

        try {
            setActionLoading({ type: 'add', id: null });
            const response = await fetch('https://vedic-backend-neon.vercel.app/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newImage.title,
                    caption: newImage.caption,
                    base64: newImage.base64
                }),
            });

            if (!response.ok) throw new Error('Failed to add image');

            const addedImage = await response.json();
            setImages(prev => [...prev, addedImage]);
            setNewImage({ title: "", caption: "", base64: "", file: null });
        } catch (err) {
            onError(err.message);
        } finally {
            setActionLoading({ type: null, id: null });
        }
    };

    const handleUpdateImage = async (id) => {
        const imageToUpdate = images.find(img => img.id === id);
        if (!imageToUpdate) return;

        try {
            setActionLoading({ type: 'update', id });
            const response = await fetch(`https://vedic-backend-neon.vercel.app/images/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: imageToUpdate.title,
                    caption: imageToUpdate.caption,
                    base64: imageToUpdate.base64
                }),
            });

            if (!response.ok) throw new Error('Failed to update image');

            const updatedImage = await response.json();
            setImages(prev => prev.map(img =>
                img.id === id ? updatedImage : img
            ));
            setEditMode(null);
        } catch (err) {
            onError(err.message);
        } finally {
            setActionLoading({ type: null, id: null });
        }
    };

    const handleDeleteImage = async (id) => {
        try {
            setActionLoading({ type: 'delete', id });
            const response = await fetch(`https://vedic-backend-neon.vercel.app/images/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete image');

            setImages(prev => prev.filter(img => img.id !== id));
            fetchImages();
        } catch (err) {
            onError(err.message);
        } finally {
            setActionLoading({ type: null, id: null });
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <ImageIcon className="h-6 w-6 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800">Image Management</h2>
                    </div>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                        <Upload className="h-5 w-5" />
                        <span>Upload New Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </motion.label>
                </div>
            </div>

            {images.length === 0 && (
                <EmptyState onUploadClick={() => document.querySelector('input[type="file"]').click()} />
            )}

            {/* New Image Preview */}
            <AnimatePresence>
                {newImage.base64 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 border-b border-gray-100 bg-gray-50"
                    >
                        <div className="flex space-x-6">
                            <motion.img
                                src={newImage.base64}
                                alt="Preview"
                                className="w-48 h-48 rounded-lg object-cover"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                            />
                            <div className="flex-1 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Image Title"
                                    value={newImage.title}
                                    onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                                <textarea
                                    placeholder="Image Caption"
                                    value={newImage.caption}
                                    onChange={(e) => setNewImage(prev => ({ ...prev, caption: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    rows={3}
                                />
                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddImage}
                                        disabled={!newImage.title || !newImage.caption}
                                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading.type === 'add' ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="h-5 w-5" />
                                                <span>Save Image</span>
                                            </>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setNewImage({ title: "", caption: "", base64: "", file: null })}
                                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {images.map((image, index) => (
                            <motion.div
                                key={image._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="relative aspect-square">
                                        <img
                                            src={image.base64}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setEditMode(image._id)}
                                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <Edit3 className="h-4 w-4 text-blue-500" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteImage(image._id)}
                                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    {actionLoading.type === 'delete' && actionLoading.id === image._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800">{image.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{image.caption}</p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {editMode === image._id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute inset-0 bg-white rounded-xl shadow-lg p-4"
                                        >
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={image.title}
                                                    onChange={(e) => setImages(prev =>
                                                        prev.map(img =>
                                                            img.id === image._id
                                                                ? { ...img, title: e.target.value }
                                                                : img
                                                        )
                                                    )}
                                                    className="w-full px-3 py-2 rounded border border-gray-200"
                                                    placeholder="Title"
                                                />
                                                <textarea
                                                    value={image.caption}
                                                    onChange={(e) => setImages(prev =>
                                                        prev.map(img =>
                                                            img.id === image._id
                                                                ? { ...img, caption: e.target.value }
                                                                : img
                                                        )
                                                    )}
                                                    className="w-full px-3 py-2 rounded border border-gray-200"
                                                    placeholder="Caption"
                                                    rows={3}
                                                />
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleUpdateImage(image._id)}
                                                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg"
                                                    >
                                                        {actionLoading.type === 'update' && actionLoading.id === image._id ? (
                                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                                        ) : (
                                                            <span>Save</span>
                                                        )}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setEditMode(null)}
                                                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg"
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

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
                                    <div className="h-60 overflow-y-auto pr-2">
                                        <AnimatePresence>
                                            {categories[category].map((item, index) => (
                                                <motion.div
                                                    key={item}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
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
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <ImageManagement onError={setError} />
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