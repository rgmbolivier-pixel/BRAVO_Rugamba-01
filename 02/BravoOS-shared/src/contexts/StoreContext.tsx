"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface StoreInfo {
  id: number;
  name: string;
  district: string;
}

interface StoreContextType {
  selectedStore: StoreInfo | null;
  setSelectedStore: (store: StoreInfo | null) => void;
}

const StoreContext = createContext<StoreContextType>({
  selectedStore: null,
  setSelectedStore: () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStoreState] = useState<StoreInfo | null>(null);

  // localStorage'dan yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem("testai_store");
      if (saved) setSelectedStoreState(JSON.parse(saved));
    } catch {}
  }, []);

  const setSelectedStore = (store: StoreInfo | null) => {
    setSelectedStoreState(store);
    if (store) {
      localStorage.setItem("testai_store", JSON.stringify(store));
    } else {
      localStorage.removeItem("testai_store");
    }
  };

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
