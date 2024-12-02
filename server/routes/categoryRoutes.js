import express from 'express';
import { 
    Gender, 
    Zodiac, 
    Rashi, 
    Nakshatra, 
    Planet, 
    Element, 
    BookName, 
    Festival 
} from '../models/Names.js';

const router = express.Router();

// Map of model names to their mongoose models
const modelMap = {
    gender: Gender,
    zodiac: Zodiac,
    rashi: Rashi,
    nakshatra: Nakshatra,
    planet: Planet,
    element: Element,
    bookName: BookName,
    festival: Festival
};

// Helper function to format category data
const formatCategoryData = (data) => {
    return data.map(item => item.value);
};

// Get all categories data
router.get('/', async (req, res) => {
    try {
        const categoryData = {};
        
        // Fetch data from all models concurrently
        const results = await Promise.all(
            Object.entries(modelMap).map(async ([key, model]) => {
                const data = await model.find().sort({ createdAt: -1 });
                return [key, formatCategoryData(data)];
            })
        );
        
        // Format response
        results.forEach(([key, data]) => {
            categoryData[key] = data;
        });

        res.json(categoryData);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Add new entry to a category
router.post('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({ error: 'Value is required' });
        }

        const Model = modelMap[category.toLowerCase()];
        if (!Model) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check for duplicate
        const existing = await Model.findOne({ 
            value: { $regex: new RegExp(`^${value}$`, 'i') } 
        });
        if (existing) {
            return res.status(400).json({ error: 'Value already exists' });
        }

        // Create new entry
        await Model.create({ value });

        // Return updated list
        const updatedData = await Model.find().sort({ createdAt: -1 });
        res.json(formatCategoryData(updatedData));
    } catch (error) {
        console.error('Error adding entry:', error);
        res.status(500).json({ error: 'Failed to add entry' });
    }
});

// Delete entry from a category
router.delete('/:category/:value', async (req, res) => {
    try {
        const { category, value } = req.params;

        const Model = modelMap[category.toLowerCase()];
        if (!Model) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete entry
        const result = await Model.findOneAndDelete({ 
            value: { $regex: new RegExp(`^${value}$`, 'i') } 
        });

        if (!result) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Return updated list
        const updatedData = await Model.find().sort({ createdAt: -1 });
        res.json(formatCategoryData(updatedData));
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});

export default router;