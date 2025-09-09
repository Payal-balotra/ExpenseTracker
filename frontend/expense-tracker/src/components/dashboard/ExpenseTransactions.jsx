import React from 'react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { CreditCard, Plus } from 'lucide-react';
import { LuArrowRight } from 'react-icons/lu';
import dayjs from 'dayjs';

const ExpenseTransactions = ({ 
 transactions,onSeeMore 
}) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Expenses</h5>
        <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base'/></button>
      </div>
      <div className='mt-6'>
        {transactions?.slice(0,5)?.map((expense)=>(
          <TransactionInfoCard
          key={expense._id}
          title={expense.category}
          icon={expense.icon}
          date={dayjs(expense.date).format("DD MMM YYYY")}
          amount={expense.amount}
          type="expense"
          hiddenDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
