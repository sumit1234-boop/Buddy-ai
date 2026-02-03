
export enum Tone {
  FRIENDLY = 'Friendly',
  PROFESSIONAL = 'Professional',
  CONCISE = 'Concise',
  ENTHUSIASTIC = 'Enthusiastic'
}

export interface UserSettings {
  name: string;
  tone: Tone;
  interests: string[];
  theme: 'light' | 'dark' | 'auto';
  voiceName?: string;
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
  tags: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  skill?: string;
  imageUrl?: string; // Support for generated images
}

export interface AppState {
  settings: UserSettings;
  memories: Memory[];
  chatHistory: Message[];
}