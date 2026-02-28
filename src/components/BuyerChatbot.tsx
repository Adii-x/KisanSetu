import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
    id: string;
    sender: 'user' | 'bot';
    /** Plain text or step-list */
    text: string | string[];
    timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent Detection — buyer only
// ─────────────────────────────────────────────────────────────────────────────

const detectBuyerIntent = (message: string): string | string[] => {
    const q = message.toLowerCase().trim();

    // ── Greetings ──────────────────────────────────────────────────────────────
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste'))
        return [
            'Hello 👋',
            "I'm your Smart Krishi Shopping Assistant.",
            'You can ask me about buying products, tracking orders, or using the marketplace.',
        ];

    // ── Help ───────────────────────────────────────────────────────────────────
    if (q.includes('help'))
        return [
            'You can ask me:',
            '• How to buy a product?',
            '• How to track my order?',
            '• How to use cart?',
            '• How to check prices?',
        ];

    // ── Order tracking (check before plain "order") ────────────────────────────
    if (
        q.includes('order status') ||
        q.includes('track order') ||
        q.includes('track my order') ||
        q.includes('where is my order')
    )
        return [
            'To track your order:',
            '1️⃣ Click on "My Orders" in the Buyer Sidebar.',
            '2️⃣ Select the order you want to track.',
            '3️⃣ View the status badge.',
            '4️⃣ Check the progress bar for the delivery stage.',
        ];

    // ── Orders ─────────────────────────────────────────────────────────────────
    if (q.includes('order') || q.includes('my orders') || q.includes('my order'))
        return [
            'To view your orders:',
            '1️⃣ Click on "My Orders" in the Buyer Sidebar.',
            '2️⃣ You will see a list of all placed orders.',
            '3️⃣ Click any order to view its full details and status.',
        ];

    // ── Buy / Purchase ─────────────────────────────────────────────────────────
    if (q.includes('buy') || q.includes('purchase') || q.includes('how to order'))
        return [
            "Here's how you can purchase a product:",
            '1️⃣ Go to the Buyer Sidebar.',
            '2️⃣ Click on "Marketplace".',
            '3️⃣ Browse available products.',
            '4️⃣ Click on a product card to view details.',
            '5️⃣ Click "Add to Cart".',
            '6️⃣ Go to the "Cart" section.',
            '7️⃣ Click "Checkout" to complete your order.',
        ];

    // ── Cart ───────────────────────────────────────────────────────────────────
    if (q.includes('cart') || q.includes('checkout') || q.includes('basket'))
        return [
            'To manage your cart:',
            '1️⃣ Click on "Cart" in the Buyer Sidebar.',
            '2️⃣ Review your selected products.',
            '3️⃣ You can remove items if needed.',
            '4️⃣ Click "Checkout" to place your order.',
        ];

    // ── Marketplace ────────────────────────────────────────────────────────────
    if (q.includes('marketplace') || q.includes('market') || q.includes('browse') || q.includes('shop'))
        return [
            'To explore products:',
            '1️⃣ Click on "Marketplace" in the Buyer Sidebar.',
            '2️⃣ Browse products in grid view.',
            '3️⃣ Use filters to sort by price or category.',
            '4️⃣ Click a product card for full details.',
        ];

    // ── Price ──────────────────────────────────────────────────────────────────
    if (q.includes('price') || q.includes('cost') || q.includes('how much'))
        return [
            'To check product prices:',
            '1️⃣ Go to Marketplace in the Buyer Sidebar.',
            '2️⃣ Each product card shows the price clearly.',
            '3️⃣ Compare multiple products before purchasing.',
        ];

    // ── Payment ────────────────────────────────────────────────────────────────
    if (q.includes('payment') || q.includes('pay') || q.includes('upi') || q.includes('cash'))
        return [
            'To complete payment:',
            '1️⃣ Go to "Cart" in the Buyer Sidebar.',
            '2️⃣ Click "Checkout".',
            '3️⃣ Select your preferred payment method.',
            '4️⃣ Confirm your order.',
        ];

    // ── Delivery / Shipping ────────────────────────────────────────────────────
    if (q.includes('deliver') || q.includes('shipping') || q.includes('dispatch'))
        return [
            'To check delivery information:',
            '1️⃣ Delivery details are shown on each product listing.',
            '2️⃣ After placing an order, track it under "My Orders".',
            '3️⃣ The status badge shows Pending → Shipped → Delivered.',
        ];

    // ── Dashboard ──────────────────────────────────────────────────────────────
    if (q.includes('dashboard') || q.includes('home'))
        return [
            'Your Dashboard shows:',
            '• A summary of recent orders',
            '• Quick links to Marketplace and Cart',
            '• Click "Dashboard" in the Sidebar to access it.',
        ];

    // ── Contact ────────────────────────────────────────────────────────────────
    if (q.includes('contact') || q.includes('support'))
        return 'For support, please contact admin@smartkrishi.com 📧';

    // ── Fallback ───────────────────────────────────────────────────────────────
    return [
        "I didn't quite understand that.",
        'Please ask about buying, cart, orders, payments, or marketplace.',
    ];
};

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble
// ─────────────────────────────────────────────────────────────────────────────

const MessageBubble = ({ msg }: { msg: Message }) => {
    const isBot = msg.sender === 'bot';
    const lines = Array.isArray(msg.text) ? msg.text : [msg.text];
    const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex gap-2 items-end ${isBot ? '' : 'flex-row-reverse'}`}
        >
            {/* Avatar */}
            <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${isBot ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-700 text-white'
                    }`}
            >
                {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-0.5 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
                <div
                    className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot
                        ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                        : 'bg-emerald-700 text-white rounded-br-none'
                        }`}
                >
                    {lines.length === 1 ? (
                        <p>{lines[0]}</p>
                    ) : (
                        <div className="space-y-1">
                            {lines.map((line, i) => (
                                <p key={i} className={i === 0 ? 'font-semibold text-emerald-800' : ''}>
                                    {isBot && i === 0 && lines.length > 1 ? line : line}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{time}</span>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// BuyerChatbot Component
// ─────────────────────────────────────────────────────────────────────────────

const WELCOME: string[] = [
    'Hello! 👋 Welcome to Smart Krishi.',
    "I'm your personal Shopping Assistant.",
    'Ask me about the Marketplace, Cart, Orders, or Payments.',
];

const BuyerChatbot = () => {
    const [ready, setReady] = useState(false); // true only when role === 'buyer'
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', sender: 'bot', text: WELCOME, timestamp: new Date() },
    ]);

    const bottomRef = useRef<HTMLDivElement>(null);

    // ── Auth + role check ──────────────────────────────────────────────────────
    useEffect(() => {
        const check = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData.user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profile?.role === 'buyer') setReady(true);
        };
        void check();

        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!session) setReady(false);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    // ── Auto scroll ────────────────────────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // ── Message send ───────────────────────────────────────────────────────────
    const send = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setMessages(prev => [
            ...prev,
            { id: `u-${Date.now()}`, sender: 'user', text: trimmed, timestamp: new Date() },
        ]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = detectBuyerIntent(trimmed);
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                { id: `b-${Date.now()}`, sender: 'bot', text: response, timestamp: new Date() },
            ]);
        }, 600);
    };

    const clearChat = () =>
        setMessages([{ id: `w-${Date.now()}`, sender: 'bot', text: WELCOME, timestamp: new Date() }]);

    // Only render for authenticated buyers
    if (!ready) return null;

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setOpen(v => !v)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-700 text-white shadow-xl flex items-center justify-center"
                aria-label={open ? 'Close chat' : 'Open chat'}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="x"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.13 }}
                        >
                            <X className="h-6 w-6" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.13 }}
                        >
                            <MessageCircle className="h-6 w-6" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 28, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            width: '22rem',
                            maxHeight: '530px',
                            background: '#f6f9f5',
                            border: '1px solid #c8e6c9',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-emerald-700 text-white shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm leading-snug">Shopping Assistant</p>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                                        <span className="text-[11px] opacity-75">Online</span>
                                    </div>
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
                        <div
                            className="flex-1 overflow-y-auto p-3 space-y-3"
                            style={{ minHeight: '300px' }}
                        >
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-2 items-end"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                            <Bot className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
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

                        {/* Input */}
                        <div className="shrink-0 border-t border-green-100 bg-white/80 px-3 py-2.5 flex items-center gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && send(input)}
                                placeholder="Ask me anything…"
                                className="flex-1 bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-400 transition"
                            />
                            <button
                                onClick={() => send(input)}
                                disabled={!input.trim()}
                                className="p-2 rounded-xl bg-emerald-700 text-white disabled:opacity-40 hover:bg-emerald-800 transition shrink-0"
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

export default BuyerChatbot;
