import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    base64: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
})

export const Image = mongoose.model('Image', imageSchema);