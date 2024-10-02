import mongoose from "mongoose";

const url = "mongodb+srv://vignaramtejtelagarapu:vzNsqoKpAzHRdN9B@amile.auexv.mongodb.net/?retryWrites=true&w=majority&appName=Amile";
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
