/* ============================================================
   Chat Page – real-time messaging interface
   WhatsApp-inspired dark glassmorphism chat with conversation
   sidebar, message bubbles, and local-state message sending.
   ============================================================ */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiMoreVertical, FiPhone, FiVideo,
  FiChevronLeft, FiWifi, FiSearch,
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import GlassCard from '../components/GlassCard';
import { chatMessages as initialMessages, mySessions } from '../data/mockData';
import { fadeInUp } from '../utils/helpers';

/* Mock conversation list from sessions */
const conversations = mySessions.map((s) => ({
  id: s.id,
  name: s.seller,
  avatar: s.seller.split(' ').map((w) => w[0]).join(''),
  lastMessage: s.id === 1
    ? 'Share your code snippet and I\'ll help you fix it...'
    : s.id === 2
      ? 'Great session! Let me know if you need more help.'
      : 'Thanks for the session, it was really helpful!',
  time: s.id === 1 ? '7:04 PM' : s.id === 2 ? 'Yesterday' : '3 days ago',
  unread: s.id === 1 ? 2 : 0,
  online: s.id === 1,
  skill: s.skill,
}));

const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
];

const Chat = () => {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'buyer',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInput('');
  };

  const handleConvoSelect = (convo) => {
    setActiveConvo(convo);
    setShowMobileSidebar(false);
    /* Reset to default messages for demo */
    if (convo.id === 1) {
      setMessages(initialMessages);
    } else {
      setMessages([
        {
          id: 1,
          sender: 'seller',
          text: `Hey! Thanks for booking the ${convo.skill} session. Looking forward to it!`,
          time: '5:00 PM',
        },
        {
          id: 2,
          sender: 'buyer',
          text: 'Thanks! I have a few questions prepared already.',
          time: '5:02 PM',
        },
      ]);
    }
  };

  return (
    <PageTransition>
      <section className="section-padding pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
              Messages
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-green-400 font-medium">
              <FiWifi className="w-3 h-3" />
              Real-time via Socket.io
            </div>
          </motion.div>

          {/* Chat container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl overflow-hidden"
            style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
          >
            <div className="flex h-full">
              {/* ── Sidebar: conversation list ──────────── */}
              <div
                className={`${
                  showMobileSidebar ? 'flex' : 'hidden'
                } md:flex flex-col w-full md:w-80 border-r border-white/5 h-full`}
              >
                {/* Sidebar header */}
                <div className="p-4 border-b border-white/5">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((convo, i) => (
                    <motion.button
                      key={convo.id}
                      onClick={() => handleConvoSelect(convo)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-full flex items-center gap-3 p-4 transition-all cursor-pointer text-left ${
                        activeConvo.id === convo.id
                          ? 'bg-purple-500/10 border-r-2 border-purple-500'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                          {convo.avatar}
                        </div>
                        {convo.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0a0015]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-semibold truncate">
                            {convo.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                            {convo.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-400 truncate pr-2">
                            {convo.lastMessage}
                          </p>
                          {convo.unread > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full animated-gradient flex items-center justify-center text-[10px] text-white font-bold">
                              {convo.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── Chat window ─────────────────────────── */}
              <div
                className={`${
                  showMobileSidebar ? 'hidden' : 'flex'
                } md:flex flex-col flex-1 h-full`}
              >
                {/* Chat header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setShowMobileSidebar(true)}
                      className="md:hidden text-gray-400 hover:text-white cursor-pointer"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>

                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[conversations.indexOf(activeConvo) % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                      {activeConvo.avatar}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold">
                        {activeConvo.name}
                      </h4>
                      <p className="text-[10px] text-green-400">
                        {activeConvo.online ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <FiPhone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <FiVideo className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                  {/* Date separator */}
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] text-gray-500 px-3 py-1 rounded-full bg-white/5">
                      Today
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'buyer'
                              ? 'animated-gradient text-white rounded-br-md'
                              : 'glass text-gray-200 rounded-bl-md'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={`text-[10px] mt-1.5 ${
                              msg.sender === 'buyer' ? 'text-white/60' : 'text-gray-500'
                            } text-right`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-white/5 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim()}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      input.trim()
                        ? 'animated-gradient text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiSend className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Chat;
