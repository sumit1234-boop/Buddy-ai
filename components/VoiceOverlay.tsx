
import React, { useEffect, useState, useRef } from 'react';
import { connectVoiceBackend } from '../services/geminiService';
import { UserSettings, Tone } from '../types';
import { LiveServerMessage, Blob } from '@google/genai';
import BuddyFace, { BuddyState } from './BuddyFace';

interface Props {
  settings: UserSettings;
  onClose: () => void;
  onSettingsUpdate?: (settings: UserSettings) => void;
}

const AVAILABLE_VOICES = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

// --- Audio Utilities ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

const VoiceOverlay: React.FC<Props> = ({ settings, onClose, onSettingsUpdate }) => {
  const [status, setStatus] = useState<BuddyState>('idle');
  const [buddyTranscript, setBuddyTranscript] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    let mediaStream: MediaStream | null = null;
    let sessionPromise: Promise<any> | null = null;

    const setupVoice = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        sessionPromise = connectVoiceBackend({
          onopen: () => {
            setStatus('listening');
            const source = inputAudioContext.createMediaStreamSource(mediaStream!);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            inputSourceRef.current = source;
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
              if (isMicOn) sessionPromise?.then(s => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            if (m.serverContent?.outputTranscription) setBuddyTranscript(prev => (prev + m.serverContent!.outputTranscription!.text).slice(-150));
            
            const audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) {
              // VITAL: Resume context if suspended to fix delay
              if (outputAudioContext.state === 'suspended') await outputAudioContext.resume();
              
              setStatus('speaking');
              // Calculate optimal start time to minimize jitter/delay
              const now = outputAudioContext.currentTime;
              if (nextStartTimeRef.current < now) {
                nextStartTimeRef.current = now + 0.05; // Tiny buffer for smoothness
              }

              const buffer = await decodeAudioData(decode(audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioContext.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (m.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          }
        }, settings);
      } catch (err) { onClose(); }
    };

    setupVoice();

    return () => { 
      sessionPromise?.then(s => s.close()); 
      sourcesRef.current.forEach(s => { try { s.stop(); s.disconnect(); } catch(e) {} });
      sourcesRef.current.clear();
      inputSourceRef.current?.disconnect();
      scriptProcessorRef.current?.disconnect();
      if (scriptProcessorRef.current) scriptProcessorRef.current.onaudioprocess = null;
      if (inputAudioContext.state !== 'closed') inputAudioContext.close();
      if (outputAudioContext.state !== 'closed') outputAudioContext.close(); 
      mediaStream?.getTracks().forEach(t => t.stop()); 
    };
  }, [settings, onClose, isMicOn]);

  const handleVoiceChange = (voice: string) => {
    if (onSettingsUpdate) {
      onSettingsUpdate({ ...settings, voiceName: voice });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-10 overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-1000 bg-indigo-600/10 blur-[120px] ${status === 'listening' ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="absolute top-10 right-10">
        <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-xl">✕</button>
      </div>
      
      <BuddyFace size="xl" state={status} className="mb-12 drop-shadow-[0_0_50px_rgba(129,140,248,0.3)]" />
      
      <div className="text-center space-y-8 max-w-xl relative z-10">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tighter">{status === 'speaking' ? 'Synthesizing...' : 'Speak Now'}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Secure Neural Channel</p>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 min-h-[120px] shadow-2xl flex flex-col items-center justify-center text-center">
          <p className="text-slate-200 text-xl font-medium leading-relaxed tracking-tight mb-4">
            {buddyTranscript ? `“${buddyTranscript}”` : "Buddy is waiting for your input..."}
          </p>
          
          <div className="w-full h-px bg-white/5 mb-4"></div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {AVAILABLE_VOICES.map(v => (
              <button
                key={v}
                onClick={() => handleVoiceChange(v)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  settings.voiceName === v 
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                    : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Voice Configuration</p>
        </div>
        
        <div className="flex justify-center gap-8 pt-4">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all active:scale-90 border-4 ${isMicOn ? 'bg-indigo-600 border-indigo-400/30 hover:bg-indigo-500' : 'bg-red-500 border-red-400/30 hover:bg-red-400'}`}
          >
            {isMicOn ? '🎤' : '🔇'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceOverlay;