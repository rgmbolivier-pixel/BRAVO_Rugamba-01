"use client";
import { useEffect, useState } from "react";
import {
  fetchSupplyChain, fetchVendors, fetchVendorPurchaseOrders,
  fetchVendorSummary, triggerReplenishment, deliverPO,
} from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, FilterTabs, AnimCard, T } from "@/components/BravoUI";

type Tab = "transfers" | "vendors";
type ExecStatus = "pending" | "confirming" | "executing" | "done" | "rejected";

function statusColor(s: string) {
  if (s === "DELIVERED" || s === "INVOICED" || s === "PAID") return T.ok;
  if (s === "CONFIRMED") return T.info;
  if (s === "SENT")      return T.warn;
  if (s === "REJECTED")  return T.err;
  return T.fg4;
}

const STATUS_LABEL: Record<string, { az: string; en: string }> = {
  PENDING:   { az: "Gözl?nir",    en: "Pending"   },
  SENT:      { az: "Yeni Sifaris",en: "New Order"  },
  CONFIRMED: { az: "T?sdiql?ndi", en: "Confirmed"  },
  DELIVERED: { az: "Çatdirildi",  en: "Delivered"  },
  INVOICED:  { az: "Faktura",     en: "Invoiced"   },
  PAID:      { az: "Öd?nildi",    en: "Paid"       },
  REJECTED:  { az: "R?dd",        en: "Rejected"   },
};

// -- Transfer Row ------------------------------------------------------
function TransferRow({ t, lang, status, onExec, onReject }: {
  t: any; lang: string; status: ExecStatus;
  onExec: () => void; onReject: () => void;
}) {
  const priColor = t.priority === "CRITICAL" || t.urgency === "CRITICAL" ? T.err
    : t.priority === "HIGH"     || t.urgency === "HIGH"     ? T.warn : T.info;
  const pri = t.priority ?? t.urgency ?? "MED";

  return (
    <tr style={{
      borderBottom: `1px solid ${T.border1}`,
      background: status === "done" ? `${T.ok}06` : status === "rejected" ? "rgba(255,255,255,0.01)" : "transparent",
      opacity: status === "rejected" ? 0.45 : 1, transition: "all .15s",
    }}
      onMouseEnter={e => { if (status === "pending") e.currentTarget.style.background = T.bgHover; }}
      onMouseLeave={e => { if (status === "pending") e.currentTarget.style.background = "transparent"; }}
    >
      <td style={{ padding: "9px 10px", color: T.fg1, fontSize: 11, whiteSpace: "nowrap" }}>{t.from_store ?? t.from_store_name ?? "-"}</td>
      <td style={{ padding: "9px 10px", color: T.ok,  fontSize: 11, whiteSpace: "nowrap" }}>? {t.to_store ?? t.to_store_name ?? "-"}</td>
      <td style={{ padding: "9px 10px", color: T.fg2, fontSize: 11, maxWidth: 160 }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.product_name ?? "-"}</div>
        <div style={{ fontSize: 9, color: T.fg5, marginTop: 1 }}>{t.category ?? ""}</div>
      </td>
      <td style={{ padding: "9px 10px", color: T.info, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{t.units}</td>
      <td style={{ padding: "9px 10px", color: T.ok,  fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>+?{(t.estimated_saving ?? t.net_saving ?? 0).toFixed(0)}</td>
      <td style={{ padding: "9px 10px" }}>
        <span style={{ fontSize: 9, border: `1px solid ${priColor}`, color: priColor, padding: "2px 6px", letterSpacing: ".08em" }}>{pri}</span>
      </td>
      <td style={{ padding: "9px 10px", minWidth: 160 }}>
        {status === "pending" && (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onExec} style={{ fontFamily: "inherit", fontSize: 9, letterSpacing: ".12em", fontWeight: 700, padding: "4px 10px", border: `1px solid ${T.ok}`, color: "#000", background: T.ok, cursor: "pointer" }}>? EXEC</button>
            <button onClick={onReject} style={{ fontFamily: "inherit", fontSize: 9, padding: "4px 8px", border: `1px solid ${T.border2}`, color: T.fg4, background: "transparent", cursor: "pointer" }}>?</button>
          </div>
        )}
        {status === "confirming" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 9, color: T.warn, letterSpacing: ".1em" }}>{lang === "az" ? "?minsiniz?" : "Confirm?"}</span>
            <button onClick={onExec}   style={{ fontFamily: "inherit", fontSize: 9, padding: "3px 8px", border: `1px solid ${T.ok}`,     color: T.ok,  background: "transparent", cursor: "pointer" }}>{lang === "az" ? "H?"     : "YES"}</button>
            <button onClick={onReject} style={{ fontFamily: "inherit", fontSize: 9, padding: "3px 8px", border: `1px solid ${T.border2}`, color: T.fg4, background: "transparent", cursor: "pointer" }}>{lang === "az" ? "XEYIR" : "NO"}</button>
          </div>
        )}
        {status === "executing" && <span style={{ fontSize: 9, color: T.info, letterSpacing: ".12em" }}>? EXECUTING...</span>}
        {status === "done"      && <span style={{ fontSize: 9, color: T.ok,   letterSpacing: ".12em" }}>? {lang === "az" ? "ICRA EDILDI" : "EXECUTED"}</span>}
        {status === "rejected"  && <span style={{ fontSize: 9, color: T.fg5,  letterSpacing: ".1em"  }}>{lang === "az" ? "R?D EDILDI"   : "REJECTED"}</span>}
      </td>
    </tr>
  );
}

// -- Delivery Receipt Panel --------------------------------------------
function DeliveryReceiptPanel({ pos, lang, onRefresh }: { pos: any[]; lang: string; onRefresh: () => void }) {
  const confirmed = pos.filter(p => p.status === "CONFIRMED");
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [busy,       setBusy]       = useState<number | null>(null);
  const [results,    setResults]    = useState<Record<number, any>>({});

  if (confirmed.length === 0) return null;

  const receive = async (po: any) => {
    const qty = parseInt(quantities[po.id] ?? String(po.quantity));
    if (!qty || qty <= 0) return;
    setBusy(po.id);
    const res = await deliverPO(po.id, qty);
    setResults(r => ({ ...r, [po.id]: res }));
    setBusy(null);
    onRefresh();
  };

  return (
    <div style={{ border: `1px solid ${T.info}30`, background: T.bgPanel, padding: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".2em" }}>
            {lang === "az" ? "G?L?N T?SLIMAT — ANBAR Q?BULU" : "INCOMING DELIVERY — WAREHOUSE RECEIPT"}
          </div>
          <div style={{ fontSize: 10, color: T.fg4, marginTop: 2 }}>
            {lang === "az" ? "Vendor sifarisi gönd?rdi — siz sayin, qeyd edin" : "Vendor shipped — count and record received quantity"}
          </div>
        </div>
        <span style={{ fontSize: 9, border: `1px solid ${T.info}40`, color: T.info, padding: "2px 8px", letterSpacing: ".1em", flexShrink: 0 }}>
          {confirmed.length} {lang === "az" ? "GÖZL?NIR" : "EXPECTED"}
        </span>
      </div>

      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {confirmed.map((po) => {
          const res    = results[po.id];
          const isDone = !!res;
          const isBusy = busy === po.id;
          const qtyVal = quantities[po.id] ?? String(po.quantity);
          const numQty = parseInt(qtyVal) || 0;
          const diff   = numQty - po.quantity;
          const matchC = diff === 0 ? T.ok : Math.abs(diff) <= Math.max(1, po.quantity * 0.05) ? T.warn : T.err;

          return (
            <div key={po.id} style={{
              border: `1px solid ${isDone ? T.ok + "50" : T.info + "30"}`,
              background: isDone ? `${T.ok}06` : T.bgElev,
              display: "flex", flexDirection: "column",
              transition: "border-color .15s",
            }}>
              {/* Product image — square top */}
              <div style={{
                width: "100%", aspectRatio: "1", background: "#0a0a0a",
                overflow: "hidden", position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {po.product?.image_url
                  ? <img
                      src={po.product.image_url}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:36px">??</span>';
                      }}
                    />
                  : <span style={{ fontSize: 36 }}>??</span>
                }
                {isDone && (
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,.55)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 32, color: T.ok }}>?</span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                {/* PO + vendor */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 8, color: T.greenDim, letterSpacing: ".1em" }}>PO-{String(po.id).padStart(4,"0")}</span>
                  <span style={{ fontSize: 8, color: T.info }}>{po.vendor_name}</span>
                </div>

                {/* Product name */}
                <div style={{
                  fontSize: 12, fontWeight: 700, color: T.fg1, lineHeight: 1.3,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {po.product_name}
                </div>

                {/* Store + ordered qty */}
                <div style={{ fontSize: 9, color: T.fg4 }}>
                  {po.store_name}
                </div>
                <div style={{ fontSize: 10, color: T.fg3 }}>
                  {lang === "az" ? "Sifaris" : "Ordered"}:{" "}
                  <b style={{ color: T.fg1, fontVariantNumeric: "tabular-nums" }}>{po.quantity} {lang === "az" ? "?d." : "u."}</b>
                  {po.expected_delivery && (
                    <span style={{ marginLeft: 6, color: T.info }}>
                      ETA {new Date(po.expected_delivery).toLocaleDateString("az-AZ", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>

                {/* 3-way match hint */}
                {!isDone && numQty > 0 && numQty !== po.quantity && (
                  <div style={{ fontSize: 9, color: matchC }}>
                    {diff > 0 ? `+${diff}` : `${diff}`} {Math.abs(diff) <= Math.max(1, po.quantity * 0.05)
                      ? (lang === "az" ? "tolerans ?" : "within tol. ?")
                      : (lang === "az" ? "? yoxlama lazim" : "? review")}
                  </div>
                )}

                {/* Done result */}
                {isDone && (
                  <div style={{ fontSize: 9, color: T.ok, lineHeight: 1.5 }}>
                    3-way: {res.match_status}<br />
                    {res.invoice_number} · ?{res.invoice_amount?.toFixed(0)}
                  </div>
                )}

                {/* Input + button */}
                {!isDone && (
                  <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", gap: 6, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 7, color: T.fg5, letterSpacing: ".12em", marginBottom: 3 }}>
                        {lang === "az" ? "G?L?N MIQDAR" : "RECEIVED QTY"}
                      </div>
                      <input
                        type="number"
                        value={qtyVal}
                        onChange={e => setQuantities(q => ({ ...q, [po.id]: e.target.value }))}
                        style={{
                          width: "100%", background: T.bgPanel,
                          border: `1px solid ${numQty !== po.quantity && numQty > 0 ? matchC : T.border2}`,
                          color: T.fg1, fontFamily: "inherit", fontSize: 16, fontWeight: 700,
                          padding: "7px 8px", textAlign: "center",
                        }}
                      />
                    </div>
                    <button
                      onClick={() => receive(po)}
                      disabled={isBusy || numQty <= 0}
                      style={{
                        fontFamily: "inherit", fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
                        padding: "0 12px", height: 36, border: `1px solid ${T.ok}`,
                        background: T.ok, color: "#000",
                        cursor: isBusy ? "not-allowed" : "pointer", flexShrink: 0,
                        marginBottom: 0,
                      }}
                    >
                      {isBusy ? "?" : "?"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Vendor Card --------------------------------------------------------
function VendorCard({ vendor, pos, lang, selected, onClick }: {
  vendor: any; pos: any[]; lang: string; selected: boolean; onClick: () => void;
}) {
  const myPOs    = pos.filter(p => p.vendor_name === vendor.name || p.vendor?.id === vendor.id);
  const newCount = myPOs.filter(p => ["SENT","PENDING"].includes(p.status)).length;
  const total    = myPOs.reduce((s: number, p: any) => s + (p.total_amount ?? 0), 0);
  const rel      = vendor.reliability_score ?? 90;
  const relC     = rel >= 90 ? T.ok : rel >= 75 ? T.warn : T.err;

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "inherit", textAlign: "left", cursor: "pointer",
        background: selected ? `${T.ok}08` : T.bgPanel,
        border: `1px solid ${selected ? T.ok : newCount > 0 ? T.warn + "60" : T.border2}`,
        padding: "20px 18px", position: "relative", transition: "border-color .12s, background .12s",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = T.ok + "80"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = newCount > 0 ? T.warn + "60" : T.border2; }}
    >
      {/* Badge */}
      {newCount > 0 && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: T.warn, color: "#000",
          fontSize: 9, fontWeight: 700, padding: "2px 7px", letterSpacing: ".08em",
        }}>
          {newCount} {lang === "az" ? "YENI" : "NEW"}
        </div>
      )}
      {selected && (
        <div style={{
          position: "absolute", top: 10, right: newCount > 0 ? 68 : 10,
          fontSize: 9, color: T.ok, border: `1px solid ${T.ok}40`, padding: "2px 7px",
        }}>? SEÇILDI</div>
      )}

      <div style={{ fontSize: 24, marginBottom: 10 }}>??</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.fg1, marginBottom: 3 }}>{vendor.name}</div>
      <div style={{ fontSize: 10, color: T.fg4, marginBottom: 12 }}>{vendor.category}</div>

      {/* Reliability bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 8, color: T.fg5, letterSpacing: ".1em" }}>{lang === "az" ? "ETIBARLILIQ" : "RELIABILITY"}</span>
          <span style={{ fontSize: 10, color: relC, fontWeight: 700 }}>{rel}%</span>
        </div>
        <div style={{ height: 3, background: T.bgElev, border: `1px solid ${T.border1}` }}>
          <div style={{ width: `${rel}%`, height: "100%", background: relC }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
        <div>
          <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>{lang === "az" ? "SIFARIS" : "ORDERS"}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.fg2, fontVariantNumeric: "tabular-nums" }}>{myPOs.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>{lang === "az" ? "TESLIMAT" : "LEAD"}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.fg2 }}>{vendor.lead_time_days}{lang === "az" ? "g" : "d"}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>? TOTAL</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ok, fontVariantNumeric: "tabular-nums" }}>{total > 0 ? total.toFixed(0) : "—"}</div>
        </div>
      </div>
    </button>
  );
}

// -- PO Card with product image -----------------------------------------
function POCard({ po, lang }: { po: any; lang: string }) {
  const sc = statusColor(po.status);
  const sl = STATUS_LABEL[po.status];
  const isNew = ["SENT","PENDING"].includes(po.status);

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "64px 1fr auto",
      gap: 14, alignItems: "center",
      padding: "14px 16px",
      border: `1px solid ${isNew ? T.warn + "40" : T.border1}`,
      background: isNew ? `${T.warn}04` : T.bgPanel,
      marginBottom: 8,
    }}>
      {/* Product image */}
      <div style={{
        width: 64, height: 64, background: T.bgElev,
        border: `1px solid ${T.border1}`, overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {po.product?.image_url
          ? <img src={po.product.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.style.fontSize = "24px"; (e.target as HTMLImageElement).parentElement!.textContent = "??"; }} />
          : <span style={{ fontSize: 24 }}>??</span>
        }
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".08em" }}>PO-{String(po.id).padStart(4,"0")}</span>
          <span style={{ fontSize: 9, color: T.fg5 }}>·</span>
          <span style={{ fontSize: 9, color: T.info }}>{po.vendor_name}</span>
          <span style={{ fontSize: 9, color: T.fg5 }}>·</span>
          <span style={{ fontSize: 9, color: T.fg4 }}>{po.store_name}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.fg1, marginBottom: 3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {po.product_name}
        </div>
        <div style={{ fontSize: 10, color: T.fg4 }}>
          {po.quantity} {lang === "az" ? "?d?d" : "units"} · ?{(po.total_amount ?? 0).toFixed(0)}
          {po.triggered_by === "Test Optimizer" && (
            <span style={{ marginLeft: 8, color: T.ok, fontSize: 9 }}>? Test Optimizer</span>
          )}
          {po.expected_delivery && (
            <span style={{ marginLeft: 8, color: T.info, fontSize: 9 }}>
              ETA: {new Date(po.expected_delivery).toLocaleDateString()}
            </span>
          )}
        </div>
        {po.invoice_number && (
          <div style={{ marginTop: 3, fontSize: 9, color: "#a78bfa" }}>
            {po.invoice_number} · ?{(po.invoice_amount ?? 0).toFixed(0)}
            {po.match_status && (
              <span style={{ marginLeft: 8, color: po.match_status === "EXACT" ? T.ok : T.warn }}>
                3-way: {po.match_status}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{
          fontSize: 9, border: `1px solid ${sc}40`, color: sc,
          padding: "3px 10px", letterSpacing: ".1em", whiteSpace: "nowrap", display: "block",
        }}>
          {sl?.[lang as "az"|"en"] ?? po.status}
        </span>
      </div>
    </div>
  );
}

// -- Main Page ---------------------------------------------------------
export default function SupplyChainPage() {
  const { lang } = useLanguage();
  const [tab, setTab]           = useState<Tab>("transfers");
  const [scData, setScData]     = useState<any>({ transfers: [], summary: {} });
  const [vendors, setVendors]   = useState<any[]>([]);
  const [pos, setPOs]           = useState<any[]>([]);
  const [summary, setSummary]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [execStatus, setExecStatus] = useState<Record<string, ExecStatus>>({});
  const [execToast,  setExecToast]  = useState<string | null>(null);
  const [replenishing, setReplenishing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [poStatusFilter, setPoStatusFilter] = useState<string>("ALL");

  const load = () =>
    Promise.all([fetchSupplyChain(), fetchVendors(), fetchVendorPurchaseOrders(), fetchVendorSummary()])
      .then(([sc, v, p, s]) => {
        setScData(sc ?? { transfers: [], summary: {} });
        setVendors(Array.isArray(v) ? v : []);
        setPOs(Array.isArray(p) ? p : []);
        setSummary(s);
      })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const transfers: any[] = scData.transfers ?? [];
  const scSummary: any   = scData.summary ?? {};

  // Filter POs by selected vendor + status
  const vendorFilteredPOs = selectedVendor
    ? pos.filter(p => p.vendor_name === selectedVendor || p.vendor?.name === selectedVendor)
    : pos;
  const filteredPOs = poStatusFilter === "ALL"
    ? vendorFilteredPOs
    : vendorFilteredPOs.filter(p => p.status === poStatusFilter);

  const execKey = (t: any, i: number) => `${t.from_store ?? i}-${t.to_store ?? i}-${t.product_name ?? i}`;

  const handleExec = (key: string) => {
    const cur = execStatus[key] ?? "pending";
    if (cur === "pending") {
      setExecStatus(p => ({ ...p, [key]: "confirming" }));
    } else if (cur === "confirming") {
      setExecStatus(p => ({ ...p, [key]: "executing" }));
      setTimeout(() => {
        setExecStatus(p => ({ ...p, [key]: "done" }));
        setExecToast(lang === "az" ? "Transfer icra edildi" : "Transfer executed");
        setTimeout(() => setExecToast(null), 3000);
      }, 800);
    }
  };
  const handleReject = (key: string) => setExecStatus(p => ({ ...p, [key]: "rejected" }));

  const doneCount      = Object.values(execStatus).filter(v => v === "done").length;
  const executedSaving = transfers
    .filter((t, i) => execStatus[execKey(t, i)] === "done")
    .reduce((s, t) => s + (t.estimated_saving ?? t.net_saving ?? 0), 0);

  const handleTrigger = async () => {
    setReplenishing(true);
    const res = await triggerReplenishment();
    setReplenishing(false);
    if (res?.created > 0) {
      setExecToast(lang === "az"
        ? `Test Optimizer ${res.created} yeni PO yaratdi ? Vendor Portal-a gönd?rildi`
        : `Test Optimizer created ${res.created} new POs ? Sent to Vendor Portal`);
      load();
    } else {
      setExecToast(lang === "az" ? "Aktiv kritik alert yoxdur" : "No active critical alerts");
    }
    setTimeout(() => setExecToast(null), 5000);
  };

  // Status counts for filter buttons
  const STATUS_FILTERS = ["ALL","SENT","CONFIRMED","INVOICED","PAID","REJECTED"];

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <AnimCard delay={0}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
          {lang === "az" ? "TECHIZAT Z?NCIRI" : "SUPPLY CHAIN OPS"}
        </div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, border: `1px solid ${T.ok}40`,   color: T.ok,   padding: "1px 7px", letterSpacing: ".12em" }}>TEST OPTIMIZER · GOOGLE</span>
          <span style={{ fontSize: 9, border: `1px solid ${T.info}40`, color: T.info, padding: "1px 7px", letterSpacing: ".12em" }}>Test · LINEAR PROGRAMMING</span>
          {!loading && <span style={{ fontSize: 9, border: `1px solid ${T.warn}40`, color: T.warn, padding: "1px 7px", letterSpacing: ".12em" }}>{summary?.automation_rate ?? 85}% AUTOMATED</span>}
          {doneCount > 0 && <span style={{ fontSize: 9, border: `1px solid ${T.ok}`, color: T.ok, padding: "1px 7px", letterSpacing: ".1em" }}>? {doneCount} TRANSFER · +?{executedSaving.toFixed(0)}</span>}
        </div>
      </AnimCard>

      {/* Toast */}
      {execToast && (
        <div style={{ border: `1px solid ${T.ok}`, background: `${T.ok}08`, padding: "8px 14px", fontSize: 10, color: T.ok, letterSpacing: ".1em" }}>
          ? {execToast}
        </div>
      )}

      {/* Tabs */}
      <FilterTabs active={tab} onChange={k => setTab(k as Tab)} tabs={[
        { key: "transfers", label: lang === "az" ? "TRANSFERL?r" : "TRANSFERS",        tone: "info" },
        { key: "vendors",   label: lang === "az" ? "VENDOR & T?SLIMAT" : "VENDORS & DELIVERY", tone: "warn" },
      ]} />

      {/* -- TRANSFERS TAB -- */}
      {tab === "transfers" && (
        <>
          {/* Replenishment trigger */}
          <div style={{ border: `1px solid ${T.warn}30`, background: `${T.warn}04`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, color: T.warn, letterSpacing: ".12em", fontWeight: 700 }}>?? TEST OPTIMIZER REPLENISHMENT</span>
            <span style={{ fontSize: 9, color: T.fg4 }}>
              {lang === "az" ? "Kritik stoklari tara ? PO yarat ? Vendor Portala gönd?r" : "Scan critical stock ? create PO ? send to Vendor Portal"}
            </span>
            <button onClick={handleTrigger} disabled={replenishing} style={{
              marginLeft: "auto", fontFamily: "inherit", fontSize: 9, letterSpacing: ".14em", fontWeight: 700,
              padding: "5px 16px", border: `1px solid ${T.warn}`,
              color: replenishing ? T.fg5 : "#000", background: replenishing ? "transparent" : T.warn,
              cursor: replenishing ? "not-allowed" : "pointer",
            }}>
              {replenishing ? "? RUNNING..." : (lang === "az" ? "? BASLAT" : "? TRIGGER")}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            <KpiBox id="TR-01" label={lang === "az" ? "TRANSFER SAYI" : "TOTAL TRANSFERS"} value={String(transfers.length)}         sub="TEST OPTIMIZER OPTIMIZED" tone="info" />
            <KpiBox id="TR-02" label={lang === "az" ? "C?MI TASARRUF" : "TOTAL SAVING"}    value={`?${(scSummary.total_saving ?? 0).toFixed(0)}`}             sub="NET BENEFIT"        tone="ok"   />
            <KpiBox id="TR-03" label={lang === "az" ? "ICRA EDILDI"   : "EXECUTED"}         value={String(doneCount)}                sub={`?${executedSaving.toFixed(0)} SAVED`} tone={doneCount > 0 ? "ok" : "info"} />
            <KpiBox id="TR-04" label="TEST OPTIMIZER"                                              value={scData.solver_used ?? "Test"}     sub={scData.optimization_status ?? "OPTIMAL"} tone="ok" />
          </div>

          <Panel id="TRF-01" title={lang === "az" ? "OPTIMAL TRANSFER TÖVSIY?L?RI" : "OPTIMAL TRANSFER RECOMMENDATIONS"} right="TEST OPTIMIZER Test">
            {loading ? (
              <div style={{ color: T.fg4, fontSize: 11, padding: "20px 0" }}>RUNNING TEST OPTIMIZER OPTIMIZER...</div>
            ) : transfers.length === 0 ? (
              <div style={{ color: T.fg4, fontSize: 11, padding: "20px 0" }}>{lang === "az" ? "Transfer tövsiy?si yoxdur." : "No transfer recommendations."}</div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
                  <thead>
                    <tr style={{ background: T.bgElev }}>
                      {[lang==="az"?"M?NB?":"FROM", lang==="az"?"H?D?F":"TO", lang==="az"?"M?HSUL":"PRODUCT",
                        lang==="az"?"?D.":"UNITS", lang==="az"?"TASARRUF":"SAVING",
                        lang==="az"?"PRIORITET":"PRIORITY", lang==="az"?"?M?LIYYAT":"ACTION"].map((h, i) => (
                        <th key={i} style={{ padding: "8px 10px", fontSize: 9, color: T.greenDim, letterSpacing: ".14em", textAlign: "left", borderBottom: `1px solid ${T.border2}`, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((t: any, i: number) => {
                      const key = execKey(t, i);
                      return <TransferRow key={key} t={t} lang={lang} status={execStatus[key] ?? "pending"} onExec={() => handleExec(key)} onReject={() => handleReject(key)} />;
                    })}
                  </tbody>
                </table>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border1}`, display: "flex", gap: 20, fontSize: 10 }}>
                  <span style={{ color: T.fg4 }}>{lang === "az" ? "Gözl?nir:" : "Pending:"} <b style={{ color: T.warn }}>{transfers.filter((_, i) => (execStatus[execKey(_, i)] ?? "pending") === "pending").length}</b></span>
                  <span style={{ color: T.fg4 }}>{lang === "az" ? "Icra edildi:" : "Executed:"} <b style={{ color: T.ok }}>{doneCount}</b></span>
                  <span style={{ color: T.fg4 }}>{lang === "az" ? "Qorunan:" : "Saved:"} <b style={{ color: T.ok }}>?{executedSaving.toFixed(0)}</b></span>
                </div>
              </>
            )}
          </Panel>
        </>
      )}

      {/* -- VENDORS TAB -- */}
      {tab === "vendors" && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            <KpiBox id="VND-01" label="TEST OPTIMIZER TRIGGERED" value={`${(summary?.ortools_triggered_pct ?? 85).toFixed(0)}%`} sub="PO AUTOMATION"       tone="ok" />
            <KpiBox id="VND-02" label="AUTOMATION RATE"    value={`${(summary?.automation_rate ?? 85).toFixed(0)}%`}       sub="AVG ACROSS VENDORS" tone="ok" />
            <KpiBox id="VND-03" label="AVG RELIABILITY"    value={`${(summary?.avg_vendor_reliability ?? 94).toFixed(0)}%`} sub="VENDOR SCORE"       tone="ok" />
          </div>

          {/* Vendor Cards */}
          <div>
            <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".2em", marginBottom: 10 }}>
              {lang === "az" ? "TEDARIKÇI SEÇIN · FILTRL?YIN" : "SELECT VENDOR · FILTER ORDERS"}
              {selectedVendor && (
                <button onClick={() => setSelectedVendor(null)} style={{
                  marginLeft: 12, fontFamily: "inherit", fontSize: 9, padding: "2px 8px",
                  border: `1px solid ${T.border2}`, color: T.fg4, background: "transparent", cursor: "pointer",
                }}>× {lang === "az" ? "hamisi" : "clear"}</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ border: `1px solid ${T.border1}`, background: T.bgPanel, height: 170, opacity: 0.4 }} />
                  ))
                : vendors.map((v: any) => (
                    <VendorCard
                      key={v.id}
                      vendor={v}
                      pos={pos}
                      lang={lang}
                      selected={selectedVendor === v.name}
                      onClick={() => setSelectedVendor(selectedVendor === v.name ? null : v.name)}
                    />
                  ))
              }
            </div>
          </div>

          {/* Delivery Receipt Panel */}
          {!loading && (
            <DeliveryReceiptPanel
              pos={selectedVendor ? vendorFilteredPOs : pos}
              lang={lang}
              onRefresh={load}
            />
          )}

          {/* PO Status Filter */}
          <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border1}` }}>
            {STATUS_FILTERS.map((s, i, arr) => {
              const count = s === "ALL" ? vendorFilteredPOs.length : vendorFilteredPOs.filter((p: any) => p.status === s).length;
              return (
                <button key={s} onClick={() => setPoStatusFilter(s)} style={{
                  flex: 1, padding: "7px 4px", fontFamily: "inherit", fontSize: 8, letterSpacing: ".06em",
                  background: poStatusFilter === s ? T.bgActive : "transparent",
                  border: "none", borderRight: i < arr.length - 1 ? `1px solid ${T.border1}` : "none",
                  borderBottom: poStatusFilter === s ? `2px solid ${T.ok}` : "2px solid transparent",
                  color: poStatusFilter === s ? T.ok : T.fg4, cursor: "pointer",
                }}>
                  {s}<br />
                  <span style={{ fontSize: 8, color: poStatusFilter === s ? T.ok : T.fg5 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* PO Cards with product images */}
          {loading ? (
            <div style={{ color: T.fg4, fontSize: 11, padding: "20px 0" }}>LOADING...</div>
          ) : filteredPOs.length === 0 ? (
            <div style={{ color: T.fg4, fontSize: 11, padding: "20px 0", textAlign: "center",
              border: `1px solid ${T.border1}`, background: T.bgPanel }}>
              {lang === "az" ? "Sifaris tapilmadi." : "No orders found."}
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".14em", marginBottom: 10 }}>
                PURCHASE ORDERS · {filteredPOs.length}
                {selectedVendor && <span style={{ color: T.warn, marginLeft: 8 }}>— {selectedVendor}</span>}
              </div>
              {filteredPOs.slice(0, 30).map((po: any) => (
                <POCard key={po.id} po={po} lang={lang} />
              ))}
              {filteredPOs.length > 30 && (
                <div style={{ fontSize: 10, color: T.fg5, textAlign: "center", padding: "12px 0" }}>
                  +{filteredPOs.length - 30} {lang === "az" ? "daha" : "more"}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
