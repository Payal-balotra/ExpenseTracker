import {FaRegEye} from "react-icons/fa"
import Chart1 from "../../assets/images/Chart1.png"
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-2xl text-gray-900 mb-8">Expense Tracker</h2>
        {children}
      </div>

      
      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-6 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 left-16 z-10" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-1/3 right-10 z-10" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-10 z-10" />

        <div className="relative z-20 p-6">
          <StatsInfoCard
            icon={<FaRegEye />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-purple-600"
          />
        </div>

        <img
          src={Chart1}
          alt="Dashboard preview"
          className="w-64 lg:w-[90%] absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 shadow-lg shadow-blue-400/20 rounded-xl"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

// Stats Info Card
const StatsInfoCard = ({ icon, label, value, color = "bg-purple-600" }) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-4 max-w-sm">
      {/* Icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color} text-white text-xl`}
      >
        {icon}
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-gray-900  text-lg">${value}</span>
      </div>
    </div>
  );
};
