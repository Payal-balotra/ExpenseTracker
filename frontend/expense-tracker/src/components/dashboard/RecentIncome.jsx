import React from 'react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';
import dayjs from 'dayjs';
const RecentIncome = ({ transactions,onSeeMore}) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Income</h5>
        <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base'/></button>
      </div>
      <div className='mt-6'>
        {transactions?.slice(0,5)?.map((income)=>(
          <TransactionInfoCard
          key={income._id}
          title={income.source}
          icon={income.icon}
          date={dayjs(income.date).format("DD MMM YYYY")}
          amount={income.amount}
          type="income"
          hiddenDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
