import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import API from "../services/api";
import { useLocation } from "react-router-dom";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello Detective! I am your Neural Guide Socratic AI Tutor.\n\nAsk me anything about:\n• 🎓 CSE Core Courses (DBMS, OS, CN, COA, OOPs, TOC, System Design)\n• 💻 25-Set DSA Roadmap & LeetCode Coding Arena\n• 🧠 Ebbinghaus Neural Decay & Retention Quizzes\n• 📜 Verifiable Certificates\n• 🌿 Focus Room Wellness" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      let contextTitle = "General Inquiry";
      let contextDescription = "User is exploring the platform.";
      
      if (location.pathname.startsWith('/coding/')) {
        contextTitle = "Coding Problem";
        contextDescription = "User is solving algorithmic problem in Coding Arena.";
      } else if (location.pathname.startsWith('/core-subjects/')) {
        contextTitle = "CSE Core Academy";
        contextDescription = "User is studying 25-set accredited CSE subject.";
      } else if (location.pathname === '/decay') {
        contextTitle = "Neural Decay Engine";
        contextDescription = "User is reviewing memory forgetting curve telemetry.";
      }

      const res = await API.post("/chat", {
        problemTitle: contextTitle,
        problemDescription: contextDescription,
        contextMessage: userMessage
      });

      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: "• Connection recalibrating.\n• Please ask any technical or platform question again!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render bold markdown and bullet formatting
  const renderFormattedMessage = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Process **bold** within line
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-black text-[var(--accent-primary)]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-${isOpen ? '[400px]' : '6'} z-50 bg-[var(--accent-primary)] hover:opacity-90 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] transition-all ease-out duration-300 transform hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Open AI Neural Guide"
      >
        <MessageSquare size={24} fill="currentColor" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-[600px] max-h-[100vh] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-20 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--accent-glow)] rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="bg-[var(--accent-primary)] w-10 h-10 rounded-2xl flex items-center justify-center text-white relative shadow-sm">
              <Bot size={20} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[var(--bg-secondary)] rounded-full"></div>
            </div>
            <div>
              <h3 className="pro-text-main font-black tracking-wide flex items-center text-sm">
                Neural Guide <Sparkles size={14} className="text-amber-400 ml-1.5" />
              </h3>
              <p className="pro-text-muted text-[11px] font-medium">Socratic AI & CSE Knowledge Engine</p>
            </div>
          </div>
          <button onClick={toggleChat} className="p-1.5 rounded-xl hover:bg-[var(--bg-card)] pro-text-muted hover:pro-text-main transition">
            <X size={18} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-[var(--accent-primary)] text-white font-medium rounded-tr-xs shadow-md' 
                  : 'bg-[var(--bg-card)] pro-text-main border border-[var(--border-color)] rounded-tl-xs space-y-1'
              }`}>
                {renderFormattedMessage(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3.5 text-xs pro-text-muted flex items-center shadow-xs">
                <Loader2 size={15} className="animate-spin text-[var(--accent-primary)] mr-2" />
                <span>Consulting Neural Knowledge Matrix...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-3.5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-b-3xl">
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl pl-4 pr-12 py-3 text-xs pro-text-main placeholder:pro-text-muted focus:outline-none focus:border-[var(--accent-primary)] transition-colors shadow-inner"
              placeholder="Ask about DBMS, OS, DSA, Networks, Decay..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[var(--accent-primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-40 transition shadow-xs"
            >
              <Send size={13} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
