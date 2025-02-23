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

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Check if post exists
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Validate required fields
        const requiredFields = [
            'uniqueId',
            'socialMediaPlatform',
            'headline',
            'caption',
            'dateOfPost',
            'time',
            'employeeAuthor',
            'view12Hour',
            'view24Hour',
            'view48Hour',
            'link'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                uniqueId: req.body.uniqueId,
                socialMediaPlatform: req.body.socialMediaPlatform,
                headline: req.body.headline,
                caption: req.body.caption,
                dateOfPost: req.body.dateOfPost,
                time: req.body.time,
                indexStatus: req.body.indexStatus,
                employeeAuthor: req.body.employeeAuthor,
                view12Hour: req.body.view12Hour,
                view24Hour: req.body.view24Hour,
                view48Hour: req.body.view48Hour,
                link: req.body.link
            },
            {
                new: true, // Return the updated document
                runValidators: true // Run model validators
            }
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost
        });

    } catch (error) {
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Post ID format'
            });
        }

        // Handle any other errors
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
