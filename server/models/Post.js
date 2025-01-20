import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    uniqueId: String,
    socialMediaPlatform: String,
    headline: String,
    caption: String,
    dateOfPost: Date,
    time: String,
    indexStatus: String,
    employeeAuthor: String,
    view12Hour: Number,
    view24Hour: Number,
    view48Hour: Number,
    link: String,
});

export const Post = mongoose.model('Post', PostSchema);