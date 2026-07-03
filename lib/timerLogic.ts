import { TimerConfig, TimerDisplay } from './types';

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function getTotalRounds(config: TimerConfig): number {
  if (config.mode === 'rounds') return config.numRounds;
  if (config.mode === 'emom') return Math.floor(config.totalSeconds / 60) * config.numRounds;
  return config.numRounds; // amrap: number of sets
}

export function getOverallTotal(config: TimerConfig): number {
  if (config.mode === 'rounds') {
    return config.workSeconds * config.numRounds + config.restSeconds * (config.numRounds - 1);
  }
  // amrap and emom: numRounds = number of sets, restSeconds = rest between sets
  const { totalSeconds, numRounds, restSeconds } = config;
  return totalSeconds * numRounds + restSeconds * (numRounds - 1);
}

// For AMRAP/EMOM: position within the current set and which set we're in
function getSetPosition(config: TimerConfig, elapsedSec: number) {
  const { totalSeconds, numRounds, restSeconds } = config;
  if (numRounds <= 1) return { setIndex: 0, posInSet: elapsedSec };
  const setBoundary = totalSeconds + restSeconds;
  const setIndex = Math.min(Math.floor(elapsedSec / setBoundary), numRounds - 1);
  const posInSet = elapsedSec - setIndex * setBoundary;
  return { setIndex, posInSet };
}

// Returns true on the first elapsed second of each EMOM minute within a work phase
export function isEmomMinuteBoundary(config: TimerConfig, elapsedSec: number): boolean {
  if (config.mode !== 'emom' || elapsedSec <= 0) return false;
  const { posInSet } = getSetPosition(config, elapsedSec);
  return posInSet > 0 && posInSet < config.totalSeconds && posInSet % 60 === 0;
}

export function deriveDisplay(config: TimerConfig, elapsedSec: number): TimerDisplay {
  if (elapsedSec < 0) {
    return {
      phase: 'countdown',
      timeDisplay: String(Math.abs(elapsedSec)),
      label: 'GET READY',
      sublabel: '',
      currentRound: 0,
      totalRounds: getTotalRounds(config),
      phaseProgress: 0,
      isLastTen: false,
      bgGlow: 'rgba(180,83,9,0.18)',
    };
  }

  if (config.mode === 'amrap') {
    const { totalSeconds, numRounds, restSeconds } = config;
    const overallTotal = getOverallTotal(config);
    if (elapsedSec >= overallTotal) return doneDisplay(config);

    const { setIndex, posInSet } = getSetPosition(config, elapsedSec);
    const currentSet = setIndex + 1;
    const isLastSet = currentSet === numRounds;

    if (posInSet < totalSeconds) {
      const remaining = totalSeconds - posInSet;
      return {
        phase: 'work',
        timeDisplay: formatTime(remaining),
        label: 'AMRAP',
        sublabel: numRounds > 1
          ? `SET ${currentSet} / ${numRounds}  ·  ${formatTime(totalSeconds)} cap`
          : `${formatTime(totalSeconds)} cap`,
        currentRound: currentSet,
        totalRounds: numRounds,
        phaseProgress: posInSet / totalSeconds,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(22,163,74,0.15)',
      };
    } else if (!isLastSet) {
      const restElapsed = posInSet - totalSeconds;
      const remaining = restSeconds - restElapsed;
      return {
        phase: 'rest',
        timeDisplay: formatTime(remaining),
        label: 'REST',
        sublabel: `SET ${currentSet} → ${currentSet + 1} / ${numRounds}`,
        currentRound: currentSet,
        totalRounds: numRounds,
        phaseProgress: restElapsed / restSeconds,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(37,99,235,0.15)',
      };
    } else {
      return doneDisplay(config);
    }
  }

  if (config.mode === 'emom') {
    const { totalSeconds, numRounds, restSeconds } = config;
    const overallTotal = getOverallTotal(config);
    if (elapsedSec >= overallTotal) return doneDisplay(config);

    const { setIndex, posInSet } = getSetPosition(config, elapsedSec);
    const currentSet = setIndex + 1;
    const isLastSet = currentSet === numRounds;
    const totalMinutesPerSet = Math.floor(totalSeconds / 60);

    if (posInSet < totalSeconds) {
      const currentMinute = Math.floor(posInSet / 60) + 1;
      const secondsIntoMinute = posInSet % 60;
      const remaining = 60 - secondsIntoMinute;
      const sublabel = numRounds > 1
        ? `SET ${currentSet}/${numRounds}  ·  MIN ${currentMinute}/${totalMinutesPerSet}`
        : `MIN ${currentMinute} / ${totalMinutesPerSet}`;
      return {
        phase: 'work',
        timeDisplay: formatTime(remaining),
        label: 'EMOM',
        sublabel,
        currentRound: setIndex * totalMinutesPerSet + currentMinute,
        totalRounds: totalMinutesPerSet * numRounds,
        phaseProgress: secondsIntoMinute / 60,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(37,99,235,0.15)',
      };
    } else if (!isLastSet) {
      const restElapsed = posInSet - totalSeconds;
      const remaining = restSeconds - restElapsed;
      return {
        phase: 'rest',
        timeDisplay: formatTime(remaining),
        label: 'REST',
        sublabel: `SET ${currentSet} → ${currentSet + 1} / ${numRounds}`,
        currentRound: currentSet,
        totalRounds: numRounds,
        phaseProgress: restElapsed / restSeconds,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(37,99,235,0.15)',
      };
    } else {
      return doneDisplay(config);
    }
  }

  if (config.mode === 'rounds') {
    const { workSeconds, restSeconds, numRounds } = config;
    const roundDuration = workSeconds + restSeconds;
    const overallTotal = getOverallTotal(config);

    if (elapsedSec >= overallTotal) return doneDisplay(config);

    const roundIndex = Math.min(Math.floor(elapsedSec / roundDuration), numRounds - 1);
    const currentRound = roundIndex + 1;
    const posInRound = elapsedSec - roundIndex * roundDuration;
    const isLastRound = currentRound === numRounds;

    if (posInRound < workSeconds) {
      const remaining = workSeconds - posInRound;
      return {
        phase: 'work',
        timeDisplay: formatTime(remaining),
        label: 'WORK',
        sublabel: `ROUND ${currentRound} / ${numRounds}`,
        currentRound,
        totalRounds: numRounds,
        phaseProgress: posInRound / workSeconds,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(22,163,74,0.15)',
      };
    } else if (!isLastRound) {
      const restElapsed = posInRound - workSeconds;
      const remaining = restSeconds - restElapsed;
      return {
        phase: 'rest',
        timeDisplay: formatTime(remaining),
        label: 'REST',
        sublabel: `ROUND ${currentRound} → ${currentRound + 1} / ${numRounds}`,
        currentRound,
        totalRounds: numRounds,
        phaseProgress: restElapsed / restSeconds,
        isLastTen: remaining <= 10,
        bgGlow: 'rgba(37,99,235,0.15)',
      };
    } else {
      return doneDisplay(config);
    }
  }

  return doneDisplay(config);
}

function doneDisplay(config: TimerConfig): TimerDisplay {
  return {
    phase: 'done',
    timeDisplay: '00:00',
    label: 'DONE',
    sublabel: 'Great work!',
    currentRound: getTotalRounds(config),
    totalRounds: getTotalRounds(config),
    phaseProgress: 1,
    isLastTen: false,
    bgGlow: 'rgba(147,51,234,0.2)',
  };
}
