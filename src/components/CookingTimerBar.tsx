import React, { useEffect } from 'react';
import { ActiveTimer, Language } from '../types';
import { Play, Pause, RotateCcw, X, Timer, BellRing } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CookingTimerBarProps {
  timers: ActiveTimer[];
  language: Language;
  onUpdateTimers: (timers: ActiveTimer[]) => void;
}

export const CookingTimerBar: React.FC<CookingTimerBarProps> = ({
  timers,
  language,
  onUpdateTimers,
}) => {
  const isArabic = language === 'ar';

  // Sound chime synthesizer using Web Audio API
  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Audio context fallback
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let updated = false;
      const nextTimers = timers.map((timer) => {
        if (timer.isRunning && timer.remainingSeconds > 0) {
          updated = true;
          const nextVal = timer.remainingSeconds - 1;
          if (nextVal === 0) {
            playChimeSound();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
            });
          }
          return { ...timer, remainingSeconds: nextVal, isRunning: nextVal > 0 };
        }
        return timer;
      });

      if (updated) {
        onUpdateTimers(nextTimers);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, onUpdateTimers]);

  if (timers.length === 0) return null;

  const togglePause = (id: string) => {
    onUpdateTimers(
      timers.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    onUpdateTimers(
      timers.map((t) =>
        t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t
      )
    );
  };

  const removeTimer = (id: string) => {
    onUpdateTimers(timers.filter((t) => t.id !== id));
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-amber-900/95 text-amber-50 dark:bg-stone-900/95 dark:text-stone-100 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-amber-600/30 flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between px-2 text-xs text-amber-200/80 font-medium">
        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isArabic ? 'مؤقتات الطهي النشطة' : 'Active Cooking Timers'}</span>
          <span className="bg-amber-600/40 text-amber-200 px-2 py-0.5 rounded-full text-[10px]">
            {timers.length}
          </span>
        </div>
        <button
          onClick={() => onUpdateTimers([])}
          className="hover:text-amber-100 text-amber-300/70 text-[11px] underline underline-offset-2"
        >
          {isArabic ? 'إغلاق الكل' : 'Dismiss All'}
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {timers.map((timer) => {
          const isDone = timer.remainingSeconds === 0;
          return (
            <div
              key={timer.id}
              className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors ${
                isDone
                  ? 'bg-emerald-900/60 border border-emerald-500/50 text-emerald-100'
                  : 'bg-amber-950/60 border border-amber-800/40'
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-amber-100 dark:text-amber-200">
                  {isArabic ? timer.recipeTitleAr : timer.recipeTitleEn}
                </p>
                <p className="text-[11px] text-amber-300/80 dark:text-stone-300 truncate">
                  {isArabic ? timer.stepTitleAr : timer.stepTitleEn}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-extrabold font-mono px-2.5 py-1 rounded-lg ${
                    isDone
                      ? 'bg-emerald-500 text-stone-950 animate-bounce'
                      : timer.isRunning
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {isDone ? (
                    <span className="flex items-center gap-1">
                      <BellRing className="w-4 h-4" />
                      {isArabic ? 'جاهز!' : 'Done!'}
                    </span>
                  ) : (
                    formatSeconds(timer.remainingSeconds)
                  )}
                </span>

                {!isDone && (
                  <button
                    onClick={() => togglePause(timer.id)}
                    className="p-1.5 rounded-lg bg-amber-700/50 hover:bg-amber-600 text-amber-100 transition-colors"
                    title={timer.isRunning ? (isArabic ? 'إيقاف مؤقت' : 'Pause') : (isArabic ? 'تشغيل' : 'Start')}
                  >
                    {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => resetTimer(timer.id)}
                  className="p-1.5 rounded-lg bg-amber-800/40 hover:bg-amber-700/60 text-amber-200 transition-colors"
                  title={isArabic ? 'إعادة ضبط' : 'Reset'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => removeTimer(timer.id)}
                  className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-800/60 text-red-200 transition-colors"
                  title={isArabic ? 'حذف' : 'Remove'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
