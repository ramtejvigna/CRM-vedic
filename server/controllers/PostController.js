import { Post } from "../models/Post.js"

export const InsertPostData= async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json({ message: 'Post saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving post', error });
    }
};

export const deletePost= async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPostData= async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};