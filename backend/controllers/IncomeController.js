const User = require("../models/User");
const Income = require("../models/Income");
const xlsx = require("xlsx");

const addIncome = async (req, res) => {
  const userId = req.user.id;

  const { amount, source, icon, date } = req.body;
  if (!amount || !source) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const newIncome = new Income({
      userId,
      amount,
      source,
      icon,
      date,
    });
    await newIncome.save();
    return res
      .status(201)
      .json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const getIncomes = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ incomes });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const getIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addIncome,
  getIncomes,
  getIncomeExcel,
  deleteIncome,
};
