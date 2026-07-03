'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export function useWakeLock() {
  const lockRef = useRef<WakeLockSentinel | null>(null);
  const [active, setActive] = useState(false);
  const wantLockRef = useRef(false);
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  const acquire = useCallback(async () => {
    if (!supported) return;
    wantLockRef.current = true;
    try {
      lockRef.current = await navigator.wakeLock.request('screen');
      setActive(true);
      lockRef.current.addEventListener('release', () => {
        setActive(false);
        lockRef.current = null;
      });
    } catch {
      // permission denied or not supported
    }
  }, [supported]);

  const release = useCallback(async () => {
    wantLockRef.current = false;
    try {
      await lockRef.current?.release();
    } catch {
      // ignore
    }
    lockRef.current = null;
    setActive(false);
  }, []);

  // iOS/Chrome release the lock when the tab goes to background; re-acquire on return
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && wantLockRef.current && !lockRef.current) {
        acquire();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [acquire]);

  return { acquire, release, active, supported };
}
