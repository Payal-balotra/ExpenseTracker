import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuWallet, LuCoins } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const QuickActionFab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleAction = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ delay: 0.05 }}
                            onClick={() => handleAction('/income')}
                            className="w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer relative group"
                        >
                            <LuWallet size={20} />
                            <span className="absolute right-14 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                                Add Income
                            </span>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            onClick={() => handleAction('/expense')}
                            className="w-12 h-12 rounded-full bg-rose-500 text-white shadow-lg flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer relative group"
                        >
                            <LuCoins size={20} />
                            <span className="absolute right-14 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                                Add Expense
                            </span>
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleOpen}
                animate={{ rotate: isOpen ? 45 : 0 }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow cursor-pointer"
            >
                <LuPlus size={28} />
            </motion.button>
        </div>
    );
};

export default QuickActionFab;
