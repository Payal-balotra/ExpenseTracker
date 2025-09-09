import React, { useEffect, useState } from "react";
import CustomLineChart from "../charts/CustomLineChart";
import CustomPieChart from "../charts/CustomPieChart";


const COLORS = ["#875CF5", "#FA2C37", "#FF6900","#F59E0B","#6366F1","#22C55E"];

const RecentIncomeWithChart = ({ data,totalIncome }) => {
const [chartData , setChartData] = useState([]);
const prepareChartData = ()=>{
  const dataArr = data?.map((item)=>({
    name : item?.source,
    amount : item?.amount

}));
setChartData(dataArr);

}
useEffect(()=>{
  prepareChartData();
  
  return () =>{}
},[data])
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>
     <CustomPieChart
     data={chartData}
     label="Total Income"
     totalAmount = {`$${totalIncome}`}
     showTextAnchor
     colors={COLORS}
     />
    </div>
  );
};

export default RecentIncomeWithChart;
