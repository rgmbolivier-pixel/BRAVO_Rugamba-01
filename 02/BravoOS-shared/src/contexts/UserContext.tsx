"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "store_manager" | "shelf_worker" | "vendor";

export interface UserProfile {
  role: UserRole;
  workerId?: string;   // "WRK-01" | "WRK-02" | "WRK-03" — shelf workers only
  name: string;
  nameEn: string;
  initial: string;
  description: string;
  descriptionEn: string;
}

export const PROFILES: UserProfile[] = [
  {
    role: "admin",
    name: "Bas Ofis",
    nameEn: "Head Office",
    initial: "B",
    description: "Bütün filiallar · Tam icaz?",
    descriptionEn: "All branches · Full access",
  },
  {
    role: "store_manager",
    name: "Magaza Müdürü",
    nameEn: "Store Manager",
    initial: "M",
    description: "Öz filiali · Q?rar verm?",
    descriptionEn: "Own branch · Decisions",
  },
  {
    role: "shelf_worker",
    workerId: "WRK-01",
    name: "Fuat ?liyev",
    nameEn: "Fuat Aliyev",
    initial: "F",
    description: "Raf Isçisi · WRK-01",
    descriptionEn: "Shelf Worker · WRK-01",
  },
  {
    role: "shelf_worker",
    workerId: "WRK-02",
    name: "?li Hüseynov",
    nameEn: "Ali Huseynov",
    initial: "?",
    description: "Raf Isçisi · WRK-02",
    descriptionEn: "Shelf Worker · WRK-02",
  },
  {
    role: "shelf_worker",
    workerId: "WRK-03",
    name: "Kamran Babayev",
    nameEn: "Kamran Babayev",
    initial: "K",
    description: "Raf Isçisi · WRK-03",
    descriptionEn: "Shelf Worker · WRK-03",
  },
];

// Unique ID per profile
export const profileId = (p: UserProfile) => p.workerId ?? p.role;

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  setProfile: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("testOS_profileId");
    if (saved) {
      const found = PROFILES.find(p => profileId(p) === saved);
      if (found) setProfileState(found);
    }
    setMounted(true);
  }, []);

  const setProfile = (p: UserProfile | null) => {
    setProfileState(p);
    if (p) localStorage.setItem("testOS_profileId", profileId(p));
    else localStorage.removeItem("testOS_profileId");
  };

  if (!mounted) return null;

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
