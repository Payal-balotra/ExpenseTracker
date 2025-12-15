import React, { useContext } from "react";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";
import { UserContext } from "../../context/UserContext";
import { motion } from "framer-motion";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 flex flex-col font-display">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex flex-1 pt-6 w-full max-w-[1600px] mx-auto px-4 md:px-8 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:block w-72 shrink-0"
          >
            <div className="glass-card h-[calc(100vh-100px)] sticky top-24 overflow-hidden p-0">
              <SideMenu activeMenu={activeMenu} />
            </div>
          </motion.div>
          
          <main className="flex-1 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
