"use client";
import { useEffect, useState } from "react";
import { fetchIntegrationStatus, triggerERPSync } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, AnimCard, AnimRow, T } from "@/components/BravoUI";

// --- color config per vendor ----------------------------------
const VENDOR_CFG: Record<string, { color: string; accent: string }> = {
  "Microsoft Dynamics 365 Commerce": { color: "#0078d4", accent: "#0078d4" },
  "SAP S/4HANA Retail":              { color: "#0a6ed1", accent: "#0a6ed1" },
  "Oracle Retail":                    { color: "#c74634", accent: "#c74634" },
  "RELEX Solutions":                  { color: "#00c896", accent: "#00c896" },
  "Blue Yonder (Luminate)":           { color: "#7b2ff7", accent: "#7b2ff7" },
  "Wasteless":                        { color: "#ff6b35", accent: "#ff6b35" },
  "Smartway":                         { color: "#00bfa5", accent: "#00bfa5" },
  "Afourspace":                       { color: "#fbbf24", accent: "#fbbf24" },
};

const ERP_KEYS: Record<string, string> = {
  "Microsoft Dynamics 365 Commerce": "dynamics365",
  "SAP S/4HANA Retail":              "sap",
  "Oracle Retail":                    "oracle",
};

const VERDICT_CFG: Record<string, { label: string; color: string }> = {
  EXTENDS:     { label: "WS EXTENDS",    color: T.ok   },
  COMPLEMENTS: { label: "COMPLEMENTS",   color: T.info },
  REPLACES:    { label: "WS REPLACES",   color: T.err  },
};

// --- ERP Connector card ---------------------------------------
function ConnectorCard({ c, lang, syncing, onSync, delay }: {
  c: any; lang: string; syncing: string | null;
  onSync: (key: string, name: string) => void; delay: number;
}) {
  const cfg   = VENDOR_CFG[c.name] ?? { color: T.info, accent: T.info };
  const erpKey = ERP_KEYS[c.name] ?? c.name.toLowerCase().replace(/\s+/g, "");
  const connected = c.configured;
  const isSyncing = syncing === erpKey;

  return (
    <AnimCard delay={delay}>
      <div style={{
        border: `1px solid ${connected ? cfg.color + "60" : T.border1}`,
        background: connected ? `${cfg.color}08` : T.bgPanel,
        padding: 16, display: "flex", flexDirection: "column", gap: 10,
        height: "100%", transition: "border-color .15s, box-shadow .15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color + "90"; e.currentTarget.style.boxShadow = `0 0 14px ${cfg.color}18`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = connected ? cfg.color + "60" : T.border1; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.fg1, letterSpacing: ".04em" }}>{c.name}</div>
            <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".1em", marginTop: 3 }}>{c.api_type}</div>
          </div>
          <span style={{ fontSize: 8, letterSpacing: ".14em", padding: "2px 7px", border: `1px solid ${connected ? T.ok : T.warn}`, color: connected ? T.ok : T.warn, flexShrink: 0 }}>
            {connected ? (lang === "az" ? "QOSULDU" : "CONNECTED") : (lang === "az" ? "HAZIR" : "READY")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {(c.capabilities || []).map((cap: string, j: number) => (
            <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 10, color: T.fg3 }}>
              <span style={{ color: cfg.color, fontSize: 8, marginTop: 2, flexShrink: 0 }}>?</span>
              <span>{cap}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>
          {c.endpoints_implemented} {lang === "az" ? "endpoint" : "endpoints implemented"}
        </div>

        {ERP_KEYS[c.name] && (
          <button
            onClick={() => onSync(erpKey, c.name)}
            disabled={isSyncing}
            style={{
              fontFamily: "inherit", fontSize: 9, letterSpacing: ".14em",
              padding: "6px 0", border: `1px solid ${cfg.color}`,
              color: isSyncing ? T.fg4 : cfg.color,
              background: isSyncing ? T.bgElev : "transparent",
              cursor: isSyncing ? "wait" : "pointer", textTransform: "uppercase",
            }}
          >
            {isSyncing ? "? SYNCING..." : `? ${lang === "az" ? "SINXRONIZASIYA" : "SYNC NOW"} (DEMO)`}
          </button>
        )}
      </div>
    </AnimCard>
  );
}

// --- Competitive row ------------------------------------------
function CompetitorRow({ c, lang, delay }: { c: any; lang: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const cfg = VENDOR_CFG[c.name] ?? { color: T.warn, accent: T.warn };
  const vc  = VERDICT_CFG[c.verdict] ?? { label: c.verdict, color: T.fg3 };

  return (
    <AnimRow delay={delay}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ borderBottom: `1px solid ${T.border1}`, cursor: "pointer", transition: "background .1s" }}
        onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 24px", alignItems: "center", gap: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{c.name}</div>
          <div style={{ fontSize: 10, color: T.fg3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {c.approach}
          </div>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".12em", border: `1px solid ${vc.color}`, color: vc.color, padding: "2px 6px", textAlign: "center" }}>
            {vc.label}
          </span>
          <span style={{ color: T.fg4, fontSize: 10 }}>{open ? "?" : "?"}</span>
        </div>

        {open && (
          <div style={{ padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ border: `1px solid ${T.err}30`, background: `${T.err}06`, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, color: T.err, letterSpacing: ".16em", marginBottom: 4 }}>
                {lang === "az" ? "BOSLUQ" : "GAP"}
              </div>
              <div style={{ fontSize: 10, color: T.fg2, lineHeight: 1.5 }}>{c.gap}</div>
            </div>
            <div style={{ border: `1px solid ${T.ok}30`, background: `${T.ok}06`, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, color: T.ok, letterSpacing: ".16em", marginBottom: 4 }}>
                TESTAI {lang === "az" ? "F?RQI" : "DIFFERENCE"}
              </div>
              <div style={{ fontSize: 10, color: T.fg2, lineHeight: 1.5 }}>{c.testai_diff}</div>
            </div>
          </div>
        )}
      </div>
    </AnimRow>
  );
}

// --- Main page ------------------------------------------------
export default function IntegrationsPage() {
  const { lang } = useLanguage();
  const [data, setData]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    fetchIntegrationStatus().then(setData).finally(() => setLoading(false));
  }, []);

  const ws           = data?.testai ?? {};
  const erpConns: any[]  = data?.erp_connectors ?? [];
  const scConns: any[]   = data?.supply_chain_connectors ?? FALLBACK_SC;
  const competitive: any[] = data?.competitive_landscape ?? FALLBACK_COMP;
  const flow: any[]  = data?.data_flow ?? [];

  const handleSync = async (erpKey: string, erpName: string) => {
    setSyncing(erpKey);
    setSyncResult(null);
    const res = await triggerERPSync(erpKey);
    setSyncResult({ ...res, erpName });
    setSyncing(null);
  };

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <AnimCard delay={0}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
          {lang === "az" ? "INTEQRASIYA M?RK?ZI" : "INTEGRATION HUB"}
        </div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, border: `1px solid ${T.ok}50`,   color: T.ok,   padding: "1px 8px", letterSpacing: ".12em" }}>8 SYSTEMS</span>
          <span style={{ fontSize: 9, border: `1px solid ${T.info}50`, color: T.info, padding: "1px 8px", letterSpacing: ".12em" }}>REST / ODATA / OAUTH2</span>
          <span style={{ fontSize: 9, border: "1px solid #a78bfa50",   color: "#a78bfa", padding: "1px 8px", letterSpacing: ".12em" }}>ZERO INFRASTRUCTURE CHANGE</span>
        </div>
      </AnimCard>

      {/* TestAI status KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[
          { id: "INT-01", label: "TESTAI",                                          value: ws.status ?? "ACTIVE",               sub: "INTERNAL ENGINE",  tone: "ok"   },
          { id: "INT-02", label: lang === "az" ? "FILIAL" : "BRANCHES",                 value: String(ws.stores ?? 10),              sub: "MONITORED",        tone: "ok"   },
          { id: "INT-03", label: lang === "az" ? "M?HSUL" : "PRODUCTS",                 value: String(ws.products ?? 262),           sub: "TRACKED",          tone: "ok"   },
          { id: "INT-04", label: lang === "az" ? "TARAMA" : "SCAN CYCLE",               value: `${ws.scan_interval_min ?? 15} MIN`,  sub: "REAL-TIME",        tone: "info" },
        ].map((k, i) => (
          <AnimCard key={k.id} delay={80 + i * 60}>
            <KpiBox id={k.id} label={k.label} value={k.value} sub={k.sub} tone={k.tone as any} />
          </AnimCard>
        ))}
      </div>

      {/* Key message */}
      <AnimCard delay={340}>
        <div style={{ border: `1px solid ${T.ok}30`, background: "rgba(0,255,65,0.03)", padding: "12px 16px" }}>
          <div style={{ fontSize: 10, color: T.ok, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4 }}>
            {lang === "az" ? "?SAS MESAJ" : "KEY MESSAGE"}
          </div>
          <div style={{ fontSize: 12, color: T.fg2, lineHeight: 1.7 }}>
            {lang === "az"
              ? "Test Market hansi sistemi istifad? edirs? — Dynamics, SAP, Oracle, RELEX, Blue Yonder — TestAI onun üz?rin? qurulur. Mövcud sisteml?ri ?v?z etmirik, onlara AI fire-önleme qati ?lav? edirik."
              : "Whichever system Test Market uses — Dynamics, SAP, Oracle, RELEX, or Blue Yonder — TestAI plugs in on top. We don't replace existing systems, we add an AI waste-prevention layer."
            }
          </div>
        </div>
      </AnimCard>

      {/* Sync result */}
      {syncResult && (
        <div style={{ border: `1px solid ${T.ok}`, background: "rgba(0,255,65,0.05)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: T.ok, fontSize: 13 }}>?</span>
          <div>
            <div style={{ fontSize: 10, color: T.ok, letterSpacing: ".1em" }}>{syncResult.erpName} — {syncResult.mode ?? "DEMO"} SYNC</div>
            <div style={{ fontSize: 11, color: T.fg2 }}>{syncResult.records_synced} records · {syncResult.stores_updated} stores · {syncResult.duration_ms}ms</div>
          </div>
          <button onClick={() => setSyncResult(null)} style={{ marginLeft: "auto", color: T.fg4, background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>?</button>
        </div>
      )}

      {/* -- CATEGORY 1: ERP Systems -- */}
      <div>
        <AnimCard delay={400}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".3em", textTransform: "uppercase" }}>-- CATEGORY 1 ----------------------</div>
            <span style={{ fontSize: 9, fontWeight: 700, color: T.info, border: `1px solid ${T.info}50`, padding: "1px 8px", letterSpacing: ".12em" }}>ERP SISTEML?RI · READ + WRITE</span>
          </div>
        </AnimCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {loading
            ? [0,1,2].map(i => <div key={i} className="bos-skeleton" style={{ height: 220 }} />)
            : erpConns.map((c, i) => (
              <ConnectorCard key={c.name} c={c} lang={lang} syncing={syncing} onSync={handleSync} delay={460 + i * 70} />
            ))
          }
        </div>
      </div>

      {/* -- CATEGORY 2: Supply Chain Platforms -- */}
      <div>
        <AnimCard delay={620}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".3em", textTransform: "uppercase" }}>-- CATEGORY 2 ----------------------</div>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#00c896", border: "1px solid #00c89650", padding: "1px 8px", letterSpacing: ".12em" }}>T?CHIZAT Z?NCIRI · READ ONLY</span>
          </div>
        </AnimCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {scConns.map((c, i) => (
            <ConnectorCard key={c.name} c={c} lang={lang} syncing={syncing} onSync={handleSync} delay={680 + i * 70} />
          ))}
        </div>
        <AnimCard delay={820}>
          <div style={{ marginTop: 8, padding: "8px 12px", border: `1px solid ${T.border1}`, background: T.bgElev, fontSize: 10, color: T.fg3, lineHeight: 1.6 }}>
            ?? {lang === "az"
              ? "RELEX v? Blue Yonder hansi m?hsulun n? q?d?r sifaris edil?c?yini hesablayir. TestAI is? hansi m?hsulun niy? artiq sifaris edilm?m?li oldugunu bilir — fire riskini azaltmaq üçün."
              : "RELEX and Blue Yonder calculate what to order and when. TestAI knows why not to over-order — waste risk intelligence that reduces last-mile spoilage."
            }
          </div>
        </AnimCard>
      </div>

      {/* -- CATEGORY 3: Competitive Landscape -- */}
      <AnimCard delay={860}>
        <Panel id="INT-COMP" title={lang === "az" ? "R?QAB?T M?NZ?R?SI" : "COMPETITIVE LANDSCAPE"} right="TESTAI POSITIONING">
          <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
            {Object.entries(VERDICT_CFG).map(([k, v]) => (
              <span key={k} style={{ fontSize: 8, border: `1px solid ${v.color}50`, color: v.color, padding: "1px 8px", letterSpacing: ".12em" }}>{v.label}</span>
            ))}
          </div>
          <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".1em", marginBottom: 10 }}>
            {lang === "az"
              ? "Klikl?yin — TestAI f?rqini görün"
              : "Click any row to see the TestAI difference"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 24px", gap: 12, padding: "6px 12px", background: T.bgElev, borderBottom: `1px solid ${T.border2}` }}>
              {["SYSTEM", lang === "az" ? "YANASMA" : "APPROACH", "WS VERDICT", ""].map((h, i) => (
                <div key={i} style={{ fontSize: 8, color: T.greenDim, letterSpacing: ".16em", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {competitive.map((c, i) => (
              <CompetitorRow key={c.name} c={c} lang={lang} delay={920 + i * 50} />
            ))}
          </div>
        </Panel>
      </AnimCard>

      {/* Data flow */}
      <AnimCard delay={1060}>
        <Panel id="INT-FLOW" title={lang === "az" ? "M?LUMAT AXISI" : "DATA FLOW"} right="BIDIRECTIONAL">
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto", padding: "8px 0" }}>
            {flow.map((step: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ border: `1px solid ${T.border2}`, background: T.bgElev, padding: "12px 16px", minWidth: 180 }}>
                  <div style={{ fontSize: 8, color: T.greenDim, letterSpacing: ".2em", marginBottom: 4 }}>STEP {step.step}</div>
                  <div style={{ fontSize: 11, color: T.fg1, fontWeight: 600, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: T.fg4, lineHeight: 1.5 }}>{step.desc}</div>
                </div>
                {i < flow.length - 1 && (
                  <div style={{ padding: "0 8px", color: T.ok, fontSize: 16, flexShrink: 0 }}>?</div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </AnimCard>

    </div>
  );
}

// --- Fallback data (if backend doesn't return new fields yet) -
const FALLBACK_SC = [
  {
    name: "RELEX Solutions", configured: false,
    api_type: "REST API + Webhooks", endpoints_implemented: 3,
    capabilities: [
      "Demand forecast data pull (read-only)",
      "Replenishment order sync",
      "TestAI waste alerts ? RELEX order throttle",
    ],
  },
  {
    name: "Blue Yonder (Luminate)", configured: false,
    api_type: "REST + OAuth2 (Azure)", endpoints_implemented: 2,
    capabilities: [
      "Luminate Commerce inventory pull",
      "Allocation plan read + override",
      "TestAI expiry signal ? Luminate markdown trigger",
    ],
  },
];

const FALLBACK_COMP = [
  {
    name: "Wasteless", category: "COMPETITOR", verdict: "EXTENDS",
    approach: "AI dynamic markdowns — discounts every at-risk product",
    gap: "No sales velocity check — discounts even products that would sell naturally",
    testai_diff: "Smart Discount: only discount if days_to_stockout > expiry × 0.85. Protects margin on naturally-selling items.",
  },
  {
    name: "Smartway", category: "ADJACENT", verdict: "COMPLEMENTS",
    approach: "Food redistribution network — connects surplus to food banks",
    gap: "No predictive layer — reactive, not proactive",
    testai_diff: "TestAI's DONATE action type + risk scoring feeds redistribution with 3-day advance notice.",
  },
  {
    name: "Afourspace", category: "ADJACENT", verdict: "COMPLEMENTS",
    approach: "Retail analytics — category performance, planogram compliance",
    gap: "No waste-specific ML, no expiry risk modeling",
    testai_diff: "TestAI adds TestAI anomaly detection + Test Model demand forecasting for waste prevention.",
  },
];
