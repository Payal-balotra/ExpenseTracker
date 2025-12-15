import React, { useState } from "react";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { FileText, Download } from "lucide-react";

const MonthlyReport = () => {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.AI.GENERATE_REPORT, {
        params: { month, year },
        responseType: "blob",
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      link.setAttribute("download", `financial-report-${monthName.replace(/\s+/g, "-")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report generated and downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Generate month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year options (last 2 years to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-violet-100 rounded-lg">
           <FileText className="w-5 h-5 text-violet-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">AI Monthly Report</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 text-sm"
            >
              {months.map((m, index) => (
                <option key={index} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>

        <div className="mt-4 p-4 bg-violet-50/50 border border-violet-100 rounded-xl">
          <p className="text-sm text-slate-700 font-medium">
            Included in report:
          </p>
          <ul className="text-xs text-slate-500 mt-2 space-y-1 list-disc list-inside">
            <li>Monthly financial summary</li>
            <li>Category analysis & Spending habits</li>
            <li>Personalized saving tips</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;

