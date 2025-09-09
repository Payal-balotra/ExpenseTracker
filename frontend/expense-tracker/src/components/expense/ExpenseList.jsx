import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import dayjs from 'dayjs'

const ExpenseList = ({transactions,onDelete,onDownload}) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Expense List</h5>
        <button className='card-btn' onClick={onDownload}>Download<LuDownload className='text-base'/></button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        {transactions?.map((expense)=>(
          <TransactionInfoCard
          key={expense._id}
          title={expense.category}
          icon={expense.icon}
          date={dayjs(expense.date).format("DD MMM YYYY")}
          amount={expense.amount}
          type="expense"
          onDelete={()=>onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList