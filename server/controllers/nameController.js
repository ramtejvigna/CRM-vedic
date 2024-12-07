import { babyNames } from "../models/PDF.js"; // Import your babyNames model
import { read, utils } from 'xlsx';

export const uploadExcelNames = async (req, res) => {
    // Check if an Excel file is uploaded
    if (!req.files || !req.files.excel) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.excel;

    try {
        // Read the Excel file
        const workbook = read(file.data, { type: 'buffer' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const results = utils.sheet_to_json(worksheet);

        // Normalize the data
        const normalizedResults = results.map(row => {
            return Object.fromEntries(
                Object.entries(row).map(([key, value]) => [
                    key.trim(),
                    value
                ])
            );
        });
        
        // Insert into database
        await babyNames.insertMany(normalizedResults);
        res.status(200).json({ message: "Baby names uploaded successfully" });
    } catch (error) {
        console.error("Error processing Excel file:", error);
        res.status(500).json({ error: "Failed to process Excel file" });
    }
};

// Update a baby name entry by ID
export const updateBabyName = async (req, res) => {
    const { id } = req.params; // Get the baby name ID from the request params
    const updatedData = req.body;  // Get the new data for the baby name from the request body

    try {
        // Find and update the baby name entry by ID
        await babyNames.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: "Baby name updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update baby name" });
    }
};