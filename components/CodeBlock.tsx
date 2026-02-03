
import React, { useState, useRef, useEffect } from 'react';
import Prism from 'prismjs';

// Attach Prism to window immediately at the module level
// While this is also hoisted, dynamic imports are the only way to be 100% safe
// for side-effect based scripts in some browser environments.
(window as any).Prism = Prism;

interface Props {
  code: string;
  language: string;
}

const CodeBlock: React.FC<Props> = ({ code, language }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  // Helper to check if language is JavaScript
  const isJavaScript = (lang: string) => {
    const l = lang.toLowerCase();
    return l === 'javascript' || l === 'js';
  };

  useEffect(() => {
    const loadLanguages = async () => {
      // If already loaded or no special language, skip
      if (isLoaded) return;

      try {
        // Load dependencies in strict order using dynamic imports to avoid hoisting issues
        // 1. Base dependencies
        await import('https://esm.sh/prismjs@1.29.0/components/prism-markup');
        await import('https://esm.sh/prismjs@1.29.0/components/prism-clike');
        
        // 2. Standard languages
        await Promise.all([
          import('https://esm.sh/prismjs@1.29.0/components/prism-css'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-javascript'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-typescript'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-python'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-bash'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-json'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-markdown'),
        ]);

        // 3. Languages that depend on clike
        await Promise.all([
          import('https://esm.sh/prismjs@1.29.0/components/prism-java'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-cpp'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-csharp'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-ruby'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-go'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-rust'),
          import('https://esm.sh/prismjs@1.29.0/components/prism-sql'),
        ]);

        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load Prism languages:", err);
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    if (isLoaded && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language, isLoaded]);

  const runCode = async () => {
    if (!isJavaScript(language)) {
      alert("Execution is only supported for JavaScript.");
      return;
    }

    setIsRunning(true);
    setOutput(["Initializing sandbox..."]);
    
    if (iframeRef.current) {
      try { document.body.removeChild(iframeRef.current); } catch(e) {}
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const win = iframe.contentWindow;
    if (!win) {
      setOutput(["Failed to initialize sandbox window."]);
      setIsRunning(false);
      return;
    }

    (win as any).console = {
      log: (...args: any[]) => {
        const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        setOutput(prev => [...prev, msg]);
      },
      error: (...args: any[]) => {
        const msg = args.map(String).join(' ');
        setOutput(prev => [...prev, `🔴 Error: ${msg}`]);
      },
    };

    try {
      setOutput([]);
      (win as any).eval(code);
    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Runtime Failed: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const getPrismLang = (lang: string) => {
    const l = lang.toLowerCase();
    const map: Record<string, string> = { 
      'js': 'javascript', 
      'ts': 'typescript', 
      'py': 'python', 
      'rb': 'ruby', 
      'cpp': 'cpp', 
      'c++': 'cpp',
      'rs': 'rust',
      'cs': 'csharp',
      'c#': 'csharp'
    };
    return map[l] || l || 'plain';
  };

  const prismLang = getPrismLang(language);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg group">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-2">{language || 'text'}</span>
        </div>
        {isJavaScript(language) && (
          <button 
            onClick={runCode} 
            disabled={isRunning}
            className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${
              isRunning ? 'bg-slate-700 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isRunning ? 'Running...' : 'Run JS'}
          </button>
        )}
      </div>
      <div className="relative">
        <pre className={`p-4 text-sm font-mono overflow-x-auto custom-scrollbar language-${prismLang}`}>
          <code ref={codeRef} className={`language-${prismLang}`}>
            {code.trim()}
          </code>
        </pre>
      </div>
      {output.length > 0 && (
        <div className="bg-black/40 border-t border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-indigo-400 font-bold mb-2 uppercase tracking-tighter">Console Output:</div>
          {output.map((line, i) => (
            <div key={i} className="py-0.5 border-l border-slate-700 pl-3">{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
