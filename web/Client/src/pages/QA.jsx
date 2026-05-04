import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { generateAI } from "../api/aiApi";

// Typing Animation Component
const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-slate-500 text-sm ml-2">AI is thinking...</span>
    </div>
  );
};

function QA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      sender: "user",
      text: question,
      timestamp: timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await generateAI(question);
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const aiMessage = {
        sender: "ai",
        text: res.answer || res.response || "No response from AI.",
        timestamp: aiTimestamp
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I'm having trouble connecting to the AI service. Please try again.",
          timestamp: errorTimestamp
        }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">AI Assistant</h1>
            <p className="text-sm text-slate-500">Ask me anything about your inverters</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden pb-20">
        <div className="h-full px-4 py-3 space-y-3">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-linear-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Welcome to AI Assistant</h2>
              <p className="text-slate-500 max-w-md">
                Ask me questions about inverter health, performance metrics, or get insights about your solar power system.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                <div className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <p className="text-sm text-slate-600">💡 "What's the health status of inverter 001?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <p className="text-sm text-slate-600">📊 "Show me performance trends"</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  msg.sender === "user"
                    ? "bg-linear-to-r from-blue-500 to-blue-600"
                    : "bg-linear-to-r from-purple-500 to-purple-600"
                }`}>
                  {msg.sender === "user" ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="chat-header text-xs text-slate-500 mb-1">
                {msg.sender === "user" ? "You" : "AI Assistant"}
                <time className="ml-2">{msg.timestamp}</time>
              </div>
              <div className={`chat-bubble ${
                msg.sender === "user"
                  ? "chat-bubble-primary bg-linear-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-800 shadow-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-6 h-6 bg-linear-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="chat-header text-xs text-slate-500 mb-1">
                AI Assistant
              </div>
              <div className="chat-bubble bg-white border border-slate-200 shadow-sm">
                <TypingAnimation />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <textarea
                ref={inputRef}
                className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2.5 pr-14 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-9 max-h-24"
                value={input}
                placeholder="Ask about inverter health, performance, or get insights..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                style={{ height: 'auto', minHeight: '36px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 bottom-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

export default QA;