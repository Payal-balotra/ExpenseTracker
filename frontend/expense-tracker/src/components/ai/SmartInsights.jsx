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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-800">AI Smart Insights</h2>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
        >
          {loading ? "Generating..." : "Refresh Insights"}
        </button>
      </div>

      {loading && insights.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Generating insights...</p>
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-500"
            >
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No insights available. Add some expenses to get started!</p>
        </div>
      )}

      {stats && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Current Month: ₹{parseFloat(stats.currentMonthTotal).toLocaleString()} | 
            Last Month: ₹{parseFloat(stats.lastMonthTotal).toLocaleString()} | 
            Change: {stats.percentageChange > 0 ? "+" : ""}{stats.percentageChange}%
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;

