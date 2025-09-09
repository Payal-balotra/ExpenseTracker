const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ExpenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {   
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    icon: {
        type: String,
    },

},{timestamps: true});


const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;