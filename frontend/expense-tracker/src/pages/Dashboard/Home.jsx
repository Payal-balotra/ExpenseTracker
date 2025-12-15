import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeprator } from "../../utils/helper";
import { LuCoins, LuWallet } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import InfoCard from "../../components/Cards/InfoCard"; 
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import FinanceOverview from "../../components/dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/dashboard/RecentIncome";
import SmartInsights from "../../components/ai/SmartInsights";
import MonthlyReport from "../../components/ai/MonthlyReport";
import FinanceChat from "../../components/ai/FinanceChat";
import QuickActionFab from "../../components/QuickActionFab";
import ExportData from "../../components/ExportData";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) setDashboardData(response.data);
    } catch (err) {
      console.log("Something went wrong. Please try again", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto relative min-h-screen pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Dashboard</h3>
            <p className="text-sm text-slate-500 mt-1">Overview of your financial status</p>
          </div>
          <ExportData />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<LuWallet />}
            label="Total Balance"
            value={addThousandsSeprator(dashboardData?.totalBalance || 0)}
            color="bg-gradient-to-br from-violet-500 to-fuchsia-500"
          />
          <InfoCard
            icon={<LuCoins />}
            label="Total Income"
            value={addThousandsSeprator(dashboardData?.totalIncome || 0)}
            color="bg-gradient-to-br from-teal-400 to-emerald-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Total Expense"
            value={addThousandsSeprator(dashboardData?.totalExpenses || 0)}
            color="bg-gradient-to-br from-rose-500 to-pink-600"
          />
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpenses={dashboardData?.totalExpenses || 0}
          />
           <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />
          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
         <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
           <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>

        {/* AI Features Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             AI-Powered Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SmartInsights />
            <MonthlyReport />
          </div>
          <div className="mt-6">
            <FinanceChat />
          </div>
        </div>

        <QuickActionFab />
      </div>
    </DashboardLayout>
  );
};

export default Home;
