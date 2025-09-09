import React, { useEffect, useState } from "react";
import CustomBarChart from "../charts/CustomBarChart";
import { LuPlus } from "react-icons/lu";
import {prepareIncomeBarChartData} from "../../utils/helper"
const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
    return () => {};
  }, [transactions]);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gary-400 mt-0.5">
            Track your income over the time and analyze your income with trends.
          </p>
        </div>

        <button onClick={onAddIncome} className="add-btn">
          Add Income
          <LuPlus className="text-lg" />
        </button>
      </div>
      <div className="mt-10">
        <CustomBarChart data={chartData} type="income" />
      </div>
    </div>
  );
};

export default IncomeOverview;
