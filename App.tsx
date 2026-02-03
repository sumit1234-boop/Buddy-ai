
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import DataControl from './pages/DataControl';
import Personalization from './pages/Personalization';
import Chat from './pages/Chat';
import { AppState, Tone, UserSettings, Memory, Message } from './types';
import { db } from './services/dbService';
import BuddyFace from './components/BuddyFace';

const defaultSettings: UserSettings = {
  name: 'Friend',
  tone: Tone.FRIENDLY,
  interests: ['Technology', 'Learning'],
  theme: 'dark',
  voiceName: 'Zephyr'
};

const App: React.FC = () => {
  // --- FAST START: Load from LS Mirror immediately if available ---
  const [state, setState] = useState<AppState | null>(() => {
    const mirrored = localStorage.getItem("buddy_settings_v4_mirror");
    if (mirrored) {
      try {
        return {
          settings: JSON.parse(mirrored),
          memories: [],
          chatHistory: []
        };
      } catch (e) { return null; }
    }
    return null;
  });
  
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Database on Mount for full state
  useEffect(() => {
    const init = async () => {
      try {
        await db.init();
        const settings = await db.getSettings();
        const memories = await db.getAllMemories();
        const chatHistory = await db.getChatHistory();

        setState({
          settings: settings || defaultSettings,
          memories: memories,
          chatHistory: chatHistory
        });
      } catch (err) {
        console.error("Database initialization failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const updateSettings = async (settings: UserSettings) => {
    if (!state) return;
    await db.saveSettings(settings);
    setState({ ...state, settings });
  };
  
  const addMemory = async (content: string, tags: string[] = []) => {
    if (!state) return;
    if (state.memories.some(m => m.content === content)) return;
    
    const newMemory: Memory = {
      id: crypto.randomUUID(),
      content,
      timestamp: Date.now(),
      tags: tags.length > 0 ? tags : ['Auto-learned']
    };
    
    await db.addMemory(newMemory);
    setState(prev => prev ? ({ ...prev, memories: [newMemory, ...prev.memories] }) : null);
  };

  const deleteMemory = async (id: string) => {
    await db.deleteMemory(id);
    setState(prev => prev ? ({ ...prev, memories: prev.memories.filter(m => m.id !== id) }) : null);
  };

  const updateChatHistory = async (messages: Message[]) => {
    if (!state) return;
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) await db.saveMessage(latestMessage);
    if (messages.length > state.chatHistory.length + 1) {
       const userMsg = messages[messages.length - 2];
       if (userMsg) await db.saveMessage(userMsg);
    }
    setState(prev => prev ? ({ ...prev, chatHistory: messages }) : null);
  };

  const clearChat = async () => {
    await db.clearChat();
    setState(prev => prev ? ({ ...prev, chatHistory: [] }) : null);
  };

  // Only show loader if we have NO mirrored state AND we're initializing
  if (isInitializing && !state) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BuddyFace size="lg" state="thinking" />
        <div className="text-center">
          <h2 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">Syncing Neural Memory</h2>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-[loading_2s_infinite_ease-in-out]"></div>
          </div>
        </div>
        <style>{`@keyframes loading { 0% { width: 0%; transform: translateX(-100%); } 50% { width: 50%; } 100% { width: 0%; transform: translateX(200%); } }`}</style>
      </div>
    );
  }

  // If state is not fully loaded but we have settings (fast start), we can still render
  const safeState = state || { settings: defaultSettings, memories: [], chatHistory: [] };

  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
        <div className="hidden md:block"><Sidebar /></div>
        <main className="flex-1 flex flex-col h-screen overflow-hidden pb-[72px] md:pb-0 relative">
          {/* Subtle loading indicator if IndexedDB is still loading in background */}
          {isInitializing && state && (
             <div className="absolute top-0 right-0 p-4 z-50 pointer-events-none">
                <div className="flex items-center gap-2 bg-indigo-600/20 px-3 py-1.5 rounded-full border border-indigo-500/30">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Hydrating Memory...</span>
                </div>
             </div>
          )}
          <Routes>
            <Route path="/" element={<Home state={safeState} />} />
            <Route path="/chat" element={<Chat state={safeState} onChatUpdate={updateChatHistory} onMemoryAdded={addMemory} onClearChat={clearChat} onSettingsUpdate={updateSettings} />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/memory" element={<DataControl memories={safeState.memories} onDelete={deleteMemory} onAdd={addMemory} chatCount={safeState.chatHistory.length} />} />
            <Route path="/personalize" element={<Personalization settings={safeState.settings} onUpdate={updateSettings} />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </HashRouter>
  );
};

export default App;