import { LuArrowRight } from "react-icons/lu";
import dayjs from "dayjs";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>
        {hasTransactions && (
          <button className="card-btn" onClick={onSeeMore}>
            See All <LuArrowRight className="text-base" />
          </button>
        )}
      </div>

      <div className="mt-6">
        {hasTransactions ? (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.type === "expense" ? item.category : item.source}
              icon={item.icon}
              date={dayjs(item.date || item.createdAt).format("DD MMM YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">
            No transactions found
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
