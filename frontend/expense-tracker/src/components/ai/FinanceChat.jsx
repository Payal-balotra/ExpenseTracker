import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { Send, MessageCircle, Bot, User } from "lucide-react";

const FinanceChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your financial assistant. Ask me about your spending, expenses, or get financial advice!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [providerName, setProviderName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const messagesEndRef = useRef(null);
  const conversationHistoryRef = useRef([]);

  // Check AI service status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(API_PATHS.AI.STATUS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAiAvailable(!!response.data.available);
        setProviderName(response.data.provider || "");
        setStatusMessage(response.data.message || response.data.testResponse || "");

        if (!response.data.available) {
          setMessages([
            {
              role: "assistant",
              content: response.data.message || "AI service is not available. Please check your backend configuration.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error checking AI status:", error);
        setAiAvailable(false);
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        setProviderName(error.response?.data?.provider || "Unknown");
        setStatusMessage(errorMessage);
        setMessages([
          {
            role: "assistant",
            content: `Unable to check AI service status: ${errorMessage}. Please ensure backend running & AI configured.`,
          },
        ]);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !aiAvailable) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    conversationHistoryRef.current.push(userMessage);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        API_PATHS.AI.CHAT,
        {
          message: userMessage.content,
          conversationHistory: conversationHistoryRef.current.slice(-10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        conversationHistoryRef.current.push(assistantMessage);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error(error.response?.data?.message || error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, AI service failed to respond. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Where did I spend most last month?",
    "Suggest how can I reduce unnecessary expenses",
    "Tell me last week summary in 2 lines",
    "What are my top spending categories?",
    "How much did I save this month?",
  ];

  return (
    <div className="glass-card flex flex-col h-[600px] p-0 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-100 bg-white/40">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
           <h2 className="text-lg font-bold text-slate-800">AI Finance Assistant</h2>
           <p className="text-xs text-slate-500">Ask about your spending & savings</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                message.role === "user" 
                  ? "bg-violet-600 text-white rounded-br-none" 
                  : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center border border-violet-200">
                <User className="w-4 h-4 text-violet-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 rounded-bl-none">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 rounded-full text-slate-600 transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {checkingStatus ? (
        <div className="p-4 border-t border-slate-100 text-center text-slate-400 text-xs">
          Checking AI service status...
        </div>
      ) : !aiAvailable ? (
        <div className="p-4 border-t border-slate-100 bg-amber-50">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <strong>AI Unavailable{providerName ? ` (${providerName})` : ""}:</strong>
          </p>
          <div className="mt-1 text-xs text-amber-700 pl-6">{statusMessage}</div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white/40">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 placeholder-slate-400 text-sm shadow-sm"
              disabled={loading || !aiAvailable}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !aiAvailable}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-200 active:scale-95 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FinanceChat;
