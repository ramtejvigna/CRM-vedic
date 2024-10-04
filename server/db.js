import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = 'mongodb+srv://ramtejsriram4:n4jIJogBZGjt8ZVQ@cluster0.bsbxq.mongodb.net/VEDIC?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongoDB = async () => {
    try {
        const conn = await mongoose.connect(url);
    
        console.log('Connected to MongoDB');

        return { conn };
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

export { connectToMongoDB , url};
