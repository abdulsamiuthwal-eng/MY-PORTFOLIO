import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

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
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const listeningVideoRef = useRef<HTMLVideoElement>(null);
  const talkingVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const spokenCuesRef = useRef<Set<number>>(new Set());
  const transcriptRef = useRef<string>('');
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [displayTranscript, setDisplayTranscript] = useState('');
  const [botText, setBotText] = useState('');
  const [muted, setMuted] = useState(false);

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

  const FILLER_AUDIOS = [
    '/chatbot/voice-robot/filler1.mp3',
    '/chatbot/voice-robot/filler2.mp3',
    '/chatbot/voice-robot/filler3.mp3',
  ];

  const playFiller = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (muted) { resolve(); return; }
      try {
        const randomFiller = FILLER_AUDIOS[Math.floor(Math.random() * FILLER_AUDIOS.length)];
        const audio = new Audio(randomFiller);
        currentAudioRef.current = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      } catch {
        resolve();
      }
    });
  }, [muted]);

  // Pre-start all 3 video streams in GPU cache for instant zero-black-screen transitions
  useEffect(() => {
    introVideoRef.current?.play().catch(() => {});
    listeningVideoRef.current?.play().catch(() => {});
    talkingVideoRef.current?.play().catch(() => {});
  }, []);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    try {
      recognitionRef.current?.stop();
    } catch {}

    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => {
      setPhase('listening');
      setDisplayTranscript('');
      transcriptRef.current = '';
    };
    rec.onresult = (e: any) => {
      const txt = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      transcriptRef.current = txt;
      setDisplayTranscript(txt);
    };
    rec.onend = async () => {
      const final = transcriptRef.current.trim();
      if (!final) {
        // If user didn't speak anything, seamlessly resume listening
        setPhase('listening');
        setBotText('I am listening...');
        try {
          setTimeout(() => startListening(), 400);
        } catch {}
        return;
      }
      
      // Shift to speaking phase so talking.mp4 animation plays while speaking
      setPhase('speaking');
      setBotText('Thinking…');
      
      // Play instant natural filler audio ("Hmm... Got it!" / "Aha...")
      playFiller();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: final }] }),
        });
        const data = await res.json();
        const reply: string = data.reply || data.message || data.text || 'I am right here to help!';
        setBotText(reply);
        setDisplayTranscript('');
        setPhase('speaking');
        speak(reply, () => {
          // Immediately after speaking finishes, resume listening automatically (Hands-Free!)
          setPhase('listening');
          setBotText('I am listening...');
          setTimeout(() => startListening(), 300);
        });
      } catch {
        setBotText('Oops! Something went wrong.');
        setPhase('listening');
        setTimeout(() => startListening(), 1000);
      }
    };
    rec.onerror = () => {
      // Auto reconnect speech listener on silence/error
      setTimeout(() => {
        if (phase !== 'intro' && phase !== 'speaking') {
          startListening();
        }
      }, 600);
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {}
  }, [phase, playFiller, speak]);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;

    if (phase === 'intro') {
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
        setPhase('listening');
        setBotText('I am listening...');
        startListening();
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('ended', onEnded);
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('ended', onEnded);
      };
    }
  }, [phase, playCueAudio, startListening]);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

  const phaseLabel: Record<Phase, string> = {
    intro: '👋 Introducing…',
    idle: '👂 Listening to you...',
    listening: '👂 Listening to you...',
    thinking: '🤔 Processing…',
    speaking: '🗣️ Speaking…',
  };

  const ringColor = phase === 'listening' ? '#22c55e' : '#fa4529';
  const ringGlow = phase === 'listening' ? 'rgba(34,197,94,0.4)' : 'rgba(250,69,41,0.3)';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.82)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', animation:'vcFadeIn 0.3s ease' }}>
      <style>{`
        @keyframes vcFadeIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes vcPulse { 0%,100%{box-shadow:0 0 0 0 rgba(250,69,41,0.55)} 50%{box-shadow:0 0 0 14px rgba(250,69,41,0)} }
        @keyframes vcPulseGreen { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.55)} 50%{box-shadow:0 0 0 14px rgba(34,197,94,0)} }
        @keyframes vcDots { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes liveVoiceWave { 0%,100%{height:6px} 50%{height:20px} }
      `}</style>
      <div style={{ position:'relative', width:'360px', maxWidth:'calc(100vw - 32px)', background:'linear-gradient(160deg,#0f0f0f 0%,#1a0a05 100%)', borderRadius:'24px', border:'1px solid rgba(250,69,41,0.25)', boxShadow:'0 32px 80px rgba(0,0,0,0.85)', overflow:'hidden', padding:'0 0 32px', display:'flex', flexDirection:'column', alignItems:'center', transform:'translateZ(0)' }}>
        {/* Header */}
        <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor: phase==='listening'?'#22c55e':'#fa4529', animation: phase==='listening'?'vcPulseGreen 1.2s infinite':'none' }} />
            <span style={{ color:'#fff', fontWeight:600, fontSize:'14px', fontFamily:'Inter,sans-serif' }}>Kitty — Live Hands-Free Mode</span>
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

        {/* Robot Video Box (3-Layer Preloaded Hardware Crossfade Stack — ZERO Black Screen, 60 FPS Mobile GPU Optimized) */}
        <div style={{ position:'relative', width:'220px', height:'220px', marginTop:'24px', borderRadius:'50%', overflow:'hidden', border:`3px solid ${ringColor}`, boxShadow:`0 0 32px ${ringGlow}`, transition:'border-color 0.4s,box-shadow 0.4s', backgroundColor:'#0a0a0a', flexShrink:0, transform:'translateZ(0)', WebkitTransform:'translateZ(0)' }}>
          {/* Layer 1: Intro Greeting Video */}
          <video
            ref={introVideoRef}
            src="/chatbot/voice-robot/Robot_waving_and_greeting_camera_compressed.mp4"
            autoPlay
            playsInline
            muted={true}
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: phase === 'intro' ? 1 : 0,
              transition: 'opacity 0.35s ease-in-out',
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'opacity',
            }}
          />

          {/* Layer 2: Listening & Attentive Loop Video */}
          <video
            ref={listeningVideoRef}
            src="/chatbot/voice-robot/kitty-listening-loop.mp4"
            autoPlay
            loop
            playsInline
            muted={true}
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: phase !== 'intro' && phase !== 'speaking' ? 1 : 0,
              transition: 'opacity 0.35s ease-in-out',
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'opacity',
            }}
          />

          {/* Layer 3: Talking / Answering Loop Video */}
          <video
            ref={talkingVideoRef}
            src="/chatbot/voice-robot/talking.mp4"
            autoPlay
            loop
            playsInline
            muted={true}
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: phase === 'speaking' ? 1 : 0,
              transition: 'opacity 0.35s ease-in-out',
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'opacity',
            }}
          />
        </div>

        {/* Phase Status */}
        <div style={{ marginTop:'16px', fontSize:'13px', color:'rgba(255,255,255,0.6)', fontFamily:'Inter,sans-serif' }}>{phaseLabel[phase]}</div>

        {/* Bot / Transcript Text */}
        <div style={{ marginTop:'10px', minHeight:'56px', padding:'0 28px', textAlign:'center', fontSize:'14px', color:'#fff', lineHeight:1.6, fontFamily:'Inter,sans-serif' }}>
          {phase==='listening' && displayTranscript ? <span style={{ color:'#22c55e', fontWeight:500 }}>"{displayTranscript}"</span> : botText}
        </div>

        {/* Live Audio Visualizer (Auto Active — No Button Required!) */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', height:'28px', marginTop:'16px' }}>
          {[0.1, 0.3, 0.5, 0.2, 0.4].map((delay, idx) => (
            <div
              key={idx}
              style={{
                width: '4px',
                borderRadius: '4px',
                backgroundColor: phase === 'listening' ? '#22c55e' : '#fa4529',
                animation: phase === 'listening' || phase === 'speaking' ? `liveVoiceWave 1s ease-in-out infinite ${delay}s` : 'none',
                height: phase === 'listening' || phase === 'speaking' ? '16px' : '6px',
                transition: 'background-color 0.3s, height 0.3s',
              }}
            />
          ))}
        </div>

        {/* Thinking Dots */}
        {phase==='thinking' && (
          <div style={{ display:'flex', gap:'6px', marginTop:'16px' }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#fa4529', animation:`vcDots 1.2s ${i*0.2}s infinite` }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
