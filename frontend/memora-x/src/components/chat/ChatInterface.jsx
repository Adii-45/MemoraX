import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchInitialHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 w-full ${
          isUser ? "justify-end" : ""
        }`}
      >
        {!isUser && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#1E3EDC] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`max-w-xl p-4 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-[#1E3EDC] text-white"
              : "bg-neutral-900 border border-neutral-800 text-neutral-200"
          }`}
        >
          {isUser ? (
            <p className="text-sm">{msg.content}</p>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-200 font-semibold shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] w-full bg-neutral-900 border border-neutral-800 rounded-2xl">
      <div className="flex-1 p-6 pb-20 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-neutral-500">
              Ask something about this document
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {loading && (
          <div className="flex items-center gap-3 my-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-neutral-500">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-neutral-800">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question"
            className="flex-1 h-11 px-4 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:border-neutral-600"
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-xl"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
