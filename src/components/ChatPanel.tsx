import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import type { ChatMessage } from '../lib/chat';
import { sendMessage } from '../lib/chat';

interface ChatPanelProps {
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '👋 Welcome! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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
      window.location.hash = hash;
    }, 200);
  };

  const isAffirmativeReply = (text: string) => {
    const normalized = text.trim().toLowerCase();
    return /\b(han|haan|yes|sure|open|karo|kr ?do|theek|thik|please)\b/.test(normalized);
  };

  const addMessage = async (userText: string) => {
    const userMsg: ChatMessage = { role: 'user', text: userText };
    const updated = [...messages, userMsg];
    setMessages(updated);

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
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Try again.' }]);
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

  return (
    <div style={{
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
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--ptf-border-color)',
        backgroundColor: 'var(--ptf-black-color)',
        color: 'var(--ptf-white-color)',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>AI Assistant</span>
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
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#f8f9fa',
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
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
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
        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} color="#495057" />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite 0.2s' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#adb5bd', animation: 'pulse 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        borderTop: '1px solid var(--ptf-border-color)',
        backgroundColor: '#fff',
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
            padding: '10px 12px',
            fontSize: '13px',
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
  );
};

export default ChatPanel;
