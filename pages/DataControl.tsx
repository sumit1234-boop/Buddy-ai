
import React, { useState } from 'react';
import { Memory } from '../types';
import { db } from '../services/dbService';

interface Props {
  memories: Memory[];
  onDelete: (id: string) => void;
  onAdd: (content: string, tags?: string[]) => void;
  chatCount: number;
}

const DataControl: React.FC<Props> = ({ memories, onDelete, onAdd, chatCount }) => {
  const [newVal, setNewVal] = useState('');

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVal.trim()) return;
    onAdd(newVal, ['Manual Entry']);
    setNewVal('');
  };

  const handleNuke = async () => {
    if (confirm("WARNING: This will permanently erase ALL memories and chat history from the neural database. This cannot be undone. Proceed?")) {
      await db.nuke();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-slate-950">
      <div className="max-w-4xl mx-auto py-6 pb-24">
        <header className="mb-10 space-y-3">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Storage</p>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">Memory Base</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg">
            Buddy utilizes an IndexedDB "Neural Cluster" for large-scale persistent memory. Manage your stored facts and historical logs below.
          </p>
        </header>

        {/* Database Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">🧠</span>
            <span className="text-xl font-black text-white">{memories.length}</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Memory Nodes</span>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">💬</span>
            <span className="text-xl font-black text-white">{chatCount}</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Chat Records</span>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">⚡</span>
            <span className="text-xl font-black text-green-400">Stable</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Link Status</span>
          </div>
        </div>

        {/* Add Section */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-10 group hover:border-indigo-500/20 transition-all">
          <h2 className="text-xs font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="text-lg">➕</span> Manual Entry
          </h2>
          <form onSubmit={handleManualAdd} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              placeholder="e.g. I prefer dark mode and clean UI layouts..."
              className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-white placeholder:text-slate-700 shadow-inner transition-all"
            />
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-[0.98] shadow-lg shadow-indigo-600/20 transition-all">
              Commit to Memory
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Active Memory Nodes</h2>
          <div className="grid grid-cols-1 gap-4">
            {memories.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-[2.5rem] border border-dashed border-white/10 text-slate-700">
                <span className="text-4xl block mb-4 opacity-20">🧠</span>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Neural nodes disconnected</p>
                <p className="text-[10px] mt-2 text-slate-800">Start chatting with Buddy to build your memory base.</p>
              </div>
            ) : (
              memories.map(memory => (
                <div key={memory.id} className="bg-slate-900/80 p-6 rounded-3xl border border-white/5 shadow-xl flex items-center justify-between gap-6 group hover:bg-slate-800/50 hover:border-indigo-500/10 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {memory.tags.map(tag => (
                        <span key={tag} className="text-[9px] uppercase font-black tracking-widest bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-100 text-[13px] font-semibold leading-relaxed break-words">{memory.content}</p>
                    <div className="flex items-center gap-2 mt-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                        Recorded: {new Date(memory.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(memory.id)}
                    className="w-12 h-12 flex items-center justify-center bg-red-500/5 text-red-500/40 rounded-2xl hover:bg-red-500/10 hover:text-red-500 active:scale-90 transition-all border border-transparent hover:border-red-500/20"
                    aria-label="Delete Memory"
                  >
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <h2 className="text-xs font-black text-red-500 uppercase tracking-widest px-2 mb-4">Danger Zone</h2>
          <button 
            onClick={handleNuke}
            className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Nuke Neural Cluster (Wipe All Data)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataControl;
