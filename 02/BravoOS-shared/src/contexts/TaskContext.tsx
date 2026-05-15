"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TaskType = "PRICE_CHANGE" | "TRANSFER" | "DONATE";

export interface WorkerTask {
  id: string;
  type: TaskType;
  productName: string;
  storeName: string;
  detail: string;      // "?2.40 (20% endirim)" | "NSM filialina transfer" | "Sosial mü?ssis?y? ver"
  createdAt: string;   // ISO
  createdBy: string;
  done: boolean;
  assignedTo?: string; // workerId ("WRK-01") or undefined = all workers
}

interface TaskContextType {
  tasks: WorkerTask[];
  activeTasks: WorkerTask[];
  addTask: (t: Omit<WorkerTask, "id" | "createdAt" | "done">) => void;
  markDone: (id: string) => void;
  clearDone: () => void;
  getTasksFor: (workerId: string) => WorkerTask[];
}

const TaskContext = createContext<TaskContextType>({
  tasks: [], activeTasks: [],
  addTask: () => {}, markDone: () => {}, clearDone: () => {},
  getTasksFor: () => [],
});

const TASK_KEY = "testOS_workerTasks";

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<WorkerTask[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(TASK_KEY);
      if (s) setTasks(JSON.parse(s));
    } catch {}
  }, []);

  const save = (t: WorkerTask[]) => {
    localStorage.setItem(TASK_KEY, JSON.stringify(t));
    setTasks(t);
  };

  const addTask = (t: Omit<WorkerTask, "id" | "createdAt" | "done">) => {
    const task: WorkerTask = {
      ...t,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      done: false,
    };
    save([task, ...tasks].slice(0, 50)); // son 50 tapsiriq
  };

  const markDone    = (id: string) => save(tasks.map(t => t.id === id ? { ...t, done: true } : t));
  const clearDone   = () => save(tasks.filter(t => !t.done));
  const activeTasks = tasks.filter(t => !t.done);

  // Worker sadece kendine atanan veya atanmamis görevleri görür
  const getTasksFor = (workerId: string) =>
    tasks.filter(t => !t.done && (!t.assignedTo || t.assignedTo === workerId));

  return (
    <TaskContext.Provider value={{ tasks, activeTasks, addTask, markDone, clearDone, getTasksFor }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}
