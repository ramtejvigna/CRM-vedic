import mongoose, { mongo } from 'mongoose';

const customerSchema = new mongoose.Schema({
    applicationID: { type: String, required: true },

    customerID: { type: String, required: true },
    fatherName: { type: String, required: true },
    customerName : {type : String, required : true},
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
    leadSource: { type:String, default: "Other", enum:['Instagram 1','Instagram 2', 'Whatsapp','Meta Ads','Google Ads','Facebook', 'Our Website', 'Other'] },
    socialMediaId: { type: String },
    otherSource: { type: String },
    offer: { type: String },
    customerStatus: { type: String, default: 'newRequests' },
    createdDateTime: { type: Date, default: Date.now },
    assignedOn: { type: Date },
    completedOn: { type: Date },
    preferredStartingLetterType : {type : String,enum:['Alphabet Based','Nakshatra Based','Rashi Based']},
    deadline : {type : Date},
    isTwins: { 
      type: String, 
      enum: ['yes', 'no'], 
      required: true,
      default: 'no'
  },
  selectedServices: [{
      type: String,
      enum: ['astro', 'numerology'],
      required: true
  }],
  totalPrice: {
      type: Number,
      required: true
  }
}, { timestamps: true });


const employeeSchema = new mongoose.Schema({
    firstName: { type: String , required : true },
    lastName: { type: String  , required : true},
    role: { type: String, enum: ["Employee", "Manager"], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    password: { type: String },
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },

    aadharOrPan: { type: String },
    degrees: { type: String },
    transcripts: { type: String },

    employerName: { type: String },
    jobTitle: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    reasonForLeaving: { type: String },

    accountHolderName: { type: String },
    bankName: { type: String },
    branchName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },

    isOnline: { type: Boolean, default: false },
    leaveBalance: { type: Number, default: 15 },
    lastLeaveReset: { type: Date, default: new Date() },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    pdfGenerated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDF' }],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    lastLeaveAcceptedDate: { type: Date, default: null },

    isAdmin: { type: Boolean, default: false },
    requestedBabyNames: { type: Boolean, default: false },
    adminAcceptedRequest: { type: Boolean, default: false },

    password : {type : String , required : true}
}, { timestamps: true });

const astroSchema = new mongoose.Schema(
    {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
      zodiacSign: { type: String, required: true },
      nakshatra: { type: String, required: true },
      numerologyNo: { type: Number, required: true },
      luckyColour: { type: String, required: true },
      gemstone: { type: String, required: true },
      destinyNumber: { type: Number, required: true },
      luckyDay: { type: String, required: true },
      luckyGod: { type: String, required: true },
      luckyMetal: { type: String, required: true },
    },
    { timestamps: true }
  );

const adminSchema = new mongoose.Schema({
    
    email: { type: String, required: true },
    password : {type : String , required : true},
    pdfGenerated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDF' }],

    resetPasswordVerificationToken : String ,
    resetPasswordVerificationTokenExpiresAt : Date,
    verificationToken : String
} ,  {timestamps : true});

export const Employee = mongoose.model('Employee', employeeSchema);

export const Astro = mongoose.model('Astro', astroSchema);

export const Customer = mongoose.model('Customer', customerSchema);
export const Admin = mongoose.model('Admin', adminSchema);