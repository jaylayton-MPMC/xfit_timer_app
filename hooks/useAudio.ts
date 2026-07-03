'use client';
import { useRef, useCallback } from 'react';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, duration: number, vol = 0.55, delay = 0) => {
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.start(t);
        osc.stop(t + duration + 0.05);
      } catch {
        // audio not available
      }
    },
    [getCtx]
  );

  // Short pip — used for each countdown second
  const countdownBeep = useCallback(() => {
    tone(440, 0.12, 0.45);
  }, [tone]);

  // Triple ascending beep — "GO!"
  const goBeep = useCallback(() => {
    tone(880, 0.09, 0.5, 0);
    tone(880, 0.09, 0.55, 0.13);
    tone(1320, 0.35, 0.65, 0.28);
  }, [tone]);

  // Two ascending tones — work phase starts
  const workBeep = useCallback(() => {
    tone(880, 0.1, 0.55, 0);
    tone(1100, 0.3, 0.65, 0.16);
  }, [tone]);

  // Two descending tones — rest phase starts
  const restBeep = useCallback(() => {
    tone(660, 0.1, 0.4, 0);
    tone(528, 0.28, 0.45, 0.14);
  }, [tone]);

  // Soft tick — last 10 seconds warning
  const lastTenBeep = useCallback(() => {
    tone(880, 0.05, 0.2);
  }, [tone]);

  // Rising arpeggio — workout complete
  const doneBeep = useCallback(() => {
    tone(523, 0.14, 0.5, 0);
    tone(659, 0.14, 0.6, 0.2);
    tone(784, 0.14, 0.65, 0.4);
    tone(1047, 0.55, 0.75, 0.6);
  }, [tone]);

  // Single mid pip — EMOM minute marker
  const minuteBeep = useCallback(() => {
    tone(660, 0.12, 0.35);
  }, [tone]);

  return { countdownBeep, goBeep, workBeep, restBeep, lastTenBeep, doneBeep, minuteBeep };
}
