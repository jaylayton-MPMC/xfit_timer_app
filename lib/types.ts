export type TimerMode = 'amrap' | 'emom' | 'rounds';
export type TimerPhase = 'countdown' | 'work' | 'rest' | 'done';
export type AppScreen = 'select' | 'setup' | 'timer';

export interface TimerConfig {
  mode: TimerMode;
  totalSeconds: number;   // AMRAP total duration; EMOM total (minutes × 60)
  workSeconds: number;    // Rounds: work interval
  restSeconds: number;    // Rounds: rest interval
  numRounds: number;      // Rounds: round count
  countdownSecs: number;  // Pre-start countdown (3)
}

export interface TimerDisplay {
  phase: TimerPhase;
  timeDisplay: string;
  label: string;
  sublabel: string;
  currentRound: number;
  totalRounds: number;
  phaseProgress: number;  // 0–1, progress through the current phase
  isLastTen: boolean;
  bgGlow: string;         // CSS color for radial glow
}
