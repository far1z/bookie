import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight
} from 'lucide-react';

const IPhoneMockup = () => {
  const [messages, setMessages] = useState<Array<{id: number, type: 'sent' | 'received', text: string}>>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const conversations = [
    [
      { id: 1, type: 'sent', text: "Bet $50 on Seahawks to win Super Bowl" },
      { id: 2, type: 'received', text: "Seahawks Futures. Odds are +2500. Bet $50 to win $1300?" },
      { id: 3, type: 'sent', text: "Lock it in" },
      { id: 4, type: 'received', text: "Confirmed. Ticket #4421." }
    ],
    [
      { id: 1, type: 'sent', text: "Will Trump invade Greenland?" },
      { id: 2, type: 'received', text: "Market: Trump invades Greenland by end of 2026. Odds are +5000. Bet $10 to win $510?" },
      { id: 3, type: 'sent', text: "Bet $10" },
      { id: 4, type: 'received', text: "Confirmed. Ticket #8829." }
    ],
    [
      { id: 1, type: 'sent', text: "Who's gonna win the Oscars?" },
      { id: 2, type: 'received', text: "Oppenheimer is favored (-500). Poor Things is +800. Want to see full odds?" },
      { id: 3, type: 'sent', text: "Bet $20 on Poor Things" },
      { id: 4, type: 'received', text: "Bet $20 to win $180. Confirm?" }
    ]
  ] as const;

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let currentConversationIndex = 0;
    
    // Reset and start animation loop
    const runAnimation = () => {
      setMessages([]);
      let delay = 500;
      
      const currentConversation = conversations[currentConversationIndex];
      
      currentConversation.forEach((msg) => {
        const timeoutId = setTimeout(() => {
          setMessages(prev => [...prev, msg]);
        }, delay);
        timeoutIds.push(timeoutId);
        
        // Add varying delays between messages to mimic typing
        delay += msg.type === 'sent' ? 1500 : 2500;
      });

      // Restart loop after all messages with next conversation
      const restartId = setTimeout(() => {
        currentConversationIndex = (currentConversationIndex + 1) % conversations.length;
        runAnimation();
      }, delay + 3000);
      timeoutIds.push(restartId);
    };

    runAnimation();

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-[300px] h-[600px] bg-black rounded-[45px] p-4 shadow-2xl border-8 border-gray-900 mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-2xl z-20"></div>
      
      {/* Screen */}
      <div className="w-full h-full bg-white rounded-[35px] overflow-hidden flex flex-col relative z-10">
        {/* Status Bar */}
        <div className="h-12 w-full bg-gray-50 flex items-center justify-between px-6 pt-2 text-[10px] font-medium text-gray-500">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2.5 bg-black rounded-[1px]"></div>
            <div className="w-0.5 h-2.5 bg-black/30 rounded-[1px]"></div>
          </div>
        </div>

        {/* Header */}
        <div className="h-12 border-b border-gray-100 flex items-center justify-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <span className="font-semibold text-sm">Bookie AI</span>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col scroll-smooth">
          <div className="text-center text-xs text-gray-400 my-2">Today 9:41 AM</div>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                msg.type === 'sent' 
                  ? 'bg-gray-100 text-black self-end rounded-tr-sm' 
                  : 'bg-blue-600 text-white self-start rounded-tl-sm'
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="h-16 border-t border-gray-100 px-4 flex items-center gap-2 bg-gray-50">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="flex-1 h-9 bg-white border border-gray-200 rounded-full"></div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-1 w-1/3 bg-black/20 rounded-full mx-auto mb-2 mt-auto"></div>
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
