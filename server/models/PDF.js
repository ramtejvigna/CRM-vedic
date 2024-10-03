import mongoose from "mongoose"

const PdfSchema = new mongoose.Schema({
    uniqueId: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    base64Pdf: [String],
    createdAt: { type: Date, default: Date.now },
});

export const PDF = mongoose.model('PDF', PdfSchema);