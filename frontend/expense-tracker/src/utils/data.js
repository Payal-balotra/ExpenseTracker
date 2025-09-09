import { LuLayoutDashboard, LuCoins, LuWallet, LuLogOut } from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard"
  },
  {
    id: "02",
    label: "Income",
    icon: LuWallet,
    path: "/income"
  },
  {
    id: "03",
    label: "Expense",
    icon: LuCoins,
    path: "/expense"
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "logout" 
  }
];

export const chartColors = [
  "#7c3aed", "#f59e42", "#ef4444", "#10b981", "#6366f1", "#f472b6"
];