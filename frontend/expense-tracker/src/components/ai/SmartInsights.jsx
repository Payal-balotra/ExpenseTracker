import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";

const SmartInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const fetchInsights = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get(API_PATHS.AI.GET_INSIGHTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setInsights(response.data.insights || []);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 rounded-lg">
             <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">AI Smart Insights</h2>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="px-4 py-2 bg-violet-100 text-violet-700 font-medium rounded-lg hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
        >
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      {loading && insights.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-2 text-slate-500 text-sm">Analyzing your finances...</p>
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 flex items-start gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"/>
              <p className="text-slate-600 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p>No insights available yet.</p>
        </div>
      )}

      {stats && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
             <span>Current Month: <span className="font-semibold text-slate-700">₹{parseFloat(stats.currentMonthTotal).toLocaleString()}</span></span>
             <span>Last Month: <span className="font-semibold text-slate-700">₹{parseFloat(stats.lastMonthTotal).toLocaleString()}</span></span>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;

