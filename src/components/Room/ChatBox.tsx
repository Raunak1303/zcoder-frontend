'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  messages: { user: any; message: string }[];
  onSend: (msg: string) => void;
}

const ChatBox: FC<ChatBoxProps> = ({ messages, onSend }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col bg-zinc-900 rounded-xl shadow-lg border border-zinc-700 h-full max-h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 tracking-wide animate-pulse">
          💬 Live Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-sm text-indigo-400 font-semibold">
              {msg.user?.username || 'Anonymous'}
            </span>
            <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg max-w-[85%] w-fit shadow border border-zinc-700">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-700 flex items-center gap-2">
        <Input
          className="flex-1 bg-black border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition-transform"
          onClick={handleSend}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
