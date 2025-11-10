const Expense = require("../models/Expense");
const Income = require("../models/Income");
const PDFDocument = require("pdfkit");
const { Types } = require("mongoose");
const { getAICompletion, checkAIService, CHAT_MODEL, GENERAL_MODEL, AI_PROVIDER } = require("../utils/aiService");

// 1. AI Auto Categorization
const categorizeExpense = async (req, res) => {
  try {

    const { description, amount } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ message: "Description and amount are required" });
    }

    const prompt = `You are a finance categorization assistant. Categorize the following expense transaction into one of these categories: Food & Dining, Travel & Transportation, Shopping & Retail, Bills & Utilities, Entertainment, Health & Fitness, Education, Groceries, Personal Care, Home & Garden, Insurance, Investments, Gifts & Donations, Subscriptions, Other.

Expense: "${description}" - ₹${amount}

Respond ONLY with a JSON object in this exact format:
{
  "category": "Category Name",
  "icon": "emoji for the category",
  "confidence": "high/medium/low"
}

Examples:
- "Zomato dine order 580" → {"category": "Food & Dining", "icon": "🍽️", "confidence": "high"}
- "Uber Cab airport 900" → {"category": "Travel & Transportation", "icon": "🚗", "confidence": "high"}
- "Netflix subscription" → {"category": "Subscriptions", "icon": "📺", "confidence": "high"}`;

    const responseText = await getAICompletion(
      [{ role: "user", content: prompt }],
      { model: GENERAL_MODEL, temperature: 0.3, max_tokens: 150 }
    );
    
    // Try to extract JSON from the response
    let categoryData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        categoryData = JSON.parse(jsonMatch[0]);
      } else {
        categoryData = JSON.parse(responseText);
      }
    } catch (parseError) {
      // Fallback categorization
      categoryData = {
        category: "Other",
        icon: "💰",
        confidence: "low",
      };
    }

    return res.status(200).json({
      success: true,
      category: categoryData.category,
      icon: categoryData.icon,
      confidence: categoryData.confidence,
    });
  } catch (error) {
    console.error("Error categorizing expense:", error);
    
      // Handle specific errors
      if (error.message.includes("Ollama is not running") || error.message.includes("not found")) {
        return res.status(503).json({
          message: error.message,
          error: error.message,
        });
      } else if (error.response) {
        const statusCode = error.response.status;
        const errorCode = error.code;
        
        if (statusCode === 429 || errorCode === 'insufficient_quota') {
          return res.status(503).json({
            message: "AI service quota exceeded.",
            error: "Quota exceeded",
            code: 'insufficient_quota',
          });
        } else if (statusCode === 401 || errorCode === 'invalid_api_key') {
          return res.status(503).json({
            message: "Invalid API key. Please check your API key configuration.",
            error: "Invalid API key",
          });
        }
      }
    
    return res.status(500).json({
      message: "Error categorizing expense",
      error: error.message,
    });
  }
};

// 2. Smart Expense Insights
const getSmartInsights = async (req, res) => {
  try {

    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);

    // Get current month expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthExpenses = await Expense.find({
      userId: userObjectId,
      date: { $gte: startOfMonth },
    });

    const lastMonthExpenses = await Expense.find({
      userId: userObjectId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Calculate statistics
    const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Category-wise spending
    const currentMonthByCategory = {};
    currentMonthExpenses.forEach((exp) => {
      currentMonthByCategory[exp.category] = (currentMonthByCategory[exp.category] || 0) + exp.amount;
    });

    const lastMonthByCategory = {};
    lastMonthExpenses.forEach((exp) => {
      lastMonthByCategory[exp.category] = (lastMonthByCategory[exp.category] || 0) + exp.amount;
    });

    // Get top spending categories
    const topCategories = Object.entries(currentMonthByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    // Calculate percentage changes
    const percentageChange = lastMonthTotal > 0
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

    // Prepare data for AI
    const statsData = {
      currentMonthTotal: currentMonthTotal.toFixed(2),
      lastMonthTotal: lastMonthTotal.toFixed(2),
      percentageChange: percentageChange.toFixed(2),
      topCategories,
      categoryChanges: Object.keys({ ...currentMonthByCategory, ...lastMonthByCategory }).map((cat) => {
        const current = currentMonthByCategory[cat] || 0;
        const last = lastMonthByCategory[cat] || 0;
        const change = last > 0 ? ((current - last) / last) * 100 : 0;
        return {
          category: cat,
          current: current.toFixed(2),
          last: last.toFixed(2),
          change: change.toFixed(2),
        };
      }),
    };

    const prompt = `You are a financial insights assistant. Based on the following expense data, generate 3-5 short, natural language insights (each in one sentence) that are helpful and actionable.

Current Month Total: ₹${statsData.currentMonthTotal}
Last Month Total: ₹${statsData.lastMonthTotal}
Percentage Change: ${statsData.percentageChange}%

Top Spending Categories this month:
${statsData.topCategories.map((c, i) => `${i + 1}. ${c.category}: ₹${c.amount.toFixed(2)}`).join("\n")}

Category-wise Changes:
${statsData.categoryChanges.filter(c => Math.abs(parseFloat(c.change)) > 5).map(c => 
  `${c.category}: ₹${c.current} (${c.change > 0 ? '+' : ''}${c.change}% from last month)`
).join("\n")}

Generate insights in this format (JSON array of strings):
["insight 1", "insight 2", "insight 3"]

Keep insights:
- Short and clear (one sentence each)
- Actionable and helpful
- Focus on significant changes (>10% difference)
- Mention specific categories when relevant
- Be encouraging but realistic`;

    const responseText = await getAICompletion(
      [{ role: "user", content: prompt }],
      { model: GENERAL_MODEL, temperature: 0.7, max_tokens: 300 }
    );
    let insights = [];
    
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = [responseText];
      }
    } catch (parseError) {
      // Fallback insights
      if (percentageChange > 10) {
        insights.push(`Your spending increased by ${Math.abs(percentageChange).toFixed(1)}% this month compared to last month.`);
      } else if (percentageChange < -10) {
        insights.push(`Great! Your spending decreased by ${Math.abs(percentageChange).toFixed(1)}% this month.`);
      }
      if (topCategories.length > 0) {
        insights.push(`Your top spending category this month is ${topCategories[0].category} with ₹${topCategories[0].amount.toFixed(2)}.`);
      }
    }

    return res.status(200).json({
      success: true,
      insights,
      stats: statsData,
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    
      // Handle specific errors
      if (error.message.includes("Ollama is not running") || error.message.includes("not found")) {
        return res.status(503).json({
          message: error.message,
          error: error.message,
        });
      } else if (error.response) {
        const statusCode = error.response.status;
        const errorCode = error.code;
        
        if (statusCode === 429 || errorCode === 'insufficient_quota') {
          return res.status(503).json({
            message: "AI service quota exceeded.",
            error: "Quota exceeded",
            code: 'insufficient_quota',
          });
        } else if (statusCode === 401 || errorCode === 'invalid_api_key') {
          return res.status(503).json({
            message: "Invalid API key. Please check your API key configuration.",
            error: "Invalid API key",
          });
        }
      }
    
    return res.status(500).json({
      message: "Error generating insights",
      error: error.message,
    });
  }
};

// 3. Monthly Report Generation (PDF)
const generateMonthlyReport = async (req, res) => {
  try {

    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);
    const { month, year } = req.query;

    // Determine date range
    const reportMonth = month ? parseInt(month) - 1 : new Date().getMonth();
    const reportYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(reportYear, reportMonth, 1);
    const endDate = new Date(reportYear, reportMonth + 1, 0, 23, 59, 59);

    // Fetch data
    const expenses = await Expense.find({
      userId: userObjectId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    const incomes = await Income.find({
      userId: userObjectId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    // Calculate statistics
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const savings = totalIncome - totalExpenses;

    // Category-wise expenses
    const expensesByCategory = {};
    expenses.forEach((exp) => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    const topExpenseCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Generate AI report content
    const monthName = startDate.toLocaleString("default", { month: "long", year: "numeric" });
    
    const prompt = `You are a financial analyst. Generate a comprehensive monthly financial report for ${monthName}.

Total Income: ₹${totalIncome.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Savings: ₹${savings.toFixed(2)}

Top Expense Categories:
${topExpenseCategories.map(([cat, amount], i) => `${i + 1}. ${cat}: ₹${amount.toFixed(2)}`).join("\n")}

Number of Transactions: ${expenses.length} expenses, ${incomes.length} incomes

Generate a report with the following sections (JSON format):
{
  "summary": "2-3 sentence overview of the month",
  "highestSpendingCategory": "category name and analysis",
  "habitPatterns": "analysis of spending habits (2-3 sentences)",
  "savingTips": ["tip 1", "tip 2", "tip 3"],
  "trendPrediction": "prediction for next month (2-3 sentences)"
}

Be specific, actionable, and professional.`;

    const responseText = await getAICompletion(
      [{ role: "user", content: prompt }],
      { model: GENERAL_MODEL, temperature: 0.7, max_tokens: 500 }
    );
    let reportData;
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON");
      }
    } catch (parseError) {
      // Fallback report
      reportData = {
        summary: `In ${monthName}, you spent ₹${totalExpenses.toFixed(2)} and earned ₹${totalIncome.toFixed(2)}, resulting in ${savings >= 0 ? 'savings' : 'a deficit'} of ₹${Math.abs(savings).toFixed(2)}.`,
        highestSpendingCategory: topExpenseCategories[0] 
          ? `${topExpenseCategories[0][0]} was your highest spending category at ₹${topExpenseCategories[0][1].toFixed(2)}.`
          : "No significant spending patterns detected.",
        habitPatterns: "Review your spending patterns to identify areas for improvement.",
        savingTips: [
          "Track your expenses daily",
          "Set a monthly budget for each category",
          "Review and reduce unnecessary subscriptions",
        ],
        trendPrediction: "Continue monitoring your expenses to maintain financial stability.",
      };
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="financial-report-${monthName.replace(/\s+/g, "-")}.pdf"`
      );
      res.send(pdfBuffer);
    });

    // PDF Content
    doc.fontSize(20).text(`Monthly Financial Report - ${monthName}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text("Summary", { underline: true });
    doc.fontSize(12).text(reportData.summary);
    doc.moveDown();

    doc.fontSize(16).text("Financial Overview", { underline: true });
    doc.fontSize(12);
    doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`);
    doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`);
    doc.text(`Savings: ₹${savings.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(16).text("Highest Spending Category", { underline: true });
    doc.fontSize(12).text(reportData.highestSpendingCategory);
    doc.moveDown();

    doc.fontSize(16).text("Spending Habits Analysis", { underline: true });
    doc.fontSize(12).text(reportData.habitPatterns);
    doc.moveDown();

    doc.fontSize(16).text("Top Expense Categories", { underline: true });
    doc.fontSize(12);
    topExpenseCategories.forEach(([category, amount], index) => {
      doc.text(`${index + 1}. ${category}: ₹${amount.toFixed(2)}`);
    });
    doc.moveDown();

    doc.fontSize(16).text("Saving Tips", { underline: true });
    doc.fontSize(12);
    reportData.savingTips.forEach((tip, index) => {
      doc.text(`${index + 1}. ${tip}`);
    });
    doc.moveDown();

    doc.fontSize(16).text("Trend Prediction", { underline: true });
    doc.fontSize(12).text(reportData.trendPrediction);

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    
      // Handle specific errors
      if (error.message.includes("Ollama is not running") || error.message.includes("not found")) {
        return res.status(503).json({
          message: error.message,
          error: error.message,
        });
      } else if (error.response) {
        const statusCode = error.response.status;
        const errorCode = error.code;
        
        if (statusCode === 429 || errorCode === 'insufficient_quota') {
          return res.status(503).json({
            message: "AI service quota exceeded.",
            error: "Quota exceeded",
            code: 'insufficient_quota',
          });
        } else if (statusCode === 401 || errorCode === 'invalid_api_key') {
          return res.status(503).json({
            message: "Invalid API key. Please check your API key configuration.",
            error: "Invalid API key",
          });
        }
      }
    
    return res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
};

// 4. AI Chat Assistant
const chatWithAI = async (req, res) => {
  try {

    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get user's financial data for context
    const expenses = await Expense.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(50);
    
    const incomes = await Income.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(50);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

    // Category-wise spending
    const expensesByCategory = {};
    expenses.forEach((exp) => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    const topCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amount]) => ({ category: cat, amount }));

    // Recent expenses (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= sevenDaysAgo;
    });
    const recentTotal = recentExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Build context - handle empty data gracefully
    let context = `You are a friendly and helpful financial assistant for a personal expense tracking app. `;
    
    if (expenses.length === 0 && incomes.length === 0) {
      context += `The user doesn't have any financial data yet. Help them get started by explaining how to add expenses and income, and provide general financial advice.`;
    } else {
      context += `Here is the user's financial data:

Total Income: ₹${totalIncome.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}

`;
      
      if (topCategories.length > 0) {
        context += `Top Spending Categories:
${topCategories.map((c, i) => `${i + 1}. ${c.category}: ₹${c.amount.toFixed(2)}`).join("\n")}

`;
      }
      
      if (recentExpenses.length > 0) {
        context += `Recent Expenses (Last 7 days): ₹${recentTotal.toFixed(2)}
Number of recent transactions: ${recentExpenses.length}

Recent transactions:
${recentExpenses.slice(0, 10).map(e => {
          const expenseDate = new Date(e.date);
          return `- ${e.category}: ₹${e.amount.toFixed(2)} on ${expenseDate.toLocaleDateString()}`;
        }).join("\n")}

`;
      }
      
      context += `Answer the user's questions based on this data. Be concise, helpful, and conversational. If the question cannot be answered from the provided data, politely say so and offer general financial advice.`;
    }

    // Build conversation messages
    // Ensure conversation history has correct format
    const formattedHistory = conversationHistory
      .slice(-10) // Last 10 messages for context
      .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content || msg.message || "",
      }))
      .filter((msg) => msg.content.trim().length > 0); // Remove empty messages

    const messages = [
      {
        role: "system",
        content: context,
      },
      ...formattedHistory,
      {
        role: "user",
        content: message,
      },
    ];

    console.log(`Sending request to ${AI_PROVIDER} with messages:`, messages.length, "messages");
    console.log("Message preview:", messages.slice(0, 2).map(m => ({ role: m.role, contentLength: m.content.length })));
    
    const aiResponse = await getAICompletion(
      messages,
      { model: CHAT_MODEL, temperature: 0.7, max_tokens: 500 }
    );

    console.log(`${AI_PROVIDER} response received successfully`);
    
    if (!aiResponse) {
      throw new Error("Empty response from AI service");
    }

    return res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    console.error("Error stack:", error.stack);
    
    // More specific error messages
    if (error.response) {
      // OpenAI API error
      const statusCode = error.response.status;
      const errorData = error.response.data;
      const errorCode = error.code || errorData?.error?.code;
      
      console.error("OpenAI API Error:", statusCode, errorData);
      
      // Handle specific error codes
      if (statusCode === 401 || errorCode === 'invalid_api_key') {
        return res.status(503).json({
          message: "Invalid API key. Please check your OPENAI_API_KEY in .env file and restart the server.",
          error: "Invalid API key",
          code: 'invalid_api_key',
        });
      } else if (statusCode === 429 || errorCode === 'insufficient_quota' || errorCode === 'rate_limit_exceeded') {
        return res.status(503).json({
          message: "OpenAI account has insufficient credits or quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing",
          error: "Quota exceeded",
          code: 'insufficient_quota',
        });
      } else {
        return res.status(500).json({
          message: `OpenAI API error: ${errorData?.error?.message || error.message}`,
          error: errorData,
          code: errorCode,
        });
      }
    } else if (error.request) {
      // Request made but no response
      console.error("No response from OpenAI:", error.request);
      return res.status(500).json({
        message: "No response from AI service. Please check your API key and network connection.",
        error: error.message,
      });
    } else {
      // Other errors
      return res.status(500).json({
        message: `Error processing chat message: ${error.message}`,
        error: error.message,
      });
    }
  }
};

// Check AI Service Status
const checkAIServiceStatus = async (req, res) => {
  try {
    const status = await checkAIService();
    
    if (status.available) {
      // Test with a simple API call
      try {
        const testResponse = await getAICompletion(
          [{ role: "user", content: "Say 'OK' if you can hear me." }],
          { model: CHAT_MODEL, max_tokens: 10 }
        );

        return res.status(200).json({
          available: true,
          provider: status.provider,
          message: "AI service is available and working.",
          testResponse: testResponse,
        });
      } catch (testError) {
        return res.status(503).json({
          available: false,
          provider: status.provider,
          message: `AI service test failed: ${testError.message}`,
          error: testError.message,
          advice: status.provider === "Groq"
            ? "Groq unreachable: check network/DNS or GROQ_API_KEY. Try running the test from the server machine."
            : status.provider === "Ollama"
              ? "Ollama unreachable: ensure `ollama serve` is running locally and OLLAMA_BASE_URL is correct."
              : "Check your API key, network connectivity and provider configuration."
        });
      }
    } else {
      return res.status(503).json({
        available: false,
        provider: status.provider,
        message: status.error || "AI service is not available.",
        error: status.error,
        advice: status.provider === "Groq"
          ? "DNS/Network error contacting api.groq.ai. Try changing DNS or use a VPN/proxy, or switch to OpenAI/Ollama temporarily."
          : status.provider === "Ollama"
            ? "Ensure Ollama is installed and `ollama serve` is running on the server host."
            : "Check provider configuration and API keys.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      available: false,
      message: "Error checking AI service status",
      error: error.message,
    });
  }
};

module.exports = {
  categorizeExpense,
  getSmartInsights,
  generateMonthlyReport,
  chatWithAI,
  checkAIService: checkAIServiceStatus,
};

