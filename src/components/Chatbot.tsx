import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const Chatbot = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: t('chatbot.greeting'), isBot: true },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ id: '0', text: t('chatbot.greeting'), isBot: true }]);
  }, [t]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.match(/price|cost|rate|मूल्य|भाव|किंमत/)) return t('chatbot.pricing');
    if (lower.match(/deliver|ship|dispatch|डिलीवरी|वितरण/)) return t('chatbot.delivery');
    if (lower.match(/pay|payment|razorpay|भुगतान|पेमेंट/)) return t('chatbot.payment');
    if (lower.match(/sell|list|add product|बेच|विक/)) return t('chatbot.sell');
    if (lower.match(/scheme|government|सरकार|योजना/)) return t('chatbot.schemes');
    if (lower.match(/support|help|contact|सहायता|मदद/)) return t('chatbot.support');
    return t('chatbot.fallback');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    const response = getResponse(input);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response, isBot: true }]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center glow-pulse"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[450px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ background: 'rgba(245, 247, 242, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold text-sm">{t('chatbot.title')}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[250px]">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.isBot ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {msg.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.isBot
                      ? 'bg-muted text-foreground rounded-tl-none'
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-muted/50 text-foreground text-sm px-3 py-2 rounded-xl border-none outline-none placeholder:text-muted-foreground"
              />
              <button onClick={handleSend} className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
