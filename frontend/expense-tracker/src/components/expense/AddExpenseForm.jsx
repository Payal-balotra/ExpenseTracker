import React, { useState } from "react";
import Input from "../inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
    description: "",
  });
  const [mode, setMode] = useState("manual"); // "manual" or "ai"
  const [categorizing, setCategorizing] = useState(false);

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  const handleAICategorize = async () => {
    if (!expense.description || !expense.amount) {
      toast.error("Please enter expense description and amount");
      return;
    }

    setCategorizing(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.CATEGORIZE, {
        description: expense.description,
        amount: expense.amount,
      });

      if (response.data.success) {
        setExpense({
          ...expense,
          category: response.data.category,
          icon: response.data.icon,
        });
        toast.success(`Categorized as: ${response.data.category}`);
      }
    } catch (error) {
      console.error("Error categorizing expense:", error);
      toast.error("Failed to categorize expense. Please categorize manually.");
    } finally {
      setCategorizing(false);
    }
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`px-4 py-2 rounded ${
            mode === "manual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`px-4 py-2 rounded ${
            mode === "ai"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          AI Auto-Categorize
        </button>
      </div>

      {mode === "ai" ? (
        <>
          {/* AI Mode: Text-based entry */}
          <Input
            value={expense.description}
            onChange={({ target }) => handleChange("description", target.value)}
            label="Expense Description"
            placeholder="e.g., Zomato dine order 580, Uber Cab airport 900"
            type="text"
          />
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAICategorize}
              disabled={categorizing || !expense.description || !expense.amount}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {categorizing ? "Categorizing..." : "🤖 Auto-Categorize"}
            </button>
          </div>
          {expense.category && (
            <div className="mb-4 p-3 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Detected Category:</p>
              <p className="text-lg font-semibold">
                {expense.icon} {expense.category}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Manual Mode: Original form */}
          <EmojiPickerPopup
            icon={expense.icon}
            onSelect={(selectIcon) => handleChange("icon", selectIcon)}
          />
          <Input
            value={expense.category}
            onChange={({ target }) => handleChange("category", target.value)}
            label="Expense Category"
            placeholder="Food , Rent ,etc"
            type="text"
          />
        </>
      )}

      {/* Common fields for both modes */}
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />
      <div className="flex justify-end mt-5">
        <button
          className="add-btn add-btn-fill"
          type="button"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
