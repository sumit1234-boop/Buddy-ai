
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Message, UserSettings } from '../types';
import * as BuddyBackend from '../services/geminiService';
import CodeBlock from '../components/CodeBlock';
import VoiceOverlay from '../components/VoiceOverlay';
import BuddyFace from '../components/BuddyFace';
import SkillRenderer from '../components/SkillRenderer';

interface Props {
  state: AppState;
  onChatUpdate: (messages: Message[]) => void;
  onMemoryAdded: (content: string, tags?: string[]) => void;
  onClearChat: () => void;
  onSettingsUpdate?: (settings: UserSettings) => void;
}

const Chat: React.FC<Props> = ({ state, onChatUpdate, onMemoryAdded, onClearChat, onSettingsUpdate }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [responseMode, setResponseMode] = useState<'standard' | 'fast' | 'think'>('standard');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ id: string; name: string; content: string }>>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [state.chatHistory, isTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    onChatUpdate([...state.chatHistory, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await BuddyBackend.processBuddyRequest(
      input,
      state.chatHistory,
      state.settings,
      state.memories,
      { mode: responseMode, files: attachedFiles.map(f => ({ name: f.name, content: f.content })) }
    );

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.text,
      timestamp: Date.now(),
      skill: JSON.stringify({ 
        type: result.type, 
        data: result.skillData, 
        sources: result.sources 
      })
    };

    onChatUpdate([...state.chatHistory, userMsg, assistantMsg]);
    setIsTyping(false);
    setAttachedFiles([]); 
    BuddyBackend.extractMemorableFact(input).then(mem => mem && onMemoryAdded(mem.fact, mem.tags));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {showVoice && (
        <VoiceOverlay 
          settings={state.settings} 
          onClose={() => setShowVoice(false)} 
          onSettingsUpdate={onSettingsUpdate}
        />
      )}
      
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BuddyFace size="sm" state={isTyping ? 'thinking' : 'idle'} />
          <div>
            <h2 className="text-xs font-black text-white leading-none mb-1">Buddy AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{responseMode} Engine</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={onClearChat} className="w-10 h-10 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all">🗑️</button>
           <button onClick={() => setResponseMode(p => p === 'standard' ? 'think' : p === 'think' ? 'fast' : 'standard')} className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-lg">{responseMode === 'standard' ? '🧠' : responseMode === 'think' ? '✨' : '⚡'}</button>
           <button onClick={() => setShowVoice(true)} className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">🎙️</button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-32">
        {state.chatHistory.map((msg) => {
          const skillMeta = msg.skill ? JSON.parse(msg.skill) : null;
          return (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`relative max-w-[92%] px-5 py-4 rounded-3xl text-[13.5px] leading-relaxed shadow-2xl ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-100 border border-white/5 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">
                  {msg.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
                     if (part.startsWith('```')) {
                       const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
                       return <CodeBlock key={i} code={match?.[2] || ''} language={match?.[1] || 'text'} />;
                     }
                     return part;
                  })}
                </div>
                {skillMeta && <SkillRenderer type={skillMeta.type} data={skillMeta.data} sources={skillMeta.sources} />}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 px-5 py-3 rounded-2xl border border-white/5 flex gap-2 items-center">
              {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>)}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-2 border border-white/10 shadow-2xl">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">📎</button>
            <input type="file" ref={fileInputRef} className="hidden" />
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Message Buddy..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none text-slate-100 placeholder:text-slate-600"
            />
            <button type="submit" disabled={!input.trim() || isTyping} className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-30 transition-all">↗</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;