'use client';
import { useEffect } from 'react';
import { TimerConfig } from '@/lib/types';
import { useTimer } from '@/hooks/useTimer';
import { useWakeLock } from '@/hooks/useWakeLock';

interface Props {
  config: TimerConfig;
  onBack: () => void;
}

const PHASE_TEXT_COLOR = {
  countdown: 'text-amber-400',
  work: 'text-green-400',
  rest: 'text-blue-400',
  done: 'text-purple-400',
} as const;

const PHASE_PROGRESS_COLOR = {
  countdown: 'bg-amber-500',
  work: 'bg-green-500',
  rest: 'bg-blue-500',
  done: 'bg-purple-500',
} as const;

function timeFontSize(s: string): string {
  if (s.length <= 1) return '44vw';
  if (s.length <= 5) return '30vw';
  return '20vw';
}

export function TimerScreen({ config, onBack }: Props) {
  const { display, isRunning, start, pause, reset } = useTimer(config);
  const { acquire, release, active: wakeLockActive, supported: wakeLockSupported } = useWakeLock();

  // Auto-start the countdown as soon as the screen appears
  useEffect(() => {
    start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    acquire();
    return () => { release(); };
  }, [acquire, release]);

  const handleAgain = () => {
    reset();
    // reset is synchronous on refs; start on next tick so state settles
    setTimeout(start, 0);
  };

  const textColor = PHASE_TEXT_COLOR[display.phase];
  const progressColor = PHASE_PROGRESS_COLOR[display.phase];

  const isCountdown = display.phase === 'countdown';
  const isDone = display.phase === 'done';

  return (
    <div
      className="flex flex-col min-h-screen transition-all duration-700"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${display.bgGlow} 0%, #000 65%)`,
      }}
    >
      {/* Header row */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2">
        <button
          onClick={() => { pause(); onBack(); }}
          className="text-gray-600 active:text-gray-300 text-sm uppercase tracking-widest py-2 px-2"
        >
          ← Back
        </button>
        {wakeLockSupported && (
          <span
            className={`text-xs uppercase tracking-widest transition-colors ${
              wakeLockActive ? 'text-green-800' : 'text-gray-800'
            }`}
          >
            {wakeLockActive ? '⚡ Screen on' : '○ Screen lock'}
          </span>
        )}
      </div>

      {/* Main timer area */}
      <div className="flex flex-col flex-1 items-center justify-center px-4 gap-5">
        <div className="text-center">
          <p className={`text-lg font-black uppercase tracking-[0.3em] ${textColor}`}>
            {display.label}
          </p>
          {display.sublabel ? (
            <p className="text-gray-500 text-sm mt-1 tracking-widest uppercase">
              {display.sublabel}
            </p>
          ) : null}
        </div>

        {/* Big time / countdown number */}
        <div
          className={`font-black tabular-nums leading-none ${textColor} transition-colors duration-300`}
          style={{ fontSize: timeFontSize(display.timeDisplay) }}
        >
          {display.timeDisplay}
        </div>

        {/* Round indicators */}
        {display.totalRounds > 1 && !isCountdown && (
          <div className="flex flex-wrap gap-2 justify-center max-w-xs mt-1">
            {display.totalRounds <= 20
              ? Array.from({ length: display.totalRounds }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      i < display.currentRound ? progressColor : 'border border-gray-800'
                    }`}
                  />
                ))
              : display.currentRound > 0 && (
                  <p className="text-gray-500 text-sm">
                    Round {display.currentRound} / {display.totalRounds}
                  </p>
                )}
          </div>
        )}

        {/* Phase progress bar — hidden during countdown */}
        {!isCountdown && (
          <div className="w-full max-w-sm h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-700 rounded-full`}
              style={{ width: `${Math.min(100, display.phaseProgress * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls — hidden during countdown */}
      {!isCountdown && (
        <div className="flex gap-3 px-5 pb-12 pt-4 max-w-sm mx-auto w-full">
          {!isDone && (
            <button
              onClick={() => { pause(); reset(); }}
              className="flex-1 border border-gray-800 text-gray-600 font-bold rounded-2xl py-5
                         active:border-gray-600 active:text-gray-300 transition-colors
                         text-sm uppercase tracking-widest"
            >
              Reset
            </button>
          )}
          <button
            onClick={isDone ? handleAgain : isRunning ? pause : start}
            className={`font-black text-2xl rounded-2xl py-5 tracking-wider
              transition-all duration-150 active:scale-[0.97]
              ${isDone ? 'flex-[1] bg-purple-700 text-white' : 'flex-[2.5] bg-white text-black'}`}
          >
            {isDone ? 'Again' : isRunning ? 'Pause' : 'Resume'}
          </button>
        </div>
      )}
    </div>
  );
}
