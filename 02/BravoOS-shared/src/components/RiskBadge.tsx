"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const CONFIG_AZ = {
  CRITICAL: { label: "KRİTİK",  cls: "bg-red-500/20 text-red-400 border border-red-500/30"    },
  HIGH:     { label: "YÜKSƏK",  cls: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
  MEDIUM:   { label: "ORTA",    cls: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" },
  LOW:      { label: "AŞAĞI",   cls: "bg-green-500/20 text-green-400 border border-green-500/30"    },
} as const;

const CONFIG_EN = {
  CRITICAL: { label: "CRITICAL", cls: "bg-red-500/20 text-red-400 border border-red-500/30"    },
  HIGH:     { label: "HIGH",     cls: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
  MEDIUM:   { label: "MEDIUM",   cls: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" },
  LOW:      { label: "LOW",      cls: "bg-green-500/20 text-green-400 border border-green-500/30"    },
} as const;

export default function RiskBadge({ level }: { level: string }) {
  const { lang } = useLanguage();
  const config = lang === "en" ? CONFIG_EN : CONFIG_AZ;
  const c = config[level as keyof typeof config] ?? config.LOW;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${c.cls}`}>
      {c.label}
    </span>
  );
}
