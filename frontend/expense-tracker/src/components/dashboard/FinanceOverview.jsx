import React from "react";
import CustomPieChart from "../charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900","#F59E0B","#6366F1","#22C55E"];
const FinanceOverview = ({ totalIncome, totalBalance, totalExpenses }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Income", amount: totalIncome },
    { name: "Total Expense", amount: totalExpenses },
  ];
  return (
    <div className="glass-card col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-lg font-bold text-slate-800">Finance Overview</h5>
      </div>
      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
