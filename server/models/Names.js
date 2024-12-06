import mongoose from "mongoose";

const genderSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const zodiacSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const rashiSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const nakshatraSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const planetSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const elementSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const bookNameSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const festivalSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});



export const Gender = mongoose.model('Gender', genderSchema);
export const Zodiac = mongoose.model('Zodiac', zodiacSchema);
export const Rashi = mongoose.model('Rashi', rashiSchema);
export const Nakshatra = mongoose.model('Nakshatra', nakshatraSchema);
export const Planet = mongoose.model('Planet', planetSchema);
export const Element = mongoose.model('Element', elementSchema);
export const BookName = mongoose.model('BookName', bookNameSchema);
export const Festival = mongoose.model('Festival', festivalSchema);