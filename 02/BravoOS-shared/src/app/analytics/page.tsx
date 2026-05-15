"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchKPI, fetchCategoryBreakdown, fetchActionSummary,
  fetchMarginBreakdown, fetchInsightCards, fetchPredictiveLoss, fetchHeatmap,
} from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { T } from "@/components/BravoUI";

// -- Tiny helpers ----------------------------------------------
const SEV_COLOR: Record<string, string> = {
  critical: T.err, high: T.warn, medium: T.info, ok: T.bgElev,
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: "14px 16px", ...style }}>
      {children}
    </div>
  );
}

function BigNum({ val, color = T.fg1, size = 28 }: { val: string; color?: string; size?: number }) {
  return (
    <div style={{ fontSize: size, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em", lineHeight: 1 }}>
      {val}
    </div>
  );
}

// -- Main ------------------------------------------------------
export default function AnalyticsPage() {
  const { lang } = useLanguage();

  const [kpi,        setKpi]       = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [summary,    setSummary]   = useState<any>(null);
  const [margins,    setMargins]   = useState<any[]>([]);
  const [insightCards, setInsightCards] = useState<any[]>([]);
  const [predictive, setPredictive] = useState<any>(null);
  const [heatmap,    setHeatmap]   = useState<any>(null);
  const [hmSel,      setHmSel]     = useState<any>(null);
  const [roiStores,  setRoiStores] = useState(10);

  useEffect(() => {
    Promise.all([
      fetchKPI(), fetchCategoryBreakdown(), fetchActionSummary(),
      fetchMarginBreakdown(), fetchInsightCards(), fetchPredictiveLoss(), fetchHeatmap(),
    ]).then(([k, c, s, m, ic, pl, hm]) => {
      setKpi(k); setCategories(Array.isArray(c) ? c : []);
      setSummary(s); setMargins(Array.isArray(m) ? m : []);
      setInsightCards(ic?.cards ?? []);
      setPredictive(pl); setHeatmap(hm);
    });
  }, []);

  const execRate = (summary?.executed && summary?.pending)
    ? (summary.executed / (summary.executed + summary.pending) * 100)
    : 0;

  // ROI projector — clearly labelled as rough estimate
  const monthlyPerStore = kpi ? (kpi.saved_profit / 10) : 1234; // saved_profit is across 10 stores
  const annualSaving    = roiStores * 12 * monthlyPerStore;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: T.font }}>

      {/* -- Header -- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em", marginBottom: 4 }}>ANALITIKA</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
            {lang === "az" ? "?M?LIYYAT ANALITIKASI" : "OPERATIONS ANALYTICS"}
          </div>
        </div>
        <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".12em" }}>
          {lang === "az" ? "Canli m?lumat · 10 filial" : "Live data · 10 stores"}
        </div>
      </div>

      {/* -- KPI strip -- */}
      {kpi && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { label: lang === "az" ? "C?MI SATIS (30G)" : "TOTAL SALES (30D)", val: `?${(kpi.total_sales_30d ?? 0).toLocaleString()}`, color: T.fg1 },
            { label: lang === "az" ? "QORUNAN QAZANC"   : "SAVED PROFIT",      val: `?${(kpi.saved_profit ?? 0).toLocaleString()}`,    color: T.ok  },
            { label: lang === "az" ? "ICRA NISB?TI"     : "ACTION EXEC RATE",  val: `${execRate.toFixed(0)}%`,                          color: execRate > 60 ? T.ok : T.warn },
            { label: "OFF MATCHED",                                               val: String(kpi.off_matched_products ?? 0),              color: T.info },
          ].map(k => (
            <Card key={k.label}>
              <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".18em", marginBottom: 8 }}>{k.label}</div>
              <BigNum val={k.val} color={k.color} />
            </Card>
          ))}
        </div>
      )}

      {/* -- Insight cards -- */}
      {insightCards.length > 0 && (
        <div>
          <SectionLabel>{lang === "az" ? "SISTEM T?HLILI" : "SYSTEM INTELLIGENCE"}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
            {insightCards.map((card: any) => {
              const c = card.severity === "err" ? T.err : card.severity === "warn" ? T.warn : card.severity === "ok" ? T.ok : T.info;
              // Fix /actions links ? /alerts
              const href = (card.href === "/actions") ? "/alerts" : (card.href ?? "/");
              return (
                <Link key={card.id} href={href} prefetch={false} style={{ textDecoration: "none" }}>
                  <div style={{
                    border: `1px solid ${c}35`, background: T.bgPanel,
                    padding: "12px 14px", height: "100%", boxSizing: "border-box",
                    transition: "border-color .15s, background .15s", cursor: "pointer",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.background = `${c}07`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${c}35`; e.currentTarget.style.background = T.bgPanel; }}
                  >
                    <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{card.icon}</span>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.fg1, lineHeight: 1.35 }}>
                        {lang === "az" ? card.title_az : card.title_en}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: T.fg3, lineHeight: 1.6, marginBottom: 10 }}>
                      {lang === "az" ? card.body_az : card.body_en}
                    </div>
                    <div style={{ fontSize: 9, color: c, letterSpacing: ".1em" }}>
                      {lang === "az" ? card.action_az : card.action_en}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* -- Predictive Loss -- */}
      {predictive && (
        <div>
          <SectionLabel>{lang === "az" ? "AKSIYA OLMASA ITKI PROQNOZu" : "LOSS FORECAST WITHOUT ACTION"}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 8 }}>
            {/* Current */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Card>
                <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em", marginBottom: 6 }}>
                  {lang === "az" ? "CARI ITKI RISKI" : "CURRENT EXPOSURE"}
                </div>
                <BigNum val={`?${predictive.base_loss?.toLocaleString("az-AZ", { maximumFractionDigits: 0 })}`} color={T.err} size={24} />
              </Card>
              <Card style={{ border: `1px solid ${T.ok}30`, background: `${T.ok}05` }}>
                <div style={{ fontSize: 8, color: T.ok, letterSpacing: ".16em", marginBottom: 6 }}>
                  {lang === "az" ? "INDIY? Q?D?R QORUNAN" : "SAVED SO FAR"}
                </div>
                <BigNum val={`?${predictive.saved_so_far?.toLocaleString("az-AZ", { maximumFractionDigits: 0 })}`} color={T.ok} size={20} />
              </Card>
            </div>

            {/* Projections */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {(predictive.projections ?? []).map((p: any, pi: number) => {
                const pColor = pi === 0 ? T.warn : T.err;
                const growth = ((p.loss - predictive.base_loss) / Math.max(predictive.base_loss, 1) * 100).toFixed(1);
                return (
                  <Card key={pi} style={{ border: `1px solid ${pColor}40`, background: `${pColor}06`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 8, color: pColor, letterSpacing: ".16em", marginBottom: 8 }}>
                      {p.label} {lang === "az" ? "SONRA" : "FROM NOW"}
                    </div>
                    <BigNum val={`?${p.loss?.toLocaleString("az-AZ", { maximumFractionDigits: 0 })}`} color={pColor} size={22} />
                    <div style={{ marginTop: 10, fontSize: 9, color: T.fg4 }}>+{growth}% {lang === "az" ? "artim" : "increase"}</div>
                    <div style={{ marginTop: 6, height: 2, background: T.bgElev }}>
                      <div style={{ height: 2, background: pColor, width: `${Math.min(100, 30 + pi * 25)}%` }} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 6, fontSize: 9, color: T.fg5, letterSpacing: ".08em" }}>
            ? {lang === "az" ? "Günd?lik +2.8% artim sür?ti ?sasinda hesablanir. Aksiyalar bu artimi dayandirir." : "Based on current +2.8%/day growth rate. Taking actions stops this compounding."}
          </div>
        </div>
      )}

      {/* -- Heatmap -- */}
      {heatmap && heatmap.categories?.length > 0 && (
        <div>
          <SectionLabel>{lang === "az" ? "FILIAL × KATEQORIYA RISK MATRISI" : "STORE × CATEGORY RISK MATRIX"}</SectionLabel>
          <Card style={{ padding: "12px 14px", overflow: "auto" }}>
            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `130px repeat(${heatmap.categories.length}, minmax(52px, 1fr))`,
              gap: 2, marginBottom: 3, minWidth: 600,
            }}>
              <div />
              {heatmap.categories.map((cat: string) => (
                <div key={cat} style={{ fontSize: 7, color: T.fg4, letterSpacing: ".06em", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cat.split(" ")[0]}
                </div>
              ))}
            </div>

            {/* Rows */}
            {heatmap.rows.map((row: any) => (
              <div key={row.store_id} style={{
                display: "grid",
                gridTemplateColumns: `130px repeat(${heatmap.categories.length}, minmax(52px, 1fr))`,
                gap: 2, marginBottom: 2, minWidth: 600,
              }}>
                <div style={{ fontSize: 9, color: T.fg2, display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 6 }}>
                  {row.store_name?.split(" ").slice(1).join(" ") || row.store_name}
                </div>
                {row.cells.map((cell: any, ci: number) => {
                  const bg   = SEV_COLOR[cell.severity] ?? T.bgElev;
                  const isOk = cell.severity === "ok";
                  const isSel = hmSel?.store_id === row.store_id && hmSel?.ci === ci;
                  return (
                    <div
                      key={ci}
                      onClick={() => setHmSel(isSel ? null : { store_id: row.store_id, ci, cell, store_name: row.store_name })}
                      style={{
                        height: 26, background: isOk ? T.bgElev : `${bg}28`,
                        border: `1px solid ${isSel ? bg : isOk ? T.border1 : bg + "55"}`,
                        cursor: isOk ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: isOk ? T.fg5 : bg,
                        transition: "all .12s",
                        boxShadow: cell.severity === "critical" ? `inset 0 0 0 1px ${bg}` : "none",
                      }}
                      onMouseEnter={e => { if (!isOk) e.currentTarget.style.background = `${bg}50`; }}
                      onMouseLeave={e => { if (!isOk) e.currentTarget.style.background = `${bg}28`; }}
                    >
                      {isOk ? "·" : cell.total}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 9, color: T.fg4 }}>
              {[
                { sev: "critical", label: lang === "az" ? "Kritik" : "Critical" },
                { sev: "high",     label: lang === "az" ? "Yüks?k" : "High"     },
                { sev: "medium",   label: lang === "az" ? "Orta"   : "Medium"   },
                { sev: "ok",       label: lang === "az" ? "Normal" : "OK"       },
              ].map(l => (
                <span key={l.sev} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, background: l.sev === "ok" ? T.bgElev : `${SEV_COLOR[l.sev]}40`, border: `1px solid ${SEV_COLOR[l.sev]}70`, display: "inline-block" }} />
                  {l.label}
                </span>
              ))}
              <span style={{ marginLeft: "auto", color: T.fg5, fontSize: 8 }}>
                {lang === "az" ? "Xanaya klikl?yin" : "Click cell for detail"}
              </span>
            </div>

            {/* Detail popup */}
            {hmSel && (
              <div style={{ marginTop: 8, padding: "10px 14px", border: `1px solid ${SEV_COLOR[hmSel.cell.severity] ?? T.border2}`, background: T.bgElev, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: T.fg1, fontWeight: 700 }}>{hmSel.store_name}</span>
                <span style={{ fontSize: 10, color: T.fg4 }}>·</span>
                <span style={{ fontSize: 11, color: T.fg2 }}>{hmSel.cell.category}</span>
                <span style={{ fontSize: 9, border: `1px solid ${T.err}50`, color: T.err, padding: "1px 6px" }}>{hmSel.cell.critical} KRITIK</span>
                <span style={{ fontSize: 9, border: `1px solid ${T.warn}50`, color: T.warn, padding: "1px 6px" }}>{hmSel.cell.high} YÜKS?K</span>
                <span style={{ fontSize: 9, border: `1px solid ${T.info}50`, color: T.info, padding: "1px 6px" }}>{hmSel.cell.medium} ORTA</span>
                <span style={{ fontSize: 10, color: T.err, fontWeight: 700, marginLeft: "auto" }}>?{hmSel.cell.loss?.toFixed(0)} {lang === "az" ? "itki riski" : "exposure"}</span>
                <button onClick={() => setHmSel(null)} style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontFamily: T.font }}>?</button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* -- Category Risk + Gross Margin -- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Risk by category */}
        <div>
          <SectionLabel>{lang === "az" ? "KATEQORIYA ÜZR? RISK" : "RISK BY CATEGORY"}</SectionLabel>
          <Card>
            {categories.length === 0 ? (
              <div style={{ fontSize: 10, color: T.fg4, padding: "16px 0", textAlign: "center" }}>—</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categories.slice(0, 8).map((c: any) => {
                  const max = Math.max(...categories.map((x: any) => x.total ?? 0), 1);
                  const pct = ((c.total ?? 0) / max) * 100;
                  const color = c.critical_count > 2 ? T.err : c.critical_count > 0 ? T.warn : T.ok;
                  return (
                    <div key={c.category}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
                        <span style={{ color: T.fg2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{c.category}</span>
                        <span style={{ color: T.fg3, flexShrink: 0, paddingLeft: 8 }}>
                          {c.total ?? 0} {lang === "az" ? "alert" : "alerts"}
                          {c.critical_count > 0 && <span style={{ color: T.err, marginLeft: 6 }}>{c.critical_count} kritik</span>}
                        </span>
                      </div>
                      <div style={{ height: 4, background: T.bgElev }}>
                        <div style={{ height: 4, width: `${pct}%`, background: color, transition: "width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Gross margin by category */}
        <div>
          <SectionLabel>
            {lang === "az" ? "KATEQORIYA BRÜT MARJA (H?QIQI MALIYY?T)" : "GROSS MARGIN BY CATEGORY (REAL COST)"}
          </SectionLabel>
          <Card>
            {margins.length === 0 ? (
              <div style={{ fontSize: 10, color: T.fg4, padding: "16px 0", textAlign: "center" }}>—</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {margins.slice(0, 8).map((m: any) => {
                  const pct    = m.margin_pct ?? 0;
                  const mColor = pct > 35 ? T.ok : pct > 25 ? "#aadd00" : pct > 15 ? T.warn : T.err;
                  return (
                    <div key={m.category}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
                        <span style={{ color: T.fg2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{m.category}</span>
                        <span style={{ color: mColor, fontWeight: 700, flexShrink: 0, paddingLeft: 8 }}>{pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 4, background: T.bgElev }}>
                        <div style={{ height: 4, width: `${pct}%`, background: mColor, transition: "width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* -- ROI Projector -- */}
      <div>
        <SectionLabel>{lang === "az" ? "ROI HESABLAYICI (T?XMINI MODEL)" : "ROI PROJECTOR (ROUGH ESTIMATE)"}</SectionLabel>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: T.fg3, marginBottom: 10 }}>
                {lang === "az"
                  ? "Cari 10 filialdaki q?na?ti baza götür?r?k, daha çox filialda t?tbiq ets?niz gözl?nil?n n?tic?ni göst?rir."
                  : "Projects expected savings if deployed to more branches, based on current 10-store performance."}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: T.fg3 }}>{lang === "az" ? "Filial sayi" : "Branch count"}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: T.ok }}>{roiStores}</span>
              </div>
              <input
                type="range" min={1} max={50} value={roiStores}
                onChange={e => setRoiStores(Number(e.target.value))}
                style={{ width: "100%", accentColor: T.ok }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: T.fg5, marginTop: 2 }}>
                <span>1</span><span>25</span><span>50</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ border: `1px solid ${T.border1}`, padding: "12px 14px" }}>
                <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em", marginBottom: 6 }}>
                  {lang === "az" ? "YILLIK PROQNOZ Q?NA?T" : "ANNUAL PROJECTED SAVING"}
                </div>
                <BigNum val={`?${Math.round(annualSaving).toLocaleString()}`} color={T.ok} size={24} />
              </div>
              <div style={{ fontSize: 9, color: T.fg5, padding: "6px 10px", border: `1px solid ${T.border1}`, background: T.bgElev, lineHeight: 1.5 }}>
                {lang === "az"
                  ? `Hesab: ${roiStores} filial × ?${Math.round(monthlyPerStore).toLocaleString()}/ay (cari orta) × 12 ay`
                  : `Calc: ${roiStores} stores × ?${Math.round(monthlyPerStore).toLocaleString()}/mo (current avg) × 12`}
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
