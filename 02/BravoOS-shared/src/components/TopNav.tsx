"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";
import { useUser } from "@/contexts/UserContext";
import { useAlertNotifications } from "@/contexts/AlertNotificationContext";
import { T } from "@/components/BravoUI";

const NAV = [
  { href: "/",                 label: "DASH",    alert: false },
  { href: "/alerts",           label: "ALERTS",  alert: true  },
  { href: "/anomalies",        label: "ANOMALY", alert: false },
  { href: "/analytics",        label: "ANALYT",  alert: false },
  { href: "/forecast",         label: "FCST",    alert: false },
  { href: "/supply-chain",     label: "SUPPLY",  alert: false },
  { href: "/test-city",       label: "CITY",    alert: false },
  { href: "/stores",           label: "STORES",  alert: false },
  { href: "/risk-intelligence",label: "RISK ??", alert: false },
  { href: "/integrations",     label: "API",     alert: false },
] as const;

const TICKER = [
  { dot: "??", src: "TB1-04",     msg: "TESTAI ANOMALY +23% WAREHOUSE DELTA" },
  { dot: "??", src: "TEST OPTIMIZER",   msg: "XTI?NSM // 45U DAIRY TRANSFER QUEUED" },
  { dot: "??", src: "SMART-DISC", msg: "BREAD CATEGORY +18% DEMAND · VICTORY DAY" },
  { dot: "??", src: "AZGD-MMC",   msg: "80U DAIRY PO AUTO-CREATED · TEST OPTIMIZER" },
  { dot: "??", src: "TB5-02",     msg: "CRITICAL · 3 SKU < 48H EXPIRY" },
  { dot: "??", src: "TEST MODEL",    msg: "NOVRUZ DEMAND SPIKE DETECTED +34%" },
  { dot: "??", src: "YSM?SUR",    msg: "28U MEAT TRANSFERRED · 196? PREVENTED" },
  { dot: "??", src: "TESTAI",msg: "2,340? PREVENTED // LAST 60M" },
];

// Role display computed dynamically from profile + selectedStore below

export default function TopNav() {
  const path = usePathname();
  const { lang, setLang } = useLanguage();
  const { selectedStore, setSelectedStore } = useStore();
  const { profile, setProfile } = useUser();
  const [stores, setStores]         = useState<any[]>([]);
  const [idx, setIdx]               = useState(0);
  const [vis, setVis]               = useState(true);
  const [time, setTime]             = useState("");
  const [confirmLogout, setConfirm]   = useState(false);
  const [bellOpen, setBellOpen]       = useState(false);
  const { notifications, unreadCount, markAllRead, dismiss } = useAlertNotifications();

  useEffect(() => {
    fetch(`/api/stores`).then(r => r.json()).then(setStores).catch(() => {});
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % TICKER.length); setVis(true); }, 250);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const ev = TICKER[idx];
  const roleLabel = profile
    ? (profile.workerId ?? (profile.role === "admin" ? "ADM-00" : selectedStore ? `MGR·${selectedStore.name.split(" ")[0].slice(0, 5).toUpperCase()}` : "MGR-01"))
    : null;
  const roleColor = profile
    ? (profile.role === "admin" ? "#a78bfa" : profile.role === "store_manager" ? T.green : "#00bfa5")
    : null;
  const F = T.font;

  return (
    <>
      {/* -- Ticker (24px) --------------------------------------- */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        height: 24, background: "#000", borderBottom: `1px solid ${T.border1}`,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
        fontSize: 10, letterSpacing: ".08em", fontFamily: F, color: T.fg3,
        textTransform: "uppercase", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className="bos-pulse" style={{ width: 6, height: 6, background: T.green, boxShadow: `0 0 6px ${T.green}`, display: "inline-block", borderRadius: "50%" }} />
          <span style={{ color: T.fg3 }}>TESTAI</span>
          <span style={{ color: T.fg5 }}>·</span>
          <span style={{ color: T.greenDim }}>LIVE</span>
        </div>
        <div style={{ width: 1, height: 12, background: T.border1, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: vis ? 1 : 0, transition: "opacity .25s", overflow: "hidden" }}>
          <span>{ev.dot}</span>
          <span style={{ color: T.green }}>{ev.src}</span>
          <span style={{ color: T.fg4 }}>//</span>
          <span style={{ color: T.fg2, whiteSpace: "nowrap" }}>{ev.msg}</span>
        </div>
        <div style={{ marginLeft: "auto", color: T.fg4, fontSize: 10, letterSpacing: ".12em", flexShrink: 0 }}>
          UTC+04 · {time}
        </div>
      </div>

      {/* -- Navbar (40px, below ticker) ------------------------- */}
      <nav style={{
        position: "fixed", top: 24, left: 0, right: 0, zIndex: 59,
        height: 40, background: "#050505", borderBottom: `1px solid ${T.border2}`,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 18,
        fontFamily: F, overflow: "hidden",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 14, borderRight: `1px solid ${T.border1}`, height: 40, flexShrink: 0 }}>
          <span style={{ color: T.green, fontSize: 18, lineHeight: 1 }}>?</span>
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".04em", color: T.fg1 }}>
            TEST<span style={{ color: T.green }}>OS</span>
          </span>
          <span style={{ fontSize: 9, color: T.fg4, letterSpacing: ".16em", marginLeft: 4 }}>v1.0</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", height: 40, flex: 1 }}>
          {NAV.map(item => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} prefetch={false}
                className="bos-nav-link"
                style={{
                  padding: "0 10px", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
                  color: active ? T.green : T.fg3, cursor: "pointer", display: "flex", alignItems: "center",
                  height: 40, textDecoration: "none",
                  fontWeight: active ? 700 : 400,
                  borderBottom: active ? `2px solid ${T.green}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: T.fg3, flexShrink: 0 }}>
          {/* Store — locked for store_manager, dropdown for admin */}
          {profile?.role === "store_manager" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: T.green, letterSpacing: ".1em", fontFamily: F }}>
              <span style={{ color: T.greenDim }}>?</span>
              <span>{selectedStore?.name ?? ""}</span>
              <span style={{ fontSize: 8, color: T.fg5, letterSpacing: ".08em" }}>LOCKED</span>
            </div>
          ) : (
            <select value={selectedStore?.id ?? ""}
              onChange={e => {
                const id = Number(e.target.value);
                if (!id) setSelectedStore(null);
                else { const s = stores.find(s => s.id === id); if (s) setSelectedStore({ id: s.id, name: s.name, district: s.district }); }
              }}
              style={{ background: "transparent", border: "none", color: selectedStore ? T.green : T.fg3, fontSize: 10, letterSpacing: ".1em", cursor: "pointer", outline: "none", fontFamily: F, textTransform: "uppercase" }}
            >
              <option value="">BR: ALL</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name.split(" ")[0].toUpperCase()}</option>)}
            </select>
          )}
          <span style={{ color: T.fg5 }}>·</span>
          {/* Live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.green }}>
            <span className="bos-pulse" style={{ width: 6, height: 6, background: T.green, boxShadow: `0 0 8px ${T.green}`, display: "inline-block", borderRadius: "50%" }} />
            LIVE
          </div>
          <span style={{ color: T.fg5 }}>·</span>

          {/* ?? Notification Bell */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setBellOpen(o => !o); if (!bellOpen) markAllRead(); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "2px 4px", position: "relative", fontFamily: F,
                color: unreadCount > 0 ? T.err : T.fg3,
                fontSize: 14, lineHeight: 1,
              }}
              title={`${unreadCount} yeni x?b?rdarliq`}
            >
              ??
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -4,
                  background: T.err, color: "#fff",
                  fontSize: 8, fontWeight: 700, borderRadius: "50%",
                  width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  letterSpacing: 0, fontFamily: F,
                  boxShadow: `0 0 6px ${T.err}`,
                  animation: "bos-pulse 1s ease-in-out infinite",
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {bellOpen && (
              <div style={{
                position: "absolute", top: 34, right: 0, width: 300,
                background: "#0a0a0a", border: `1px solid ${T.border2}`,
                zIndex: 9998, fontFamily: F,
                boxShadow: "0 8px 32px rgba(0,0,0,.8)",
              }}>
                {/* Header */}
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border1}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".2em" }}>BILDIRISL?R</span>
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: 8, color: T.fg4, cursor: "pointer", letterSpacing: ".1em", fontFamily: F }}>
                      HAMISI OXUNDU
                    </button>
                  )}
                </div>

                {/* List */}
                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "20px 14px", fontSize: 11, color: T.fg4, textAlign: "center" }}>
                      Yeni bildiris yoxdur
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} style={{
                        padding: "10px 14px", borderBottom: `1px solid ${T.border1}`,
                        background: n.read ? "transparent" : `${T.err}05`,
                        display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "start",
                      }}>
                        <div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                            <span style={{ width: 5, height: 5, background: n.read ? T.fg5 : T.err, borderRadius: "50%", display: "inline-block", flexShrink: 0, boxShadow: n.read ? "none" : `0 0 4px ${T.err}` }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: n.read ? T.fg2 : T.fg1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.productName}</span>
                          </div>
                          <div style={{ fontSize: 9, color: T.fg4, paddingLeft: 11 }}>
                            {n.storeName} · <span style={{ color: n.daysLeft <= 1 ? T.err : T.warn }}>{n.daysLeft}g</span> · <span style={{ color: T.err }}>?{n.potentialLoss.toFixed(0)}</span>
                          </div>
                          <div style={{ fontSize: 8, color: T.fg5, paddingLeft: 11, marginTop: 2 }}>
                            {new Date(n.arrivedAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        <button onClick={() => dismiss(n.id)} style={{ background: "none", border: "none", color: T.fg5, cursor: "pointer", fontSize: 11, padding: 0, fontFamily: F }}>×</button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.border1}` }}>
                  <a href="/alerts" onClick={() => setBellOpen(false)} style={{ fontSize: 9, color: T.info, letterSpacing: ".12em", textDecoration: "none" }}>
                    BÜTÜN ALERTL?R? KEÇ ?
                  </a>
                </div>
              </div>
            )}
          </div>
          <span style={{ color: T.fg5 }}>·</span>

          {/* Lang */}
          <div style={{ display: "flex", gap: 0 }}>
            {(["AZ", "EN"] as const).map(l => (
              <button key={l} onClick={() => setLang(l.toLowerCase() as "az" | "en")} style={{
                fontFamily: F, fontSize: 10, letterSpacing: ".12em", padding: "2px 8px",
                color: lang === l.toLowerCase() ? T.green : T.fg4,
                background: lang === l.toLowerCase() ? "rgba(0,255,65,0.05)" : "transparent",
                border: "none", cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
          {/* User */}
          {roleLabel && roleColor && (
            <>
              <span style={{ color: T.fg5 }}>·</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: roleColor, letterSpacing: ".12em" }}>{roleLabel}</span>
                <button
                  onClick={() => {
                    if (confirmLogout) { setProfile(null); setConfirm(false); }
                    else { setConfirm(true); setTimeout(() => setConfirm(false), 2500); }
                  }}
                  style={{
                    color: confirmLogout ? T.err : T.fg4,
                    background: confirmLogout ? `${T.err}12` : "none",
                    border: confirmLogout ? `1px solid ${T.err}60` : "none",
                    cursor: "pointer", fontFamily: F, fontSize: confirmLogout ? 9 : 11,
                    letterSpacing: confirmLogout ? ".12em" : "0",
                    padding: confirmLogout ? "2px 7px" : "2px 4px",
                    transition: "all .15s",
                  }}
                  title={confirmLogout ? "Click again to confirm logout" : "Switch profile"}
                >
                  {confirmLogout ? "CONFIRM?" : "?"}
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
