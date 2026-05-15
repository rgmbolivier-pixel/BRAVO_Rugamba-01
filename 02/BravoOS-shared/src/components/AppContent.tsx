"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, PROFILES, UserProfile, profileId } from "@/contexts/UserContext";
import { useStore } from "@/contexts/StoreContext";
import { useShift } from "@/contexts/ShiftContext";
import { useTask, WorkerTask } from "@/contexts/TaskContext";
import { useLanguage } from "@/contexts/LanguageContext";
import TopNav from "@/components/TopNav";
import DemoGuide from "@/components/DemoGuide";
import { GridBg, T } from "@/components/BravoUI";

// --- Role config ----------------------------------------------
const ROLE_CFG = {
  admin:         { color: "#a78bfa", border: "rgba(167,139,250,0.5)", bg: "#0d0a1f" },
  store_manager: { color: T.green,   border: `${T.green}80`,           bg: T.bgActive },
  shelf_worker:  { color: "#00bfa5", border: "rgba(0,191,165,0.5)",    bg: "#001a18"  },
  vendor:        { color: "#fb923c", border: "rgba(251,146,60,0.5)",   bg: "#1a0d00"  },
} as const;

// --- Store picker step (for Store Manager) --------------------
function StorePicker({ onPick }: { onPick: (storeId: number, storeName: string) => void }) {
  const { lang } = useLanguage();
  const [stores, setStores] = useState<any[]>([]);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/stores`).then(r => r.json()).then(setStores).catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".3em", textTransform: "uppercase" }}>
        {lang === "az" ? "FILIALINIZI SEÇIN" : "SELECT YOUR BRANCH"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 220px)", gap: 0 }}>
        {stores.map((s, i) => {
          const isH = hover === s.id;
          return (
            <button key={s.id} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
              onClick={() => onPick(s.id, s.name)}
              style={{
                padding: "14px 16px", background: isH ? T.bgActive : "#050505",
                borderTop:    `1px solid ${isH ? `${T.green}80` : T.border1}`,
                borderLeft:   `1px solid ${isH ? `${T.green}80` : T.border1}`,
                borderRight:  i % 2 === 0 ? "none" : `1px solid ${isH ? `${T.green}80` : T.border1}`,
                borderBottom: i < stores.length - 2 ? "none" : `1px solid ${isH ? `${T.green}80` : T.border1}`,
                cursor: "pointer", fontFamily: T.font, textAlign: "left", outline: "none",
                transition: "all .1s",
              }}
            >
              <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".16em", marginBottom: 4 }}>
                BR-{String(s.id).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 12, color: isH ? T.fg1 : T.fg2, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 9, color: T.fg4, marginTop: 2 }}>{s.district}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Profile Selection ----------------------------------------
function ProfileSelection({ onSelect }: { onSelect: (p: UserProfile, storeId?: number, storeName?: string) => void }) {
  const [hover, setHover]           = useState<string | null>(null);
  const [step, setStep]             = useState<"profiles" | "store_pick">("profiles");
  const [pendingProfile, setPending] = useState<UserProfile | null>(null);
  const { lang, setLang }           = useLanguage();
  const { isOnShift }               = useShift();

  const mgmt    = PROFILES.filter(p => p.role !== "shelf_worker");
  const workers = PROFILES.filter(p => p.role === "shelf_worker");

  const VENDOR_PROFILE: UserProfile = {
    role: "vendor" as any,
    name: "Vendor / T?chizatçi",
    nameEn: "Vendor / Supplier",
    initial: "V",
    description: "Sifarisl?r · Çatdirilma · Faktura",
    descriptionEn: "Orders · Delivery · Invoices",
  };

  const handleClick = (p: UserProfile) => {
    if (p.role === "store_manager") {
      setPending(p);
      setStep("store_pick");
    } else {
      onSelect(p);
    }
  };

  const handleStorePick = (storeId: number, storeName: string) => {
    if (pendingProfile) onSelect(pendingProfile, storeId, storeName);
  };

  const Card = ({ p, wide = false }: { p: UserProfile; wide?: boolean }) => {
    const cfg    = ROLE_CFG[p.role];
    const id     = profileId(p);
    const active = hover === id;
    const onShift = p.role === "shelf_worker" && p.workerId ? isOnShift(p.workerId) : false;
    return (
      <button key={id}
        onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
        onClick={() => handleClick(p)}
        style={{
          width: wide ? 300 : 200, height: 200, padding: 18,
          background: active ? cfg.bg : "#050505",
          border: "1px solid", borderColor: active ? cfg.border : T.border1,
          cursor: "pointer", color: "inherit", fontFamily: T.font,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          textAlign: "left", transition: "all .12s", outline: "none",
          boxShadow: active ? `0 0 28px ${cfg.color}30` : "none",
          position: "relative",
        }}
      >
        {/* Shift dot for workers */}
        {p.role === "shelf_worker" && (
          <div style={{ position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: "50%", background: onShift ? T.ok : T.fg5, boxShadow: onShift ? `0 0 6px ${T.ok}` : "none" }} />
        )}
        <div>
          <div style={{ fontSize: 9, color: cfg.color, letterSpacing: ".16em", marginBottom: 12 }}>
            {p.workerId ?? (p.role === "admin" ? "ADM-00" : "MGR-XX")}
          </div>
          <div style={{ fontSize: 30, color: active ? cfg.color : T.fg4, lineHeight: 1, marginBottom: 14, transition: "color .12s" }}>
            {active ? "?" : "?"}
          </div>
          <div style={{ fontSize: 12, color: T.fg1, fontWeight: 700, letterSpacing: ".04em", marginBottom: 3 }}>
            {lang === "az" ? p.name : p.nameEn}
          </div>
          <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".1em" }}>
            {lang === "az" ? p.description : p.descriptionEn}
          </div>
        </div>
        <div style={{ fontSize: 9, color: active ? cfg.color : T.fg4, letterSpacing: ".1em", transition: "color .12s" }}>
          {p.role === "shelf_worker"
            ? (onShift ? (lang === "az" ? "? NÖVB?D?" : "? ON SHIFT") : (lang === "az" ? "? NÖVB?D? DEYIL" : "? OFF SHIFT"))
            : p.role === "store_manager"
            ? (lang === "az" ? "FILIAL SEÇ ?" : "SELECT BRANCH ?")
            : (lang === "az" ? "TAM GIRIS" : "FULL ACCESS")
          }
        </div>
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: T.font, position: "relative", overflow: "hidden" }}>
      <GridBg />

      {/* Lang */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", border: `1px solid ${T.border1}` }}>
        {(["az", "en"] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ fontFamily: T.font, fontSize: 9, letterSpacing: ".14em", padding: "5px 12px", background: lang === l ? "rgba(0,255,65,0.08)" : "transparent", color: lang === l ? T.green : T.fg4, border: "none", cursor: "pointer" }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6, position: "relative", animation: "bos-scalein .6s cubic-bezier(.22,1,.36,1) 0ms both" }}>
        <span style={{ fontSize: 32, color: T.green, textShadow: "0 0 24px rgba(0,255,65,.7)", animation: "bos-pulse 2s ease-in-out infinite" }}>?</span>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-.02em", color: T.fg1 }}>
          TEST<span style={{ color: T.green }}>OS</span>
        </div>
      </div>
      <div style={{ fontSize: 10, color: T.greenDim, letterSpacing: ".32em", marginBottom: 40, textTransform: "uppercase", position: "relative", animation: "bos-fadein .5s ease .3s both" }}>
        {lang === "az" ? "v1.0 · UTC+04 BAKI" : "v1.0 · UTC+04 TEST CITY"}
      </div>

      {step === "profiles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {/* Management row */}
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 6, animation: "bos-fadein .4s ease .4s both" }}>
            {lang === "az" ? "-- IDAR?ETM? --------------------------------" : "-- MANAGEMENT ------------------------------"}
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
            {mgmt.map((p, i) => (
              <div key={profileId(p)} style={{ borderRight: i < mgmt.length - 1 ? "none" : undefined, animation: `bos-slideup .5s cubic-bezier(.22,1,.36,1) ${500 + i * 80}ms both` }}>
                <Card p={p} wide={p.role === "store_manager"} />
              </div>
            ))}
          </div>

          {/* Workers row */}
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".3em", textTransform: "uppercase", marginTop: 0, marginBottom: 6, borderTop: `1px solid ${T.border1}`, paddingTop: 10, animation: "bos-fadein .4s ease .65s both" }}>
            {lang === "az" ? "-- RAF ISÇIL?RI -----------------------------" : "-- SHELF WORKERS ----------------------------"}
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {workers.map((p, i) => (
              <div key={profileId(p)} style={{ borderRight: i < workers.length - 1 ? "none" : undefined, animation: `bos-slideup .5s cubic-bezier(.22,1,.36,1) ${700 + i * 60}ms both` }}>
                <Card p={p} />
              </div>
            ))}
          </div>

          {/* Vendor row */}
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".3em", textTransform: "uppercase", marginTop: 0, marginBottom: 6, borderTop: `1px solid ${T.border1}`, paddingTop: 10, animation: "bos-fadein .4s ease .85s both" }}>
            {lang === "az" ? "-- VENDOR / TEDARIKÇI -----------------------" : "-- VENDOR / SUPPLIER ------------------------"}
          </div>
          <div style={{ animation: "bos-slideup .5s cubic-bezier(.22,1,.36,1) 900ms both" }}>
            {(() => {
              const cfg = ROLE_CFG.vendor;
              const [hov, setHov] = useState(false);
              return (
                <button
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  onClick={() => handleClick(VENDOR_PROFILE)}
                  style={{
                    width: "100%", height: 80, padding: "0 18px",
                    background: hov ? cfg.bg : "#050505",
                    border: "1px solid", borderColor: hov ? cfg.border : T.border1,
                    cursor: "pointer", fontFamily: T.font,
                    display: "flex", alignItems: "center", gap: 20,
                    transition: "all .12s", outline: "none",
                    boxShadow: hov ? `0 0 28px ${cfg.color}30` : "none",
                  }}
                >
                  <div style={{ fontSize: 28, color: hov ? cfg.color : T.fg4, lineHeight: 1, transition: "color .12s" }}>
                    {hov ? "?" : "?"}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, color: T.fg1, fontWeight: 700, letterSpacing: ".04em" }}>
                      {lang === "az" ? VENDOR_PROFILE.name : VENDOR_PROFILE.nameEn}
                    </div>
                    <div style={{ fontSize: 9, color: T.fg4, marginTop: 3, letterSpacing: ".1em" }}>
                      {lang === "az" ? VENDOR_PROFILE.description : VENDOR_PROFILE.descriptionEn}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 9, color: hov ? cfg.color : T.fg5, letterSpacing: ".14em", transition: "color .12s" }}>
                    {lang === "az" ? "PORTALA GIR ?" : "ENTER PORTAL ?"}
                  </div>
                </button>
              );
            })()}
          </div>
        </div>
      )}

      {step === "store_pick" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative" }}>
          <button onClick={() => setStep("profiles")} style={{ fontFamily: T.font, fontSize: 9, letterSpacing: ".16em", color: T.fg3, background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
            ? {lang === "az" ? "GERI" : "BACK"}
          </button>
          <StorePicker onPick={handleStorePick} />
        </div>
      )}

      <div style={{ position: "absolute", bottom: 24, fontSize: 9, color: T.fg5, letterSpacing: ".32em", textTransform: "uppercase" }}>
        TESTOS // AUTHENTICATION TERMINAL // © TEST MARKET
      </div>
    </div>
  );
}

// --- Shelf Worker Shell ---------------------------------------
function ShelfWorkerShell({ profile }: { profile: UserProfile }) {
  const { setProfile } = useUser();
  const { lang }       = useLanguage();
  const { isOnShift, checkIn, checkOut, activeShifts, shiftLogs } = useShift();
  const { getTasksFor, markDone, clearDone } = useTask();
  const workerId   = profile.workerId!;
  const myTasks = getTasksFor(workerId);
  const onShift    = isOnShift(workerId);
  const shiftEntry = activeShifts.find(s => s.workerId === workerId);
  const myLogs     = shiftLogs.filter(l => l.workerId === workerId).slice(0, 10);

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: T.font, color: T.fg1 }}>
      {/* Top bar */}
      <div style={{ height: 48, background: "#050505", borderBottom: `1px solid ${T.border1}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
        <span style={{ fontSize: 18, color: T.green }}>?</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: T.fg1 }}>TEST<span style={{ color: T.green }}>OS</span></span>
        <div style={{ width: 1, height: 16, background: T.border1 }} />
        <span style={{ fontSize: 9, color: "#00bfa5", letterSpacing: ".16em" }}>{workerId}</span>
        <span style={{ fontSize: 11, color: T.fg2 }}>{lang === "az" ? profile.name : profile.nameEn}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {myTasks.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", border: `1px solid ${T.warn}60`, background: `${T.warn}10` }}>
              <span className="bos-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: T.warn, boxShadow: `0 0 6px ${T.warn}`, display: "inline-block" }} />
              <span style={{ fontSize: 9, color: T.warn, letterSpacing: ".12em", fontWeight: 700 }}>
                {myTasks.length} {lang === "az" ? "TAPSIRIQ" : "TASK"}
              </span>
            </div>
          )}
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: onShift ? T.ok : T.err, boxShadow: onShift ? `0 0 8px ${T.ok}` : "none" }} />
          <span style={{ fontSize: 9, color: onShift ? T.ok : T.err, letterSpacing: ".14em" }}>{onShift ? (lang === "az" ? "NÖVB?D?" : "ON SHIFT") : (lang === "az" ? "NÖVB? YOX" : "OFF SHIFT")}</span>
          <button onClick={() => setProfile(null)} style={{ fontFamily: T.font, fontSize: 9, letterSpacing: ".12em", padding: "4px 10px", border: `1px solid ${T.border2}`, color: T.fg3, background: "transparent", cursor: "pointer" }}>
            ? {lang === "az" ? "ÇIXIS" : "LOGOUT"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Shift toggle */}
        <div style={{ border: `1px solid ${onShift ? T.ok + "40" : T.border1}`, background: onShift ? "rgba(0,255,65,0.04)" : T.bgPanel, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em", textTransform: "uppercase" }}>
            {lang === "az" ? "NÖVB? IDAR?ETM?SI" : "SHIFT MANAGEMENT"}
          </div>
          {onShift && shiftEntry && (
            <div style={{ fontSize: 11, color: T.fg3 }}>
              {lang === "az" ? "Növb? basladi:" : "Shift started:"} <span style={{ color: T.ok }}>{fmt(shiftEntry.since)}</span>
            </div>
          )}
          <button
            onClick={() => onShift ? checkOut(workerId, profile.name) : checkIn(workerId, profile.name)}
            style={{
              fontFamily: T.font, fontSize: 12, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase",
              padding: "14px 0", cursor: "pointer",
              border: `1px solid ${onShift ? T.err : T.ok}`,
              color: onShift ? T.err : "#000",
              background: onShift ? "transparent" : T.ok,
            }}
          >
            {onShift
              ? (lang === "az" ? "¦ NÖVB?NI BITIR" : "¦ END SHIFT")
              : (lang === "az" ? "? NÖVB?Y? BASLA" : "? START SHIFT")}
          </button>
        </div>

        {/* Tasks from manager */}
        <div style={{ border: `1px solid ${myTasks.length > 0 ? T.warn + "60" : T.border1}`, background: T.bgPanel }}>
          <div style={{ padding: "12px 16px 10px", borderBottom: myTasks.length > 0 ? `1px solid ${T.border1}` : undefined, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 9, color: myTasks.length > 0 ? T.warn : T.greenDim, letterSpacing: ".24em", textTransform: "uppercase" }}>
                {lang === "az" ? "AKTIV TAPSIRIQLAR" : "ACTIVE TASKS"}
              </div>
              {myTasks.length > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, background: T.warn, color: "#000", padding: "1px 6px", letterSpacing: ".1em" }}>
                  {myTasks.length}
                </span>
              )}
            </div>
            {myTasks.length > 0 && (
              <button onClick={clearDone} style={{ fontFamily: T.font, fontSize: 8, color: T.fg4, background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>
                {lang === "az" ? "T?MIZL?" : "CLEAR DONE"}
              </button>
            )}
          </div>

          {myTasks.length === 0 ? (
            <div style={{ padding: 20, fontSize: 11, color: T.fg4, letterSpacing: ".1em" }}>
              {lang === "az" ? "Hazirda tapsiriq yoxdur." : "No tasks assigned right now."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {myTasks.map((task: WorkerTask) => {
                const typeLabel = task.type === "PRICE_CHANGE"
                  ? (lang === "az" ? "QIYM?T"    : "PRICE TAG")
                  : task.type === "TRANSFER"
                  ? (lang === "az" ? "TRANSFER"   : "TRANSFER")
                  : (lang === "az" ? "BAGIS"      : "DONATE");
                const typeColor = task.type === "PRICE_CHANGE" ? T.warn
                  : task.type === "TRANSFER" ? T.info : T.ok;

                return (
                  <div key={task.id} style={{ borderBottom: `1px solid ${T.border1}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Type + product */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".14em", border: `1px solid ${typeColor}`, color: typeColor, padding: "2px 6px", flexShrink: 0 }}>
                        {typeLabel}
                      </span>
                      <span style={{ fontSize: 12, color: T.fg1, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {task.productName}
                      </span>
                    </div>
                    {/* Store */}
                    <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".1em", textTransform: "uppercase" }}>
                      {task.storeName}
                    </div>
                    {/* Detail — the actual instruction */}
                    <div style={{ fontSize: 13, color: typeColor, fontWeight: 700, letterSpacing: ".04em", padding: "8px 12px", background: `${typeColor}08`, border: `1px solid ${typeColor}30` }}>
                      {task.detail}
                    </div>
                    {/* Meta */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: T.fg4 }}>
                        {lang === "az" ? "Müdür:" : "By:"} {task.createdBy} · {new Date(task.createdAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
                        {task.assignedTo && (
                          <span style={{ marginLeft: 6, color: "#00bfa5" }}>? {task.assignedTo}</span>
                        )}
                      </span>
                      <button onClick={() => markDone(task.id)} style={{
                        fontFamily: T.font, fontSize: 9, fontWeight: 700, letterSpacing: ".16em",
                        padding: "5px 14px", border: `1px solid ${T.ok}`, color: "#000",
                        background: T.ok, cursor: "pointer",
                      }}>
                        ? {lang === "az" ? "T?SDIQ" : "DONE"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shift log */}
        {myLogs.length > 0 && (
          <div style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: 20 }}>
            <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em", textTransform: "uppercase", marginBottom: 12 }}>
              {lang === "az" ? "NÖVB? JURNALI" : "SHIFT LOG"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {myLogs.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 12, fontSize: 10, color: T.fg3 }}>
                  <span style={{ color: T.fg4, width: 50 }}>{fmt(l.time)}</span>
                  <span style={{ color: l.action === "CHECK_IN" ? T.ok : T.err, width: 90 }}>{l.action === "CHECK_IN" ? "? GIRIS" : "¦ ÇIXIS"}</span>
                  <span>{l.workerName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main AppContent ------------------------------------------
export default function AppContent({ children }: { children: React.ReactNode }) {
  const { profile, setProfile } = useUser();
  const { setSelectedStore }    = useStore();
  const { checkIn }             = useShift();
  const router                  = useRouter();
  const [selecting, setSelecting] = useState<string | null>(null);

  const handleSelect = (p: UserProfile, storeId?: number, storeName?: string) => {
    setSelecting(profileId(p));
    setProfile(p);
    if (p.role === "store_manager" && storeId) {
      setSelectedStore({ id: storeId, name: storeName ?? "", district: "" });
    }
    if ((p.role as string) === "vendor") {
      router.push("/vendor-portal");
    }
    setSelecting(null);
  };

  if (!profile) return <ProfileSelection onSelect={handleSelect} />;

  // Shelf workers ? dedicated shift screen
  if (profile.role === "shelf_worker") {
    return <ShelfWorkerShell profile={profile} />;
  }

  // Vendors ? clean portal (no sidebar, no topnav)
  if ((profile.role as string) === "vendor") {
    return (
      <div style={{ minHeight: "100vh", background: "#000", fontFamily: T.font, color: T.fg1 }}>
        {/* Minimal top bar */}
        <div style={{ height: 40, background: "#050505", borderBottom: `1px solid ${T.border1}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
          <span style={{ fontSize: 16, color: T.green }}>?</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.fg1 }}>TEST<span style={{ color: T.green }}>OS</span></span>
          <span style={{ fontSize: 9, color: "#fb923c", letterSpacing: ".16em", marginLeft: 4 }}>VENDOR PORTAL</span>
          <button
            onClick={() => setProfile(null)}
            style={{ marginLeft: "auto", fontFamily: T.font, fontSize: 9, letterSpacing: ".12em", padding: "4px 12px", border: `1px solid ${T.border2}`, color: T.fg4, background: "transparent", cursor: "pointer" }}
          >
            ? {profile.name ?? "Çixis"}
          </button>
        </div>
        {/* Content */}
        <div style={{ padding: "24px 24px" }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#000" }} />}>
        <TopNav />
      </Suspense>
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "#000" }}>
        <div style={{ padding: "20px 20px" }}>{children}</div>
      </main>
      <DemoGuide />
    </>
  );
}
