import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface TeacherChatProps {
  subject: string;
  gradeLevel: string;
}

const SAMPLE_PROMPTS = [
  "Can you explain Newton's second law with an intuitive analogy?",
  "How do I factor quadratic equations like $x^2 + 5x + 6 = 0$?",
  "What is the difference between mitosis and meiosis?",
  "Explain how recursion works in computer science with a simple example.",
];

export const TeacherChat: React.FC<TeacherChatProps> = ({ subject, gradeLevel }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **Professor Maya**, your AI tutor for **${subject}** (${gradeLevel}). What concept or problem would you like to explore together today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutoringStyle, setTutoringStyle] = useState<'Socratic & Interactive' | 'Direct & Detailed' | 'Simplified & Intuitive'>('Socratic & Interactive');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/teacher/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          subject,
          gradeLevel,
          style: tutoringStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get teacher response');

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Sorry, I encountered an issue: ${err.message || 'Unable to connect to teacher service.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const cleanText = text.replace(/[\$#\*`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto px-4 py-4">
      {/* Settings bar */}
      <div className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-2.5 mb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Teaching Approach:</span>
          <select
            value={tutoringStyle}
            onChange={(e: any) => setTutoringStyle(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="Socratic & Interactive">Socratic (Guided Questions)</option>
            <option value="Direct & Detailed">Direct Step-by-Step Explanation</option>
            <option value="Simplified & Intuitive">Simplified & Analogies</option>
          </select>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Session restarted! How can I assist you in **${subject}**?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Session
        </button>
      </div>

      {/* Messages area */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold shadow-md ${
                m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-4 shadow-lg ${
                m.role === 'user'
                  ? 'bg-indigo-600/90 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-slate-400 border-b border-slate-700/30 pb-1">
                <span className="font-semibold text-slate-300">{m.role === 'user' ? 'You' : 'Professor Maya'}</span>
                <div className="flex items-center gap-2">
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeak(m.content)}
                      className="text-slate-400 hover:text-indigo-300 transition-colors"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              <MathRenderer content={m.content} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-100"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-300 animate-bounce delay-200"></span>
              <span>Thinking and structuring concept...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length < 3 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-slate-800/60 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 rounded-lg px-3 py-1.5 transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-2 shadow-xl flex items-center gap-2">
        <textarea
          id="chat-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask Professor Maya anything about ${subject}...`}
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-sm px-3 py-2 outline-none resize-none max-h-24"
        />
        <button
          id="btn-send-message"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
