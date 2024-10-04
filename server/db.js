import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
<<<<<<< HEAD
const url = 'mongodb+srv://ramtejsriram4:n4jIJogBZGjt8ZVQ@cluster0.bsbxq.mongodb.net/VEDIC?retryWrites=true&w=majority&appName=Cluster0';
=======
const url = process.env.MONGO_URL;
>>>>>>> abf57aa7a344784689bd4fb223785a56cfcb61f7

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
