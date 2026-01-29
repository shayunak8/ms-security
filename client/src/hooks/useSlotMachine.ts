import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { cashout, createSession, roll } from "../api/api";
import type { SlotSymbol } from "../types/api";
import { parseApiError } from "../utils/errorHandler";
import { ANIMATION_DURATION, INITIAL_STATE } from "../constants";

interface UseSlotMachineState {
  readonly sessionId: string | null;
  readonly credits: number;
  readonly symbols: (SlotSymbol | "X")[];
  readonly isRolling: boolean;
  readonly isSessionClosed: boolean;
  readonly isLoadingSession: boolean;
  readonly error: string | null;
}

interface UseSlotMachineActions {
  readonly startSession: () => Promise<void>;
  readonly rollOnce: () => Promise<void>;
  readonly cashoutSession: () => Promise<void>;
}

export type UseSlotMachineResult = UseSlotMachineState & UseSlotMachineActions;

const INITIAL_SYMBOLS: (SlotSymbol | "X")[] = ["X", "X", "X"];

export function useSlotMachine(): UseSlotMachineResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [symbols, setSymbols] = useState<(SlotSymbol | "X")[]>(INITIAL_SYMBOLS);
  const [isRolling, setIsRolling] = useState(false);
  const [isSessionClosed, setIsSessionClosed] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  const startSession = useCallback(async () => {
    setIsLoadingSession(true);
    setError(null);
    setIsSessionClosed(false);
    setSymbols(INITIAL_SYMBOLS);

    try {
      const response = await createSession();
      setSessionId(response.sessionId);
      setCredits(response.credits);
      setError(null);
    } catch (e) {
      const apiError = parseApiError(e);
      setError(apiError.message);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  const rollOnce = useCallback(async () => {
    if (!sessionId || isRolling || isSessionClosed) {
      return;
    }

    setIsRolling(true);
    setError(null);
    setSymbols(INITIAL_SYMBOLS);

    try {
      const response = await roll(sessionId);

      const [s1, s2, s3] = response.symbols;

      const t1 = window.setTimeout(() => {
        setSymbols([
          s1,
          INITIAL_STATE.SPINNING_SYMBOL,
          INITIAL_STATE.SPINNING_SYMBOL,
        ]);
      }, ANIMATION_DURATION.REEL_1_REVEAL);

      const t2 = window.setTimeout(() => {
        setSymbols([s1, s2, INITIAL_STATE.SPINNING_SYMBOL]);
      }, ANIMATION_DURATION.REEL_2_REVEAL);

      const t3 = window.setTimeout(() => {
        setSymbols([s1, s2, s3]);
        setCredits(response.credits);
        setIsRolling(false);
      }, ANIMATION_DURATION.REEL_3_REVEAL);

      timeoutsRef.current.push(t1, t2, t3);
    } catch (e) {
      const apiError = parseApiError(e);
      setError(apiError.message);
      setIsRolling(false);
      setSymbols(INITIAL_SYMBOLS);
      // Clear any pending timeouts on error
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    }
  }, [isRolling, isSessionClosed, sessionId]);

  const cashoutSession = useCallback(async () => {
    if (!sessionId || isRolling || isSessionClosed) {
      return;
    }

    setError(null);
    try {
      const response = await cashout(sessionId);
      setCredits(response.finalCredits);
      setIsSessionClosed(true);
      setError(null);
    } catch (e) {
      const apiError = parseApiError(e);
      setError(apiError.message);
    }
  }, [isRolling, isSessionClosed, sessionId]);

  // Memoize the return object to prevent unnecessary re-renders of consumers
  return useMemo(
    () => ({
      sessionId,
      credits,
      symbols,
      isRolling,
      isSessionClosed,
      isLoadingSession,
      error,
      startSession,
      rollOnce,
      cashoutSession,
    }),
    [
      sessionId,
      credits,
      symbols,
      isRolling,
      isSessionClosed,
      isLoadingSession,
      error,
      startSession,
      rollOnce,
      cashoutSession,
    ],
  );
}
