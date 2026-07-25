import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import type { ChatMessage } from '../lib/chat';
import { sendMessage } from '../lib/chat';

interface ChatPanelProps {
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  '🛠️ What are his skills?',
  '💼 Tell me about his projects',
  '🎓 Education & experience?',
  '📞 How to contact him?',
  '🤝 Is he available for hire?',
];

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '👋 Welcome! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`]/g, ''));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const scrollToSection = (hash: string) => {
    onClose();
    setTimeout(() => {
      if (window.location.hash && window.location.hash !== '#home') {
        window.location.hash = '';
      }
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        history.replaceState(null, '', hash);
      });
    }, 300);
  };

  const isAffirmativeReply = (text: string) => {
    const normalized = text.trim().toLowerCase();
    return /\b(han|haan|hn|yes|sure|open|karo|kr ?do|theek|thik|please)\b/.test(normalized);
  };

  const addMessage = async (userText: string) => {
    const userMsg: ChatMessage = { role: 'user', text: userText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setShowSuggestions(false);
    setLastFailedMessage(null);

    if (pendingSection && isAffirmativeReply(userText)) {
      setPendingSection(null);
      scrollToSection(pendingSection);
    }

    setLoading(true);

    try {
      const result = await sendMessage(updated);
      setMessages((prev) => [...prev, { role: 'assistant', text: result.text }]);
      speakText(result.text);
      setPendingSection(result.section || null);
    } catch {
      setLastFailedMessage(userText);
      setMessages((prev) => [...prev, { role: 'assistant', text: '⚠️ Oops! Something went wrong. Please check your connection and try again.' }]);
      setPendingSection(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    addMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Voice input is not supported in your browser.' }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      addMessage(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  };

  // Mobile: full-width bottom sheet, Desktop: side panel
  const panelStyle: React.CSSProperties = isMobile ? {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '85vh',
    maxHeight: '85vh',
    borderRadius: '16px 16px 0 0',
    backgroundColor: '#ffffff',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--ptf-font-sans)',
    border: 'none',
    borderTop: '1px solid var(--ptf-border-color)',
  } : {
    position: 'fixed',
    bottom: '166px',
    right: '30px',
    width: '340px',
    maxHeight: '480px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--ptf-font-sans)',
    border: '1px solid var(--ptf-border-color)',
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 9999,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
    <div style={panelStyle}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '16px 20px' : '14px 16px',
        borderBottom: '1px solid var(--ptf-border-color)',
        backgroundColor: 'var(--ptf-black-color)',
        color: 'var(--ptf-white-color)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isMobile && (
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: isMobile ? '15px' : '14px', fontWeight: 600 }}>AI Assistant</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); window.speechSynthesis.cancel(); }}
            style={{
              background: 'none',
              border: 'none',
              color: voiceEnabled ? 'var(--ptf-accent-1)' : 'var(--ptf-white-color)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              opacity: voiceEnabled ? 1 : 0.6,
            }}
            aria-label="Toggle voice"
            title={voiceEnabled ? 'Voice on' : 'Voice off'}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ptf-white-color)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              opacity: 0.7,
            }}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px 20px' : '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#f8f9fa',
        WebkitOverflowScrolling: 'touch',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: msg.role === 'user' ? 'var(--ptf-accent-1)' : '#e9ecef',
              color: msg.role === 'user' ? '#fff' : '#495057',
              flexShrink: 0,
            }}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div style={{
            maxWidth: isMobile ? '85%' : '80%',
            padding: isMobile ? '12px 16px' : '10px 14px',
            borderRadius: '12px',
            fontSize: isMobile ? '14px' : '13px',
            lineHeight: '1.5',
            color: msg.role === 'user' ? '#fff' : '#212529',
            backgroundColor: msg.role === 'user' ? 'var(--ptf-accent-1)' : '#ffffff',
            border: msg.role === 'user' ? 'none' : '1px solid #e9ecef',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
              {msg.text}
            </div>
          </div>
        ))}
        {/* Suggested Questions */}
        {showSuggestions && messages.length === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Questions</span>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => addMessage(q)}
                style={{
                  textAlign: 'left',
                  background: '#fff',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  color: '#212529',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ptf-accent-1)'; e.currentTarget.style.color = 'var(--ptf-accent-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.color = '#212529'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Retry button on error */}
        {lastFailedMessage && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <button
              onClick={() => { setLastFailedMessage(null); addMessage(lastFailedMessage); }}
              style={{
                background: 'none',
                border: '1px solid var(--ptf-accent-1)',
                borderRadius: '6px',
                padding: '5px 14px',
                fontSize: '12px',
                color: 'var(--ptf-accent-1)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
              }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} color="#495057" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite 0.2s' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite 0.4s' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#adb5bd' }}>AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: isMobile ? '12px 16px 20px' : '10px 12px',
        borderTop: '1px solid var(--ptf-border-color)',
        backgroundColor: '#fff',
        flexShrink: 0,
      }}>
        <button
          onClick={toggleMic}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: listening ? 'var(--ptf-accent-1)' : '#f0f0f0',
            color: listening ? '#fff' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={listening ? 'Stop recording' : 'Start voice input'}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: isMobile ? '12px 14px' : '10px 12px',
            fontSize: isMobile ? '16px' : '13px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: loading || !input.trim() ? '#ccc' : 'var(--ptf-black-color)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'default' : 'pointer',
            flexShrink: 0,
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
    </>
  );
};

export default ChatPanel;
