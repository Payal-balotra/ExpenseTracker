import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ 
  data,
  label,
  colors,
  totalAmount,
  showTextAnchor

}) => {
  // const CustomTooltip = ({ active, payload }) => {
  //   if (active && payload && payload.length) {
  //     const data = payload[0].payload;
  //     return (
  //       <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
  //         <p className="font-medium text-gray-900">{data[nameKey]}</p>
  //         <p className="text-sm text-gray-600">
  //           Amount: <span className="font-semibold text-blue-600">
  //             {formatCurrency(data[dataKey])}
  //           </span>
  //         </p>
  //         <p className="text-sm text-gray-500">
  //           Percentage: {((data[dataKey] / data.total) * 100).toFixed(1)}%
  //         </p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // const CustomLegend = ({ payload }) => {
  //   return (
  //     <div className="flex flex-wrap justify-center gap-2 mt-4">
  //       {payload.map((entry, index) => (
  //         <div key={index} className="flex items-center space-x-2">
  //           <div 
  //             className="w-3 h-3 rounded-full" 
  //             style={{ backgroundColor: entry.color }}
  //           />
  //           <span className="text-sm text-gray-600">{entry.value}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // // Calculate total for percentage calculation
  // const total = data.reduce((sum, item) => sum + item[dataKey], 0);
  // const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            nameKey="name"
          innerRadius={100}
            outerRadius={130}
            labelLine={false}
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip/>} />
         <Legend content={<CustomLegend/>} />
         {showTextAnchor && (
          <>
          <text 
          x="50%"
          y="50%"
          dy={-25}
          textAnchor='middle'
          fill="#666"
          fontSize="14px"
          >
          {label}
          </text>
          <text
           x="50%"
          y="50%"
          dy={8}
          textAnchor='middle'
          fill="#333"
          fontSize="24px"
          fontWeight="semi-bold"
          >
            {totalAmount}

          </text>
          </>
         )}
        </PieChart>
      </ResponsiveContainer>
  
  );
};

export default CustomPieChart;
