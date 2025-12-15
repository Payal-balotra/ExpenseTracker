import React from 'react';
import { LuDownload } from 'react-icons/lu';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ExportData = () => {
  const handleExport = () => {
    // Mock export functionality
    const toastId = toast.loading('Generating report...');
    
    setTimeout(() => {
      // In a real app, this would generate a CSV blob and trigger download
      toast.success('Report downloaded successfully!', { id: toastId });
    }, 1500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      className="flex items-center gap-2 text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-lg hover:bg-purple-500/20 transition-colors"
    >
      <LuDownload size={16} />
      Export Report
    </motion.button>
  );
};

export default ExportData;
