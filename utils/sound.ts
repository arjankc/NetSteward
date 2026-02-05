// Simple Web Audio API Synthesizer for UI Sounds

let audioCtx: AudioContext | null = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const setGlobalMute = (muted: boolean) => {
  isMuted = muted;
  if (!muted && audioCtx?.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (
  ctx: AudioContext, 
  freq: number, 
  type: OscillatorType, 
  duration: number, 
  vol: number, 
  delay: number = 0
) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
};

export const playSound = (type: 'hover' | 'click' | 'gamestart' | 'success' | 'failure' | 'badge' | 'type') => {
  if (isMuted) return;

  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  switch (type) {
    case 'hover': {
      // High pitched, very short blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.005, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'click': {
      // Mechanical click
      playTone(ctx, 300, 'triangle', 0.1, 0.05);
      break;
    }

    case 'type': {
        // Very soft typing sound
        playTone(ctx, 800, 'sine', 0.03, 0.01);
        break;
    }

    case 'gamestart': {
      // Power up sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
    }
    
    case 'success': {
      // Major chord
      playTone(ctx, 440, 'sine', 0.3, 0.05, 0);       // A4
      playTone(ctx, 554.37, 'sine', 0.3, 0.05, 0.05); // C#5
      playTone(ctx, 659.25, 'sine', 0.5, 0.05, 0.1);  // E5
      break;
    }

    case 'failure': {
      // Dissonant descending
      playTone(ctx, 150, 'sawtooth', 0.5, 0.05, 0);
      playTone(ctx, 140, 'sawtooth', 0.5, 0.05, 0.2);
      break;
    }

    case 'badge': {
      // Sparkly high arpeggio
      playTone(ctx, 880, 'square', 0.1, 0.03, 0);
      playTone(ctx, 1108, 'square', 0.1, 0.03, 0.08);
      playTone(ctx, 1318, 'square', 0.1, 0.03, 0.16);
      playTone(ctx, 1760, 'square', 0.4, 0.05, 0.24);
      break;
    }
  }
};