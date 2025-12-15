import { LuArrowRight } from "react-icons/lu";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import EmptyState from '../EmptyState';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="glass-card col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-lg font-bold text-slate-800">Recent Transactions</h5>
        {hasTransactions && (
          <button className="card-btn" onClick={onSeeMore}>
            See All <LuArrowRight className="text-base" />
          </button>
        )}
      </div>

      <div className="mt-4">
        {hasTransactions ? (
          transactions.slice(0, 5).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TransactionInfoCard
                title={item.type === "expense" ? item.category : item.source}
                icon={item.icon}
                date={dayjs(item.date || item.createdAt).format("DD MMM YYYY")}
                amount={item.amount}
                type={item.type}
                hideDeleteBtn // Assuming this prop exists
              />
            </motion.div>
          ))
        ) : (
          <EmptyState 
            message="No transactions found. Start by adding your income or expenses."
            onAction={onSeeMore}
            actionLabel="View All"
          />
        )}
      </div>
    </div>
  );
};


export default RecentTransactions;
