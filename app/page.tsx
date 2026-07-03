'use client';
import { useState } from 'react';
import { AppScreen, TimerMode, TimerConfig } from '@/lib/types';
import { SelectScreen } from '@/components/SelectScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { TimerScreen } from '@/components/TimerScreen';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('select');
  const [mode, setMode] = useState<TimerMode>('amrap');
  const [config, setConfig] = useState<TimerConfig | null>(null);

  return (
    <main className="min-h-screen bg-black">
      {screen === 'select' && (
        <SelectScreen
          onSelect={(m) => {
            setMode(m);
            setScreen('setup');
          }}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen
          mode={mode}
          onBack={() => setScreen('select')}
          onStart={(cfg) => {
            setConfig(cfg);
            setScreen('timer');
          }}
        />
      )}
      {screen === 'timer' && config && (
        <TimerScreen
          config={config}
          onBack={() => setScreen('select')}
        />
      )}
    </main>
  );
}
