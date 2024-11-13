
import mongoose from "mongoose";

// const PdfSchema = new mongoose.Schema({
//     babyNames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'babyNames' }],
//     createdAt: { type: Date, default: Date.now },
//     whatsappStatus: { type: Boolean, default: false },
//     mailStatus: { type: Boolean, default: false },
//     additionalBabyNames: [
//         {
//             name: { type: String, required: true },
//             meaning: { type: String, required: true }
//         }
//     ],
// });

const PdfSchema = new mongoose.Schema({
    babyNames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'babyNames' }],
    createdAt: { type: Date, default: Date.now },
    whatsappStatus: { type: Boolean, default: false },
    mailStatus: { type: Boolean, default: false },
    additionalBabyNames: [
        {
            nameEnglish: { type: String, required: true },
            meaning: { type: String, required: true }
        }
    ],
    generatedBy:{type:String,required:true},
    rating: { type: Number, min: 0, max: 5, default: 0 }, 
});



const NameSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    gender: { type: String, required: true },
    nameEnglish: { type: String, required: true },
    nameDevanagari: { type: String, required: true },
    meaning: { type: String, required: true },
    numerology: { type: String, required: false },
    zodiac: { type: String, required: false },
    rashi: { type: String, required: false },
    nakshatra: { type: String, required: false },
    planetaryInfluence: { type: String, required: false },
    element: { type: String, required: false },
    pageNo: { type: Number, required: true },
    syllableCount: { type: Number, required: false },
    characterSignificance: { type: String, required: false },
    mantraRef: { type: String, required: false },
    relatedFestival: { type: String, required: false },
    extraNote: { type: String, required: false },
    researchTag: { type: String, required: false }
}, { collection: 'babyNames' });


export const babyNames = mongoose.model('babyNames', NameSchema);
export const PDF = mongoose.model('PDF', PdfSchema);
