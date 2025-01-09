import { Image } from "../models/Form.js";

const isValidBase64 = (str) => {
    try {
        // Check if it's a valid base64 image string
        if (!str.startsWith('data:image/')) return false;
        
        // Extract the actual base64 content
        const base64Content = str.split(',')[1];
        if (!base64Content) return false;
        
        // Check if it's a valid base64 string
        return Buffer.from(base64Content, 'base64').toString('base64') === base64Content;
    } catch (error) {
        return false;
    }
};

// Get all images
export const getAllImages = async (req, res) => {
    try {
        const images = await Image.find()
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching images', 
            error: error.message 
        });
    }
};

// Create new image
export const createImage = async (req, res) => {
    try {
        const { title, caption, base64 } = req.body;

        // Validate required fields
        if (!caption || !base64) {
            return res.status(400).json({ 
                message: 'Caption and image are required' 
            });
        }

        // Validate base64 image
        if (!isValidBase64(base64)) {
            return res.status(400).json({ 
                message: 'Invalid image format' 
            });
        }

        // Create new image
        const newImage = new Image({
            title,
            caption,
            base64
        });

        await newImage.save();

        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating image', 
            error: error.message 
        });
    }
};

// Update image
export const updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, caption, base64 } = req.body;

        // Validate fields
        if (!caption && !base64) {
            return res.status(400).json({ 
                message: 'Nothing to update' 
            });
        }

        // Validate base64 if provided
        if (base64 && !isValidBase64(base64)) {
            return res.status(400).json({ 
                message: 'Invalid image format' 
            });
        }

        // Find and update image
        const updatedImage = await Image.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),  
                ...(caption && { caption }),
                ...(base64 && { base64 })
            },
            { new: true, runValidators: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ 
                message: 'Image not found' 
            });
        }

        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating image', 
            error: error.message 
        });
    }
};

// Delete image
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedImage = await Image.findByIdAndDelete(id);

        if (!deletedImage) {
            return res.status(404).json({ 
                message: 'Image not found' 
            });
        }

        res.status(200).json({ 
            message: 'Image deleted successfully', 
            id: deletedImage._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting image', 
            error: error.message 
        });
    }
};
