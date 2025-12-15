import { LuWallet, LuTrendingUp, LuActivity, LuPiggyBank, LuArrowUpRight } from "react-icons/lu";
import Chart1 from "../../assets/images/Chart1.png";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen">
      
      <div className="w-full md:w-[60vw] px-8 md:px-12 py-12 flex flex-col justify-center relative z-10">
        <div className="absolute top-8 left-8 md:left-12 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">W</div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">WalletIQ</h2>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
            {children}
        </motion.div>
      </div>

      <div className="hidden md:flex w-[40vw] h-screen relative overflow-hidden items-center justify-center bg-slate-900">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 w-full h-full">
           <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-violet-500/30 blur-[120px] rounded-full mix-blend-screen animate-blob" />
           <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-fuchsia-500/30 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-2000" />
           <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-blue-500/30 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-4000" />
           <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-slate-50/80 to-transparent backdrop-blur-3xl" />
        </div>

        <div className="relative z-20 w-full max-w-[400px] h-[600px] flex flex-col items-center justify-center">
          
          {/* Floating Card 1: Balance */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="absolute top-[10%] right-[-14%] md:right-[-5%] glass-heavy p-4 rounded-2xl flex items-center gap-4 border border-white/40 shadow-2xl shadow-violet-500/20 z-30"
          >
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl shadow-lg">
                <LuWallet />
             </div>
             <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Total Balance</p>
                <p className="text-lg font-bold text-slate-800">$42,593.00</p>
             </div>
          </motion.div>

          {/* Floating Card 2: Main Chart Mockup - Added margin for breathing room */}
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="w-full glass-card p-6 border-white/60 relative z-20 mx-4"
          >
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-800">Spending Analysis</h3>
                   <p className="text-xs text-slate-500">Last 30 Days</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                   <LuTrendingUp />
                </div>
             </div>
             
             {/* Mock Bars */}
             <div className="flex items-end justify-between h-32 gap-2">
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                   <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, type: "spring", stiffness: 50 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-fuchsia-500/80 hover:to-fuchsia-500 transition-colors shadow-md shadow-violet-200"
                   />
                ))}
             </div>
          </motion.div>

          {/* Floating Card 3: Recent Transaction */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="absolute bottom-[15%] left-[-14%] md:left-[-5%] glass-heavy p-4 rounded-2xl flex items-center gap-3 border border-white/40 shadow-2xl shadow-fuchsia-500/20 z-30"
          >
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-fuchsia-500 shadow-sm">
                <LuActivity />
             </div>
             <div>
                <p className="text-xs text-slate-500 font-medium">Subscription</p>
                <p className="text-sm font-bold text-slate-800">-$14.99</p>
             </div>
          </motion.div>

          {/* Floating Card 4: Savings Goal (New) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="absolute top-[40%] left-[-22%] md:left-[-15%] glass-heavy p-3 rounded-2xl flex flex-col items-center gap-1 border border-white/40 shadow-2xl shadow-blue-500/20 z-30"
          >
             <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]">
                   <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                   <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset="35" strokeLinecap="round" className="text-blue-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                   <LuPiggyBank className="text-lg" />
                </div>
             </div>
             <p className="text-[10px] font-bold text-slate-700">Goal 75%</p>
          </motion.div>

          {/* Floating Card 5: Income Stream (New) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
            className="absolute bottom-[20%] right-[-12%] glass-heavy py-3 px-5 rounded-full flex items-center gap-3 border border-white/40 shadow-xl shadow-green-500/20 z-30"
          >
             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <LuArrowUpRight />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Income</span>
                <span className="text-sm font-bold text-slate-800">+$3,250</span>
             </div>
          </motion.div>

          {/* Abstract background shapes */}
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -z-10 w-[500px] h-[500px] border border-white/10 rounded-full border-dashed"
          />
           <motion.div
             animate={{ rotate: -360 }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="absolute -z-10 w-[350px] h-[350px] border border-violet-200/20 rounded-full"
          />
          
          {/* Decorative Grid */}
           <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
