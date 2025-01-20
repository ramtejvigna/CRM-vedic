import React, { useState,useEffect } from 'react';
import axios from 'axios';

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

    // Fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await axios.get("https://vedic-backend-neon.vercel.app/api/posts");
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
            const response = await axios.post('https://vedic-backend-neon.vercel.app/api/posts', formData);
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit the form. Please try again.');
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen">
    <h1 className="text-2xl font-semibold mb-4">Post Form</h1>

    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">Unique Id</label>
                <input type="text" id="uniqueId" name="uniqueId" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter unique ID0" value={formData.uniqueId}  onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="socialMediaPlatform" className="block text-sm font-medium text-gray-700">Social Media Platform</label>
                <input type="text" id="socialMediaPlatform" name="socialMediaPlatform" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter social media platform" value={formData.socialMediaPlatform}  onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline</label>
                <input type="text" id="headline" name="headline" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter headline" value={formData.headline}  onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                <textarea id="caption" name="caption" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter caption" rows="3" value={formData.caption}  onChange={handleChange} ></textarea>
            </div>

            <div>
                <label htmlFor="dateOfPost" className="block text-sm font-medium text-gray-700">Date of Post</label>
                <input type="date" id="dateOfPost" name="dateOfPost" className="mt-1 block w-full p-2 border rounded-md"  value={formData.dateOfPost}  onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input type="time" id="time" name="time" className="mt-1 block w-full p-2 border rounded-md" value={formData.time} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="indexStatus" className="block text-sm font-medium text-gray-700">Index Status</label>
                <input type="text" id="indexStatus" name="indexStatus" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter index status" value={formData.indexStatus}  onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="employeeAuthor" className="block text-sm font-medium text-gray-700">Employee/Author</label>
                <input type="text" id="employeeAuthor" name="employeeAuthor" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter employee/author name" value={formData.employeeAuthor}  onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="view12Hour" className="block text-sm font-medium text-gray-700">12 Hour View</label>
                <input type="number" id="view12Hour" name="view12Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 12-hour views"  value={formData.view12Hour}  onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="view24Hour" className="block text-sm font-medium text-gray-700">24 Hour View</label>
                <input type="number" id="view24Hour" name="view24Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 24-hour views"  value={formData.view24Hour} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="view48Hour" className="block text-sm font-medium text-gray-700">48 Hour View</label>
                <input type="number" id="view48Hour" name="view48Hour" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter 48-hour views" value={formData.view48Hour} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                <input type="url" id="link" name="link" className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter link"   value={formData.link}  onChange={handleChange}/>
            </div>
        </div>

        <div className="text-right">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
        </div>
    </form>

         {/* Posts Table */}
         <h2 className="text-xl font-semibold mt-8 mb-4">Posts Table</h2>
            <div className="overflow-x-auto p-4">
                <div className="bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y min-h-full divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Unique ID",
                                    "Platform",
                                    "Headline",
                                    "Date",
                                    "Time",
                                    "Author",
                                    "Views (12h)",
                                    "Views (24h)",
                                    "Views (48h)",
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
                            {posts.map((post, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{post.uniqueId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.socialMediaPlatform}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.headline}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {post.dateOfPost ? new Date(post.dateOfPost).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.time || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.employeeAuthor || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view12Hour || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view24Hour || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{post.view48Hour || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {posts.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-500">No posts found.</div>
                    )}
                </div>
            </div>

</div>

    );
}

export default PostForm;
