import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { ChatMessage } from '../lib/chat';
import ChatPanel from './ChatPanel';

interface ChatIconProps {
  isContactPage?: boolean;
}

const ChatIcon: React.FC<ChatIconProps> = ({ isContactPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipState, setTooltipState] = useState<'hidden' | 'fade-in' | 'visible' | 'fade-out'>('hidden');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const scrollDismissed = useRef(false);

  // Preserved chat state across open/close
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '👋 Welcome! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!' },
  ]);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  // Hide Chatbot on mobile view when on Contact Page.
  // NOTE: This must stay AFTER all hooks — an early return before a hook would
  // change the hook count between renders and crash the whole app on mobile.
  const isHiddenOnMobile = isMobile && isContactPage;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Don't show tooltip on mobile (no hover)
    if (isMobile) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const onScroll = () => {
      if (scrollDismissed.current) return;
      scrollDismissed.current = true;
      timeouts.forEach(clearTimeout);
      setTooltipState('fade-out');
      setTimeout(() => setTooltipState('hidden'), 800);
    };

    window.addEventListener('scroll', onScroll, { once: true });

    timeouts.push(setTimeout(() => setTooltipState('fade-in'), 600));
    timeouts.push(setTimeout(() => setTooltipState('visible'), 1400));
    timeouts.push(setTimeout(() => setTooltipState('fade-out'), 4500));
    timeouts.push(setTimeout(() => setTooltipState('hidden'), 5500));

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isMobile]);

  const tooltipOpacity = tooltipState === 'hidden' ? 0
    : tooltipState === 'fade-in' ? '0.6'
    : tooltipState === 'fade-out' ? '0'
    : 1;

  const buttonSize = isMobile ? '46px' : '50px';

  // Render nothing on mobile + contact page (all hooks already called above)
  if (isHiddenOnMobile) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <ChatPanel
          onClose={() => setIsOpen(false)}
          messages={messages}
          setMessages={setMessages}
          lastFailedMessage={lastFailedMessage}
          setLastFailedMessage={setLastFailedMessage}
          pendingSection={pendingSection}
          setPendingSection={setPendingSection}
        />
      )}

      <div
        className="ptf-chat-wrapper"
        style={{
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row-reverse',
          gap: '12px',
          transition: 'bottom 0.2s ease-out, right 0.25s ease',
        }}
      >
        <button
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          className="ptf-chat-icon"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            backgroundColor: isHovered ? 'var(--ptf-accent-1)' : 'var(--ptf-black-color)',
            color: 'var(--ptf-white-color)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isHovered
              ? '0 10px 30px rgba(250, 69, 41, 0.3)'
              : '0 10px 20px rgba(0, 0, 0, 0.15)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            flexShrink: 0,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>

        {/* Tooltip — only on desktop */}
        {!isOpen && !isMobile && (
          <div
            className="ptf-chat-tooltip"
            style={{
              position: 'relative',
              opacity: tooltipOpacity,
              transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--ptf-black-color)',
                color: 'var(--ptf-white-color)',
                fontFamily: 'var(--ptf-font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                whiteSpace: 'nowrap',
              }}
            >
              Ask me anything
            </div>
            <div
              style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '0',
                height: '0',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '5px solid var(--ptf-black-color)',
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatIcon;
