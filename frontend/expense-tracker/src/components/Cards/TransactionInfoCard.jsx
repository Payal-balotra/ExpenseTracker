import React from 'react'
import { LuTrash, LuTrendingDown, LuTrendingUp, LuUtensils } from 'react-icons/lu'
import { motion } from "framer-motion";

const TransactionInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  hiddenDeleteBtn,
  onDelete
}) => {

  const getAmountStyles = () =>
    type === "income" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border border-rose-400/20"

  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: "rgba(139, 92, 246, 0.05)" }}
      className='group relative flex items-center gap-4 mt-2 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100'
    >
      <div className='w-12 h-12 flex items-center justify-center text-xl text-slate-700 bg-slate-100 rounded-full border border-slate-200 shadow-sm'>
        {icon ? (
          <img src={icon} alt='Title' className='w-6 h-6 object-contain' />
        ) : (<LuUtensils />)}
      </div>
      <div className='flex-1 flex items-center justify-between'>
        <div>
          <p className='text-sm text-slate-800 font-bold'>{title}</p>
          <p className='text-xs text-slate-500 mt-1 font-medium'>{date}</p>
        </div>
        <div className='flex items-center gap-2'>
          {!hiddenDeleteBtn && (
            <button className='text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-2 hover:bg-rose-400/10 rounded-full' onClick={onDelete}>
              <LuTrash size={16} />
            </button>
          )}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
            <h6 className='text-xs font-semibold'>
              {type === "income" ? "+" : "-"} ${amount}
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionInfoCard