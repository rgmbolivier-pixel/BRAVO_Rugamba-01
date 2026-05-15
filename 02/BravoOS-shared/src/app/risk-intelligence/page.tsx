"use client";
import { useEffect, useState } from "react";
import { fetchRiskIntelligence } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, T, SkeletonKpi, Skeleton, AnimCard, AnimRow, useCountUp } from "@/components/BravoUI";

const TIER_COLOR: Record<string, string> = {
  PLATINUM: "#00ff41",
  GOLD:     "#fbbf24",
  SILVER:   "#94a3b8",
  STANDARD: "#ef4444",
};

const TIER_AZ: Record<string, string> = {
  PLATINUM: "PLATIN",
  GOLD:     "QIZIL",
  SILVER:   "GÜMÜs",
  STANDARD: "STANDART",
};

const FACTOR_AZ: Record<string, string> = {
  waste_rate:          "Israf nisb?ti",
  anomaly_frequency:   "Anomaliya tezliyi",
  vendor_reliability:  "Vendor etibarliligi",
  fefo_compliance:     "FEFO uyumu",
};

// --- Certificate Modal -----------------------------------------
function CertModal({ store, lang, onClose }: { store: any; lang: string; onClose: () => void }) {
  const tc   = TIER_COLOR[store.insurance_tier] ?? T.fg3;
  const tierLabel = lang === "az" ? TIER_AZ[store.insurance_tier] ?? store.insurance_tier : store.insurance_tier;
  const today = new Date();
  const expiry = new Date(today); expiry.setFullYear(expiry.getFullYear() + 1);
  const fmt = (d: Date) => d.toLocaleDateString(lang === "az" ? "az-AZ" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const certNo = `WSC-${store.store_id.toString().padStart(3,"0")}-2026`;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 520, background: "#050505", border: `1px solid ${tc}`, position: "relative", fontFamily: T.font }}
      >
        {/* Top bar */}
        <div style={{ background: tc, height: 4 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: ".32em", color: T.fg4, textTransform: "uppercase" }}>PASHA INSURANCE · TEST CITY</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.fg1, letterSpacing: "-.01em", marginTop: 4 }}>
              {lang === "az" ? "?M?LIYYAT T?HLÜK?SIZLIK SERTIFIKATI" : "OPERATIONAL SAFETY CERTIFICATE"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em" }}>CERT NO.</div>
            <div style={{ fontSize: 10, color: tc, fontWeight: 700, letterSpacing: ".12em" }}>{certNo}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: "16px 24px", height: 1, background: `${tc}30` }} />

        {/* Store info */}
        <div style={{ padding: "0 24px", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".16em", marginBottom: 4 }}>
              {lang === "az" ? "FILIAL" : "BRANCH"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.fg1 }}>{store.store_name}</div>
            <div style={{ fontSize: 11, color: T.fg3, marginTop: 2 }}>{store.district} · Baki, Test Country</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 16px", border: `1px solid ${tc}`, background: `${tc}10` }}>
            <div style={{ fontSize: 9, letterSpacing: ".14em", color: T.fg4 }}>TIER</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: tc, letterSpacing: ".06em" }}>{tierLabel}</div>
          </div>
        </div>

        {/* Score grid */}
        <div style={{ margin: "16px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { label: lang === "az" ? "ÜMUMI SKOR" : "SAFETY SCORE", value: `${store.score}`, unit: "/100" },
            { label: lang === "az" ? "ISRAF" : "WASTE IDX", value: `${store.breakdown.waste_rate_score.toFixed(0)}`, unit: "" },
            { label: "FEFO", value: `${store.breakdown.fefo_compliance.toFixed(0)}`, unit: "%" },
            { label: lang === "az" ? "ENDIRIM" : "DISCOUNT", value: `${store.premium_discount_pct}`, unit: "%" },
          ].map((item, i) => (
            <div key={i} style={{ border: `1px solid ${T.border1}`, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 7, color: T.fg5, letterSpacing: ".14em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: tc }}>{item.value}<span style={{ fontSize: 10, color: T.fg3 }}>{item.unit}</span></div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ margin: "0 24px 16px", height: 1, background: `${T.border1}` }} />

        {/* Validity + signature */}
        <div style={{ padding: "0 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".14em", marginBottom: 4 }}>
              {lang === "az" ? "ETIBARLILIQ MÜDD?TI" : "VALIDITY PERIOD"}
            </div>
            <div style={{ fontSize: 10, color: T.fg2 }}>{fmt(today)} ? {fmt(expiry)}</div>
            <div style={{ fontSize: 8, color: T.fg5, marginTop: 8, letterSpacing: ".12em" }}>
              {lang === "az" ? "IMZALAYAN: TestAI Sistemi · v1.0" : "ISSUED BY: TestAI System · v1.0"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".12em", marginBottom: 6 }}>
              {lang === "az" ? "T?SDIQL?YIR" : "VERIFIED BY"}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0ea5e9", letterSpacing: ".06em" }}>PASHA INSURANCE</div>
            <div style={{ fontSize: 8, color: T.fg4 }}>PASHA Holding · Test City</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ background: `${tc}18`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${tc}30` }}>
          <div style={{ fontSize: 9, color: T.fg4, fontFamily: "monospace" }}>
            {lang === "az"
              ? `Bu sertifikat TestAI ?m?liyyat datasina ?saslanir. ${store.premium_discount_pct}% premium endirimi`
              : `Certificate based on TestAI operational data. ${store.premium_discount_pct}% premium reduction applies.`
            }
          </div>
          <button
            onClick={onClose}
            style={{ fontFamily: T.font, fontSize: 9, letterSpacing: ".14em", padding: "5px 14px", border: `1px solid ${T.border2}`, color: T.fg3, background: "transparent", cursor: "pointer" }}
          >
            {lang === "az" ? "BAGLA" : "CLOSE"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Fleet Premium Calculator ----------------------------------
function FleetPremiumCalc({ stores, insurance, lang }: { stores: any[]; insurance: any; lang: string }) {
  const BASELINE_PER_STORE = 24000; // ?/year estimated baseline premium
  const total = stores.length;
  const baselineTotal = total * BASELINE_PER_STORE;

  // Weighted discount
  const weightedDiscount = stores.reduce((sum, s) => sum + s.premium_discount_pct, 0) / Math.max(total, 1) / 100;
  const saving = Math.round(baselineTotal * weightedDiscount);
  const afterTotal = baselineTotal - saving;
  const barPct = (afterTotal / baselineTotal) * 100;

  const tierDist = [
    { key: "PLATINUM", color: TIER_COLOR.PLATINUM, count: insurance.platinum_stores ?? 0, disc: 20 },
    { key: "GOLD",     color: TIER_COLOR.GOLD,     count: insurance.gold_stores ?? 0,     disc: 15 },
    { key: "SILVER",   color: TIER_COLOR.SILVER,   count: insurance.silver_stores ?? 0,   disc: 8  },
    { key: "STANDARD", color: TIER_COLOR.STANDARD, count: insurance.standard_stores ?? 0, disc: 0  },
  ];

  return (
    <Panel id="RI-CALC" title={lang === "az" ? "PREMIUM KALKULYATORU" : "PREMIUM CALCULATOR"} right="PASHA INSURANCE · FLEET">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left: numbers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 12px", background: T.bgElev, border: `1px solid ${T.border1}` }}>
            <div>
              <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em" }}>{lang === "az" ? "BAZIS PREMIUM (TestAI yoxdur)" : "BASELINE PREMIUM (no TestAI)"}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.err, marginTop: 3 }}>?{baselineTotal.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: T.fg4 }}>{lang === "az" ? "/il · 10 filial" : "/year · 10 branches"}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", border: `1px dashed ${T.ok}40` }}>
            <div style={{ fontSize: 9, color: T.ok, letterSpacing: ".12em" }}>TestAI {lang === "az" ? "ENDIRIMI" : "DISCOUNT"}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ok }}>-?{saving.toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 12px", background: "rgba(0,255,65,0.05)", border: `1px solid ${T.ok}50` }}>
            <div>
              <div style={{ fontSize: 8, color: T.ok, letterSpacing: ".16em" }}>{lang === "az" ? "TestAI IL? NET PREMIUM" : "NET PREMIUM WITH TestAI"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.ok, marginTop: 3 }}>?{afterTotal.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: T.fg4 }}>/year · {Math.round(weightedDiscount * 100)}% avg reduction</div>
            </div>
          </div>
          {/* Bar */}
          <div>
            <div style={{ height: 8, background: T.bgElev, border: `1px solid ${T.border1}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barPct}%`, background: T.ok, transition: "width 1s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: T.fg5, marginTop: 3 }}>
              <span>{lang === "az" ? "TestAI il?" : "With TestAI"}</span>
              <span>{lang === "az" ? "Bazis" : "Baseline"}</span>
            </div>
          </div>
        </div>

        {/* Right: tier distribution */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".16em", marginBottom: 4 }}>
            {lang === "az" ? "TIER PAYLANMASI · 10 FILIAL" : "TIER DISTRIBUTION · 10 BRANCHES"}
          </div>
          {tierDist.map(tier => {
            const pct = (tier.count / Math.max(total, 1)) * 100;
            return (
              <div key={tier.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 3 }}>
                  <span style={{ color: tier.color, letterSpacing: ".1em", fontWeight: 700 }}>{tier.key}</span>
                  <span style={{ color: T.fg3 }}>{tier.count} {lang === "az" ? "filial" : "br"} · {tier.disc > 0 ? `-${tier.disc}%` : "—"}</span>
                </div>
                <div style={{ height: 4, background: T.bgElev, border: `1px solid ${T.border1}` }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: tier.color, opacity: 0.8 }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 8, padding: "8px 10px", border: `1px solid #0ea5e940`, background: "rgba(14,165,233,0.04)" }}>
            <div style={{ fontSize: 8, color: "#0ea5e9", letterSpacing: ".14em", marginBottom: 4 }}>
              {lang === "az" ? "ROI: SIGORTA" : "ROI: INSURANCE"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ok }}>
              ?{saving.toLocaleString()}{lang === "az" ? "/il q?na?t" : "/year saved"}
            </div>
            <div style={{ fontSize: 9, color: T.fg4, marginTop: 2 }}>
              {lang === "az" ? "TestAI abun?lik x?rcini özü öd?yir" : "TestAI subscription pays for itself"}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// --- RiKpi — count-up KPI box ---------------------------------
function RiKpi({ id, label, raw, prefix = "", tone, delay }: {
  id: string; label: string; raw: number; prefix?: string;
  tone: "ok" | "err" | "warn"; delay: number;
}) {
  const v = useCountUp(raw, 1100, delay);
  return (
    <AnimCard delay={delay}>
      <KpiBox id={id} label={label} value={prefix + v.toLocaleString()} tone={tone} />
    </AnimCard>
  );
}

// --- Main page -------------------------------------------------
export default function RiskIntelligencePage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    fetchRiskIntelligence().then(setData).finally(() => setLoading(false));
  }, []);

  const stores: any[]   = data?.stores ?? [];
  const summary         = data?.summary ?? {};
  const insurance       = data?.insurance_summary ?? {};
  const factors: any[]  = data?.score_factors ?? [];

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {showCert && selectedStore && <CertModal store={selectedStore} lang={lang} onClose={() => setShowCert(false)} />}
      {/* Header */}
      <AnimCard delay={0}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
          {lang === "az" ? "?M?LIYYAT RISKI K?SFIYYATI" : "OPERATIONAL RISK INTELLIGENCE"}
        </div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, border: "1px solid #0ea5e960", color: "#0ea5e9", padding: "1px 8px", letterSpacing: ".12em" }}>PASHA INSURANCE · INTEGRATION</span>
          <span style={{ fontSize: 9, border: `1px solid ${T.ok}50`, color: T.ok, padding: "1px 8px", letterSpacing: ".12em" }}>OPERATIONAL SAFETY SCORE v1.0</span>
          <span style={{ fontSize: 9, border: "1px solid #a78bfa50", color: "#a78bfa", padding: "1px 8px", letterSpacing: ".12em" }}>TestAI + Test POWERED</span>
        </div>
      </AnimCard>

      {/* PASHA Insurance banner */}
      <AnimCard delay={120}>
      <div style={{
        border: "1px solid #0ea5e940",
        background: "rgba(14,165,233,0.04)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ fontSize: 22 }}>???</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#0ea5e9", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 3 }}>
            {lang === "az" ? "KATEGORIYA 4 — GIZLI PROBLEM" : "CATEGORY 4 — THE HIDDEN PROBLEM"}
          </div>
          <div style={{ fontSize: 12, color: T.fg2, lineHeight: 1.6 }}>
            {lang === "az"
              ? "TestAI h?r magazanin ?m?liyyat riskl?rini ölçür — bu data PASHA Sigortaya birbasa ötürül? bil?r. Daha az israf = daha asagi risk = daha ucuz sigorta. Retail OS-ni sigorta risk modelin? qosan ilk sistem."
              : "TestAI measures every store's operational risk — this data can feed directly into PASHA Insurance's premium model. Less waste = lower risk = cheaper insurance. First retail OS that talks to its insurer's risk model."
            }
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.ok }}>{insurance.avg_premium_discount ?? 0}%</div>
          <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".1em" }}>AVG PREMIUM REDUCTION</div>
        </div>
      </div>
      </AnimCard>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <RiKpi id="RI-01" label={lang === "az" ? "ORT. T?HLÜK?SIZLIK" : "AVG SAFETY SCORE"} raw={summary.avg_safety_score ?? 0} tone="ok" delay={240} />
        <RiKpi id="RI-02" label={lang === "az" ? "PLATIN+QIZIL" : "PLATINUM+GOLD"}           raw={summary.stores_above_threshold ?? 0} tone="ok" delay={310} />
        <RiKpi id="RI-03" label={lang === "az" ? "AYLIQ RISK" : "MONTHLY RISK"}              raw={Math.round(summary.total_monthly_risk ?? 0)} prefix="?" tone="err" delay={380} />
        <RiKpi id="RI-04" label={lang === "az" ? "ILLIK Q?NA?T" : "ANNUAL SAVING EST."}     raw={Math.round(insurance.annual_premium_saving_est ?? 0)} prefix="?" tone="ok" delay={450} />
      </div>

      {/* Score methodology */}
      <Panel id="RI-METHOD" title={lang === "az" ? "SKOR METODOLOGIYASI" : "SCORE METHODOLOGY"} right="COMPOSITE WEIGHTED INDEX">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {factors.map((f: any, i: number) => (
            <div key={i} style={{ border: `1px solid ${T.border2}`, background: T.bgElev, padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.ok, marginBottom: 4 }}>{f.weight}%</div>
              <div style={{ fontSize: 10, color: T.fg1, fontWeight: 600, letterSpacing: ".06em", marginBottom: 4, textTransform: "uppercase" }}>
                {lang === "az" ? (FACTOR_AZ[String(f.key)] ?? String(f.key)) : String(f.key).replace(/_/g, " ").toUpperCase()}
              </div>
              <div style={{ fontSize: 9, color: T.fg4, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em", fontFamily: "monospace" }}>
          FORMULA: score = waste_rate(35%) + anomaly_freq(25%) + vendor_reliability(20%) + fefo_compliance(20%)
        </div>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12, alignItems: "start" }}>
        {/* Store rankings */}
        <Panel id="RI-STORES" title={lang === "az" ? "FILIAL RISK SIRALAMASI" : "BRANCH RISK RANKING"} right="SORTED BY SAFETY SCORE">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 0" }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "30px 140px 60px 80px 50px 50px 50px 50px", gap: 8, padding: "6px 0" }}>
                  {Array.from({ length: 8 }).map((_, j) => <Skeleton key={j} h={10} />)}
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              <thead>
                <tr style={{ background: T.bgElev }}>
                  {["#", lang==="az"?"FILIAL":"BRANCH", lang==="az"?"SKOR":"SCORE",
                    lang==="az"?"TIER":"TIER",
                    lang==="az"?"ISRAF":"WASTE",
                    lang==="az"?"ANOMALIYA":"ANOMALY",
                    "FEFO",
                    lang==="az"?"ENDIRIM":"DISCOUNT"].map((h,i) => (
                    <th key={i} style={{ padding: "8px 10px", fontSize: 9, color: T.greenDim, letterSpacing: ".14em", textAlign: "left", borderBottom: `1px solid ${T.border2}`, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stores.map((s: any, i: number) => {
                  const tc = TIER_COLOR[s.insurance_tier] ?? T.fg3;
                  const scoreColor = s.score >= 80 ? T.ok : s.score >= 60 ? T.warn : T.err;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedStore(selectedStore?.store_id === s.store_id ? null : s)}
                      style={{ borderBottom: `1px solid ${T.border1}`, cursor: "pointer", background: selectedStore?.store_id === s.store_id ? T.bgActive : "transparent", animation: `bos-slideleft .3s cubic-bezier(.22,1,.36,1) ${620 + i * 40}ms both` }}
                      onMouseEnter={e => { if (selectedStore?.store_id !== s.store_id) e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={e => { if (selectedStore?.store_id !== s.store_id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "8px 10px", color: T.fg4, fontSize: 9 }}>{String(i+1).padStart(2,"0")}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ color: T.fg1, fontWeight: 600 }}>{s.store_name}</div>
                        <div style={{ fontSize: 9, color: T.fg4, marginTop: 1 }}>{s.district}</div>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: scoreColor }}>{s.score}</div>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".12em", border: `1px solid ${tc}`, color: tc, padding: "2px 6px" }}>
                          {lang === "az" ? TIER_AZ[s.insurance_tier] ?? s.insurance_tier : s.insurance_tier}
                        </span>
                      </td>
                      <td style={{ padding: "8px 10px", color: T.fg2 }}>{s.breakdown.waste_rate_score.toFixed(0)}</td>
                      <td style={{ padding: "8px 10px", color: T.fg2 }}>{s.breakdown.anomaly_score.toFixed(0)}</td>
                      <td style={{ padding: "8px 10px", color: T.fg2 }}>{s.breakdown.fefo_compliance.toFixed(0)}%</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ fontSize: 9, color: s.premium_discount_pct > 0 ? T.ok : T.fg4 }}>
                          {s.premium_discount_pct > 0 ? `-${s.premium_discount_pct}%` : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Panel>

        {/* Insurance tier breakdown + selected store detail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Tier summary */}
          <Panel id="RI-TIERS" title={lang === "az" ? "SIGORTA TIERL?RI" : "INSURANCE TIERS"} right="PASHA INSURANCE">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { key: "PLATINUM", label: lang === "az" ? "PLATIN" : "PLATINUM", count: insurance.platinum_stores ?? 0, disc: 20, min: 85 },
                { key: "GOLD",     label: lang === "az" ? "QIZIL" : "GOLD",     count: insurance.gold_stores ?? 0,     disc: 15, min: 75 },
                { key: "SILVER",   label: lang === "az" ? "GÜMÜs" : "SILVER",   count: insurance.silver_stores ?? 0,   disc: 8,  min: 60 },
                { key: "STANDARD", label: "STANDARD",                            count: insurance.standard_stores ?? 0, disc: 0,  min: 0  },
              ].map((tier) => {
                const tc = TIER_COLOR[tier.key];
                return (
                  <div key={tier.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${tc}20`, background: `${tc}05` }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".12em", border: `1px solid ${tc}`, color: tc, padding: "2px 7px", minWidth: 64, textAlign: "center" }}>{tier.label}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: T.fg1 }}>{tier.count} {lang === "az" ? "filial" : "branches"}</div>
                      <div style={{ fontSize: 9, color: T.fg4 }}>Score = {tier.min}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tier.disc > 0 ? T.ok : T.fg4 }}>
                        {tier.disc > 0 ? `-${tier.disc}%` : "—"}
                      </div>
                      <div style={{ fontSize: 8, color: T.fg5 }}>PREMIUM</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Selected store detail */}
          {selectedStore && (
            <Panel id="RI-DETAIL" title={selectedStore.store_name.toUpperCase()} right={selectedStore.district}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[
                    { label: lang === "az" ? "SKOR" : "SCORE", value: selectedStore.score, unit: "/100" },
                    { label: "TIER", value: lang === "az" ? TIER_AZ[selectedStore.insurance_tier] : selectedStore.insurance_tier, unit: "" },
                    { label: lang === "az" ? "ENDIRIM" : "DISCOUNT", value: selectedStore.premium_discount_pct, unit: "%" },
                    { label: lang === "az" ? "TREND" : "TREND", value: selectedStore.risk_trend, unit: "" },
                  ].map((item, i) => (
                    <div key={i} style={{ border: `1px solid ${T.border1}`, padding: "8px 10px" }}>
                      <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".14em" }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.ok, marginTop: 2 }}>{item.value}{item.unit}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, color: T.fg4, marginTop: 4 }}>
                  {[
                    { label: lang === "az" ? "Israf skoru" : "Waste score",  val: selectedStore.breakdown.waste_rate_score },
                    { label: lang === "az" ? "Anomaliya" : "Anomaly",         val: selectedStore.breakdown.anomaly_score },
                    { label: lang === "az" ? "Vendor" : "Vendor",            val: selectedStore.breakdown.vendor_reliability },
                    { label: "FEFO",                                          val: selectedStore.breakdown.fefo_compliance },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px dashed ${T.border1}` }}>
                      <span style={{ color: T.fg3 }}>{row.label}</span>
                      <span style={{ color: T.ok, fontWeight: 600 }}>{row.val.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                {/* Certificate button */}
                <button
                  onClick={() => setShowCert(true)}
                  style={{
                    marginTop: 4,
                    fontFamily: T.font, fontSize: 9, fontWeight: 700, letterSpacing: ".16em",
                    padding: "9px 0", cursor: "pointer", width: "100%",
                    border: `1px solid #0ea5e9`,
                    color: "#000", background: "#0ea5e9",
                    textTransform: "uppercase",
                  }}
                >
                  ?? {lang === "az" ? "SERTIFIKAT YARAT" : "GENERATE CERTIFICATE"}
                </button>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* Fleet Premium Calculator */}
      {stores.length > 0 && (
        <FleetPremiumCalc stores={stores} insurance={insurance} lang={lang} />
      )}

      {/* Pitch footer */}
      <div style={{ border: "1px solid #0ea5e930", background: "rgba(14,165,233,0.03)", padding: "14px 16px" }}>
        <div style={{ fontSize: 10, color: "#0ea5e9", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>
          {lang === "az" ? "JÜRIY? MESAJ" : "MESSAGE TO JURY"}
        </div>
        <div style={{ fontSize: 12, color: T.fg2, lineHeight: 1.8 }}>
          {lang === "az"
            ? `"Bu Kateqoriya 4-dür — heç kim sorusmadi, biz gördük. H?r magaza üçün ?m?liyyat riski skoru hesablayiriq — israf faizi, anomaliya tezliyi, vendor etibarliligi, FEFO uyumu. PASHA Sigorta bu datadan birbasa istifad? edib sigorta premiumunu hesablaya bil?r. Daha az israf = daha asagi risk = daha ucuz sigorta."`
            : `"This is Category 4 — nobody asked for it, we saw it. We compute an operational safety score per store using waste rate, anomaly frequency, vendor reliability, and FEFO compliance. PASHA Insurance can use this data directly to price insurance premiums. Less waste = lower risk = cheaper insurance."`
          }
        </div>
      </div>
    </div>
  );
}
