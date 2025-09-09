import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route, label) => {
    if (label === "Logout") {
      handleLogout();
      return ; 
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white h-[calc(100vh-61px)] border border-gray-200/50 p-5 border-r sticky top-[61px] z-20">
      <div className="flex flex-col items-center mb-7 mt-3 gap-3">
        {user?.profileImageUrl ? (
          <img  
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mb-2 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        <h5 className="text-gray-700 font-medium text-center leading-tight">
          {user?.fullName || "User"}
        </h5>
        {user?.email && (
          <p className="text-gray-500 text-xs text-center">{user.email}</p>
        )}
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu == item.label 
                ? "text-white btn-primary ": ""
            } py-3 px-6 rounded-lg mb-3 transition-all duration-200 font-medium`}
            onClick={() => handleClick(item.path, item.label)}
          >
            <item.icon className="text-lg" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;