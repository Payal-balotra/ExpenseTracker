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
    <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: "600px" }}>
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <MessageCircle className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-bold text-gray-800">AI Finance Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-green-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {checkingStatus ? (
        <div className="p-4 border-t border-gray-200 text-center text-gray-500">
          Checking AI service status...
        </div>
      ) : !aiAvailable ? (
        <div className="p-4 border-t border-gray-200 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            <strong>AI Service Unavailable{providerName ? ` (${providerName})` : ""}:</strong>
          </p>
          <div className="mt-2 text-sm text-yellow-900">{statusMessage}</div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading || !aiAvailable}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !aiAvailable}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
