import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Eye, Link as LinkIcon,X,Search,Filter, Trash} from "lucide-react"; // Import Lucide icons
import { motion } from 'framer-motion';
import { api } from '../../../utils/constants';


function PostForm() {
    const [formData, setFormData] = useState({
        uniqueId: '',
        socialMediaPlatform: '',
        headline: '',
        caption: '',
        dateOfPost: '',
        time: '',
        indexStatus: '',
        employeeAuthor: '',
        view12Hour: '',
        view24Hour: '',
        view48Hour: '',
        link: '',
    });

    const [posts, setPosts] = useState([]); // State for posts
    const [loading, setLoading] = useState(true); // Loading state
    const [modalCaption, setModalCaption] = useState(null); // For modal caption
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
    const [filters, setFilters] = useState({
        platform: '',
        date: '',
        author: '',
        uniqueId: '',
    });

    // Toggle filter visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Handle rows per page change
const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
};

// Handle page change
const handleChangePage = (newPage) => {
    setPage(newPage);
};

    
    

    // Fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${api}/api/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/api/posts`, formData);
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit the form. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${api}/api/posts/${id}`);
            alert('Post deleted successfully');
            fetchPosts(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const filteredPosts = posts.filter((post) => {
        // Global search logic
        const matchesGlobalSearch = Object.values(post)
            .some((value) => value && value.toString().toLowerCase().includes(searchQuery));
    
        // Individual filters logic
        const matchesPlatform = !filters.platform || post.socialMediaPlatform.toLowerCase().includes(filters.platform.toLowerCase());
        const matchesDate = !filters.date || post.dateOfPost.slice(0, 10) === filters.date; // Comparing the date string format YYYY-MM-DD
        const matchesAuthor = !filters.author || post.employeeAuthor.toLowerCase().includes(filters.author.toLowerCase());
        const matchesUniqueId = !filters.uniqueId || post.uniqueId.toLowerCase().includes(filters.uniqueId.toLowerCase());
    
        return matchesGlobalSearch && matchesPlatform && matchesDate && matchesAuthor && matchesUniqueId;
    });
    
    // Pagination logic: slice the filtered posts array to show only the current page's data
const displayedPosts = filteredPosts.slice(page * rowsPerPage, (page + 1) * rowsPerPage) || [];

    const openModal = (caption) => {
        setModalCaption(caption);
        setShowModal(true);
    };

    const closeModal = () => {
        setModalCaption(null);
        setShowModal(false);
    };

    return (
        <div className="p-4 md:p-8 min-h-screen">
    <h1 className="text-2xl font-semibold mb-4">Post Form</h1>

    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">Unique Id</label>
                <input type="text" id="uniqueId" name="uniqueId" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter unique ID0" value={formData.uniqueId}  onChange={handleChange}  required/>
            </div>

            <div>
                <label htmlFor="socialMediaPlatform" className="block text-sm font-medium text-gray-700">Social Media Platform</label>
                <input type="text" id="socialMediaPlatform" name="socialMediaPlatform" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter social media platform" value={formData.socialMediaPlatform}  onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline</label>
                <input type="text" id="headline" name="headline" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter headline" value={formData.headline}  onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                <textarea id="caption" name="caption" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter caption" rows="3" value={formData.caption}  onChange={handleChange} required></textarea>
            </div>

            <div>
                <label htmlFor="dateOfPost" className="block text-sm font-medium text-gray-700">Date of Post</label>
                <input type="date" id="dateOfPost" name="dateOfPost" className="mt-1 block w-full p-2 border rounded-md"  value={formData.dateOfPost}  onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input type="time" id="time" name="time" className="mt-1 block w-full p-2 border rounded-md" value={formData.time} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="indexStatus" className="block text-sm font-medium text-gray-700">Index Status</label>
                <input type="text" id="indexStatus" name="indexStatus" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter index status" value={formData.indexStatus}  onChange={handleChange} required />
            </div>

            <div>
                <label htmlFor="employeeAuthor" className="block text-sm font-medium text-gray-700">Employee/Author</label>
                <input type="text" id="employeeAuthor" name="employeeAuthor" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter employee/author name" value={formData.employeeAuthor}  onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="view12Hour" className="block text-sm font-medium text-gray-700">12 Hour View</label>
                <input type="number" id="view12Hour" name="view12Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 12-hour views"  value={formData.view12Hour}  onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="view24Hour" className="block text-sm font-medium text-gray-700">24 Hour View</label>
                <input type="number" id="view24Hour" name="view24Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 24-hour views"  value={formData.view24Hour} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="view48Hour" className="block text-sm font-medium text-gray-700">48 Hour View</label>
                <input type="number" id="view48Hour" name="view48Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 48-hour views" value={formData.view48Hour} onChange={handleChange} required/>
            </div>

            <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                <input type="url" id="link" name="link" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter link"   value={formData.link}  onChange={handleChange} required/>
            </div>
        </div>

        <div className="text-right">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
        </div>
    </form>

         {/* Posts Table */}
         <h2 className="text-xl font-semibold mt-8 mb-4">Posts Table</h2>
         <div className="flex items-center space-x-4"> {/* Flex container for search input and button */}
    <div className="relative flex-1 min-w-0 w-30"> {/* Adjusted width here */}
        <input
            type="text"
            placeholder="Search Names"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>

    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFilters}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white transition duration-300 flex items-center justify-center"
    >
        <Filter className="h-5 w-5 mr-2" />
        <span>Filters</span>
    </motion.button>
</div>


        <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden bg-gray-100 rounded-lg shadow-lg mt-4 p-4"
>
    {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                    Platform
                </label>
                <input
                    type="text"
                    id="platform"
                    placeholder="Enter platform"
                    value={filters.platform}
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-md"
                />

            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-md"
                />

            </div>
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author
                </label>
                <input
                    type="text"
                    id="author"
                    placeholder="Search by author"
                    value={filters.author}
                    onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-md"
                />

            </div>
            <div>
                <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">
                    Unique ID
                </label>
                <input
                    type="text"
                    id="uniqueId"
                    placeholder="Search by unique ID"
                    value={filters.uniqueId}
                    onChange={(e) => setFilters({ ...filters, uniqueId: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded-md"
                />
            </div>
        </div>
    )}
</motion.div>

         

         <div className="overflow-x-auto p-4">
                <div className="bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y min-h-full divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Unique ID",
                                    "Platform",
                                    "Headline",
                                    "Caption",
                                    "Date",
                                    "Time",
                                    "Author",
                                    "Views (12h)",
                                    "Views (24h)",
                                    "Views (48h)",
                                    "Link",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y text-sm divide-gray-200">
                            {displayedPosts.map((post, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{post.uniqueId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.socialMediaPlatform}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.headline}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => openModal(post.caption)}
                                            className="text-blue-500 hover:underline"
                                        >
                                        <Eye className="inline-block w-5 h-5" />
                                         </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {post.dateOfPost
                                            ? new Date(post.dateOfPost).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.time || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.employeeAuthor || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view12Hour || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view24Hour || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view48Hour || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href={post.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            <LinkIcon className="inline-block w-5 h-5" />
                                            </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(post._id)}  // Call handleDelete on click
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash className="inline-block w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPosts.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-500">No posts found.</div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-lg px-4 py-3">
            <div className="flex items-center">
                <span className="mr-2 text-sm">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="border border-gray-300 rounded-lg pl-2 pr-5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                >
                    {[5, 10, 25].map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                    className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300 text-sm"
                >
                    Previous
                </button>
                <span className="text-sm">{`Page ${page + 1} of ${Math.ceil(filteredPosts.length / rowsPerPage)}`}</span>
                <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= Math.ceil(filteredPosts.length / rowsPerPage) - 1}
                    className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300 text-sm"
                >
                    Next
                </button>
            </div>
        </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Caption</h3>
                        <p className="text-sm text-gray-700">{modalCaption || "No caption available."}</p>
                    </div>
                </div>
            )}
</div>

    );
}

export default PostForm;