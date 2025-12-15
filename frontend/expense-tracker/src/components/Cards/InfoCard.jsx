

import { motion } from "framer-motion";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card flex items-center gap-6 relative overflow-hidden group p-6 min-w-full"
    >
      <div className={`absolute -top-4 -right-4 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-9xl ${color.replace('bg-', 'text-')} rotate-12`}>
        {icon}
      </div>
      
      <div
        className={`w-16 h-16 flex items-center justify-center text-[28px] text-white ${color} rounded-2xl shadow-xl shadow-slate-300/60 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div className="z-10">
        <h6 className="text-sm text-slate-500 mb-1 font-semibold tracking-wider uppercase">{label}</h6>
        <span className="text-3xl font-bold text-slate-800">
          {value !== null && value !== undefined ? `$${value}` : "$0"}
        </span>
      </div>
    </motion.div>
  );
};

export default InfoCard;
