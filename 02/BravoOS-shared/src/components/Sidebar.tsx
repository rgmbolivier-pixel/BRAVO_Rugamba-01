"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";
import { useUser } from "@/contexts/UserContext";

const navItems = [
  { href: "/",          icon: "??", key: "nav_dashboard"  },
  { href: "/alerts",    icon: "??", key: "nav_alerts"     },
  { href: "/actions",   icon: "?", key: "nav_actions"    },
  { href: "/anomalies", icon: "??", key: "nav_anomalies"  },
  { href: "/stores",    icon: "??", key: "nav_stores"     },
] as const;

const navExtra = [
  { href: "/analytics",         icon: "??", key: "nav_analytics"   },
  { href: "/forecast",          icon: "??", key: "nav_forecast"    },
  { href: "/supply-chain",      icon: "??", key: "nav_supply"      },
  { href: "/test-city",        icon: "???", key: "nav_bravocity"   },
  { href: "/integrations",      icon: "??", key: "nav_integrations"},
  { href: "/risk-intelligence", icon: "???", key: "nav_risk"        },
  { href: "/vendor-portal",     icon: "??", key: "nav_vendor_portal"},
] as const;

const ROLE_META: Record<string, { icon: string; color: string; bg: string }> = {
  admin:         { icon: "??", color: "#a78bfa", bg: "rgba(124,58,237,0.15)" },
  store_manager: { icon: "??", color: "#fb923c", bg: "rgba(249,115,22,0.15)" },
  shelf_worker:  { icon: "??", color: "#34d399", bg: "rgba(16,185,129,0.15)" },
};

export default function Sidebar() {
  const path = usePathname();
  const { t, lang, setLang } = useLanguage();
  const { selectedStore, setSelectedStore } = useStore();
  const { profile, setProfile } = useUser();
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/stores`)
      .then((r) => r.json())
      .then(setStores)
      .catch(() => {});
  }, []);

  return (
    <aside className="fixed top-8 left-0 h-[calc(100vh-2rem)] w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Image
            src="/test-logo.png"
            alt="Test Market"
            width={80}
            height={32}
            className="object-contain"
            unoptimized
          />
          <div>
            <div className="font-bold text-white text-sm">TestAI</div>
            <div className="text-orange-400 text-xs font-medium">v1.0 · AI</div>
          </div>
        </div>
      </div>

      {/* Sube Seçici */}
      <div className="px-3 py-2.5 border-b border-gray-800">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">
          {lang === "az" ? "Idar? olunan sub?" : "Managing branch"}
        </div>
        <select
          value={selectedStore?.id ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            if (!id) {
              setSelectedStore(null);
            } else {
              const s = stores.find((s) => s.id === id);
              if (s) setSelectedStore({ id: s.id, name: s.name, district: s.district });
            }
          }}
          className="w-full bg-gray-800 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 border border-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="">{lang === "az" ? "?? Bütün sub?l?r" : "?? All branches"}</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {selectedStore ? (
          <div className="flex items-center justify-between mt-1">
            <div className="text-[10px] text-orange-400">?? {selectedStore.district}</div>
            <button
              onClick={() => setSelectedStore(null)}
              className="text-[9px] text-gray-600 hover:text-gray-400 transition-colors"
            >
              ? {lang === "az" ? "Hamisi" : "All"}
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-gray-600 mt-1">
            {lang === "az" ? "Bütün sub?l?rin datasi" : "Showing all branches"}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} label={t(item.key)} active={path === item.href} />
        ))}

        <div className="pt-3 pb-1">
          <div className="px-3 text-[10px] text-gray-700 uppercase tracking-wider font-semibold">{t("nav_analytics")}</div>
        </div>

        {navExtra.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} label={t(item.key)} active={path === item.href} />
        ))}
      </nav>

      {/* Powered by */}
      <div className="px-3 py-2 border-t border-gray-800">
        <div className="text-xs text-gray-600 mb-1.5">Powered by</div>
        <div className="flex flex-wrap gap-1">
          {["Test Model", "Test AI", "Test", "Test Optimizer", "Test Map"].map(tech => (
            <span key={tech} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Language Toggle */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setLang("az")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
              lang === "az" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            AZ
          </button>
          <button
            onClick={() => setLang("en")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
              lang === "en" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Active user chip */}
      {profile && (() => {
        const m = ROLE_META[profile.role];
        return (
          <div
            className="mx-3 mb-3 rounded-xl px-3 py-2.5 flex items-center gap-2.5"
            style={{ background: m.bg, border: `1px solid ${m.color}30` }}
          >
            <span className="text-lg leading-none">{m.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {lang === "az" ? profile.name : profile.nameEn}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wide" style={{ color: m.color }}>
                {profile.role.replace("_", " ")}
              </div>
            </div>
            <button
              onClick={() => setProfile(null)}
              title={lang === "az" ? "Profili d?yis" : "Switch profile"}
              className="text-gray-600 hover:text-gray-300 transition-colors text-xs shrink-0"
            >
              ?
            </button>
          </div>
        );
      })()}
    </aside>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active
          ? "bg-orange-500/20 text-orange-400 font-medium"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />}
    </Link>
  );
}
