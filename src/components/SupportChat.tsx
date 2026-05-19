import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, Send, X, Mic, Image, 
  Video, Phone, Languages, User, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: Date;
  translated?: string;
}

export function SupportChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'admin', 
      text: 'chat.welcome', 
      timestamp: new Date() 
    }
  ]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, newUserMsg]);
    setInputValue('');

    // Simulate Admin Response
    setTimeout(() => {
      const adminMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        text: 'chat.admin_typing',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, adminMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "premium-card mb-4 min-w-[350px] md:w-[450px] h-[60vh] flex flex-col shadow-2xl overflow-hidden",
              "border-tiffany-blue/30"
            )}
          >
            {/* Header */}
            <div className="bg-tiffany-blue p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-tiffany-blue rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">{t('chat.header')}</h3>
                  <p className="text-[10px] mt-1 opacity-80">{t('chat.admin_online')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><Video size={18} /></button>
                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><Phone size={18} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-bg-primary/30">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl shadow-sm relative group",
                    msg.sender === 'user' 
                      ? "bg-button-primary text-white rounded-tr-none" 
                      : "bg-bg-card border border-border-soft rounded-tl-none text-text-primary"
                  )}>
                    <p className="text-sm">{msg.sender === 'admin' ? t(msg.text) : msg.text}</p>
                    {autoTranslate && (
                      <div className="mt-2 pt-2 border-t border-white/10 opacity-70 italic text-[11px] flex items-center gap-1">
                        <Languages size={12} />
                        {t('chat.trans_translated')}
                      </div>
                    )}
                    <span className="text-[9px] block mt-1 opacity-50 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls & Input */}
            <div className="p-4 bg-bg-card border-t border-border-soft shrink-0">
               <div className="flex items-center gap-2 mb-3">
                 <button 
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors",
                    autoTranslate ? "bg-tiffany-blue text-white" : "bg-bg-secondary text-text-muted"
                  )}
                 >
                   <Languages size={12} /> {t('chat.auto_translate')}
                 </button>
               </div>
               <div className="flex items-center gap-2 bg-bg-secondary rounded-full px-4 py-2">
                 <button className="text-text-muted hover:text-tiffany-blue"><Mic size={20} /></button>
                 <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-text-primary"
                 />
                 <button className="text-text-muted hover:text-tiffany-blue"><Image size={20} /></button>
                 <button 
                  onClick={handleSend}
                  className="w-8 h-8 rounded-full bg-tiffany-blue flex items-center justify-center text-white"
                 >
                   <Send size={16} />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-tiffany-blue shadow-lg flex items-center justify-center text-white"
      >
        <MessageSquare size={32} />
      </motion.button>
    </div>
  );
}
