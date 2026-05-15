"use client";
import { useEffect, useState } from "react";
import { fetchAlerts, fetchActionSummary, executeAction, dismissAction } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";
import { useUser, PROFILES } from "@/contexts/UserContext";
import { useTask } from "@/contexts/TaskContext";
import { useShift } from "@/contexts/ShiftContext";
import { BButton, FilterTabs, T, DiscountCalcPanel } from "@/components/BravoUI";

type RiskFilter = "ALL" | "CRITICAL" | "HIGH" | "MEDIUM";

const NUTRI: Record<string, { bg: string; color: string }> = {
  A: { bg: "#1a6e3a", color: "#00ff80" },
  B: { bg: "#2d7a1f", color: "#7fff00" },
  C: { bg: "#6b6b00", color: "#ffff00" },
  D: { bg: "#7a3500", color: "#ff9900" },
  E: { bg: "#6b0000", color: "#ff3344" },
};

const ACTION_COLOR: Record<string, string> = {
  DISCOUNT: T.warn,
  TRANSFER: T.info,
  DONATE:   T.ok,
};

/** details alani API'den object veya JSON string olarak gelebilir — ikisini de handle et */
function parseDetails(details: any): Record<string, any> {
  if (!details) return {};
  if (typeof details === "object") return details;
  try { return JSON.parse(details); } catch { return {}; }
}

function exportCSV(alerts: any[], lang: string) {
  const header = lang === "az"
    ? ["M?hsul", "Filial", "Risk", "Aksiya", "Günl?r", "Miqdar", "Itki (?)", "Q?na?t (?)"]
    : ["Product", "Branch", "Risk", "Action", "Days", "Qty", "Loss (?)", "Saving (?)"];
  const rows = alerts.map(a => {
    const act = a.actions?.[0];
    return [
      `"${a.product?.name ?? ""}"`,
      `"${a.store?.name ?? ""}"`,
      a.risk_level ?? "",
      act?.action_type ?? "",
      a.days_until_expiry ?? "",
      a.quantity_at_risk ?? "",
      (a.potential_loss ?? 0).toFixed(2),
      (act?.estimated_saving ?? 0).toFixed(2),
    ];
  });
  const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `testai_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// -- Card component --------------------------------------------
function AlertCard({
  a, lang, isCalcOpen, assignTarget,
  onCalcToggle, onExec, onDismiss,
}: {
  a: any; lang: string; isCalcOpen: boolean; assignTarget: string | undefined;
  onCalcToggle: () => void;
  onExec: () => void;
  onDismiss: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const action      = a.actions?.[0];
  const actionType  = action?.action_type ?? null;
  const saving      = action?.estimated_saving ?? 0;
  const isDiscount  = actionType === "DISCOUNT";
  const tone        = a.risk_level === "CRITICAL" ? T.err : a.risk_level === "HIGH" ? T.warn : T.info;
  const acColor     = actionType ? (ACTION_COLOR[actionType] ?? T.fg3) : T.fg5;
  const daysColor   = a.days_until_expiry <= 1 ? T.err : a.days_until_expiry <= 3 ? T.warn : T.fg3;
  const imgUrl      = a.product?.image_url;
  const hasImg      = imgUrl && !imgErr;
  const ns          = a.product?.nutriscore?.toUpperCase();
  const nsStyle     = ns ? (NUTRI[ns] ?? null) : null;
  const allergens: string[] = (() => { try { return JSON.parse(a.product?.allergens ?? "[]"); } catch { return []; } })();

  return (
    <div style={{
      background: T.bgPanel,
      border: `1px solid ${isCalcOpen ? T.warn + "80" : tone + "40"}`,
      display: "flex", flexDirection: "column", position: "relative",
      transition: "border-color .15s, box-shadow .15s",
      boxShadow: isCalcOpen ? `0 0 20px ${T.warn}20` : "none",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = isCalcOpen ? T.warn : tone; e.currentTarget.style.boxShadow = `0 0 14px ${tone}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isCalcOpen ? T.warn + "80" : tone + "40"; e.currentTarget.style.boxShadow = isCalcOpen ? `0 0 20px ${T.warn}20` : "none"; }}
    >
      {/* Risk badge — top left */}
      <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".12em", background: tone, color: "#000", padding: "2px 6px" }}>
          {a.risk_level}
        </span>
        {actionType && (
          <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: ".1em", border: `1px solid ${acColor}`, color: acColor, padding: "2px 5px", background: T.bgPanel }}>
            {actionType}
          </span>
        )}
      </div>

      {/* Days — top right */}
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: daysColor, background: "#000", padding: "2px 6px", border: `1px solid ${daysColor}40` }}>
          {a.days_until_expiry}{lang === "az" ? "G" : "D"}
        </span>
      </div>

      {/* Product image */}
      <div style={{ width: "100%", aspectRatio: "1/1", background: T.bgElev, overflow: "hidden" }}>
        {hasImg
          ? <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => setImgErr(true)} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.fg5, fontSize: 32 }}>?</div>
        }
      </div>

      {/* Info */}
      <div style={{ padding: "10px 10px 0", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        <div style={{ fontSize: 11, color: T.fg1, fontWeight: 600, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
          {a.product?.name ?? "—"}
        </div>

        <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {a.store?.name ?? "—"}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
          <span style={{ color: T.fg3 }}>{a.quantity_at_risk} {lang === "az" ? "?d." : "u."}</span>
          <span style={{ color: T.err, fontWeight: 700 }}>-{(a.potential_loss ?? 0).toFixed(0)}?</span>
        </div>

        {saving > 0 && (
          <div style={{ fontSize: 9, color: T.ok, letterSpacing: ".08em" }}>
            +{saving.toFixed(0)}? {lang === "az" ? "q?na?t" : "saved"}
          </div>
        )}

        {/* Nutri + Eco */}
        {(nsStyle || a.product?.ecoscore) && (
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {nsStyle && (
              <span style={{ fontSize: 7, fontWeight: 700, padding: "2px 5px", background: nsStyle.bg, color: nsStyle.color, border: `1px solid ${nsStyle.color}30` }}>
                NUTRI-{ns}
              </span>
            )}
            {a.product?.ecoscore && (
              <span style={{ fontSize: 7, padding: "2px 5px", background: "rgba(0,191,165,0.08)", color: "#00bfa5", border: "1px solid #00bfa520" }}>
                ECO-{a.product.ecoscore.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {allergens.length > 0 && (
          <div style={{ fontSize: 8, color: T.warn }}>? {allergens.slice(0, 2).join(", ")}</div>
        )}
      </div>

      {/* Action row */}
      <div style={{ padding: "8px 10px 10px", display: "flex", gap: 5, marginTop: "auto" }}>
        {action ? (
          <>
            <button
              onClick={isDiscount ? onCalcToggle : onExec}
              style={{
                flex: 1, fontFamily: "inherit", fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
                padding: "6px 0",
                border: `1px solid ${isCalcOpen ? T.warn : T.ok}`,
                color: isCalcOpen ? T.warn : "#000",
                background: isCalcOpen ? "transparent" : T.ok,
                cursor: "pointer", transition: "all .1s",
              }}
            >
              {isDiscount ? (isCalcOpen ? "? CALC" : "? CALC") : "? EXEC"}
            </button>
            <button
              onClick={onDismiss}
              style={{ fontFamily: "inherit", fontSize: 9, padding: "6px 8px", border: `1px solid ${T.border2}`, color: T.fg4, background: "transparent", cursor: "pointer" }}
              title={lang === "az" ? "Gizl?t" : "Dismiss"}
            >?</button>
          </>
        ) : (
          <div style={{ fontSize: 9, color: T.fg5, padding: "6px 0" }}>
            {lang === "az" ? "Aksiya yoxdur" : "No action"}
          </div>
        )}
      </div>

      {/* Assigned worker badge */}
      {assignTarget && (
        <div style={{ position: "absolute", bottom: 44, right: 10, fontSize: 7, color: "#00bfa5", background: "rgba(0,191,165,0.08)", border: "1px solid #00bfa520", padding: "1px 5px", letterSpacing: ".08em" }}>
          ? {assignTarget}
        </div>
      )}
    </div>
  );
}

// -- Main page -------------------------------------------------
export default function AlertsPage() {
  const { lang }          = useLanguage();
  const { selectedStore } = useStore();
  const { profile }       = useUser();
  const { addTask }       = useTask();
  const { isOnShift }     = useShift();

  const [alerts,    setAlerts]   = useState<any[]>([]);
  const [summary,   setSummary]  = useState<any>(null);
  const [filter,    setFilter]   = useState<RiskFilter>("ALL");
  const [loading,   setLoading]  = useState(true);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [calcAlert, setCalcAlert] = useState<any | null>(null); // alert with open calc
  const [assignTarget, setAssignTarget] = useState<string | undefined>(undefined);
  const [search,    setSearch]   = useState("");
  const [minSaving, setMinSaving] = useState(0);

  const shelfWorkers = PROFILES.filter(p => p.role === "shelf_worker");

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchAlerts({ store_id: selectedStore?.id, limit: 200 }),
      fetchActionSummary(),
    ]).then(([a, s]) => {
      setAlerts(Array.isArray(a) ? a : []);
      setSummary(s);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [selectedStore]);

  const searchLow = search.trim().toLowerCase();
  const visible = (filter === "ALL" ? alerts : alerts.filter(a => a.risk_level === filter))
    .filter(a => !dismissed.has(a.id))
    .filter(a => !searchLow || (a.product?.name ?? "").toLowerCase().includes(searchLow))
    .filter(a => minSaving === 0 || (a.actions?.[0]?.estimated_saving ?? 0) >= minSaving);

  const counts = {
    ALL:      alerts.filter(a => !dismissed.has(a.id)).length,
    CRITICAL: alerts.filter(a => a.risk_level === "CRITICAL" && !dismissed.has(a.id)).length,
    HIGH:     alerts.filter(a => a.risk_level === "HIGH"     && !dismissed.has(a.id)).length,
    MEDIUM:   alerts.filter(a => a.risk_level === "MEDIUM"   && !dismissed.has(a.id)).length,
  };

  // -- Task helper --
  const createTask = (alert: any, action: any, discountPct?: number) => {
    if (!action) return;
    const by = lang === "az" ? (profile?.name ?? "Müdür") : (profile?.nameEn ?? "Manager");
    const base = {
      productName: alert.product?.name ?? "-",
      storeName:   alert.store?.name   ?? "-",
      createdBy:   by,
      assignedTo:  assignTarget,
    };
    if (action.action_type === "DISCOUNT") {
      const price = alert.product?.price ?? 0;
      const pct   = discountPct ?? (parseDetails(action.details).discount_pct ?? 20);
      addTask({ ...base, type: "PRICE_CHANGE", detail: `?${(price * (1 - pct / 100)).toFixed(2)} qiym?t et (${pct}% endirim)` });
    } else if (action.action_type === "TRANSFER") {
      const dest = parseDetails(action.details).transfer_to ?? parseDetails(action.details).to_store ?? "";
      addTask({ ...base, type: "TRANSFER", detail: dest ? `${dest} filialina transfer et` : "Transfer et" });
    } else if (action.action_type === "DONATE") {
      addTask({ ...base, type: "DONATE", detail: lang === "az" ? "Sosial mü?ssis?y? ver" : "Donate to social institution" });
    }
  };

  const execAction = async (alert: any, discountPct?: number) => {
    const action = alert.actions?.[0];
    if (!action) return;
    await executeAction(action.id);
    createTask(alert, action, discountPct);
    setCalcAlert(null);
    load();
  };

  const execAllCritical = async () => {
    const crits = alerts.filter(a => a.risk_level === "CRITICAL" && !dismissed.has(a.id));
    for (const a of crits) await execAction(a);
    load();
  };

  const thresholdCount  = minSaving > 0 ? visible.filter(a => (a.actions?.[0]?.estimated_saving ?? 0) >= minSaving).length : 0;
  const execAboveThreshold = async () => {
    const targets = visible.filter(a => (a.actions?.[0]?.estimated_saving ?? 0) >= minSaving);
    for (const a of targets) await execAction(a);
    load();
  };

  // AI recommended discount for the currently open calc panel
  const aiDiscountPct = calcAlert
    ? (parseDetails(calcAlert.actions?.[0]?.details).discount_pct ?? 20)
    : 20;

  const dismiss = (alertId: number) => {
    if (calcAlert?.id === alertId) setCalcAlert(null);
    setDismissed(p => new Set([...p, alertId]));
  };

  const totalLoss    = visible.reduce((s, a) => s + (a.potential_loss ?? 0), 0);
  const totalSaving  = visible.reduce((s, a) => s + (a.actions?.[0]?.estimated_saving ?? 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* -- Header -- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em" }}>X?B?RDARLIQ & TÖVSIY?</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase", marginTop: 2 }}>
            {lang === "az" ? "ALERT & AKSIYA" : "ALERTS & ACTIONS"}
          </div>
          <div style={{ marginTop: 5, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, border: `1px solid ${T.ok}40`, color: T.ok, padding: "1px 7px", letterSpacing: ".12em" }}>
              {lang === "az" ? "SISTEM TÖVSIY? · MÜDÜR T?SDIQ" : "SYSTEM SUGGESTS · MANAGER APPROVES"}
            </span>
            {selectedStore && (
              <span style={{ fontSize: 9, border: `1px solid ${T.warn}40`, color: T.warn, padding: "1px 7px", letterSpacing: ".12em" }}>
                ? {selectedStore.name}
              </span>
            )}
          </div>
        </div>

        {/* Right: worker picker + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
          {/* Worker selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${T.border1}`, height: 28 }}>
            <span style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em", padding: "0 10px", borderRight: `1px solid ${T.border1}`, height: "100%", display: "flex", alignItems: "center" }}>
              {lang === "az" ? "ISÇI" : "WORKER"}
            </span>
            {[
              { id: undefined, label: lang === "az" ? "Hamisi" : "All" },
              ...shelfWorkers.map(w => ({ id: w.workerId, label: w.workerId! })),
            ].map(opt => {
              const onShift = opt.id ? isOnShift(opt.id) : false;
              const isSel   = assignTarget === opt.id;
              return (
                <button key={String(opt.id)} onClick={() => setAssignTarget(opt.id)} style={{
                  fontFamily: "inherit", fontSize: 8, letterSpacing: ".08em",
                  padding: "0 10px", height: "100%",
                  border: "none", borderRight: `1px solid ${T.border1}`,
                  background: isSel ? `${T.ok}15` : "transparent",
                  color: isSel ? T.ok : T.fg4, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {opt.id && <span style={{ width: 4, height: 4, borderRadius: "50%", background: onShift ? T.ok : T.fg5, display: "inline-block" }} />}
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <BButton variant="outline" onClick={execAllCritical}>
              ? {lang === "az" ? "KRIT. HAMISI" : "ALL CRITICAL"}
            </BButton>
            <BButton variant="ghost" onClick={() => exportCSV(visible, lang)}>
              ? {lang === "az" ? "IXRAC" : "EXPORT"}
            </BButton>
          </div>
        </div>
      </div>

      {/* -- KPI strip -- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[
          { label: lang === "az" ? "AKTIV ALERT" : "ACTIVE ALERTS", val: String(counts.ALL),           sub: "TOTAL",                              color: T.warn },
          { label: "CRITICAL",                                         val: String(counts.CRITICAL),      sub: "HIGHEST RISK",                       color: T.err  },
          { label: lang === "az" ? "POT. ITKI"   : "POTENTIAL LOSS", val: `?${totalLoss.toFixed(0)}`,  sub: lang === "az" ? "CARI GÖRÜN?ND?" : "CURRENTLY VISIBLE", color: T.err  },
          { label: lang === "az" ? "MAX Q?NA?T"  : "MAX SAVING",     val: `?${totalSaving.toFixed(0)}`, sub: lang === "az" ? "ICRA OLUNSA" : "IF ALL EXECUTED",     color: T.ok   },
        ].map(k => (
          <div key={k.label} style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".18em", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-.01em" }}>{k.val}</div>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".12em", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* -- Filter tabs -- */}
      <FilterTabs
        active={filter}
        onChange={k => setFilter(k as RiskFilter)}
        tabs={[
          { key: "ALL",      label: "ALL",      count: counts.ALL,      tone: "ok"   },
          { key: "CRITICAL", label: "CRITICAL", count: counts.CRITICAL, tone: "err"  },
          { key: "HIGH",     label: "HIGH",     count: counts.HIGH,     tone: "warn" },
          { key: "MEDIUM",   label: "MEDIUM",   count: counts.MEDIUM,   tone: "info" },
        ]}
      />

      {/* -- Search + Min Saving toolbar -- */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        border: `1px solid ${T.border1}`, background: T.bgElev, height: 36, overflow: "hidden",
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", flex: 1, height: "100%", borderRight: `1px solid ${T.border1}`, padding: "0 10px", gap: 8 }}>
          <span style={{ fontSize: 10, color: T.fg4, flexShrink: 0 }}>??</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === "az" ? "M?hsul axtar..." : "Search products..."}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: T.font, fontSize: 10, color: T.fg1, letterSpacing: ".06em",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontSize: 11, padding: 0, fontFamily: T.font, flexShrink: 0 }}>×</button>
          )}
        </div>

        {/* Separator */}
        <div style={{ height: "100%", width: 1, background: T.border1, flexShrink: 0 }} />

        {/* Min saving */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: "100%", borderRight: `1px solid ${T.border1}`, flexShrink: 0 }}>
          <span style={{ fontSize: 8, color: T.fg5, letterSpacing: ".18em" }}>{lang === "az" ? "MIN Q?NA?T ?" : "MIN SAVING ?"}</span>
          <input
            type="number" min={0} step={10} value={minSaving}
            onChange={e => setMinSaving(Math.max(0, Number(e.target.value)))}
            style={{
              width: 52, background: T.bgPanel, border: `1px solid ${T.border2}`,
              color: T.warn, fontSize: 10, padding: "3px 7px",
              fontFamily: T.font, outline: "none", fontVariantNumeric: "tabular-nums",
            }}
          />
          {minSaving > 0 && (
            <>
              <button
                onClick={execAboveThreshold}
                disabled={thresholdCount === 0}
                style={{
                  fontFamily: T.font, fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
                  padding: "4px 10px", border: `1px solid ${thresholdCount > 0 ? T.warn : T.border2}`,
                  color: thresholdCount > 0 ? T.warn : T.fg5, background: "transparent",
                  cursor: thresholdCount > 0 ? "pointer" : "default",
                }}
              >
                {thresholdCount > 0 ? `? ${thresholdCount} EXEC` : "0 MATCH"}
              </button>
              <button onClick={() => setMinSaving(0)} style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontSize: 11, padding: 0, fontFamily: T.font }}>×</button>
            </>
          )}
        </div>

        {/* Result count */}
        <div style={{ padding: "0 12px", fontSize: 9, color: visible.length === 0 ? T.err : T.fg4, letterSpacing: ".12em", flexShrink: 0 }}>
          {visible.length} {lang === "az" ? "n?tic?" : "results"}
        </div>
      </div>

      {/* -- Card grid -- */}
      <div style={{ paddingBottom: calcAlert ? 320 : 0, transition: "padding-bottom .2s" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bos-skeleton" style={{ height: 280, border: "1px solid #1a2a1a" }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ color: T.fg4, fontSize: 12, padding: "48px 0", textAlign: "center", border: `1px solid ${T.border1}`, letterSpacing: ".1em" }}>
            {lang === "az" ? "Bu filtrd? alert tapilmadi." : "No alerts found for this filter."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {visible.map((a, i) => (
              <div key={a.id} style={{ animation: `bos-slideup .35s cubic-bezier(.22,1,.36,1) ${Math.min(i * 30, 600)}ms both` }}>
                <AlertCard
                  a={a}
                  lang={lang}
                  isCalcOpen={calcAlert?.id === a.id}
                  assignTarget={assignTarget}
                  onCalcToggle={() => setCalcAlert(calcAlert?.id === a.id ? null : a)}
                  onExec={() => execAction(a)}
                  onDismiss={() => dismiss(a.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -- Discount Calc — fixed bottom -- */}
      {calcAlert && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300,
          background: "#000", borderTop: `2px solid ${T.warn}`,
          boxShadow: "0 -12px 48px rgba(0,0,0,.9)", fontFamily: T.font,
        }}>
          <div style={{
            height: 36, background: T.bgElev, borderBottom: `1px solid ${T.border1}`,
            display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
          }}>
            <span style={{ width: 8, height: 8, background: T.warn, borderRadius: "50%", boxShadow: `0 0 8px ${T.warn}`, display: "inline-block" }} />
            <span style={{ fontSize: 9, color: T.warn, letterSpacing: ".24em" }}>DISCOUNT CALC</span>
            <div style={{ width: 1, height: 12, background: T.border1 }} />
            <span style={{ fontSize: 11, color: T.fg1, fontWeight: 600 }}>{calcAlert.product?.name}</span>
            <span style={{ fontSize: 9, color: T.fg4 }}>·</span>
            <span style={{ fontSize: 9, color: T.fg3, letterSpacing: ".1em" }}>{calcAlert.store?.name}</span>
            {assignTarget && (
              <>
                <span style={{ fontSize: 9, color: T.fg4 }}>·</span>
                <span style={{ fontSize: 9, color: "#00bfa5" }}>? {assignTarget}</span>
              </>
            )}
            <button onClick={() => setCalcAlert(null)} style={{ marginLeft: "auto", fontFamily: T.font, fontSize: 9, letterSpacing: ".14em", padding: "4px 12px", border: `1px solid ${T.border2}`, color: T.fg3, background: "transparent", cursor: "pointer" }}>
              ? CLOSE
            </button>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <DiscountCalcPanel
              product={calcAlert.product}
              quantity={calcAlert.quantity_at_risk}
              lang={lang}
              initialPct={aiDiscountPct}
              onExec={(pct) => execAction(calcAlert, pct)}
              onClose={() => setCalcAlert(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
