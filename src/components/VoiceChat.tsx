import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const INTRO_CUES = [
  { start: 1.8, end: 3.2, text: 'Hi...', audio: '/chatbot/voice-robot/cue1.mp3' },
  { start: 3.5, end: 6.2, text: "I'm Kitty... Sami's personal assistant!", audio: '/chatbot/voice-robot/cue2.mp3' },
  { start: 6.6, end: 9.2, text: 'How can I help you today?', audio: '/chatbot/voice-robot/cue3.mp3' },
];

interface VoiceChatProps {
  onClose: () => void;
}

type Phase = 'intro' | 'idle' | 'listening' | 'thinking' | 'speaking';

const VoiceChat: React.FC<VoiceChatProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const spokenCuesRef = useRef<Set<number>>(new Set());
  const transcriptRef = useRef<string>('');
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [displayTranscript, setDisplayTranscript] = useState('');
  const [botText, setBotText] = useState('');
  const [muted, setMuted] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (muted) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.pitch = 1.05;
    utt.lang = 'en-US';
    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }, [muted]);

  const playCueAudio = useCallback((audioSrc: string, fallbackText: string) => {
    if (muted) return;
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      const audio = new Audio(audioSrc);
      currentAudioRef.current = audio;
      audio.play().catch(() => {
        speak(fallbackText);
      });
    } catch {
      speak(fallbackText);
    }
  }, [muted, speak]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      const t = video.currentTime;
      INTRO_CUES.forEach((cue, idx) => {
        if (t >= cue.start && t <= cue.end && !spokenCuesRef.current.has(idx)) {
          spokenCuesRef.current.add(idx);
          playCueAudio(cue.audio, cue.text);
        }
      });
    };
    const onEnded = () => {
      setPhase('idle');
      setBotText('Go ahead, ask me anything!');
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [playCueAudio]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => { setPhase('listening'); setMicActive(true); setDisplayTranscript(''); transcriptRef.current = ''; };
    rec.onresult = (e: any) => {
      const txt = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      transcriptRef.current = txt;
      setDisplayTranscript(txt);
    };
    rec.onend = async () => {
      setMicActive(false);
      const final = transcriptRef.current.trim();
      if (!final) { setPhase('idle'); return; }
      setPhase('thinking');
      setBotText('Thinking…');
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: final }] }),
        });
        const data = await res.json();
        const reply: string = data.reply || data.message || 'Sorry, I could not understand.';
        setBotText(reply);
        setDisplayTranscript('');
        setPhase('speaking');
        speak(reply, () => setPhase('idle'));
      } catch {
        setBotText('Oops! Something went wrong.');
        setPhase('idle');
      }
    };
    rec.onerror = () => { setMicActive(false); setPhase('idle'); };
    recognitionRef.current = rec;
    rec.start();
  }, [speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setMicActive(false);
    setPhase('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const phaseLabel: Record<Phase, string> = {
    intro: '👋 Introducing…',
    idle: '🎙️ Tap mic to speak',
    listening: '👂 Listening…',
    thinking: '🤔 Thinking…',
    speaking: '🗣️ Speaking…',
  };

  const ringColor = phase === 'listening' ? '#22c55e' : '#fa4529';
  const ringGlow = phase === 'listening' ? 'rgba(34,197,94,0.35)' : 'rgba(250,69,41,0.3)';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', animation:'vcFadeIn 0.3s ease' }}>
      <style>{`
        @keyframes vcFadeIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes vcPulse { 0%,100%{box-shadow:0 0 0 0 rgba(250,69,41,0.55)} 50%{box-shadow:0 0 0 14px rgba(250,69,41,0)} }
        @keyframes vcPulseGreen { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.55)} 50%{box-shadow:0 0 0 14px rgba(34,197,94,0)} }
        @keyframes vcDots { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
      `}</style>
      <div style={{ position:'relative', width:'360px', background:'linear-gradient(160deg,#0f0f0f 0%,#1a0a05 100%)', borderRadius:'24px', border:'1px solid rgba(250,69,41,0.25)', boxShadow:'0 32px 80px rgba(0,0,0,0.7)', overflow:'hidden', padding:'0 0 32px', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {/* Header */}
        <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor: phase==='listening'?'#22c55e':'#fa4529', animation: phase==='listening'?'vcPulseGreen 1.2s infinite':'none' }} />
            <span style={{ color:'#fff', fontWeight:600, fontSize:'14px', fontFamily:'Inter,sans-serif' }}>Kitty — Voice Mode</span>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setMuted(m=>!m)} style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: muted?'#fa4529':'#aaa' }} title={muted?'Unmute':'Mute'}>
              {muted ? <VolumeX size={15}/> : <Volume2 size={15}/>}
            </button>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#aaa' }}>
              <X size={15}/>
            </button>
          </div>
        </div>

        {/* Robot Video */}
        <div style={{ width:'220px', height:'220px', marginTop:'24px', borderRadius:'50%', overflow:'hidden', border:`3px solid ${ringColor}`, boxShadow:`0 0 32px ${ringGlow}`, transition:'border-color 0.4s,box-shadow 0.4s', backgroundColor:'#111', flexShrink:0 }}>
          <video ref={videoRef} src="/chatbot/voice-robot/Robot_waving_and_greeting_camera_compressed.mp4" autoPlay playsInline muted={true} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
        </div>

        {/* Phase Status */}
        <div style={{ marginTop:'16px', fontSize:'13px', color:'rgba(255,255,255,0.5)', fontFamily:'Inter,sans-serif' }}>{phaseLabel[phase]}</div>

        {/* Bot / Transcript Text */}
        <div style={{ marginTop:'10px', minHeight:'56px', padding:'0 28px', textAlign:'center', fontSize:'14px', color:'#fff', lineHeight:1.6, fontFamily:'Inter,sans-serif' }}>
          {phase==='listening' && displayTranscript ? <span style={{ color:'#fa4529' }}>{displayTranscript}</span> : botText}
        </div>

        {/* Mic Button */}
        {(phase==='idle'||phase==='listening') && (
          <button onClick={micActive?stopListening:startListening} style={{ marginTop:'20px', width:'64px', height:'64px', borderRadius:'50%', border:'none', background: micActive?'linear-gradient(135deg,#22c55e,#16a34a)':'linear-gradient(135deg,#fa4529,#e03d24)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', animation: micActive?'vcPulseGreen 1.2s infinite':'vcPulse 0s', boxShadow: micActive?'0 4px 20px rgba(34,197,94,0.5)':'0 4px 20px rgba(250,69,41,0.5)', transition:'background 0.3s,box-shadow 0.3s' }} title={micActive?'Stop':'Speak'}>
            {micActive ? <MicOff size={26}/> : <Mic size={26}/>}
          </button>
        )}

        {/* Thinking Dots */}
        {phase==='thinking' && (
          <div style={{ display:'flex', gap:'6px', marginTop:'24px' }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', backgroundColor:'#fa4529', animation:`vcDots 1.2s ${i*0.2}s infinite` }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
