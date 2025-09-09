const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const incomeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    source: {   
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


const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;