import React, { useState, useRef, useEffect } from 'react';
import { Send, X, User, Mic, MicOff, Volume2, VolumeX, SkipForward, Square } from 'lucide-react';
import type { ChatMessage } from '../lib/chat';
import { sendMessage } from '../lib/chat';

interface ChatPanelProps {
  onClose: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  lastFailedMessage: string | null;
  setLastFailedMessage: (msg: string | null) => void;
  pendingSection: string | null;
  setPendingSection: (section: string | null) => void;
}

const SUGGESTED_QUESTIONS = [
  '🛠️ What are his skills?',
  '💼 Tell me about his projects',
  '🎓 Education & experience?',
  '📞 How to contact him?',
  '🤝 Is he available for hire?',
];

const BotAvatarVideo: React.FC = () => {
  return (
    <video
      src="/chatbot/boticon.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center 25%',
        borderRadius: '50%',
        display: 'block',
      }}
    />
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose,
  messages,
  setMessages,
  lastFailedMessage,
  setLastFailedMessage,
  pendingSection,
  setPendingSection,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock background body scroll on mobile when chat panel is active
  useEffect(() => {
    if (isMobile) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isMobile]);

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
      if (hash === '#contact-page') {
        window.location.hash = '#contact-page';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // If switching from contact page or project detail page back to homepage sections
      if (window.location.hash === '#contact-page' || window.location.hash.startsWith('#project/')) {
        window.location.hash = hash;
        return;
      }

      // In-page section scrolling (#biography, #skills, #timeline, #project, #home)
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', hash);
      } else {
        window.location.hash = hash;
      }
    }, 300);
  };

  const isAffirmativeReply = (text: string) => {
    const normalized = text.trim().toLowerCase();
    return /\b(han|haan|hn|yes|sure|open|karo|kr ?do|theek|thik|please)\b/.test(normalized);
  };

  const [isStreaming, setIsStreaming] = useState(false);
  const typeIntervalRef = useRef<any>(null);

  const handleStop = () => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setLoading(false);
    setIsStreaming(false);
  };

  const addMessage = async (userText: string) => {
    const userMsg: ChatMessage = { role: 'user', text: userText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLastFailedMessage(null);

    if (pendingSection && isAffirmativeReply(userText)) {
      setPendingSection(null);
      scrollToSection(pendingSection);
    }

    setLoading(true);
    setIsStreaming(true);

    try {
      const result = await sendMessage(updated);
      setLoading(false);
      speakText(result.text);
      setPendingSection(result.section || null);

      // Typewriter Effect: character-by-character smooth streaming
      const fullText = result.text;
      let currIndex = 0;

      setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);

      const typeInterval = setInterval(() => {
        currIndex += 3;
        const chunk = fullText.slice(0, currIndex);

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', text: chunk };
          return next;
        });

        if (currIndex >= fullText.length) {
          clearInterval(typeInterval);
          typeIntervalRef.current = null;
          setIsStreaming(false);
        }
      }, 16);

      typeIntervalRef.current = typeInterval;
    } catch {
      setLastFailedMessage(userText);
      setMessages((prev) => [...prev, { role: 'assistant', text: '⚠️ Oops! Something went wrong. Please check your connection and try again.' }]);
      setPendingSection(null);
      setLoading(false);
      setIsStreaming(false);
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

  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinishIntro = () => {
    if (isVideoFading) return;
    setIsVideoFading(true);
    setTimeout(() => {
      setShowIntroVideo(false);
    }, 400);
  };

  // Defer video playback slightly until after 60 FPS drawer slide animation completes (prevents GPU decoding thread lag)
  useEffect(() => {
    if (showIntroVideo) {
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 2; // Skip first 2 seconds (total 8 seconds video)
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsVideoMuted(true);
                videoRef.current.play().catch(() => {});
              }
            });
          }
        }
      }, 180);

      return () => clearTimeout(playTimer);
    }
  }, [showIntroVideo]);

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
    boxShadow: '0 -8px 30px rgba(0,0,0,0.22)',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--ptf-font-sans)',
    border: 'none',
    borderTop: '1px solid var(--ptf-border-color)',
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    animation: 'popUpMobileSheet 0.24s cubic-bezier(0, 0, 0.2, 1) forwards',
  } : {
    position: 'fixed',
    bottom: '166px',
    right: '30px',
    width: '340px',
    height: '480px',
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
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    animation: 'popOutFromIcon 0.28s cubic-bezier(0, 0, 0.2, 1) forwards',
  };

  return (
    <>
      <style>{`
        @keyframes popOutFromIcon {
          0% {
            transform: scale(0.1) translate3d(120%, 120%, 0);
            opacity: 0;
            transform-origin: bottom right;
          }
          100% {
            transform: scale(1) translate3d(0, 0, 0);
            opacity: 1;
            transform-origin: bottom right;
          }
        }
        @keyframes popUpMobileSheet {
          0% {
            transform: translate3d(0, 100%, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Mobile backdrop overlay */}
      {isMobile && (
        <div
          onClick={onClose}
          onTouchMove={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            touchAction: 'none',
          }}
        />
      )}
    <div style={panelStyle}>
      {/* Intro Video Full-Boundary Overlay (White Theme Buffer) */}
      {showIntroVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            opacity: isVideoFading ? 0 : 1,
            transition: 'opacity 0.4s ease',
            overflow: 'hidden',
          }}
        >
          {/* Top Header overlay for close button */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              zIndex: 120,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#111827', fontSize: '13px', fontWeight: 600, textShadow: '0 1px 4px rgba(255,255,255,0.9)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span>AI Assistant</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                padding: '6px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Video element covering the ENTIRE container boundary over White theme */}
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
            {!isVideoReady && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                color: '#6c757d',
                fontSize: '12px',
                gap: '8px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--ptf-accent-1)', animation: 'pulse 1s infinite' }} />
                <span>Loading Assistant...</span>
              </div>
            )}
            <video
              ref={videoRef}
              src="/chatbot/Robot_cleans_teeth_and_waves_202608142326.mp4"
              autoPlay
              playsInline
              onLoadedData={() => setIsVideoReady(true)}
              onPlaying={() => setIsVideoReady(true)}
              onEnded={handleFinishIntro}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: isVideoReady ? 1 : 0,
                transition: 'opacity 0.35s ease-out',
              }}
            />

            {/* Seamless Floating Controls Overlay INSIDE Video Bottom Area (Under feet) */}
            <div
              style={{
                position: 'absolute',
                bottom: isMobile ? '24px' : '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 120,
              }}
            >
              {/* Sound Toggle (Transparent Icon-Only) */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    const newMuted = !videoRef.current.muted;
                    videoRef.current.muted = newMuted;
                    setIsVideoMuted(newMuted);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.8))',
                }}
                aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
              >
                {isVideoMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>

              {/* Seamless Skip Button (Transparent Icon-Only) */}
              <button
                onClick={handleFinishIntro}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.8))',
                }}
                aria-label="Skip video intro"
              >
                <SkipForward size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
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
        overscrollBehavior: 'contain',
        touchAction: 'pan-y',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: msg.role === 'user' ? 'var(--ptf-accent-1)' : 'transparent',
              color: msg.role === 'user' ? '#fff' : '#495057',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {msg.role === 'user' ? <User size={18} /> : <BotAvatarVideo />}
            </div>
            <div 
              className={msg.role === 'assistant' ? 'gemini-message-fade' : ''}
              style={{
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
              }}
            >
              {msg.role === 'assistant' ? (
                <>
                  <FormattedText text={msg.text} />
                  {isStreaming && i === messages.length - 1 && (
                    <span className="gemini-streaming-cursor" title="AI Streaming..." />
                  )}
                </>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {/* Retry Button on Error */}
        {lastFailedMessage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <button
              onClick={() => addMessage(lastFailedMessage)}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--ptf-accent-1)',
                backgroundColor: 'rgba(250, 69, 41, 0.08)',
                color: 'var(--ptf-accent-1)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              🔄 Retry last message
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d', fontSize: '12px', fontStyle: 'italic', paddingLeft: '4px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
              <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
            </div>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Persistent Quick Questions Pill Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '8px 12px',
        borderTop: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => addMessage(q)}
            disabled={loading}
            style={{
              whiteSpace: 'nowrap',
              background: '#ffffff',
              border: '1px solid #dee2e6',
              borderRadius: '16px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#343a40',
              cursor: loading ? 'default' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {q}
          </button>
        ))}
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
            backgroundColor: listening ? 'rgba(250, 69, 41, 0.15)' : '#f1f3f5',
            color: listening ? 'var(--ptf-accent-1)' : '#495057',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={listening ? 'Stop listening' : 'Start voice input'}
          title={listening ? 'Listening...' : 'Use microphone'}
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
        {(loading || isStreaming) ? (
          <button
            onClick={handleStop}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'var(--ptf-accent-1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(250, 69, 41, 0.4)',
              transition: 'all 0.2s ease',
            }}
            title="Stop generating"
            aria-label="Stop generating"
          >
            <Square size={13} fill="#ffffff" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: input.trim() ? '#000000' : '#e0e0e0',
              color: input.trim() ? '#ffffff' : '#999999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: input.trim() ? '0 2px 8px rgba(0, 0, 0, 0.25)' : 'none',
            }}
            title={input.trim() ? 'Send message' : 'Type a message'}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
    </>
  );
};

// Formatted Markdown text renderer (Headings, Bold text, Bullet lists)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: '4px' }} />;

        // Headings: ### Header or ## Header
        if (/^#+\s/.test(trimmed)) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={idx} style={{ marginTop: '6px', marginBottom: '2px', fontSize: '13px', fontWeight: 700, color: 'var(--ptf-accent-1)' }}>
              {renderBoldText(headingText)}
            </div>
          );
        }

        // Bullet points: - item, * item, • item
        if (/^[-*•]\s/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^[-*•]\s*/, '');
          return (
            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', paddingLeft: '2px' }}>
              <span style={{ color: 'var(--ptf-accent-1)', fontWeight: 'bold', fontSize: '13px' }}>•</span>
              <span style={{ flex: 1 }}>{renderBoldText(bulletContent)}</span>
            </div>
          );
        }

        return <div key={idx}>{renderBoldText(trimmed)}</div>;
      })}
    </div>
  );
};

const renderBoldText = (str: string) => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default ChatPanel;
