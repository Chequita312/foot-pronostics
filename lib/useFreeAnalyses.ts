import { useCallback, useEffect, useSyncExternalStore } from 'react';

const KEY = 'kickdata_free_analyses_used';
const MAX = 3;

function getSnapshot(): number {
  try {
    const n = parseInt(localStorage.getItem(KEY) ?? '0', 10);
    return isNaN(n) ? 0 : Math.min(n, MAX);
  } catch {
    return 0;
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function writeCount(n: number): void {
  try {
    localStorage.setItem(KEY, String(n));
    // Notifie useSyncExternalStore dans le même onglet
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
  } catch {}
}

export function useFreeAnalyses() {
  // useSyncExternalStore évite setState dans useEffect et gère le cas SSR via getServerSnapshot
  const used = useSyncExternalStore(subscribe, getSnapshot, () => MAX);

  const increment = useCallback(() => {
    writeCount(Math.min(getSnapshot() + 1, MAX));
  }, []);

  const resetFreeAnalyses = useCallback(() => {
    writeCount(0);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const win = window as Window & { resetFreeAnalyses?: () => void };
      win.resetFreeAnalyses = resetFreeAnalyses;
      return () => {
        delete win.resetFreeAnalyses;
      };
    }
  }, [resetFreeAnalyses]);

  return {
    used,
    remaining: Math.max(MAX - used, 0),
    limitReached: used >= MAX,
    increment,
    resetFreeAnalyses,
  };
}
