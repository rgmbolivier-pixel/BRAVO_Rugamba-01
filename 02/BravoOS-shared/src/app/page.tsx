"use client";
import { useEffect, useState } from "react";
import { fetchKPI, fetchRiskOverview, fetchActionSummary, fetchHourlyPulse } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Panel, KpiBox, LogRow, RiskBar,
  Skeleton, SkeletonKpi, AnimCard, AnimRow, AnimBar,
  useCountUp, T,
} from "@/components/BravoUI";

const LOG_ROWS = [
  { time: "14:32:01", tone: "ok"   as const, src: "TB1-04",   msg: "TESTAI anomaly cleared · delta normalized" },
  { time: "14:31:58", tone: "err"  as const, src: "TB5-02",   msg: "3 SKU below 48H expiry · loss 1,420? projected" },
  { time: "14:31:42", tone: "info" as const, src: "XTI?NSM",  msg: "transfer queued · 45U DAIRY · saving 312?" },
  { time: "14:31:30", tone: "warn" as const, src: "TB3-03",   msg: "FEFO score dropped to 81% · review queue" },
  { time: "14:31:09", tone: "ok"   as const, src: "PRPHT",    msg: "forecast retrained · 30D RMSE 4.2%" },
  { time: "14:30:55", tone: "info" as const, src: "TEST OPTIMIZER", msg: "auto-PO sent · Test Vendor A · 80U" },
];

// -- Animated KPI box ----------------------------------------
function AnimKpiBox({ id, label, rawValue, prefix = "", suffix = "", sub, delta, deltaTone, tone, delay = 0 }: {
  id: string; label: string; rawValue: number;
  prefix?: string; suffix?: string;
  sub?: string; delta?: string; deltaTone?: "ok" | "err" | "warn"; tone?: "ok" | "err" | "warn";
  delay?: number;
}) {
  const val  = useCountUp(rawValue, 1200, delay);
  const formatted = prefix + val.toLocaleString("az-AZ", { maximumFractionDigits: 0 }) + suffix;
  return (
    <AnimCard delay={delay}>
      <KpiBox id={id} label={label} value={formatted} sub={sub} delta={delta} deltaTone={deltaTone} tone={tone} />
    </AnimCard>
  );
}

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const [kpi, setKpi]               = useState<any>(null);
  const [overview, setOverview]     = useState<any[]>([]);
  const [actionSummary, setActionSummary] = useState<any>(null);
  const [pulse, setPulse]           = useState<any>(null);

  useEffect(() => {
    Promise.all([fetchKPI(), fetchRiskOverview(), fetchActionSummary(), fetchHourlyPulse()])
      .then(([k, o, s, p]) => { setKpi(k); setOverview(o); setActionSummary(s); setPulse(p); });
  }, []);

  if (!kpi) return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <Skeleton h={9} w={200} style={{ marginBottom: 8 }} />
        <Skeleton h={22} w={320} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <SkeletonKpi /><SkeletonKpi /><SkeletonKpi /><SkeletonKpi />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
        <Skeleton h={160} /><Skeleton h={160} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Skeleton h={180} /><Skeleton h={180} />
      </div>
    </div>
  );

  const now = new Date().toLocaleDateString("en-GB", {
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  }).toUpperCase();

  const savedProfit  = Math.round(kpi.saved_profit  ?? 0);
  const potLoss      = Math.round(kpi.potential_loss ?? 0);
  const totalAlerts  = kpi.total_alerts     ?? 0;
  const atRisk       = kpi.products_at_risk ?? 0;
  const execSaving   = actionSummary?.saving_executed ?? 0;

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <AnimCard delay={0} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
            {lang === "az" ? "?M?LIYYAT PANELI" : "OPERATIONS DASHBOARD"}
          </div>
        </div>
        <div style={{ fontSize: 10, color: T.fg3, letterSpacing: ".16em", textTransform: "uppercase" }}>{now}</div>
      </AnimCard>

      {/* KPI row — each card counts up */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <AnimKpiBox id="KPI-01" label={lang === "az" ? "QORUNAN QAZANC · MTD" : "SAVED PROFIT · MTD"}
          rawValue={savedProfit} prefix="?"
          sub={lang === "az" ? "10 FILIAL · CANLI" : "10 BRANCHES · LIVE"}
          tone="ok" delay={80} />
        <AnimKpiBox id="KPI-02" label={lang === "az" ? "POTENSIAL ITKI" : "POTENTIAL LOSS"}
          rawValue={potLoss} prefix="?"
          sub={lang === "az" ? "AKTIV RISKL?R · INDI" : "ACTIVE RISKS · NOW"}
          tone="err" delay={160} />
        <AnimKpiBox id="KPI-03" label={lang === "az" ? "AKTIV X?B?RDARLIQ" : "ACTIVE ALERTS"}
          rawValue={totalAlerts}
          sub={`${kpi.critical_alerts ?? 0} ${lang === "az" ? "KRITIK" : "CRITICAL"}`}
          delta={`+${kpi.critical_alerts}`} deltaTone="warn" tone="warn" delay={240} />
        <AnimKpiBox id="KPI-04" label={lang === "az" ? "RISK ALTINDA M?HSUL" : "PRODUCTS AT RISK"}
          rawValue={atRisk}
          sub={`${kpi.anomaly_count ?? 0} ${lang === "az" ? "ANOMALIYA" : "ANOMALIES"}`}
          tone="ok" delay={320} />
      </div>

      {/* Mid row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
        <AnimCard delay={440}>
          <Panel id="REC-01" title={lang === "az" ? "GÖZL?Y?NL?r" : "PENDING RECS"}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { code: "DSC", label: lang === "az" ? "ENDIRIM" : "DISCOUNT", count: actionSummary?.discount ?? 0, color: T.warn },
                { code: "TRF", label: "TRANSFER",                              count: actionSummary?.transfer ?? 0, color: T.info },
                { code: "DON", label: lang === "az" ? "BAGIS" : "DONATE",    count: actionSummary?.donate ?? 0,   color: T.ok   },
              ].map((r, ri) => (
                <div key={r.code} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
                  <span style={{ width: 36, color: r.color, fontWeight: 600, letterSpacing: ".12em" }}>{r.code}</span>
                  <span style={{ flex: 1, color: T.fg2, letterSpacing: ".12em", textTransform: "uppercase" }}>{r.label}</span>
                  <AnimBar pct={Math.min(100, r.count * 2.5)} color={r.color} height={4} delay={500 + ri * 80} />
                  <span style={{ width: 24, textAlign: "right", color: T.fg1, fontWeight: 600 }}>{r.count}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px dashed ${T.border1}`, display: "flex", justifyContent: "space-between", fontSize: 10, color: T.fg3, letterSpacing: ".12em", textTransform: "uppercase" }}>
                <span>{lang === "az" ? "ICRA EDILDI · MTD" : "EXECUTED · MTD"}</span>
                <span style={{ color: T.ok }}>{actionSummary?.executed ?? 0} RECS · ?{actionSummary?.saving_executed?.toFixed(0) ?? "0"} SAVED</span>
              </div>
            </div>
          </Panel>
        </AnimCard>

        <AnimCard delay={500}>
          <Panel id="RSK-01" title={lang === "az" ? "FILIAL RISK MATRISI" : "BRANCH RISK MATRIX"} right={`${overview.length} / 10 SHOWN`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {overview.slice(0, 8).map((b, bi) => (
                <AnimRow key={b.store_id} delay={560 + bi * 45}>
                  <div style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 70px 80px", alignItems: "center", gap: 10, fontSize: 11, padding: "4px 0", borderBottom: `1px dashed ${T.border1}` }}>
                    <span style={{ color: T.greenDim, letterSpacing: ".08em", fontSize: 9 }}>TB1-{String(b.store_id).padStart(2, "0")}</span>
                    <span style={{ color: T.fg1 }}>{b.store_name}</span>
                    <RiskBar critical={b.critical ?? 0} high={b.high ?? 0} medium={b.medium ?? 0} />
                    <span style={{ color: T.fg3, textAlign: "right" }}>{(b.critical ?? 0) + (b.high ?? 0) + (b.medium ?? 0)} RSK</span>
                    <span style={{ color: T.err, textAlign: "right", fontWeight: 600 }}>-{b.potential_loss?.toFixed(0)}?</span>
                  </div>
                </AnimRow>
              ))}
              <div style={{ display: "flex", gap: 14, fontSize: 9, color: T.fg4, letterSpacing: ".16em", textTransform: "uppercase", marginTop: 4 }}>
                <span><span style={{ display: "inline-block", width: 6, height: 6, background: T.err, marginRight: 5 }} />CRIT</span>
                <span><span style={{ display: "inline-block", width: 6, height: 6, background: T.warn, marginRight: 5 }} />HIGH</span>
                <span><span style={{ display: "inline-block", width: 6, height: 6, background: T.info, marginRight: 5 }} />MED</span>
              </div>
            </div>
          </Panel>
        </AnimCard>
      </div>

      {/* Hourly Operations Pulse */}
      {pulse && (
        <AnimCard delay={660}>
          <Panel id="PULSE-01"
            title={lang === "az" ? "SAATLiQ ?M?LIYYAT NABZi" : "HOURLY OPERATIONS PULSE"}
            right={`${lang === "az" ? "ZIRV?" : "PEAK"} ${pulse.peak_label} · ${lang === "az" ? "INDI" : "NOW"} ${String(pulse.current_hour).padStart(2,"0")}:00`}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 64, padding: "4px 0 0" }}>
              {(pulse.hours as any[]).map((h: any) => {
                const max    = Math.max(...(pulse.hours as any[]).map((x: any) => x.sales_units), 1);
                const pct    = (h.sales_units / max) * 100;
                const isCurr = h.hour === pulse.current_hour;
                const isPeak = h.is_peak;
                const color  = isCurr ? T.green : isPeak ? T.warn : T.info;
                return (
                  <div key={h.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative" }}>
                    <div style={{
                      width: "100%", height: `${pct}%`, minHeight: 2,
                      background: color, opacity: isCurr ? 1 : 0.55,
                      boxShadow: isCurr ? `0 0 6px ${T.green}` : "none",
                      animation: `bos-bar-grow .7s cubic-bezier(.22,1,.36,1) ${660 + h.hour * 18}ms both`,
                      transformOrigin: "bottom",
                    }} />
                    {(h.hour % 4 === 0) && (
                      <span style={{ fontSize: 7, color: isCurr ? T.green : T.fg5, letterSpacing: ".04em", position: "absolute", bottom: -12, whiteSpace: "nowrap" }}>
                        {h.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 9, color: T.fg4, letterSpacing: ".12em", textTransform: "uppercase" }}>
              <span><span style={{ color: T.green }}>¦</span> {lang === "az" ? "INDI" : "NOW"}</span>
              <span><span style={{ color: T.warn }}>¦</span> {lang === "az" ? "ZIRV? SAATi" : "PEAK HOUR"}</span>
              <span><span style={{ color: T.info }}>¦</span> {lang === "az" ? "Normal" : "NORMAL"}</span>
              <span style={{ marginLeft: "auto", color: T.fg2 }}>
                {lang === "az" ? "Günlük orta" : "DAILY AVG"}: <span style={{ color: T.ok }}>{pulse.daily_units?.toLocaleString()} {lang === "az" ? "vahid" : "UNITS"}</span>
              </span>
            </div>
          </Panel>
        </AnimCard>
      )}

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <AnimCard delay={700}>
          <Panel id="LOG-01" title="SYSTEM LOG · LIVE" right="STREAMING ?">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {LOG_ROWS.map((r, i) => (
                <AnimRow key={i} delay={750 + i * 40}>
                  <LogRow {...r} />
                </AnimRow>
              ))}
            </div>
          </Panel>
        </AnimCard>

        <AnimCard delay={760}>
          <Panel id="ECO-01" title={lang === "az" ? "DAYANIQLlIQ · MTD" : "SUSTAINABILITY · MTD"}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { code: "FOOD", val: Math.round(execSaving / 4.2 * 0.8), unit: "KG", label: lang === "az" ? "?RZAQ QORUNDU" : "FOOD SAVED" },
                { code: "CO2",  val: Math.round(execSaving / 4.2 * 2.5), unit: "KG", label: "CO2 AVOIDED" },
                { code: "SDG",  val: 12, unit: ".3 ?", label: "UN-SDG ALIGNED" },
              ].map((e, ei) => (
                <AnimCard key={e.code} delay={820 + ei * 60}>
                  <div style={{ border: `1px solid ${T.border1}`, padding: 10, position: "relative" }}>
                    <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".16em", marginBottom: 8 }}>{e.code}</div>
                    <AnimatedEcoVal target={e.val} delay={880 + ei * 60} />
                    <div style={{ fontSize: 10, color: T.fg3, letterSpacing: ".16em", textTransform: "uppercase", marginTop: 2 }}>{e.unit} · {e.label}</div>
                  </div>
                </AnimCard>
              ))}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", fontSize: 10, color: T.fg4, letterSpacing: ".12em", textTransform: "uppercase", paddingTop: 10, borderTop: `1px dashed ${T.border1}` }}>
              <span>TESTDATA</span>
              <span style={{ color: T.ok }}>· {kpi.off_matched_products ?? 0} SKU MATCHED</span>
              <span style={{ marginLeft: "auto", color: T.greenDim }}>SYNC ?</span>
            </div>
          </Panel>
        </AnimCard>
      </div>
    </div>
  );
}

// -- inline helper — avoids hook-in-loop -----------------------
function AnimatedEcoVal({ target, delay }: { target: number; delay: number }) {
  const val = useCountUp(target, 1000, delay);
  return (
    <div style={{ fontSize: 24, color: T.ok, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
      {val.toLocaleString()}
    </div>
  );
}
