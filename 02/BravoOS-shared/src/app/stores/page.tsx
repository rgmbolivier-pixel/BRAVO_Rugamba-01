"use client";
import { useEffect, useState } from "react";
import { fetchStores, fetchRiskOverview } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, RiskBar, AnimCard, Skeleton, T } from "@/components/BravoUI";

export default function StoresPage() {
  const { lang } = useLanguage();
  const [stores, setStores] = useState<any[]>([]);
  const [overview, setOverview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStores(), fetchRiskOverview()])
      .then(([s, o]) => { setStores(s); setOverview(o); })
      .finally(() => setLoading(false));
  }, []);

  const merged = stores.map(s => ({
    ...s,
    ...overview.find((o:any) => o.store_id === s.id),
  }));

  if (loading) return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Skeleton h={28} w={240} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[0,1,2,3].map(i => <Skeleton key={i} h={72} />)}
      </div>
      <Skeleton h={320} />
    </div>
  );

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnimCard delay={0}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
          {lang === "az" ? "FILIAL REYESTRI" : "BRANCH REGISTRY"}
        </div>
      </AnimCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[
          { id: "STR-01", label: lang === "az" ? "C?MI FILIAL"    : "TOTAL BRANCHES",    value: String(stores.length),                                               sub: "TEST CITY METRO AREA",       tone: "ok"   as const, delay: 80  },
          { id: "STR-02", label: lang === "az" ? "AKTIV MONITOR"  : "ACTIVE MONITOR",    value: String(stores.length),                                               sub: "ALL BRANCHES LIVE",     tone: "ok"   as const, delay: 160 },
          { id: "STR-03", label: lang === "az" ? "KRITIK FILIAL"  : "CRITICAL BRANCHES", value: String(overview.filter((o:any) => (o.critical ?? 0) > 2).length),    sub: "NEED IMMEDIATE ACTION", tone: "err"  as const, delay: 240 },
          { id: "STR-04", label: lang === "az" ? "C?MI RISK"      : "TOTAL RISK",        value: String(overview.reduce((s:any,o:any) => s + (o.total_at_risk??0), 0)), sub: "PRODUCTS AT RISK",     tone: "warn" as const, delay: 320 },
        ].map(k => (
          <AnimCard key={k.id} delay={k.delay}>
            <KpiBox id={k.id} label={k.label} value={k.value} sub={k.sub} tone={k.tone} />
          </AnimCard>
        ))}
      </div>

      <AnimCard delay={400}>
        <Panel id="STR-TABLE" title={`${lang === "az" ? "FILIAL STATUS MATRISI" : "BRANCH STATUS MATRIX"} · ${stores.length} BRANCHES`} right="TESTAI · LIVE">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
            <thead>
              <tr style={{ background: T.bgElev }}>
                {["ID", lang==="az"?"AD":"NAME", lang==="az"?"RAYON":"DISTRICT", lang==="az"?"MÜDIR":"MANAGER", "LAT/LNG", "CRIT","HIGH","MED","LOSS","STATUS"].map((h,i) => (
                  <th key={i} style={{ padding: "8px 10px", fontSize: 9, color: T.greenDim, letterSpacing: ".16em", textAlign: "left", borderBottom: `1px solid ${T.border2}`, fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {merged.map((s:any, i) => {
                const crit = s.critical ?? 0;
                const sc = crit > 2 ? T.err : crit > 0 ? T.warn : T.ok;
                const statusText = crit > 2 ? "CRITICAL" : crit > 0 ? "HIGH" : "OK";
                return (
                  <tr key={s.id}
                    style={{ borderBottom: `1px solid ${T.border1}`, animation: `bos-slideleft .3s cubic-bezier(.22,1,.36,1) ${400 + i * 30}ms both` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "8px 10px", color: T.greenDim, fontSize: 9 }}>BR-{String(s.id).padStart(2,"0")}</td>
                    <td style={{ padding: "8px 10px", color: T.fg1, fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: "8px 10px", color: T.fg2 }}>{s.district ?? "-"}</td>
                    <td style={{ padding: "8px 10px", color: T.fg3 }}>{s.manager ?? "-"}</td>
                    <td style={{ padding: "8px 10px", color: T.fg4, fontSize: 9 }}>{s.lat?.toFixed(3)}/{s.lng?.toFixed(3)}</td>
                    <td style={{ padding: "8px 10px", color: T.err, fontWeight: 700, textAlign: "center" }}>{crit}</td>
                    <td style={{ padding: "8px 10px", color: T.warn, textAlign: "center" }}>{s.high ?? 0}</td>
                    <td style={{ padding: "8px 10px", color: T.info, textAlign: "center" }}>{s.medium ?? 0}</td>
                    <td style={{ padding: "8px 10px", color: T.err, fontWeight: 600, whiteSpace: "nowrap" }}>?{s.potential_loss?.toFixed(0) ?? 0}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ fontSize: 9, border: `1px solid ${sc}`, color: sc, padding: "2px 6px", letterSpacing: ".1em" }}>{statusText}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </AnimCard>
    </div>
  );
}
