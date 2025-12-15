import React from 'react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import EmptyState from '../EmptyState';

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className='glass-card col-span-1'>
      <div className='flex items-center justify-between mb-6'>
        <h5 className='text-lg font-bold text-slate-800'>Income</h5>
        <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base' /></button>
      </div>
      <div className='mt-4'>
        {transactions?.length > 0 ? (
           transactions?.slice(0, 5)?.map((income, index) => (
          <motion.div
            key={income._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={dayjs(income.date).format("DD MMM YYYY")}
              amount={income.amount}
              type="income"
              hiddenDeleteBtn
            />
          </motion.div>
        ))
        ) : (
           <EmptyState message="No recent income records." />
        )}
      </div>
    </div>
  );
};

export default RecentIncome;
