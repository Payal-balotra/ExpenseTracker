const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);

    // Total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    // Total Expenses
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    // Income transactions in last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Expense transactions in last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Last 5 recent transactions (income + expense)
   const lastTransactions = await Income.aggregate([
      { $match: { userId: userObjectId } },
      {
        $project: {
          amount: 1,
          date: 1,
          source: 1,
          icon: 1,
          type: { $literal: "income" }, 
        },
      },
      {
        $unionWith: {
          coll: "expenses", 
          pipeline: [
            { $match: { userId: userObjectId } },
            {
              $project: {
                amount: 1,
                date: 1,
                category: 1,
                icon: 1,
                type: { $literal: "expense" }, 
              },
            },
          ],
        },
      },
      { $sort: { date: -1 } },
      { $limit: 5 },
    ]);


    // Response
    res.json({
      totalBalance:
        (totalIncome[0]?.totalAmount || 0) -
        (totalExpense[0]?.totalAmount || 0),
      totalIncome: totalIncome[0]?.totalAmount || 0,
      totalExpenses: totalExpense[0]?.totalAmount || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDashboardData };
