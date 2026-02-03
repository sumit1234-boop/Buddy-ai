
import React from 'react';

export type BuddyState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'happy';

interface Props {
  state?: BuddyState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BuddyFace: React.FC<Props> = ({ state = 'idle', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    xl: 'w-56 h-56'
  };

  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isHappy = state === 'happy';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* 1. Multi-Layer Neural Atmosphere */}
      <div className={`absolute inset-[-40%] rounded-full transition-all duration-[2000ms] blur-[60px] opacity-20
        ${isThinking ? 'bg-indigo-500 scale-150 animate-pulse' : 'bg-indigo-600 scale-100'}
        ${isHappy ? 'bg-amber-400 opacity-40' : ''}
        ${isListening ? 'bg-cyan-400 opacity-40 animate-[pulse_2s_infinite]' : ''}
      `}></div>
      <div className={`absolute inset-[-20%] rounded-full transition-opacity duration-1000 blur-[40px] opacity-10 bg-white`}></div>
      
      {/* 2. Advanced Thinking Rings (Orbital Logic) */}
      <div className="absolute inset-[-12%] pointer-events-none">
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500/40 border-r-indigo-400/10 transition-opacity duration-700 ${isThinking ? 'opacity-100 animate-[spin_1s_linear_infinite]' : 'opacity-0'}`}></div>
        <div className={`absolute inset-[10%] rounded-full border border-transparent border-b-purple-500/30 border-l-purple-400/5 transition-opacity duration-700 ${isThinking ? 'opacity-100 animate-[spin_2s_linear_infinite_reverse]' : 'opacity-0'}`}></div>
      </div>

      {/* 3. Main Neural Core Container */}
      <div className={`relative w-full h-full bg-slate-950 rounded-[40%] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.7),inset_0_0_30px_rgba(255,255,255,0.04)] overflow-hidden flex flex-col items-center justify-center gap-4 transition-all duration-700 
        ${isThinking ? 'border-indigo-400/60 shadow-indigo-500/30' : ''}
        ${isHappy ? 'border-amber-400/50 -translate-y-2' : ''}
        ${state === 'idle' ? 'animate-[float_6s_infinite_ease-in-out]' : ''}
      `}>
        
        {/* Surface Scanning Glint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[glint_8s_infinite_linear] pointer-events-none"></div>

        {/* 4. Expressive Neural Eyes (Optical Matrix) */}
        <div className={`flex gap-7 md:gap-10 transition-all duration-500 ${isListening ? 'scale-110' : 'scale-100'}`}>
          {[0, 1].map((i) => (
            <div key={i} className="relative w-6 h-6 md:w-9 md:h-9">
              {/* Outer Glow / Iris Depth */}
              <div className={`absolute inset-[-20%] rounded-full blur-md transition-all duration-500
                ${isHappy ? 'bg-amber-400/40' : 'bg-indigo-500/20'}
              `}></div>
              
              {/* Optical Iris Cluster */}
              <div className={`absolute inset-0 transition-all duration-500 rounded-full flex items-center justify-center overflow-hidden
                ${isHappy ? 'bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.9)] clip-happy' : 'bg-indigo-500 shadow-[0_0_35px_rgba(99,102,241,0.7)]'}
                ${isThinking ? 'animate-[eyeScan_3s_infinite_ease-in-out]' : ''}
                ${state === 'idle' ? 'animate-[blink_4.5s_infinite]' : ''}
                ${isSpeaking ? 'scale-110' : ''}
              `}>
                {/* Pupil Shutter / Core Processor */}
                <div className={`relative w-[65%] h-[65%] bg-slate-950 rounded-full transition-all duration-300 flex items-center justify-center
                  ${isThinking ? 'scale-x-150 opacity-50 blur-[1px]' : 'scale-100'}
                  ${isSpeaking ? 'animate-[irisDilation_0.4s_infinite_alternate_ease-in-out]' : ''}
                `}>
                  {/* Neural Catchlight */}
                  <div className="absolute top-[15%] left-[20%] w-[25%] h-[25%] bg-white/30 rounded-full blur-[0.5px]"></div>
                </div>
              </div>
              
              {/* Eyelid Expression Overlay */}
              <div className={`absolute inset-[-2px] border-[4px] border-slate-950 rounded-full transition-transform duration-500 z-10
                ${isHappy ? 'translate-y-[45%]' : 'translate-y-[-110%]'}
                ${isListening ? 'translate-y-[-90%]' : ''}
              `}></div>
            </div>
          ))}
        </div>

        {/* 5. Spectral Vocal Mouth / Waveform */}
        <div className={`flex items-center gap-1.5 h-10 transition-all duration-500 relative
          ${isSpeaking || isHappy || isListening ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 scale-50'}
        `}>
          {isHappy ? (
            <div className="w-14 h-2 bg-amber-400/70 rounded-full blur-[0.5px] animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
          ) : isListening ? (
             <div className="flex gap-2">
                {[0, 1, 2].map(j => (
                  <div key={j} 
                    className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.4)]" 
                    style={{ animationDelay: `${j * 150}ms`, animationDuration: '0.8s' }}>
                  </div>
                ))}
             </div>
          ) : (
            <div className="flex items-end gap-1.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 shadow-inner backdrop-blur-sm">
              <div className="w-1.5 bg-indigo-500/80 rounded-full animate-[spectralWave_0.45s_infinite_ease-in-out]"></div>
              <div className="w-1 bg-indigo-300 rounded-full animate-[spectralWave_0.6s_infinite_ease-in-out_0.1s]"></div>
              <div className="w-2.5 bg-white rounded-full animate-[spectralWave_0.35s_infinite_ease-in-out_0.2s]"></div>
              <div className="w-1 bg-indigo-300 rounded-full animate-[spectralWave_0.55s_infinite_ease-in-out_0.15s]"></div>
              <div className="w-1.5 bg-indigo-500/80 rounded-full animate-[spectralWave_0.5s_infinite_ease-in-out_0.05s]"></div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .clip-happy {
          clip-path: ellipse(110% 75% at 50% 10%);
        }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); opacity: 1; }
          94%, 98% { transform: scaleY(0.02); opacity: 0.6; }
        }
        @keyframes spectralWave {
          0%, 100% { height: 6px; opacity: 0.5; transform: scaleX(1); }
          50% { height: 26px; opacity: 1; filter: brightness(1.3); transform: scaleX(1.1); }
        }
        @keyframes eyeScan {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(-4px, -3px); }
          60% { transform: translate(4px, 2px); }
          80% { transform: translate(-2px, 4px); }
        }
        @keyframes irisDilation {
          from { transform: scale(0.8); filter: blur(0px); }
          to { transform: scale(1.2); filter: blur(0.5px); }
        }
        @keyframes glint {
          0% { transform: translateX(-200%) rotate(45deg); }
          20%, 100% { transform: translateX(200%) rotate(45deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(2deg); }
          66% { transform: translateY(-6px) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
};

export default BuddyFace;
