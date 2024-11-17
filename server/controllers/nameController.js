import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { babyNames } from "../models/PDF.js"; // Import your babyNames model

export const uploadCsvNames = async (req, res) => {
    // Check if a CSV file is uploaded
    if (!req.files || !req.files.csv) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.csv; // Access the uploaded file
    const results = []; // To store parsed CSV data

    try {
        // Convert the file buffer to a readable stream
        const readableFile = new Readable();
        readableFile.push(file.data);  // Push the buffer into the stream
        readableFile.push(null);  // End the stream

        console.log(readableFile)
        // Parse the CSV data using csv-parser
        readableFile
            .pipe(csvParser())  // Parse the readable stream with csv-parser
            .on('data', (row) => {
                const validRow = {
                    bookName: row.bookName || '',                 
                    gender: row.gender || '',                     
                    nameEnglish: row.nameEnglish || '',           
                    nameDevanagari: row.nameDevanagari || '',     
                    meaning: row.meaning || '',                   
                    numerology: row.numerology || '',             
                    zodiac: row.zodiac || '',                     
                    rashi: row.rashi || '',                       
                    nakshatra: row.nakshatra || '',              
                    planetaryInfluence: row.planetaryInfluence || '', // Optional: Planetary influence on the name
                    element: row.element || '',                  // Optional: Element associated with the name (e.g., Fire, Water)
                    pageNo: row.pageNo || 0,                     // Required: Page number where the name is found in the book
                    syllableCount: row.syllableCount || 0,       // Optional: Number of syllables in the name
                    characterSignificance: row.characterSignificance || '', // Optional: Significance of the name's characters
                    mantraRef: row.mantraRef || '',              // Optional: Reference to mantra related to the name
                    relatedFestival: row.relatedFestival || '',  // Optional: Festivals related to the name
                    extraNote: row.extraNote || '',              // Optional: Any additional notes
                    researchTag: row.researchTag || ''           // Optional: Any research-related tag
                };
                

                results.push(validRow);
            })
            .on('end', async () => {
                // Validate all rows before inserting
                if (results.length === 0) {
                    return res.status(400).json({ error: "CSV file is empty or invalid" });
                }

                // Insert data into the database
                const insertedData = await babyNames.insertMany(results);
                res.status(200).json({
                    message: "Baby names uploaded successfully",
                    insertedCount: insertedData.length,
                });
            })
            .on('error', (error) => {
                console.error("CSV file parsing error:", error);
                res.status(500).json({ error: "Error processing the CSV file" });
            });
    } catch (error) {
        console.error("File processing error:", error);
        res.status(500).json({ error: "Unexpected error during file upload" });
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
