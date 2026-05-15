"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ShiftEntry {
  workerId: string;
  workerName: string;
  since: string; // ISO
}

export interface ShiftLog {
  workerId: string;
  workerName: string;
  action: "CHECK_IN" | "CHECK_OUT";
  time: string;
}

interface ShiftContextType {
  activeShifts: ShiftEntry[];
  shiftLogs: ShiftLog[];
  isOnShift: (workerId: string) => boolean;
  checkIn: (workerId: string, workerName: string) => void;
  checkOut: (workerId: string, workerName: string) => void;
}

const ShiftContext = createContext<ShiftContextType>({
  activeShifts: [],
  shiftLogs: [],
  isOnShift: () => false,
  checkIn: () => {},
  checkOut: () => {},
});

const SHIFT_KEY = "testOS_shifts";
const LOG_KEY   = "testOS_shiftLogs";

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [activeShifts, setActiveShifts] = useState<ShiftEntry[]>([]);
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SHIFT_KEY);
      const l = localStorage.getItem(LOG_KEY);
      if (s) setActiveShifts(JSON.parse(s));
      if (l) setShiftLogs(JSON.parse(l));
    } catch {}
  }, []);

  const save = (shifts: ShiftEntry[], logs: ShiftLog[]) => {
    localStorage.setItem(SHIFT_KEY, JSON.stringify(shifts));
    localStorage.setItem(LOG_KEY,   JSON.stringify(logs));
    setActiveShifts(shifts);
    setShiftLogs(logs);
  };

  const isOnShift = (workerId: string) => activeShifts.some(s => s.workerId === workerId);

  const checkIn = (workerId: string, workerName: string) => {
    if (isOnShift(workerId)) return;
    const entry: ShiftEntry = { workerId, workerName, since: new Date().toISOString() };
    const log: ShiftLog = { workerId, workerName, action: "CHECK_IN", time: new Date().toISOString() };
    save([...activeShifts, entry], [log, ...shiftLogs].slice(0, 100));
  };

  const checkOut = (workerId: string, workerName: string) => {
    const log: ShiftLog = { workerId, workerName, action: "CHECK_OUT", time: new Date().toISOString() };
    save(activeShifts.filter(s => s.workerId !== workerId), [log, ...shiftLogs].slice(0, 100));
  };

  return (
    <ShiftContext.Provider value={{ activeShifts, shiftLogs, isOnShift, checkIn, checkOut }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  return useContext(ShiftContext);
}
