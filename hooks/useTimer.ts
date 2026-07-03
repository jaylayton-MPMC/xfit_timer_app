'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TimerConfig } from '@/lib/types';
import { deriveDisplay, isEmomMinuteBoundary } from '@/lib/timerLogic';
import { useAudio } from './useAudio';

export function useTimer(config: TimerConfig) {
  const audio = useAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(-config.countdownSecs);
  const prevSecRef = useRef(-config.countdownSecs);

  // Simple 1-second interval — functional update means no stale-closure issues
  // and React Strict Mode's double-invoke doesn't corrupt anything.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setElapsedSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const display = useMemo(() => deriveDisplay(config, elapsedSec), [config, elapsedSec]);

  // Audio on each second change
  useEffect(() => {
    const sec = elapsedSec;
    const prev = prevSecRef.current;
    if (sec === prev) return;
    prevSecRef.current = sec;

    const a = audioRef.current;
    const prevDisplay = deriveDisplay(config, prev);
    const currDisplay = deriveDisplay(config, sec);

    if (sec < 0 && sec >= -(config.countdownSecs - 1)) {
      a.countdownBeep();
    }

    if (prev < 0 && sec === 0 && currDisplay.phase !== 'done') {
      a.goBeep();
    }

    if (currDisplay.phase !== prevDisplay.phase && sec > 0) {
      if (currDisplay.phase === 'work') a.workBeep();
      else if (currDisplay.phase === 'rest') a.restBeep();
      else if (currDisplay.phase === 'done') a.doneBeep();
    }

    if (isEmomMinuteBoundary(config, sec)) {
      a.minuteBeep();
    }

    if (currDisplay.isLastTen && currDisplay.phase === 'work' && sec >= 0) {
      a.lastTenBeep();
    }
  }, [elapsedSec, config]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    prevSecRef.current = -config.countdownSecs;
    setElapsedSec(-config.countdownSecs);
  }, [config.countdownSecs]);

  // Auto-stop when done
  useEffect(() => {
    if (display.phase === 'done' && isRunning) {
      setIsRunning(false);
    }
  }, [display.phase, isRunning]);

  return { display, isRunning, elapsedSec, start, pause, reset };
}
