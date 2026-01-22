import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Check
} from 'lucide-react';

// --- BetTicket Component ---
const BetTicket = ({ onConfirm }: { onConfirm: () => void }) => {
  const x = useMotionValue(0);
  const xInput = [0, 200];
  const background = useTransform(x, xInput, [
    "linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)",
    "linear-gradient(90deg, #22c55e 0%, #22c55e 100%)"
  ]);
  const color = useTransform(x, xInput, ["#6b7280", "#ffffff"]);
  const textOpacity = useTransform(x, [0, 150], [1, 0]);
  const [confirmed, setConfirmed] = useState(false);

  const handleDragEnd = () => {
    if (x.get() > 150) {
        setConfirmed(true);
        onConfirm();
    } else {
        // Reset animation handled by dragConstraints
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute bottom-0 left-0 w-full bg-white rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-50 border-t border-gray-100"
    >
      {/* Ticket Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Seahawks Futures</h3>
          <p className="text-sm text-gray-500 font-medium">Super Bowl Winner</p>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
          LIVE
        </div>
      </div>

      {/* Ticket Details */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
          <span className="text-gray-400 font-medium text-sm">Odds</span>
          <span className="font-mono font-bold text-lg">+2500</span>
        </div>
        <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
          <span className="text-gray-400 font-medium text-sm">Wager</span>
          <span className="font-mono font-bold text-lg">$50.00</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-900 font-bold text-sm">Potential Win</span>
          <span className="font-mono font-bold text-2xl text-[#007AFF]">$1,300.00</span>
        </div>
      </div>

      {/* Swipe to Confirm */}
      <motion.div 
        className="h-14 rounded-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ background }}
      >
        <motion.span style={{ opacity: textOpacity, color }} className="font-semibold text-sm pointer-events-none">
            Swipe to Confirm
        </motion.span>
        
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0.1}
            dragSnapToOrigin={!confirmed} // Snap back unless confirmed
            onDragEnd={handleDragEnd}
            className="absolute left-1 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-black z-10"
        >
            {confirmed ? <Check size={20} className="text-green-600" /> : <ChevronRight size={20} />}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const IPhoneMockup = () => {
  const [messages, setMessages] = useState<Array<{id: number, type: 'sent' | 'received' | 'ticket-receipt', text?: string, ticketData?: any}>>([
    { id: 1, type: 'received', text: "Welcome back, Fariz. What's the play today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<'idle' | 'processing' | 'confirming' | 'success'>('idle');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    
    // Add User Message
    setMessages(prev => [...prev, { id: Date.now(), type: 'sent', text: userText }]);
    setStatus('processing');

    // Simulate AI Thinking
    setTimeout(() => {
        if (userText.toLowerCase().includes("seahawks")) {
            setStatus('confirming');
        } else {
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                type: 'received', 
                text: "I only have lines on the Seahawks right now. Try 'Bet 50 on Seahawks'." 
            }]);
            setStatus('idle');
        }
    }, 1500);
  };

  const handleConfirmBet = () => {
    // Play success sound (optional - browser policy often blocks auto-audio, skipping for now)
    
    // Wait a brief moment for visual confirmation then collapse
    setTimeout(() => {
        setStatus('success');
        setMessages(prev => [...prev, { 
            id: Date.now(), 
            type: 'ticket-receipt',
            ticketData: {
                title: "Seahawks Futures",
                wager: "$50.00",
                win: "$1,300.00"
            }
        }]);
        
        // Reset to idle after a bit
        setTimeout(() => setStatus('idle'), 1000);
    }, 800);
  };

  return (
    <div className="relative w-[320px] h-[640px] bg-black rounded-[50px] p-3 shadow-2xl border-[8px] border-gray-900 mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-[20px] z-30"></div>
      
      {/* Screen */}
      <div className="w-full h-full bg-[#f2f2f7] rounded-[42px] overflow-hidden flex flex-col relative z-10 font-sans">
        {/* Status Bar */}
        <div className="h-12 w-full flex items-center justify-between px-6 pt-3 text-[12px] font-semibold text-black z-20">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
             <div className="h-3 w-3 bg-black rounded-full opacity-20"></div>
             <div className="h-3 w-3 bg-black rounded-full opacity-20"></div>
             <div className="w-6 h-3.5 bg-black rounded-[4px] opacity-100 flex items-center justify-center">
                <div className="w-[1px] h-3 bg-white opacity-30"></div>
             </div>
          </div>
        </div>

        {/* Header */}
        <div className="h-14 flex items-center justify-center bg-[#f2f2f7]/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50">
           <div className="flex flex-col items-center">
             <span className="font-semibold text-sm text-black">Bookie AI</span>
             <span className="text-[10px] text-gray-400 font-medium">iMessage</span>
           </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col scroll-smooth pb-24">
          <div className="text-center text-[10px] font-bold text-gray-400 my-2 uppercase tracking-wide">Today 9:41 AM</div>
          
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[85%] ${msg.type === 'sent' ? 'self-end' : 'self-start'}`}
              >
                {msg.type === 'ticket-receipt' ? (
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-64">
                      <div className="flex items-center gap-2 mb-3 text-green-600">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                           <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Bet Locked</span>
                      </div>
                      <h4 className="font-bold text-gray-900">{msg.ticketData.title}</h4>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500">Wager</span>
                        <span className="font-mono">{msg.ticketData.wager}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">To Win</span>
                         <span className="font-mono font-bold">{msg.ticketData.win}</span>
                      </div>
                   </div>
                ) : (
                    <div className={`p-3 px-4 text-[15px] leading-snug rounded-[20px] shadow-sm ${
                        msg.type === 'sent' 
                        ? 'bg-[#007AFF] text-white rounded-br-sm' 
                        : 'bg-white text-black border border-gray-200 rounded-bl-sm'
                    }`}>
                        {msg.text}
                    </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {status === 'processing' && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-gray-200 self-start rounded-full px-4 py-3 flex gap-1 items-center w-fit"
             >
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
             </motion.div>
          )}
        </div>

        {/* Input Area (Command Bar) */}
        <div className="absolute bottom-0 w-full bg-[#f2f2f7] p-4 pb-6 z-20">
           <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                <ArrowRight size={16} />
              </div>
              <div className="flex-1 relative">
                 <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message Bookie..."
                    disabled={status !== 'idle'}
                    className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#007AFF] transition-colors shadow-sm disabled:opacity-50 placeholder:text-gray-400"
                 />
                 <button 
                    type="submit"
                    disabled={!inputValue.trim() || status !== 'idle'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#007AFF] rounded-full flex items-center justify-center text-white disabled:opacity-0 transition-opacity"
                 >
                    <ArrowRight size={14} />
                 </button>
              </div>
           </form>
        </div>
        
        {/* Generative UI Layer (Bet Ticket) */}
        <AnimatePresence>
            {status === 'confirming' && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-40">
                    <BetTicket onConfirm={handleConfirmBet} />
                </div>
            )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1/3 bg-black/20 rounded-full z-50"></div>
      </div>
    </div>
  );
};


export default function BookieLanding() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">BOOKIE</div>
        </div>
      </nav>

      <main className="pt-12 pb-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]"
            >
              No app needed. <br/>
              <span className="text-[#007AFF]">Text 394-333-2039</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-lg leading-relaxed"
            >
              The fastest and simplest way to make a bet. Bet on Sports, Politics, or Pop Culture in plain English. Instant payouts to your wallet.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="sms:394-333-2039" className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                Start Betting <ArrowRight size={20} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4"
            >
              <p className="text-sm font-semibold text-gray-400 mb-4">Get the best price across</p>
              <div className="flex items-center gap-6 opacity-60">
                 {/* Kalshi */}
                 <span className="text-xl font-bold tracking-tight text-[#00D2BE]">Kalshi</span>
                 {/* Polymarket */}
                 <div className="flex items-center gap-1">
                    <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                    <span className="text-lg font-bold tracking-tight text-slate-800">Polymarket</span>
                 </div>
                 {/* Augur */}
                 <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-600 rotate-45"></div>
                    <span className="text-lg font-bold text-slate-800">AUGUR</span>
                 </div>
              </div>
            </motion.div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent rounded-full filter blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
            <IPhoneMockup />
          </div>
        </section>


      </main>
    </div>
  );
}
