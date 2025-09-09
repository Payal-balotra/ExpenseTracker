import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Bar,
} from "recharts";
import dayjs from "dayjs";

const CustomBarChart = ({ data, type = "expense" }) => {
  // Alternate bar colors
  const getBarColor = (index) => (index % 2 === 0 ? "#875cf5" : "#6d28d9");

// Custom tooltip content
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;

    // Decide label text based on type
    const label =
      type === "income"
        ? `Source: ${d.source || "Unknown"}`
        : `Category: ${d.category || "Expense"}`;

    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">{label}</p>
        <p className="text-xs text-gray-600 mb-1">Date: {d.originalDate}</p>
        <p className="text-sm text-gray-600">
          Amount:{" "}
          <span className="text-sm font-medium text-gray-900">
            ${Number(d.amount).toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white mt-6">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No {type} data available to display</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  let chartData;
  if (type === "income") {
    chartData = data.map((item, index) => ({
      ...item,
      label: item.source ? item.source.substring(0, 10) : `Income ${index + 1}`,
      date: item.month,
      originalDate: item.date
        ? dayjs(item.date).format("MMM DD")
        : item.month,
      amount: Number(item.amount) || 0,
    }));
  } else {
    chartData = data.map((item) => ({
      date: item.month,
      originalDate: item.month,
      amount: Number(item.amount) || 0,
      category: item.category || "Expense",
    }));
  }

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={type === "income" ? "label" : "date"}
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
            angle={type === "income" ? -30 : 0}
            textAnchor={type === "income" ? "end" : "middle"}
            height={type === "income" ? 80 : 40}
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
