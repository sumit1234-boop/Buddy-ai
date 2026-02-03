
import { GoogleGenAI, Type, Modality, Blob, LiveServerMessage } from "@google/genai";
import { UserSettings, Memory, Message, Tone } from "../types";

/**
 * BACKEND MODULE: Advanced AI processing with Multi-Tool Routing.
 * Includes Rate-Limiting and Request Throttling.
 */

let lastRequestTime = 0;
const RATE_LIMIT_COOLDOWN = 1500; // 1.5 seconds minimum between prompts

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error?.status === 429 || error?.status >= 500 || error?.message?.includes('fetch');
    if (retries > 0 && isRetryable) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const getPosition = (): Promise<GeolocationPosition | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 5000 });
  });
};

export const processBuddyRequest = async (
  prompt: string,
  history: Message[],
  settings: UserSettings,
  memories: Memory[],
  options: {
    mode?: 'fast' | 'think' | 'standard';
    files?: Array<{ name: string; content: string }>;
  } = {}
): Promise<{ text: string; sources?: any[]; skillData?: any; type: 'text' | 'image' | 'qr' | 'map' | 'plan' }> => {
  // --- Client Side Rate Limit ---
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_COOLDOWN) {
    throw new Error("NEURAL_COOLDOWN_ACTIVE: Please wait before sending another command.");
  }
  lastRequestTime = now;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { mode = 'standard' } = options;
  const lowPrompt = prompt.toLowerCase();

  // Skill Detection: QR Code
  if (lowPrompt.includes("qr code") && (lowPrompt.includes("for") || lowPrompt.includes("generate"))) {
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/g) || [prompt.split(/for |generate /i).pop()];
    if (urlMatch && urlMatch[0]) {
      return { 
        text: `I've synthesized a high-density QR code for: ${urlMatch[0].trim()}`, 
        type: 'qr',
        skillData: { url: urlMatch[0].trim() }
      };
    }
  }

  // Skill Detection: Plan Architect (Interactive Roadmap)
  if (lowPrompt.includes("plan") || lowPrompt.includes("roadmap") || lowPrompt.includes("how to") || lowPrompt.includes("steps for")) {
    try {
      const planResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a structured plan for: "${prompt}". 
        Output ONLY a JSON object with this schema: 
        {"title": string, "steps": [{"task": string, "detail": string, "importance": "high"|"med"|"low"}]}`,
        config: { responseMimeType: "application/json" }
      });
      const planData = JSON.parse(planResponse.text || "{}");
      if (planData.steps) {
        return {
          text: `I've architected a strategic roadmap for your goal: **${planData.title}**.`,
          type: 'plan',
          skillData: planData
        };
      }
    } catch (e) { console.error("Plan synthesis failed", e); }
  }

  // Skill Detection: Image Generation
  if (lowPrompt.match(/(generate|create|make|draw|paint) (an image|a picture|art)/)) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            text: "Neural visualization complete.",
            type: 'image',
            skillData: { base64: part.inlineData.data, mime: part.inlineData.mimeType }
          };
        }
      }
    } catch (e) { console.error("Visual synthesis failed", e); }
  }

  // Determine Model & Tools
  const isMapsQuery = lowPrompt.includes("near me") || lowPrompt.includes("nearby") || lowPrompt.includes("location") || lowPrompt.includes("find a");
  let modelName = isMapsQuery ? "gemini-2.5-flash" : (mode === 'fast' ? "gemini-flash-lite-latest" : "gemini-3-pro-preview");
  
  const memoryContext = memories.map(m => `- [${m.tags.join(', ')}] ${m.content}`).join("\n");
  const systemInstruction = `
    You are Buddy, a world-class AI companion with advanced skill matrices.
    Current User: ${settings.name}
    Persona: ${settings.tone}
    Memories: ${memoryContext || "None initialized."}

    CAPABILITY OVERVIEW:
    1. Practical/Technical: System architecture, regex, advanced code debugging, unit conversions.
    2. Language/Cognitive: Emotional intelligence, style-transfer, linguistic analysis, logic puzzles.
    3. Spatial Intelligence: Mapping and place discovery using googleMaps.
    4. Neural Grounding: Real-time search for news and validated facts.
    5. Socratic Teaching: If the user asks for help learning something, use Socratic questioning to guide them rather than giving immediate answers.

    Always respond with high clarity, citing sources where available.
  `;

  const contents = history.slice(-10).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const tools: any[] = [{ googleSearch: {} }];
  let toolConfig: any = undefined;

  if (isMapsQuery) {
    tools.push({ googleMaps: {} });
    const pos = await getPosition();
    if (pos) {
      toolConfig = {
        retrievalConfig: {
          latLng: { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        }
      };
    }
  }

  try {
    const config: any = { 
      systemInstruction, 
      tools,
      toolConfig
    };
    if (mode === 'think') config.thinkingConfig = { thinkingBudget: 32768 };

    const response = await withRetry(() => ai.models.generateContent({
      model: modelName,
      contents,
      config
    }));

    return {
      text: response.text || "Neural connection timeout.",
      type: isMapsQuery ? 'map' : 'text',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    return { text: `Neural Error: ${error.message}`, type: 'text' };
  }
};

export const extractMemorableFact = async (text: string): Promise<{ fact: string; tags: string[] } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract ONE fact from: "${text}". JSON format: {"fact": string, "tags": string[]}. If none, return {"fact": "NONE"}.`,
      config: { responseMimeType: "application/json" }
    });
    const res = JSON.parse(response.text || "{}");
    return (res.fact && res.fact !== "NONE") ? res : null;
  } catch { return null; }
};

export const connectVoiceBackend = (callbacks: any, settings: UserSettings) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const selectedVoice = settings.voiceName || 'Zephyr';
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } },
      systemInstruction: `You are Buddy. Speaker: ${settings.name}. Tone: ${settings.tone}. Stay helpful and conversational.`,
    },
  });
};
