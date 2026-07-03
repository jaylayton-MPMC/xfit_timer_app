'use client';
import { TimerMode } from '@/lib/types';

interface Props {
  onSelect: (mode: TimerMode) => void;
}

const MODES: {
  id: TimerMode;
  name: string;
  full: string;
  hint: string;
  gradient: string;
  border: string;
}[] = [
  {
    id: 'amrap',
    name: 'AMRAP',
    full: 'As Many Rounds As Possible',
    hint: 'Set a time cap and go until the clock hits zero.',
    gradient: 'from-green-950 to-green-800',
    border: 'border-green-600',
  },
  {
    id: 'emom',
    name: 'EMOM',
    full: 'Every Minute On the Minute',
    hint: 'Beeps at the start of each minute to keep you on pace.',
    gradient: 'from-blue-950 to-blue-800',
    border: 'border-blue-600',
  },
  {
    id: 'rounds',
    name: 'ROUNDS',
    full: 'Work / Rest Intervals',
    hint: 'Set work time, rest time, and how many rounds.',
    gradient: 'from-purple-950 to-purple-800',
    border: 'border-purple-600',
  },
];

export function SelectScreen({ onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-black px-5 py-12">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-white tracking-tight">WOD TIMER</h1>
        <p className="text-gray-500 mt-2 text-xs uppercase tracking-[0.25em]">
          Select workout type
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto w-full flex-1 justify-center">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`
              bg-gradient-to-br ${mode.gradient} border ${mode.border}
              rounded-2xl p-6 text-left shadow-xl
              active:scale-[0.97] active:brightness-110
              transition-all duration-100
            `}
          >
            <p className="text-3xl font-black text-white tracking-widest">{mode.name}</p>
            <p className="text-white/70 font-semibold text-sm mt-1">{mode.full}</p>
            <p className="text-white/35 text-xs mt-1">{mode.hint}</p>
          </button>
        ))}
      </div>

      <p className="text-gray-800 text-xs text-center mt-8">
        Screen stays on during your WOD
      </p>
    </div>
  );
}
