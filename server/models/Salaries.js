import mongoose from "mongoose";

const monthsEnum = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const SalariesSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    amountPaid: {
        type: String,
        required: true ,
        default : 0,
    },
    year: {
        type: String,
        required: true
    },
    month: {
        type: String,
        enum: monthsEnum,
        required: true
    },
    bankStatement: {
        type: String,
    }
} , {timestamps : true});


SalariesSchema.pre('save', function(next) {
    this.totalSalary = this.basicSalary + this.totalAllowance - this.totalDeduction;
    next();
});

export const Salaries = mongoose.model("Salaries", SalariesSchema);