import mongoose from "mongoose";

const url = process.env.MONGO_URL;
const connectToMongoDB = async () => {
    try {
        const conn = await mongoose.connect(url, {});

        console.log('Connected to MongoDB');

        return { conn };
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

export { connectToMongoDB , url};
