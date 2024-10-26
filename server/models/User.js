import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customerID: { type: String, required: true },
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
    pdfGenerated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDF' }],
    amountPaid: { type: String },
    leadSource: { type:String, default: "Other", enum:['Instagram', 'Facebook', 'Our Website', 'Other'] },
    socialMediaId: { type: String },
    otherSource: { type: String },
    offer: { type: String },
    customerStatus: { type: String, default: 'newRequests' },
    createdDateTime: { type: Date, default: Date.now }
});


const employeeSchema = new mongoose.Schema({
    // username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    password : {type : String},
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    aadharOrPan : {type : String} ,
    passport : {type : String} ,
    ssn : {type : String},
    degrees : {type : String } ,
    transcripts : {type : String },
    employerName : {type : String } ,
    jobTitle : {type : String} ,
    startDate: { type: Date },
    endDate: { type: Date },
    reasonForLeaving : {type : String } ,
    cardNumber : {type : String} ,
    cardHolderName : {type : String } ,
    cvv : {type : String} ,
    expiryDate : {type : Date} ,
    isOnline :  {type : Boolean , default : false},
    leaveBalance: { type: Number, default: 15 },
    lastLeaveReset: { type: Date, default: new Date() },    // others
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] ,
    lastLeaveAcceptedDate: { type: Date, default: null },

    isAdmin: { type: Boolean, default: false }
});

export const Employee = mongoose.model('Employee', employeeSchema);


export const Customer = mongoose.model('Customer', customerSchema);