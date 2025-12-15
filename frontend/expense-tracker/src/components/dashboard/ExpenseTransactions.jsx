import React from 'react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import EmptyState from '../EmptyState';

const ExpenseTransactions = ({ 
 transactions,onSeeMore 
}) => {
  return (
    <div className='glass-card col-span-1'>
      <div className='flex items-center justify-between mb-6'>
        <h5 className='text-lg font-bold text-slate-800'>Expenses</h5>
        <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base'/></button>
      </div>
      <div className='mt-4'>
        {transactions?.length > 0 ? (
           transactions?.slice(0,5)?.map((expense, index)=>(
          <motion.div
            key={expense._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={dayjs(expense.date).format("DD MMM YYYY")}
            amount={expense.amount}
            type="expense"
            hiddenDeleteBtn
            />
          </motion.div>
        ))
        ) : (
           <EmptyState message="No recent expenses found." />
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
