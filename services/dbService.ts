
import { AppState, Memory, Message, UserSettings, Tone } from "../types";

const DB_NAME = "BuddyNeuralDatabase";
const DB_VERSION = 1;
const STORES = {
  MEMORIES: "memories",
  CHAT: "chat_history",
  SETTINGS: "settings"
};

const LS_SETTINGS_KEY = "buddy_settings_v4_mirror";

/**
 * DATABASE ENGINE: Handles all low-level IndexedDB operations.
 * This is the "Large Memory" core of Buddy.
 */
class BuddyDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.MEMORIES)) {
          db.createObjectStore(STORES.MEMORIES, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.CHAT)) {
          db.createObjectStore(STORES.CHAT, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS);
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async getStore(name: string, mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(name, mode);
    return transaction.objectStore(name);
  }

  // Settings
  async saveSettings(settings: UserSettings): Promise<void> {
    // 1. Save to IndexedDB (Long term)
    const store = await this.getStore(STORES.SETTINGS, "readwrite");
    store.put(settings, "current_config");
    
    // 2. Mirror to localStorage (Zero-latency access & Backup)
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
  }

  async getSettings(): Promise<UserSettings | null> {
    // 1. Try localStorage mirror first (Fastest)
    const mirrored = localStorage.getItem(LS_SETTINGS_KEY);
    if (mirrored) {
      try { return JSON.parse(mirrored); } catch (e) { console.error("Corrupt LS mirror"); }
    }

    // 2. Fallback to IndexedDB
    const store = await this.getStore(STORES.SETTINGS);
    return new Promise((resolve) => {
      const request = store.get("current_config");
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // --- Neural Sync Logic (Manual Device-to-Device Sync) ---
  
  generateSyncCode(settings: UserSettings): string {
    const json = JSON.stringify(settings);
    return btoa(json); // Base64 encoding for the sync string
  }

  importSyncCode(code: string): UserSettings | null {
    try {
      const json = atob(code);
      const settings = JSON.parse(json);
      // Basic validation
      if (settings.name && settings.tone) return settings;
      return null;
    } catch (e) {
      return null;
    }
  }

  // Memories
  async getAllMemories(): Promise<Memory[]> {
    const store = await this.getStore(STORES.MEMORIES);
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async addMemory(memory: Memory): Promise<void> {
    const store = await this.getStore(STORES.MEMORIES, "readwrite");
    store.add(memory);
  }

  async deleteMemory(id: string): Promise<void> {
    const store = await this.getStore(STORES.MEMORIES, "readwrite");
    store.delete(id);
  }

  // Chat
  async getChatHistory(): Promise<Message[]> {
    const store = await this.getStore(STORES.CHAT);
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.sort((a: any, b: any) => a.timestamp - b.timestamp));
      };
    });
  }

  async saveMessage(message: Message): Promise<void> {
    const store = await this.getStore(STORES.CHAT, "readwrite");
    store.put(message);
  }

  async clearChat(): Promise<void> {
    const store = await this.getStore(STORES.CHAT, "readwrite");
    store.clear();
  }

  async nuke(): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      localStorage.removeItem(LS_SETTINGS_KEY);
      request.onsuccess = () => resolve();
    });
  }
}

export const db = new BuddyDB();
