"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAnomalies } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { T } from "@/components/BravoUI";

// -- Olasi sebep çikarimi --------------------------------------
function inferCauses(d: any, lang: string): { label: string; prob: string; color: string }[] {
  const delta = d.discrepancy_pct ?? 0;
  const cat   = (d.product_category ?? "").toLowerCase();
  const causes = [];

  if (delta > 35) {
    causes.push({ label: lang === "az" ? "Anbar sayim x?tasi"   : "Inventory counting error", prob: lang === "az" ? "Yüks?k" : "High",   color: T.err  });
    causes.push({ label: lang === "az" ? "Ogurluq / itkisi"     : "Theft or shrinkage",        prob: lang === "az" ? "Orta"   : "Medium", color: T.warn });
  } else if (delta > 20) {
    causes.push({ label: lang === "az" ? "Tedarikçi çatismazligi" : "Supplier shortfall",       prob: lang === "az" ? "Orta"   : "Medium", color: T.warn });
    causes.push({ label: lang === "az" ? "Sayim gecikmesi"         : "Count lag / timing",       prob: lang === "az" ? "Orta"   : "Medium", color: T.warn });
  } else {
    causes.push({ label: lang === "az" ? "Normal ?m?liyyat sürüsm?si" : "Normal operational drift", prob: lang === "az" ? "Asagi" : "Low", color: T.ok });
  }
  if (cat.includes("süd") || cat.includes("?t") || cat.includes("meyv?") || cat.includes("çör?k")) {
    causes.push({ label: lang === "az" ? "Son istifad? tarixi itkisi" : "Expiry-related waste", prob: lang === "az" ? "Orta" : "Medium", color: T.warn });
  }
  return causes;
}

// -- Sag sütun detail panel ------------------------------------
function DetailPanel({ anomaly, onClose, onInvestigate, onDismiss, isInvestigated, isDismissed, lang }: {
  anomaly: any; onClose: () => void;
  onInvestigate: (id: string) => void; onDismiss: (id: string) => void;
  isInvestigated: boolean; isDismissed: boolean; lang: string;
}) {
  const router  = useRouter();
  const [note,  setNote]  = useState("");
  const [saved, setSaved] = useState(false);
  const id      = `${anomaly.store_id}-${anomaly.product_id}`;
  const sev     = anomaly.severity === "HIGH" ? T.err : T.warn;
  const causes  = inferCauses(anomaly, lang);

  const saveNote = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
      background: "#060606", borderLeft: `1px solid ${T.border2}`,
      zIndex: 200, display: "flex", flexDirection: "column",
      fontFamily: T.font, overflowY: "auto",
      boxShadow: "-8px 0 40px rgba(0,0,0,.7)",
    }}>
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: `1px solid ${T.border1}`, background: T.bgPanel, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".2em", marginBottom: 5 }}>ANOMALIYA DETALi</div>
            <div style={{ fontSize: 13, color: T.fg1, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
              {anomaly.product_name}
            </div>
            <div style={{ fontSize: 10, color: T.fg3 }}>{anomaly.store_name}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1, flexShrink: 0 }}>?</button>
        </div>

        {/* Status badges */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 700, border: `1px solid ${sev}`, color: sev, padding: "2px 8px" }}>
            ? {anomaly.severity}
          </span>
          <span style={{ fontSize: 9, color: T.fg4, border: `1px solid ${T.border1}`, padding: "2px 8px" }}>
            {anomaly.detection_method ?? "threshold"}
          </span>
          {isInvestigated && (
            <span style={{ fontSize: 9, border: `1px solid ${T.ok}`, color: T.ok, padding: "2px 8px" }}>
              ? {lang === "az" ? "INC?L?NDI" : "REVIEWED"}
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border1}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: lang === "az" ? "Sapma (delta)"   : "Delta variance",   val: `+${(anomaly.discrepancy_pct ?? 0).toFixed(1)}%`, color: sev },
            { label: "Test skoru",                                             val: anomaly.ai_score != null ? anomaly.ai_score.toFixed(1) : "—",    color: "#a78bfa" },
            { label: lang === "az" ? "POS satis (30g)" : "POS sales (30d)",  val: String(anomaly.actual_pos_sales ?? 0), color: T.fg2 },
            { label: lang === "az" ? "Taxmini itki"    : "Est. loss",        val: `?${(anomaly.estimated_loss ?? 0).toFixed(2)}`, color: T.warn },
          ].map((m, i) => (
            <div key={i} style={{ background: T.bgElev, padding: "10px 12px", border: `1px solid ${T.border1}` }}>
              <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".14em", marginBottom: 5 }}>{m.label.toUpperCase()}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Probable causes */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border1}` }}>
        <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".2em", marginBottom: 10 }}>
          {lang === "az" ? "OLASI S?B?BL?R" : "PROBABLE CAUSES"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {causes.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: T.bgElev, border: `1px solid ${T.border1}` }}>
              <span style={{ fontSize: 10, color: T.fg2 }}>{c.label}</span>
              <span style={{ fontSize: 9, color: c.color, border: `1px solid ${c.color}50`, padding: "1px 7px" }}>{c.prob}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Investigation note */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border1}` }}>
        <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".2em", marginBottom: 8 }}>
          {lang === "az" ? "ISTINTAQ QEYDI" : "INVESTIGATION NOTE"}
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={lang === "az" ? "Qeydinizi yazin..." : "Add your investigation note..."}
          rows={3}
          style={{
            width: "100%", background: T.bgElev, border: `1px solid ${T.border2}`,
            color: T.fg2, fontFamily: T.font, fontSize: 10, padding: "8px 10px",
            resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.5,
          }}
        />
        <button onClick={saveNote} style={{
          marginTop: 6, fontFamily: T.font, fontSize: 9, letterSpacing: ".12em",
          padding: "5px 14px", border: `1px solid ${saved ? T.ok : T.border2}`,
          color: saved ? T.ok : T.fg3, background: "transparent", cursor: "pointer",
        }}>
          {saved ? (lang === "az" ? "? SAXLANDI" : "? SAVED") : (lang === "az" ? "SAXLA" : "SAVE NOTE")}
        </button>
      </div>

      {/* Actions */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => router.push("/alerts")}
          style={{
            fontFamily: T.font, fontSize: 10, letterSpacing: ".14em", fontWeight: 700,
            padding: "10px 0", border: `1px solid ${T.ok}`, color: "#000",
            background: T.ok, cursor: "pointer",
          }}
        >
          ? {lang === "az" ? "ALERT & AKSIYALARA KEÇ" : "GO TO ALERTS & ACTIONS"}
        </button>
        <button
          onClick={() => onInvestigate(id)}
          disabled={isInvestigated}
          style={{
            fontFamily: T.font, fontSize: 9, letterSpacing: ".12em",
            padding: "9px 0", border: `1px solid ${isInvestigated ? T.fg5 : T.info}`,
            color: isInvestigated ? T.fg5 : T.info,
            background: "transparent", cursor: isInvestigated ? "default" : "pointer",
          }}
        >
          {isInvestigated
            ? (lang === "az" ? "? INC?L?NDI" : "? MARKED AS INVESTIGATED")
            : (lang === "az" ? "?? INC?L?NDI ISAR?L?" : "?? MARK AS INVESTIGATED")}
        </button>
        <button
          onClick={() => onDismiss(id)}
          disabled={isDismissed}
          style={{
            fontFamily: T.font, fontSize: 9, letterSpacing: ".12em",
            padding: "9px 0", border: `1px solid ${isDismissed ? T.fg5 : T.border2}`,
            color: isDismissed ? T.fg5 : T.fg4,
            background: "transparent", cursor: isDismissed ? "default" : "pointer",
          }}
        >
          {isDismissed
            ? (lang === "az" ? "GEÇERSIZ SAYILDI" : "MARKED FALSE POSITIVE")
            : (lang === "az" ? "? GEÇERSIZ SAY" : "? MARK FALSE POSITIVE")}
        </button>
      </div>
    </div>
  );
}

// -- Ana sayfa -------------------------------------------------
export default function AnomaliesPage() {
  const { lang } = useLanguage();

  const [data,    setData]    = useState<any>({ total_checked: 0, anomalies_found: 0, anomalies: [] });
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [search,  setSearch]  = useState("");
  const [selected, setSelected]   = useState<any>(null);
  const [investigated, setInvestigated] = useState<Set<string>>(new Set());
  const [dismissed,    setDismissed]    = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnomalies()
      .then(res => setData(res ?? { total_checked: 0, anomalies_found: 0, anomalies: [] }))
      .finally(() => setLoading(false));
  }, []);

  const all: any[]   = data?.anomalies ?? [];
  const total        = data?.total_checked ?? 0;
  const aiOn       = data?.ai_available ?? false;
  const totalLoss    = all.reduce((s: number, d: any) => s + (d.estimated_loss ?? 0), 0);
  const high         = all.filter((d: any) => d.severity === "HIGH").length;
  const medium       = all.filter((d: any) => d.severity === "MEDIUM").length;
  const rate         = total > 0 ? ((all.length / total) * 100).toFixed(1) : "0";

  const active = all.filter((d: any) => !dismissed.has(`${d.store_id}-${d.product_id}`));
  const searchLow = search.trim().toLowerCase();
  const filtered = active
    .filter((d: any) => filter === "ALL" || d.severity === filter)
    .filter((d: any) => !searchLow || (d.product_name ?? "").toLowerCase().includes(searchLow) || (d.store_name ?? "").toLowerCase().includes(searchLow));

  const rowId = (d: any) => `${d.store_id}-${d.product_id}`;

  // Filial özeti
  const byBranch: Record<string, { count: number; high: number; loss: number }> = {};
  active.forEach((d: any) => {
    if (!byBranch[d.store_name]) byBranch[d.store_name] = { count: 0, high: 0, loss: 0 };
    byBranch[d.store_name].count++;
    if (d.severity === "HIGH") byBranch[d.store_name].high++;
    byBranch[d.store_name].loss += d.estimated_loss ?? 0;
  });
  const branchList = Object.entries(byBranch).sort((a, b) => b[1].count - a[1].count);
  const maxBranch  = branchList[0]?.[1].count ?? 1;

  // Kateqoriya özeti
  const byCat: Record<string, { count: number; loss: number }> = {};
  active.forEach((d: any) => {
    const cat = d.product_category ?? "Dig?r";
    if (!byCat[cat]) byCat[cat] = { count: 0, loss: 0 };
    byCat[cat].count++;
    byCat[cat].loss += d.estimated_loss ?? 0;
  });
  const catList  = Object.entries(byCat).sort((a, b) => b[1].count - a[1].count);
  const maxCat   = catList[0]?.[1].count ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: T.font, paddingRight: selected ? 396 : 0, transition: "padding-right .25s" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".24em", marginBottom: 4 }}>ANOMALIYA</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
            {lang === "az" ? "ANOMALIYA ASKARLAMA" : "ANOMALY DETECTION"}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 9, border: "1px solid #a78bfa60", color: "#a78bfa", padding: "1px 7px", letterSpacing: ".1em" }}>
              Test AI {aiOn ? "?" : ""}
            </span>
            <span style={{ fontSize: 9, border: `1px solid ${T.border1}`, color: T.fg4, padding: "1px 7px", letterSpacing: ".1em" }}>
              THRESHOLD ENSEMBLE
            </span>
            <span style={{ fontSize: 9, color: T.fg5 }}>·</span>
            <span style={{ fontSize: 9, color: T.fg4 }}>
              {lang === "az" ? `${total} qeyd yoxlanildi` : `${total} records scanned`}
            </span>
          </div>
        </div>
        {investigated.size > 0 && (
          <span style={{ fontSize: 9, border: `1px solid ${T.ok}40`, color: T.ok, padding: "3px 10px" }}>
            ? {investigated.size} {lang === "az" ? "incelendi" : "reviewed"}
          </span>
        )}
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[
          { label: lang === "az" ? "AKTIV ANOMALIYA"  : "ACTIVE ANOMALIES",  val: String(active.length),          color: active.length > 10 ? T.err : T.warn },
          { label: lang === "az" ? "KRITIK (HIGH)"     : "HIGH SEVERITY",     val: String(high),                   color: T.err  },
          { label: lang === "az" ? "ANOMALIYA ORANI"   : "ANOMALY RATE",      val: `${rate}%`,                     color: Number(rate) > 15 ? T.err : T.warn },
          { label: lang === "az" ? "TAXMINI ITKI"     : "ESTIMATED LOSS",    val: `?${totalLoss.toFixed(0)}`,     color: T.warn },
        ].map(k => (
          <div key={k.label} style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".18em", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em" }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Filial + Kateqoriya özeti */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* By branch */}
        <div style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: "14px 16px" }}>
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".2em", marginBottom: 12 }}>
            {lang === "az" ? "FILIAL ÜZR?" : "BY BRANCH"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {branchList.map(([name, v]) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
                  <span style={{ color: T.fg2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                    {name.replace("Test ", "")}
                  </span>
                  <span style={{ flexShrink: 0, paddingLeft: 8, display: "flex", gap: 10 }}>
                    {v.high > 0 && <span style={{ color: T.err, fontSize: 9 }}>{v.high} kritik</span>}
                    <span style={{ color: T.fg3 }}>?{v.loss.toFixed(0)}</span>
                    <span style={{ color: T.fg2, fontWeight: 700 }}>{v.count}</span>
                  </span>
                </div>
                <div style={{ height: 3, background: T.bgElev }}>
                  <div style={{ height: 3, width: `${(v.count / maxBranch) * 100}%`, background: v.high > 0 ? T.err : T.warn, transition: "width .5s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By category */}
        <div style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, padding: "14px 16px" }}>
          <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".2em", marginBottom: 12 }}>
            {lang === "az" ? "KATEQORIYA ÜZR?" : "BY CATEGORY"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catList.map(([cat, v]) => (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10 }}>
                  <span style={{ color: T.fg2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{cat}</span>
                  <span style={{ flexShrink: 0, paddingLeft: 8, display: "flex", gap: 10 }}>
                    <span style={{ color: T.fg4 }}>?{v.loss.toFixed(0)}</span>
                    <span style={{ color: T.warn, fontWeight: 700 }}>{v.count}</span>
                  </span>
                </div>
                <div style={{ height: 3, background: T.bgElev }}>
                  <div style={{ height: 3, width: `${(v.count / maxCat) * 100}%`, background: T.warn, transition: "width .5s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomali feed */}
      <div style={{ border: `1px solid ${T.border1}`, background: T.bgPanel }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border1}`, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".2em", flexShrink: 0 }}>
            {lang === "az" ? "FEED" : "FEED"}
          </div>
          <div style={{ width: 1, height: 14, background: T.border1, flexShrink: 0 }} />

          {/* Severity filter */}
          {(["ALL", "HIGH", "MEDIUM"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: "inherit", fontSize: 9, letterSpacing: ".1em",
              padding: "3px 10px",
              border: `1px solid ${filter === f ? (f === "HIGH" ? T.err : f === "MEDIUM" ? T.warn : T.ok) : T.border2}`,
              color: filter === f ? (f === "HIGH" ? T.err : f === "MEDIUM" ? T.warn : T.ok) : T.fg4,
              background: "transparent", cursor: "pointer",
            }}>
              {f === "ALL" ? `${lang === "az" ? "Hamisi" : "All"} (${active.length})` : f === "HIGH" ? `HIGH (${high})` : `MEDIUM (${medium})`}
            </button>
          ))}

          <div style={{ width: 1, height: 14, background: T.border1, flexShrink: 0 }} />

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 10, color: T.fg5 }}>??</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === "az" ? "M?hsul v? ya filial axtar..." : "Search product or store..."}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: T.font, fontSize: 10, color: T.fg1 }}
            />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontFamily: T.font, fontSize: 12 }}>×</button>}
          </div>

          <span style={{ fontSize: 9, color: T.fg5, marginLeft: "auto", flexShrink: 0 }}>
            {filtered.length} {lang === "az" ? "n?tic?" : "results"} · {lang === "az" ? "detay üçün klikl?yin" : "click row for detail"}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: "28px 16px", fontSize: 10, color: T.fg4, letterSpacing: ".1em" }}>
            Test MODEL RUNNING...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px 0", fontSize: 11, color: T.fg4, textAlign: "center", letterSpacing: ".1em" }}>
            {lang === "az" ? "N?tic? tapilmadi." : "No anomalies found."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
            <thead>
              <tr>
                {[
                  { label: "#",                                                    w: 40  },
                  { label: lang === "az" ? "FILIAL"    : "BRANCH",               w: 130 },
                  { label: lang === "az" ? "M?HSUL"    : "PRODUCT",              w: undefined },
                  { label: lang === "az" ? "KATEQORIYA": "CATEGORY",             w: 110 },
                  { label: "DELTA",                                                w: 72  },
                  { label: "Score",                                                 w: 64  },
                  { label: lang === "az" ? "RISK"      : "RISK",                 w: 80  },
                  { label: lang === "az" ? "ITKI"      : "LOSS",                 w: 72  },
                  { label: "",                                                      w: 32  },
                ].map((h, i) => (
                  <th key={i} style={{
                    padding: "9px 12px", fontSize: 8, color: T.fg5, letterSpacing: ".16em",
                    textAlign: "left", borderBottom: `1px solid ${T.border1}`,
                    fontWeight: 500, width: h.w, whiteSpace: "nowrap",
                    background: T.bgElev,
                  }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any, i: number) => {
                const sev   = d.severity === "HIGH" ? T.err : T.warn;
                const id    = rowId(d);
                const isInv = investigated.has(id);
                const isSel = selected && rowId(selected) === id;
                return (
                  <tr
                    key={id}
                    onClick={() => setSelected(isSel ? null : d)}
                    style={{
                      borderBottom: `1px solid ${T.border1}`,
                      background: isSel ? `${sev}08` : "transparent",
                      cursor: "pointer",
                      borderLeft: isSel ? `2px solid ${sev}` : "2px solid transparent",
                      transition: "background .1s",
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = T.bgElev; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "10px 12px", color: T.fg5, fontSize: 9 }}>{String(i + 1).padStart(3, "0")}</td>
                    <td style={{ padding: "10px 12px", color: T.fg1, fontSize: 10, whiteSpace: "nowrap" }}>
                      {(d.store_name ?? "-").replace("Test ", "")}
                    </td>
                    <td style={{ padding: "10px 12px", color: T.fg2, fontSize: 10, maxWidth: 200 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.product_name ?? "-"}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 9, color: T.fg4, whiteSpace: "nowrap" }}>{d.product_category ?? "-"}</td>
                    <td style={{ padding: "10px 12px", color: sev, fontWeight: 700, fontSize: 11 }}>
                      +{(d.discrepancy_pct ?? 0).toFixed(1)}%
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {d.ai_score != null
                        ? <span style={{ fontSize: 9, color: "#a78bfa", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)", padding: "2px 7px" }}>
                            {d.ai_score.toFixed(1)}
                          </span>
                        : <span style={{ color: T.fg5, fontSize: 9 }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, border: `1px solid ${sev}50`, color: sev, padding: "2px 7px" }}>
                        {d.severity}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: (d.estimated_loss ?? 0) > 100 ? T.warn : T.fg3, fontWeight: (d.estimated_loss ?? 0) > 100 ? 700 : 400, fontSize: 10 }}>
                      ?{(d.estimated_loss ?? 0).toFixed(0)}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      <span style={{ fontSize: 10, color: isSel ? sev : T.fg5 }}>{isSel ? "?" : "?"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border1}`, display: "flex", gap: 20, fontSize: 10, color: T.fg4 }}>
            <span>{lang === "az" ? "Göst?ril?n:" : "Showing:"} <b style={{ color: T.fg2 }}>{filtered.length}</b></span>
            <span>{lang === "az" ? "C?mi itki:" : "Total loss:"} <b style={{ color: T.warn }}>?{filtered.reduce((s: number, d: any) => s + (d.estimated_loss ?? 0), 0).toFixed(0)}</b></span>
            {investigated.size > 0 && <span>{lang === "az" ? "Incelendi:" : "Reviewed:"} <b style={{ color: T.ok }}>{investigated.size}</b></span>}
          </div>
        )}
      </div>

      {/* Detail panel overlay */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,.35)" }}
          />
          <DetailPanel
            anomaly={selected}
            onClose={() => setSelected(null)}
            onInvestigate={id => setInvestigated(prev => new Set([...prev, id]))}
            onDismiss={id => { setDismissed(prev => new Set([...prev, id])); setSelected(null); }}
            isInvestigated={investigated.has(rowId(selected))}
            isDismissed={dismissed.has(rowId(selected))}
            lang={lang}
          />
        </>
      )}
    </div>
  );
}
