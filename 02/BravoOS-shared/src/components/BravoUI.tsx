"use client";
import { useState, useEffect, useRef } from "react";

// ── DiscountCalcPanel (shared between Alerts + Actions) ───────
export function DiscountCalcPanel({ product, quantity, onExec, onClose, lang, initialPct = 20 }: {
  product: any; quantity: number;
  onExec: (pct: number) => void; onClose: () => void; lang: string;
  initialPct?: number;
}) {
  const [pct, setPct] = useState(initialPct);
  const [imgErr, setImgErr] = useState(false);

  // Reset slider whenever a new product is opened
  useEffect(() => { setPct(initialPct); setImgErr(false); }, [initialPct, product?.id]);

  const isAtAI  = pct === initialPct;
  const aiLabel = lang === "az" ? "AI ÖNƏRİSİ" : "AI REC.";

  const price     = product?.price ?? 0;
  const costPrice = product?.cost_price ?? null;
  const hasReal   = costPrice !== null && costPrice > 0;
  const cost      = hasReal ? costPrice : price * 0.68;

  const newPrice     = price * (1 - pct / 100);
  const unitMargin   = newPrice - cost;
  const totalRevenue = newPrice * quantity;
  const newMarginPct = price > 0 ? ((newPrice - cost) / newPrice) * 100 : 0;
  const curMarginPct = price > 0 ? ((price - cost) / price) * 100 : 0;
  const mColor = newMarginPct > 15 ? "#00ff41" : newMarginPct > 5 ? "#ffcc00" : "#ff3344";
  const mLabel = newMarginPct > 15
    ? (lang === "az" ? "✓ SAĞLAM MARJA" : "✓ HEALTHY MARGIN")
    : newMarginPct > 5
    ? (lang === "az" ? "⚠ İNCƏ MARJA"  : "⚠ THIN MARGIN")
    : (lang === "az" ? "✕ ZƏRƏR RİSKİ" : "✕ LOSS RISK");

  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #2a3a2a", padding: 14, display: "grid", gridTemplateColumns: "1fr 180px", gap: 16 }}>
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "#00b82e", letterSpacing: ".2em", textTransform: "uppercase" }}>
            {lang === "az" ? "ENDİRİM KALKULYATORU" : "DISCOUNT CALCULATOR"} · {product?.name ?? ""}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7a6b", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>✕</button>
        </div>
        <div style={{ marginBottom: 8, fontSize: 9, color: hasReal ? "#00ff41" : "#3a4a3a", letterSpacing: ".12em", textTransform: "uppercase" }}>
          {hasReal ? `✓ ${lang === "az" ? "HƏQİQİ MALİYYƏT" : "REAL COST"} · ₼${costPrice?.toFixed(2)}` : `~ ${lang === "az" ? "TƏXMİNİ MALİYYƏT" : "EST. COST"} · ₼${cost.toFixed(2)}`}
        </div>
        <div style={{ marginBottom: 10, padding: "6px 10px", background: "#050505", border: "1px solid #1a2a1a", display: "flex", justifyContent: "space-between", fontSize: 10 }}>
          <span style={{ color: "#6b7a6b", letterSpacing: ".12em", textTransform: "uppercase" }}>{lang === "az" ? "CARİ MARJA" : "CUR. MARGIN"}</span>
          <span style={{ color: "#b8c4b8", fontWeight: 600 }}>{curMarginPct.toFixed(1)}% · ₼{price.toFixed(2)}</span>
        </div>
        {/* AI Recommendation banner */}
        <div style={{
          marginBottom: 10, padding: "7px 10px",
          background: isAtAI ? "rgba(0,255,65,0.06)" : "rgba(255,204,0,0.04)",
          border: `1px solid ${isAtAI ? "#00ff4140" : "#ffcc0030"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 9, color: "#00ff41", letterSpacing: ".02em" }}>⚡</span>
            <span style={{ fontSize: 8, color: "#00b82e", letterSpacing: ".18em", textTransform: "uppercase" }}>{aiLabel}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#00ff41", letterSpacing: "-.01em", fontVariantNumeric: "tabular-nums" }}>%{initialPct}</span>
            {isAtAI && <span style={{ fontSize: 7, color: "#00b82e", letterSpacing: ".12em", padding: "1px 5px", border: "1px solid #00ff4130", background: "rgba(0,255,65,0.06)" }}>AKTİV</span>}
          </div>
          {!isAtAI && (
            <button onClick={() => setPct(initialPct)} style={{
              fontFamily: "inherit", fontSize: 7, letterSpacing: ".14em", textTransform: "uppercase",
              padding: "2px 8px", border: "1px solid #00ff4160", color: "#00ff41",
              background: "rgba(0,255,65,0.06)", cursor: "pointer",
            }}>
              ↩ {lang === "az" ? "RESET" : "RESET"}
            </button>
          )}
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "#6b7a6b", letterSpacing: ".12em", textTransform: "uppercase" }}>{lang === "az" ? "SEÇİLMİŞ ENDİRİM" : "SELECTED DISCOUNT"}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: isAtAI ? "#00ff41" : "#ffcc00" }}>%{pct}</span>
          </div>
          <input type="range" min={5} max={60} step={5} value={pct} onChange={e => setPct(Number(e.target.value))} style={{ width: "100%", accentColor: isAtAI ? "#00ff41" : "#ffcc00", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#1a2a1a", marginTop: 2 }}>
            <span>5%</span><span>30%</span><span>60%</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
          {[
            { label: lang === "az" ? "YENİ QİYMƏT"  : "NEW PRICE",   val: `₼${newPrice.toFixed(2)}`,    color: "#e8ffe8" },
            { label: lang === "az" ? "BİRİM QAZANC" : "UNIT MARGIN", val: `₼${unitMargin.toFixed(2)}`,   color: unitMargin >= 0 ? "#00ff41" : "#ff3344" },
            { label: lang === "az" ? "CƏMİ GƏLİR"   : "TOTAL REV.",  val: `₼${totalRevenue.toFixed(0)}`, color: "#00ccff" },
            { label: lang === "az" ? "YENİ MARJA"    : "NEW MARGIN",  val: `${newMarginPct.toFixed(1)}%`, color: mColor },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", background: "#050505", border: "1px solid #1a2a1a" }}>
              <span style={{ fontSize: 9, color: "#3a4a3a", letterSpacing: ".14em", textTransform: "uppercase" }}>{s.label}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.val}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "6px 10px", border: `1px solid ${mColor}40`, background: `${mColor}08`, fontSize: 9, color: mColor, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          {mLabel}
        </div>
        <button onClick={() => onExec(pct)} style={{ width: "100%", fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "10px 0", border: "1px solid #00ff41", color: "#000", background: "#00ff41", cursor: "pointer" }}>
          ▶ {lang === "az" ? `%${pct} ENDİRİM İCRA ET` : `EXECUTE ${pct}% DISCOUNT`}
        </button>
      </div>
      {/* Right: product photo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {product?.image_url && !imgErr
          ? <img src={product.image_url} alt="" onError={() => setImgErr(true)} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", border: "1px solid #2a3a2a", display: "block" }} />
          : <div style={{ width: "100%", aspectRatio: "1/1", background: "#050505", border: "1px solid #1a2a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a2a1a", fontSize: 40 }}>◻</div>
        }
        <div style={{ fontSize: 9, color: "#6b7a6b", letterSpacing: ".1em", textAlign: "center", lineHeight: 1.5 }}>
          {price > 0 ? `₼${price.toFixed(2)}` : ""}
          {product?.brand ? `\n${product.brand}` : ""}
        </div>
      </div>
    </div>
  );
}

// ── Design tokens (mirrors colors_and_type.css) ──────────────
export const T = {
  bgPanel: "#050505", bgElev: "#0a0a0a", bgHover: "#0f1a0f", bgActive: "#0a1f0a",
  green: "#00ff41", greenDim: "#00b82e",
  fg1: "#e8ffe8", fg2: "#b8c4b8", fg3: "#6b7a6b", fg4: "#3a4a3a", fg5: "#1a2a1a",
  ok: "#00ff41", warn: "#ffcc00", err: "#ff3344", info: "#00ccff",
  border1: "#1a2a1a", border2: "#2a3a2a",
  font: "'JetBrains Mono','IBM Plex Mono','SF Mono',Menlo,monospace",
} as const;

export type Tone = "ok" | "warn" | "err" | "info" | "dim";
export const toneColor: Record<Tone, string> = {
  ok: T.ok, warn: T.warn, err: T.err, info: T.info, dim: T.fg3,
};

// ── GridBg ────────────────────────────────────────────────────
export function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "linear-gradient(rgba(0,255,65,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,65,0.04) 1px,transparent 1px)",
      backgroundSize: "32px 32px",
      maskImage: "radial-gradient(ellipse at center,#000 30%,transparent 70%)",
      WebkitMaskImage: "radial-gradient(ellipse at center,#000 30%,transparent 70%)",
    }} />
  );
}

// ── Panel ─────────────────────────────────────────────────────
export function Panel({ id, title, right, children, style }: {
  id?: string; title: string; right?: React.ReactNode;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ background: T.bgPanel, border: `1px solid ${T.border1}`, display: "flex", flexDirection: "column", ...style }}>
      <div style={{ height: 30, borderBottom: `1px solid ${T.border1}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", background: T.bgElev }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {id && <span style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".16em", textTransform: "uppercase" }}>{id}</span>}
          <span style={{ fontSize: 11, color: T.fg1, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>{title}</span>
        </div>
        {right && <div style={{ fontSize: 10, color: T.fg3, letterSpacing: ".12em", textTransform: "uppercase" }}>{right}</div>}
      </div>
      <div style={{ padding: 14, flex: 1 }}>{children}</div>
    </div>
  );
}

// ── KpiBox ────────────────────────────────────────────────────
export function KpiBox({ id, label, value, sub, delta, deltaTone = "ok", tone = "ok" }: {
  id?: string; label: string; value: string; sub?: string;
  delta?: string; deltaTone?: Tone; tone?: Tone;
}) {
  const valColor = tone === "err" ? T.err : tone === "warn" ? T.warn : T.green;
  const dc = toneColor[deltaTone];
  return (
    <div style={{ background: T.bgPanel, border: `1px solid ${T.border1}`, padding: 14, display: "flex", flexDirection: "column", gap: 4, minHeight: 110, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        {id && <span style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".16em", textTransform: "uppercase" }}>{id}</span>}
        {delta && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: dc }}>{deltaTone === "err" ? "▼" : "▲"} {delta}</span>}
      </div>
      <div style={{ fontSize: 10, color: T.fg3, letterSpacing: ".16em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em", marginTop: 4, color: valColor, textShadow: tone === "ok" ? "0 0 12px rgba(0,255,65,.3)" : "none" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: T.fg4, letterSpacing: ".08em", textTransform: "uppercase", marginTop: "auto" }}>{sub}</div>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ tone = "ok", solid = false, children }: { tone?: Tone; solid?: boolean; children: React.ReactNode }) {
  const c = toneColor[tone];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", padding: "2px 7px", border: `1px solid ${c}`, color: solid ? "#000" : c, background: solid ? c : "transparent", display: "inline-flex", alignItems: "center", gap: 5 }}>
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────
export function BButton({ variant = "outline", children, onClick, style }: { variant?: "outline" | "solid" | "ghost" | "danger"; children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hover, setHover] = useState(false);
  const s = {
    outline: { border: `1px solid ${T.green}`, color: hover ? "#000" : T.green, background: hover ? T.green : "transparent" },
    solid:   { border: `1px solid ${T.green}`, background: hover ? T.greenDim : T.green, color: "#000", boxShadow: hover ? "0 0 16px rgba(0,255,65,.5)" : "none" },
    ghost:   { border: `1px solid ${T.border2}`, color: hover ? T.fg1 : T.fg2, background: hover ? T.bgHover : "transparent" },
    danger:  { border: `1px solid ${T.err}`, color: hover ? "#000" : T.err, background: hover ? T.err : "transparent" },
  }[variant];
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ fontFamily: "inherit", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".12em", padding: "7px 14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .1s", ...s, ...style }}>
      {children}
    </button>
  );
}

// ── LogRow ────────────────────────────────────────────────────
export function LogRow({ time, tone, src, msg }: { time: string; tone: Tone; src: string; msg: string }) {
  const c = toneColor[tone];
  const tag = { ok: "[OK]", err: "[CRIT]", warn: "[WARN]", info: "[OR]", dim: "[--]" }[tone];
  return (
    <div style={{ display: "flex", gap: 10, fontSize: 11, lineHeight: 1.7 }}>
      <span style={{ color: T.fg4, width: 60, flexShrink: 0 }}>{time}</span>
      <span style={{ color: c, width: 56, flexShrink: 0 }}>{tag}</span>
      <span style={{ color: T.fg3, width: 80, flexShrink: 0 }}>{src}</span>
      <span style={{ color: T.fg1 }}>{msg}</span>
    </div>
  );
}

// ── RiskBar ───────────────────────────────────────────────────
export function RiskBar({ critical = 0, high = 0, medium = 0 }: { critical?: number; high?: number; medium?: number }) {
  const Bar = ({ count, color, glow }: { count: number; color: string; glow?: boolean }) => (
    <div style={{ display: "flex", gap: 1.5, alignItems: "center" }}>
      {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
        <div key={i} style={{ width: 6, height: 12, background: color, boxShadow: glow ? `0 0 4px ${color}` : "none" }} />
      ))}
      {count > 12 && <span style={{ color: T.fg3, fontSize: 10, marginLeft: 2 }}>+{count - 12}</span>}
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      {critical > 0 && <Bar count={critical} color={T.err} glow />}
      {high > 0 && <Bar count={high} color={T.warn} />}
      {medium > 0 && <Bar count={medium} color={T.info} />}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────
export function PageHeader({ screen, title, subtitle, actions }: { screen: string; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em", textTransform: "uppercase" }}>{screen}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase", marginTop: 2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: T.fg3, letterSpacing: ".08em", marginTop: 4 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 6 }}>{actions}</div>}
    </div>
  );
}

// ── FilterTabs ────────────────────────────────────────────────
export function FilterTabs({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number; tone?: Tone }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border1}` }}>
      {tabs.map((tab, i) => {
        const isActive = active === tab.key;
        const c = tab.tone ? toneColor[tab.tone] : T.fg1;
        return (
          <button key={tab.key} onClick={() => onChange(tab.key)} style={{
            flex: 1, padding: "12px 16px", background: isActive ? T.bgActive : "transparent",
            border: "none", borderRight: i < tabs.length - 1 ? `1px solid ${T.border1}` : "none",
            borderBottom: isActive ? `2px solid ${c}` : `2px solid transparent`,
            color: isActive ? c : T.fg3, fontFamily: "inherit", fontSize: 11,
            letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>{tab.label}</span>
            {tab.count !== undefined && <span style={{ fontWeight: 700, fontSize: 14 }}>{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── useCountUp ───────────────────────────────────────────────
export function useCountUp(target: number, duration = 1100, delay = 0): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let timer: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;
    timer = setTimeout(() => {
      const t0 = Date.now();
      iv = setInterval(() => {
        const p = Math.min((Date.now() - t0) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * ease));
        if (p >= 1) { setVal(target); clearInterval(iv); }
      }, 16);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(iv); };
  }, [target, duration, delay]);
  return val;
}

// ── AnimCard ──────────────────────────────────────────────────
export function AnimCard({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      animation: `bos-slideup .45s cubic-bezier(.22,1,.36,1) ${delay}ms both`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── AnimRow ───────────────────────────────────────────────────
export function AnimRow({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      animation: `bos-slideleft .3s cubic-bezier(.22,1,.36,1) ${delay}ms both`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── TypeWriter ────────────────────────────────────────────────
export function TypeWriter({ text, speed = 22, delay = 0, style }: { text: string; speed?: number; delay?: number; style?: React.CSSProperties }) {
  const [shown, setShown] = useState("");
  const [done, setDone]   = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    const t0 = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) { setDone(true); clearInterval(id); }
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t0);
  }, [text, speed, delay]);
  return (
    <span style={style}>
      {shown}
      {!done && <span className="bos-cursor" style={{ color: T.green, marginLeft: 1 }}>_</span>}
    </span>
  );
}

// ── AnimBar (width animates from 0) ──────────────────────────
export function AnimBar({ pct, color, height = 4, delay = 0 }: { pct: number; color: string; height?: number; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), delay + 50);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height, background: T.bgElev, border: `1px solid ${T.border1}`, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, transition: `width .8s cubic-bezier(.22,1,.36,1) ${delay}ms`, boxShadow: `0 0 6px ${color}60` }} />
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ h = 14, w = "100%", style }: { h?: number; w?: string | number; style?: React.CSSProperties }) {
  return <div className="bos-skeleton" style={{ height: h, width: w, ...style }} />;
}

export function SkeletonKpi() {
  return (
    <div style={{ background: T.bgPanel, border: `1px solid ${T.border1}`, padding: 14, minHeight: 110, display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton h={8} w={50} />
      <Skeleton h={9} w="60%" />
      <Skeleton h={26} w="45%" />
      <Skeleton h={8} w="75%" style={{ marginTop: "auto" }} />
    </div>
  );
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border1}` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} h={11} w={`${100 / cols}%`} />
      ))}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon = "◻", title, sub }: { icon?: string; title: string; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", gap: 10 }}>
      <div style={{ fontSize: 32, color: T.fg5, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 11, color: T.fg3, letterSpacing: ".2em", textTransform: "uppercase" }}>{title}</div>
      {sub && <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".12em" }}>{sub}</div>}
    </div>
  );
}

// ── Toast (standalone usage) ──────────────────────────────────
export function Toast({ msg, tone = "ok", onDone }: { msg: string; tone?: Tone; onDone?: () => void }) {
  const c = toneColor[tone];
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bos-toast" style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: T.bgElev, border: `1px solid ${c}`, padding: "10px 20px",
      fontSize: 11, letterSpacing: ".14em", color: c, zIndex: 9998,
      display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, boxShadow: `0 0 6px ${c}`, flexShrink: 0, display: "inline-block" }} />
      {msg}
    </div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────
export function Sparkline({ data, color = T.green, width = 100, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity={0.1} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
