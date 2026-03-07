import { useState } from "react";
import { generateAI } from "../api/aiApi";

function QA() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!input.trim()) return;

    const question = input;

    const userMessage = {
      sender: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const res = await generateAI(question);

      const aiMessage = {
        sender: "ai",
        text: res.answer || res.response || "No response from AI."
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "AI service unavailable." }
      ]);

    }

    setLoading(false);
  };

  return (

    <div className="flex flex-col h-full">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >

            <span
              className={`inline-block px-4 py-2 rounded-lg ${msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                }`}
            >
              {msg.text}
            </span>

          </div>

        ))}

        {loading && (
          <div className="text-left text-gray-500">
            AI is thinking...
          </div>
        )}

      </div>

      {/* Input Box */}
      <div className="flex border-t p-3">

        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          placeholder="Ask about inverter health..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default QA;