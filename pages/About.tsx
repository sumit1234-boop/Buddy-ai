import React from 'react';

const About: React.FC = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Main "What is Buddy?" Card */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="bg-slate-800 p-10 rounded-3xl shadow-sm border border-white/5">
            <h1 className="text-3xl font-black text-indigo-400 mb-6 tracking-tight">What is Buddy?</h1>
            <p className="text-slate-300 text-xl leading-relaxed font-medium">
              Buddy is more than just a chatbot. It's designed to be a persistent, personalized assistant that evolves with you. By combining high-level reasoning with long-term memory, Buddy understands your preferences, your coding style, and your goals.
            </p>
          </div>
        </div>

        {/* Mission & Privacy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="bg-slate-800 p-8 rounded-2xl h-full border border-white/5">
              <h3 className="font-bold text-xl text-white mb-3 tracking-tight">Our Mission</h3>
              <p className="text-slate-400 text-lg leading-snug">
                To create an AI companion that feels like a true partner in productivity and learning.
              </p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="bg-slate-800 p-8 rounded-2xl h-full border border-white/5">
              <h3 className="font-bold text-xl text-white mb-3 tracking-tight">Private by Design</h3>
              <p className="text-slate-400 text-lg leading-snug">
                Your memory and data are stored locally in your browser. We don't sell your conversations.
              </p>
            </div>
          </div>
        </div>

        {/* The Technology Card */}
        <div className="p-1 px-2">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border-2 border-indigo-500/20 shadow-2xl">
            <div className="bg-indigo-950/40 text-white p-12 rounded-[2.5rem] shadow-inner border border-white/5">
              <h2 className="text-3xl font-black mb-8 tracking-tight text-indigo-100">The Technology</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-indigo-400 font-black text-xl">01.</span>
                  <p className="text-lg font-medium leading-relaxed">
                    Powered by <span className="font-black text-white">Google Gemini 3.0 Pro</span> for state-of-the-art reasoning and planning.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-indigo-400 font-black text-xl">02.</span>
                  <p className="text-lg font-medium leading-relaxed">
                    Reactive Memory Engine that learns your preferences automatically during chat.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-indigo-400 font-black text-xl">03.</span>
                  <p className="text-lg font-medium leading-relaxed">
                    Built with React and Tailwind CSS for a seamless, blazing-fast interface.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;