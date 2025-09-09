const User = require("../models/User");
const Expense = require("../models/Expense");
const xlsx = require("xlsx");
const addExpense = async (req, res) => {
  const userId = req.user.id;

  const { amount, category, icon, date } = req.body;
  if (!amount || !category) {
    return res.status(400).json({ message: "Please fill all fields"});
  }
   if (!date) {
    date = new Date();
  }
  try {
    const newExpense = new Expense({
      userId,
      amount,
      category,
      icon,
      date: date || new Date()
    });
    await newExpense.save();
    return res
      .status(201)
      .json({ message: "Expense added successfully",newExpense});
  } catch (error) {
    console.log("Error adding expense:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const Expenses = await Expense.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ Expenses });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const Expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = Expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date:  item.date.toISOString().split("T")[0]
    }));

   
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="expense_details.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {

  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    downloadExpenseExcel,
};
