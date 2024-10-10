import mongoose from "mongoose"

const PdfSchema = new mongoose.Schema({
    uniqueId: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    base64Pdf: String,
    createdAt: { type: Date, default: Date.now },
});


const NameSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    meaning: { type: String, required: true },
    nameInHindi: { type: String, required: true },
    meaningInHindi: { type: String, required: true },
    shlokNo: { type: String, required: true },
    pageNo: { type: Number, required: true },
}, { collection: 'babyNames' });  // Explicitly set the collection name

export const babyNames = mongoose.model('babyNames', NameSchema);

export const PDF = mongoose.model('PDF', PdfSchema);