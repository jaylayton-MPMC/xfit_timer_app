'use client';
import { useState, useRef, useEffect } from 'react';
import { TimerMode, TimerConfig } from '@/lib/types';
import { formatTime } from '@/lib/timerLogic';

interface Props {
  mode: TimerMode;
  onBack: () => void;
  onStart: (config: TimerConfig) => void;
}

// ── Time picker modal ────────────────────────────────────────────────────────

interface TimePickerProps {
  label: string;
  totalSeconds: number;
  onConfirm: (seconds: number) => void;
  onClose: () => void;
}

function TimePickerModal({ label, totalSeconds, onConfirm, onClose }: TimePickerProps) {
  const initMin = Math.floor(totalSeconds / 60);
  const initSec = totalSeconds % 60;
  const [mins, setMins] = useState(String(initMin));
  const [secs, setSecs] = useState(String(initSec).padStart(2, '0'));
  const minRef = useRef<HTMLInputElement>(null);

  useEffect(() => { minRef.current?.focus(); }, []);

  const handleConfirm = () => {
    const m = Math.max(0, parseInt(mins) || 0);
    const s = Math.min(59, Math.max(0, parseInt(secs) || 0));
    const total = m * 60 + s;
    if (total > 0) onConfirm(total);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
      onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-t-3xl w-full max-w-sm px-6 pt-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">{label}</p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-600 text-xs uppercase tracking-widest">Min</label>
            <input
              ref={minRef}
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              value={mins}
              onChange={e => setMins(e.target.value)}
              onFocus={e => e.target.select()}
              onKeyDown={handleKey}
              className="w-24 h-16 bg-gray-800 border border-gray-700 rounded-2xl
                         text-white font-black text-3xl text-center tabular-nums
                         focus:outline-none focus:border-white"
            />
          </div>

          <span className="text-gray-500 font-black text-3xl mt-4">:</span>

          <div className="flex flex-col items-center gap-1">
            <label className="text-gray-600 text-xs uppercase tracking-widest">Sec</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={secs}
              onChange={e => setSecs(e.target.value)}
              onFocus={e => e.target.select()}
              onKeyDown={handleKey}
              className="w-24 h-16 bg-gray-800 border border-gray-700 rounded-2xl
                         text-white font-black text-3xl text-center tabular-nums
                         focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-white text-black font-black text-xl rounded-2xl py-4
                     active:scale-[0.97] transition-transform"
        >
          Set time
        </button>
      </div>
    </div>
  );
}

// ── Time stepper with tap-to-edit ───────────────────────────────────────────

interface TimeStepperProps {
  label: string;
  value: number;       // total seconds
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function TimeStepper({ label, value, onChange, min = 5, max = 3600, step = 5 }: TimeStepperProps) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      {editing && (
        <TimePickerModal
          label={label}
          totalSeconds={value}
          onConfirm={v => onChange(Math.min(max, Math.max(min, v)))}
          onClose={() => setEditing(false)}
        />
      )}
      <div className="flex items-center justify-between bg-gray-900 rounded-2xl px-5 py-4">
        <span className="text-gray-300 font-semibold text-sm">{label}</span>
        <div className="flex items-center gap-3">
          <button
            onPointerDown={() => onChange(Math.max(min, value - step))}
            className="w-11 h-11 rounded-full bg-gray-700 text-white text-2xl font-black
                       active:bg-gray-600 flex items-center justify-center select-none"
          >
            −
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-white font-black text-xl w-16 text-center tabular-nums
                       active:text-gray-300 underline decoration-dotted underline-offset-4
                       decoration-gray-600"
          >
            {formatTime(value)}
          </button>
          <button
            onPointerDown={() => onChange(Math.min(max, value + step))}
            className="w-11 h-11 rounded-full bg-gray-700 text-white text-2xl font-black
                       active:bg-gray-600 flex items-center justify-center select-none"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}

// ── Plain number stepper (unchanged) ────────────────────────────────────────

interface StepperProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  display?: string;
}

function Stepper({ label, value, onChange, min, max, step = 1, display }: StepperProps) {
  const shown = display ?? String(value);
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-2xl px-5 py-4">
      <span className="text-gray-300 font-semibold text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onPointerDown={() => onChange(Math.max(min, value - step))}
          className="w-11 h-11 rounded-full bg-gray-700 text-white text-2xl font-black
                     active:bg-gray-600 flex items-center justify-center select-none"
        >
          −
        </button>
        <span className="text-white font-black text-xl w-16 text-center tabular-nums">
          {shown}
        </span>
        <button
          onPointerDown={() => onChange(Math.min(max, value + step))}
          className="w-11 h-11 rounded-full bg-gray-700 text-white text-2xl font-black
                     active:bg-gray-600 flex items-center justify-center select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

const MODE_TITLES: Record<TimerMode, string> = {
  amrap: 'AMRAP',
  emom: 'EMOM',
  rounds: 'ROUNDS',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-600 text-xs uppercase tracking-[0.2em] px-1 pt-2 pb-1">{children}</p>
  );
}

export function SetupScreen({ mode, onBack, onStart }: Props) {
  // AMRAP / EMOM: duration per set
  const [totalMinutes, setTotalMinutes] = useState(mode === 'emom' ? 10 : 20);
  // All modes: rounds/sets count and rest between
  const [numSets, setNumSets] = useState(1);
  const [setBetweenRestSec, setSetBetweenRestSec] = useState(0);
  // Rounds only: work/rest intervals
  const [workSec, setWorkSec] = useState(40);
  const [restSec, setRestSec] = useState(0);
  const [numRounds, setNumRounds] = useState(8);

  // Derived totals for summary
  const totalTime = (() => {
    if (mode === 'rounds') {
      return formatTime(workSec * numRounds + restSec * (numRounds - 1));
    }
    if (mode === 'emom') return formatTime(60 * numSets + setBetweenRestSec * (numSets - 1));
    const perSet = totalMinutes * 60;
    return formatTime(perSet * numSets + setBetweenRestSec * (numSets - 1));
  })();

  const handleStart = () => {
    if (mode === 'rounds') {
      onStart({
        mode,
        totalSeconds: 0,        // unused in rounds mode
        workSeconds: workSec,
        restSeconds: restSec,
        numRounds,
        countdownSecs: 3,
      });
    } else {
      onStart({
        mode,
        totalSeconds: mode === 'emom' ? 60 : totalMinutes * 60,
        workSeconds: 0,
        restSeconds: setBetweenRestSec,
        numRounds: numSets,
        countdownSecs: 3,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black px-5 py-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 active:text-white text-xl px-2 py-2 -ml-2"
        >
          ←
        </button>
        <h2 className="text-3xl font-black text-white">{MODE_TITLES[mode]}</h2>
      </div>

      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">

        {/* ── AMRAP fields ── */}
        {mode === 'amrap' && (
          <>
            <SectionLabel>Workout</SectionLabel>
            <Stepper
              label="AMRAP duration (min)"
              value={totalMinutes}
              onChange={setTotalMinutes}
              min={1}
              max={60}
            />
            <SectionLabel>Sets</SectionLabel>
            <Stepper
              label="Number of sets"
              value={numSets}
              onChange={setNumSets}
              min={1}
              max={20}
            />
            {numSets > 1 && (
              <TimeStepper
                label="Rest between sets"
                value={setBetweenRestSec}
                onChange={setSetBetweenRestSec}
                min={0}
                max={600}
                step={10}
              />
            )}
          </>
        )}

        {/* ── EMOM fields ── */}
        {mode === 'emom' && (
          <>
            <SectionLabel>Rounds</SectionLabel>
            <Stepper
              label="Rounds (1 min each)"
              value={numSets}
              onChange={setNumSets}
              min={1}
              max={60}
            />
            {numSets > 1 && (
              <TimeStepper
                label="Rest between rounds"
                value={setBetweenRestSec}
                onChange={setSetBetweenRestSec}
                min={0}
                max={600}
                step={10}
              />
            )}
          </>
        )}

        {/* ── ROUNDS fields ── */}
        {mode === 'rounds' && (
          <>
            <SectionLabel>Intervals</SectionLabel>
            <TimeStepper
              label="Work time"
              value={workSec}
              onChange={setWorkSec}
              min={5}
              max={3600}
              step={5}
            />
            <TimeStepper
              label="Rest time"
              value={restSec}
              onChange={setRestSec}
              min={0}
              max={3600}
              step={5}
            />
            <Stepper
              label="Rounds"
              value={numRounds}
              onChange={setNumRounds}
              min={1}
              max={99}
            />
          </>
        )}

        {/* Summary */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4 mt-2">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Summary</p>

          {mode === 'amrap' && numSets === 1 && (
            <p className="text-white font-bold">{totalMinutes} min AMRAP</p>
          )}
          {mode === 'amrap' && numSets > 1 && (
            <p className="text-white font-bold">
              {numSets} × {totalMinutes} min AMRAP · {formatTime(setBetweenRestSec)} rest
            </p>
          )}

          {mode === 'emom' && numSets === 1 && (
            <p className="text-white font-bold">{numSets} round EMOM</p>
          )}
          {mode === 'emom' && numSets > 1 && (
            <p className="text-white font-bold">
              {numSets} round EMOM{setBetweenRestSec > 0 ? ` · ${formatTime(setBetweenRestSec)} rest` : ''}
            </p>
          )}

          {mode === 'rounds' && (
            <p className="text-white font-bold">
              {numRounds} × ({formatTime(workSec)} work / {formatTime(restSec)} rest)
            </p>
          )}

          <p className="text-gray-400 text-sm mt-1">Total time: {totalTime}</p>
        </div>

        <button
          onClick={handleStart}
          className="mt-3 bg-white text-black font-black text-2xl rounded-2xl py-5
                     active:scale-[0.97] transition-transform shadow-xl tracking-wider"
        >
          START
        </button>
      </div>
    </div>
  );
}
