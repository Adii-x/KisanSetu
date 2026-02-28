import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import VoiceAssistant from './VoiceAssistant';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Role = 'farmer' | 'buyer' | null;

interface Message {
  id: string;
  sender: 'user' | 'bot';
  /** plain text OR an array of step strings for guided responses */
  text: string | string[];
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent Detection — returns string (plain) or string[] (step-by-step)
// ─────────────────────────────────────────────────────────────────────────────

const detectIntent = (message: string, role: Role): string | string[] => {
  const q = message.toLowerCase().trim();

  // ── General ─────────────────────────────────────────────────────────────────
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste'))
    return [
      'Hello 👋',
      'I am your Smart Krishi Assistant.',
      'You can ask me about products, orders, analytics, or platform features.',
    ];

  if (q.includes('help'))
    return [
      'Here are some things you can ask:',
      '• How to add product?',
      '• How to check orders?',
      '• How to view analytics?',
      '• How to buy products?',
      '• How to track order?',
    ];

  if (q.includes('contact'))
    return 'For support, please contact admin@smartkrishi.com 📧';

  // ── Farmer ───────────────────────────────────────────────────────────────────
  if (role === 'farmer') {
    if (
      q.includes('add product') ||
      q.includes('upload product') ||
      q.includes('new product') ||
      q.includes('list product')
    )
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Products".',
        '3️⃣ Click the "Add Product" button on the top right.',
        '4️⃣ Fill in product name, price, and details.',
        '5️⃣ Click Submit.',
        '✅ Your product will appear in the Products list immediately.',
      ];

    if (q.includes('order detail') || q.includes('orders') || q.includes('my order'))
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Orders".',
        '3️⃣ You will see all recent orders.',
        '4️⃣ Click any order to view details.',
        '5️⃣ Use the status selector to update order progress.',
      ];

    if (q.includes('analytic') || q.includes('sales report') || q.includes('sales') || q.includes('report'))
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Analytics".',
        '3️⃣ You will see revenue charts and monthly performance.',
        '4️⃣ Review growth percentage and top-selling products.',
      ];

    if (q.includes('community'))
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Community".',
        '3️⃣ Browse posts from other farmers.',
        '4️⃣ Click "Create Post" to share your own experience.',
      ];

    if (q.includes('payment') || q.includes('pay') || q.includes('revenue'))
      return [
        '1️⃣ Go to the Farmer Dashboard.',
        '2️⃣ Check the Revenue section.',
        '3️⃣ Payments are calculated automatically from completed orders.',
      ];

    if (q.includes('product'))
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Products".',
        '3️⃣ Here you can view, edit, or remove your product listings.',
        '4️⃣ To add a new product, click "Add Product" at the top right.',
      ];

    if (q.includes('price') || q.includes('rate') || q.includes('cost'))
      return [
        '1️⃣ Go to the Farmer Sidebar.',
        '2️⃣ Click on "Products".',
        '3️⃣ Open the product you want to update.',
        '4️⃣ Edit the price field and click Save.',
      ];
  }

  // ── Buyer ─────────────────────────────────────────────────────────────────────
  if (role === 'buyer') {
    if (q.includes('order status') || q.includes('track order') || q.includes('track my'))
      return [
        '1️⃣ Go to the Buyer Sidebar.',
        '2️⃣ Click on "My Orders".',
        '3️⃣ Select the order you want to track.',
        '4️⃣ Check the status badge and progress bar.',
      ];

    if (q.includes('order') || q.includes('my order'))
      return [
        '1️⃣ Go to the Buyer Sidebar.',
        '2️⃣ Click on "My Orders".',
        '3️⃣ Here you will see all your placed orders.',
        '4️⃣ Click on any order to see full details.',
      ];

    if (
      q.includes('buy') ||
      q.includes('purchase') ||
      q.includes('shop') ||
      q.includes('browse') ||
      q.includes('marketplace') ||
      q.includes('market')
    )
      return [
        '1️⃣ Go to the Buyer Sidebar.',
        '2️⃣ Click on "Marketplace".',
        '3️⃣ Browse available products.',
        '4️⃣ Click on a product card.',
        '5️⃣ Click "Add to Cart".',
        '6️⃣ Go to Cart to complete checkout.',
      ];

    if (q.includes('cart') || q.includes('checkout') || q.includes('basket'))
      return [
        '1️⃣ Go to the Buyer Sidebar.',
        '2️⃣ Click on "Cart".',
        '3️⃣ Review your selected products.',
        '4️⃣ Click Checkout to place your order.',
      ];

    if (q.includes('price') || q.includes('cost') || q.includes('how much'))
      return [
        '1️⃣ Go to Marketplace.',
        '2️⃣ Each product card shows the price clearly.',
        '3️⃣ You can compare products before adding to cart.',
      ];

    if (q.includes('product'))
      return [
        '1️⃣ Go to the Buyer Sidebar.',
        '2️⃣ Click on "Marketplace".',
        '3️⃣ Browse all available products from farmers.',
        '4️⃣ Use filters to find what you need.',
      ];

    if (q.includes('wish') || q.includes('favourite') || q.includes('favorite') || q.includes('save'))
      return [
        '1️⃣ Go to Marketplace.',
        '2️⃣ Click the ❤️ icon on any product card.',
        '3️⃣ Find all saved products under "Wishlist" in the Sidebar.',
      ];

    if (q.includes('deliver') || q.includes('shipping'))
      return [
        '1️⃣ Delivery details are shown on each product listing.',
        '2️⃣ After placing an order, track it under "My Orders".',
      ];
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  return [
    "I'm not sure I understood that.",
    'Please try asking about products, orders, analytics, or marketplace.',
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// Welcome message per role
// ─────────────────────────────────────────────────────────────────────────────

const getWelcome = (role: Role): string[] => {
  if (role === 'farmer')
    return [
      'Hello Farmer! 🌾',
      'I am your Smart Krishi Assistant.',
      'Ask me about adding products, viewing orders, analytics, payments, or your farming community.',
    ];
  if (role === 'buyer')
    return [
      'Hello! 🛒',
      'I am your Smart Krishi Assistant.',
      'Ask me about buying products, cart, order status, or pricing in the Marketplace.',
    ];
  return ['Hello! 👋', 'I am your Smart Krishi Assistant.', 'How can I help you today?'];
};

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — renders plain string OR step-by-step list
// ─────────────────────────────────────────────────────────────────────────────

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isBot = msg.sender === 'bot';
  const lines = Array.isArray(msg.text) ? msg.text : [msg.text];
  const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 items-end ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isBot
            ? 'bg-green-100 text-green-700'
            : 'bg-emerald-700 text-white'
          }`}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-0.5 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot
              ? 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
              : 'bg-emerald-700 text-white rounded-br-none'
            }`}
        >
          {lines.length === 1 ? (
            <span>{lines[0]}</span>
          ) : (
            <ul className="space-y-1">
              {lines.map((line, i) => (
                <li key={i} className={i === 0 ? 'font-medium' : ''}>
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{time}</span>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Chatbot Component
// ─────────────────────────────────────────────────────────────────────────────

const Chatbot = () => {
  const [role, setRole] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Auth + Profile fetch ───────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      setIsAuthenticated(true);

      // Fetch role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const fetchedRole: Role =
        profile?.role === 'farmer' ? 'farmer' : profile?.role === 'buyer' ? 'buyer' : null;

      setRole(fetchedRole);
      setAuthChecked(true);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsAuthenticated(false);
        setRole(null);
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Set welcome message once role is known ─────────────────────────────────
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: getWelcome(role),
        timestamp: new Date(),
      },
    ]);
  }, [role, authChecked, isAuthenticated]);

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Send logic ─────────────────────────────────────────────────────────────
  const handleSendText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = detectIntent(trimmed, role);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: response,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  };

  const handleSend = () => handleSendText(input);

  const clearChat = () =>
    setMessages([
      {
        id: `clear-${Date.now()}`,
        sender: 'bot',
        text: getWelcome(role),
        timestamp: new Date(),
      },
    ]);

  // Hide if not logged in
  if (!authChecked || !isAuthenticated) return null;

  return (
    <>
      {/* ── Floating Button ─────────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-700 text-white shadow-xl flex items-center justify-center"
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: '22rem',
              maxHeight: '520px',
              background: '#f7f9f5',
              border: '1px solid #d1ead4',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-700 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Smart Krishi Assistant</p>
                  <p className="text-[11px] opacity-70 capitalize">
                    {role ? `${role} mode` : 'Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: '300px' }}>
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-end"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-600"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="shrink-0 border-t border-green-100 bg-white/80 px-3 py-2.5 flex items-center gap-2">
              <VoiceAssistant mode="chat" onTranscript={handleSendText} />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message…"
                className="flex-1 bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-400 transition"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-emerald-700 text-white disabled:opacity-40 transition-opacity shrink-0 hover:bg-emerald-800"
                aria-label="Send"
              >
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
