import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    email: { type: String },
    whatsappNumber: { type: String, required: true },
    babyGender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    babyBirthDate: { type: Date, required: true },
    babyBirthTime: { type: String, required: true },
    birthplace: { type: String, required: true },
    preferredStartingLetter: { type: String },
    preferredGod: { type: String },
    referenceName: { type: String },
    additionalPreferences: { type: String },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    socialMediaUsername: { type: String },
    paymentStatus: { type: Boolean, default: false },
    paymentDate: { type: Date },
    paymentTime: { type: String },
    payTransactionID: { type: String },
    pdfGenerated: { type: Number, default: 0 },  // Storing the count of PDFs generated
    amountPaid: { type: String },
    offer: { type: String },
    createdDateTime: { type: Date, default: Date.now }
});


const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    password : {type : String , required : true},
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] ,
    isAdmin: { type: Boolean, default: false }
});

export const Employee = mongoose.model('Employee', employeeSchema);


export const Customer = mongoose.model('Customer', customerSchema);
