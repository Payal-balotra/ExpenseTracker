import React from 'react';
import { LuFilePlus } from 'react-icons/lu';

const EmptyState = ({ message, onAction, actionLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <LuFilePlus className="text-3xl text-slate-300" />
      </div>
      <p className="text-slate-500 text-sm font-medium mb-4 max-w-xs mx-auto leading-relaxed">
        {message}
      </p>
      {onAction && actionLabel && (
        <button 
            onClick={onAction}
            className="text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-lg transition-colors border border-violet-200"
        >
            {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
