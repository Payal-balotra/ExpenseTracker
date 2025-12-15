import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SideMenu = ({ activeMenu, isMobile }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route, label) => {
    if (label === "Logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className={`flex flex-col h-full ${isMobile ? '' : 'p-5'}`}>
      {!isMobile && (
        <div className="flex flex-col items-center mb-8 mt-6 gap-3">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 rounded-full object-cover mb-2 border-4 border-white shadow-xl shadow-purple-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-2 flex items-center justify-center border-4 border-white shadow-xl shadow-purple-200">
              <span className="text-violet-600 text-3xl font-bold">
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div className="text-center">
            <h5 className="text-slate-800 font-bold text-lg leading-tight">
              {user?.fullName || "User"}
            </h5>
            {user?.email && (
              <p className="text-slate-400 text-xs mt-1 font-medium">{user.email}</p>
            )}
          </div>
        </div>
      )}

      {/* Menu Buttons */}
      <div className="flex flex-col gap-2">
        {SIDE_MENU_DATA.map((item, index) => (
          <motion.button
            key={`menu_${index}`}
            whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 text-[15px] py-3.5 px-6 rounded-xl transition-all duration-200 font-medium ${
              activeMenu === item.label
                ? "text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-200"
                : "text-slate-500 hover:text-violet-600"
            }`}
            onClick={() => handleClick(item.path, item.label)}
          >
            <item.icon className="text-lg" />
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;