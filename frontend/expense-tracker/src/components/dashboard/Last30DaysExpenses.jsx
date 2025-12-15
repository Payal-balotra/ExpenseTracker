import React, { useEffect, useState } from 'react';
import CustomBarChart from '../charts/CustomBarChart';
import { prepareExpenseBarChartData } from '../../utils/helper';
const Last30DaysExpenses = ({data}) => {

const [chartData ,setChartData] = useState([]);

useEffect(()=>{
  const result =  prepareExpenseBarChartData(data);
  setChartData(result);

  return ()=>{}
},[data])
  return (
    <div className='glass-card col-span-1'>
      <div className='flex items-center justify-between mb-6'>
        <h5 className='text-lg font-bold text-slate-800'>Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data={chartData}/>
    </div>
  );
};

export default Last30DaysExpenses;
