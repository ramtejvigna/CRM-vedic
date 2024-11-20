import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { babyNames } from "../models/PDF.js"; // Import your babyNames model

export const uploadCsvNames = async (req, res) => {
    // Check if a CSV file is uploaded
    if (!req.files || !req.files.csv) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.csv; // Access the uploaded file
    const results = [];

    // Convert the file buffer to a readable stream
    const readableFile = new Readable();
    readableFile.push(file.data);
    readableFile.push(null); // End the stream

    // Parse the CSV file
    readableFile
        .pipe(csvParser({ separator: '\t', encoding: 'utf-8' })) // Specify tab delimiter
        .on('data', (row) => {
            // Normalize keys to handle stray characters
            const normalizedRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => [
                    key.trim(), // Trim leading/trailing spaces
                    value
                ])
            );
            results.push(normalizedRow);
        })
        .on('end', async () => {
            try {
                console.log("Parsed Rows:", results);
                await babyNames.insertMany(results);
                res.status(200).json({ message: "Baby names uploaded successfully" });
            } catch (error) {
                console.error("Database Insertion Error:", error);
                res.status(500).json({ error: "Failed to upload baby names" });
            }
        })
        .on('error', (error) => {
            console.error("CSV File Parsing Error:", error);
            res.status(500).json({ error: "Error processing the CSV file" });
        });
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