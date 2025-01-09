export const validateImageSize = (req, res, next) => {
    try {
        const { base64 } = req.body;
        
        if (!base64) {
            return next();
        }

        // Calculate size in MB
        const sizeInMb = (base64.length * 0.75) / 1024 / 1024;
        
        // Limit to 5MB
        if (sizeInMb > 5) {
            return res.status(400).json({
                message: 'Image size should not exceed 5MB'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error processing image',
            error: error.message
        });
    }
};