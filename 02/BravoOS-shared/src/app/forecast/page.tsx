"use client";
import { useEffect, useState } from "react";
import { fetchDemandForecast, fetchOrderRecommendations } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, AnimCard, T } from "@/components/BravoUI";

const CATEGORIES = ["Süd m?hsullari","?t v? qus ?ti","Çör?k m?mulatlari","Meyv?-t?r?v?z","Sirniyyat"];

// -- Forecast Chart ------------------------------------------------
function ForecastChart({ historical, forecast, holidays }: {
  historical: any[]; forecast: any[]; holidays: any[];
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const histVals = historical.map((d: any) => d.qty ?? d.actual ?? 0);
  const foreVals = forecast.map((d: any) => d.qty ?? d.predicted ?? 0);
  const upperVals = forecast.map((d: any) => d.upper ?? (d.qty ?? 0) * 1.15);
  const lowerVals = forecast.map((d: any) => d.lower ?? (d.qty ?? 0) * 0.85);

  const all = [...histVals, ...foreVals, ...upperVals];
  if (!all.length) return null;

  const max = Math.max(...all) * 1.05;
  const min = Math.max(0, Math.min(...[...histVals, ...lowerVals]) * 0.9);
  const W = 1100, H = 200, pad = 14;
  const total = historical.length + forecast.length;
  const stepX = (W - pad * 2) / Math.max(total - 1, 1);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2);
  const divX = pad + (historical.length - 1) * stepX;

  // Points
  const histPts = historical.map((d: any, i: number) => `${pad + i * stepX},${y(d.qty ?? d.actual ?? 0)}`).join(" ");
  const forePts = forecast.map((d: any, i: number) => `${divX + (i + 1) * stepX},${y(d.qty ?? 0)}`).join(" ");

  // Confidence band polygon
  const upperPts = forecast.map((d: any, i: number) => `${divX + (i + 1) * stepX},${y(upperVals[i])}`);
  const lowerPtsRev = forecast.map((d: any, i: number) => `${divX + (forecast.length - i) * stepX},${y(lowerVals[forecast.length - 1 - i])}`);
  const bandPoly = [
    `${divX},${y(foreVals[0] ?? 0)}`,
    ...upperPts,
    ...lowerPtsRev,
    `${divX},${y(foreVals[0] ?? 0)}`,
  ].join(" ");

  // Holiday date ? x position
  const holidaySet = new Set(holidays.map((h: any) => h.date));
  const forecastHolidays = forecast
    .map((d: any, i: number) => ({ ...d, x: divX + (i + 1) * stepX }))
    .filter((d: any) => d.is_holiday || holidaySet.has(d.date));

  const ticks = [0, 10, 20, 30, 40, 50, 60]
    .filter(t => t < total)
    .map(t => ({ x: pad + t * stepX, label: `D${String(t).padStart(2,"0")}` }));

  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      <svg
        viewBox={`0 0 ${W} ${H + 24}`}
        preserveAspectRatio="none"
        style={{ width: "100%", display: "block", height: 250 }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(p => (
          <line key={p} x1={pad} x2={W - pad}
            y1={pad + (H - pad * 2) * p} y2={pad + (H - pad * 2) * p}
            stroke={T.border1} strokeDasharray="2 4" />
        ))}

        {/* Holiday vertical markers */}
        {forecastHolidays.map((d: any, i: number) => {
          const hol = holidays.find((h: any) => h.date === d.date);
          return (
            <g key={i}>
              <line x1={d.x} x2={d.x} y1={pad} y2={H - pad}
                stroke="#fbbf24" strokeOpacity="0.5" strokeDasharray="4 3" strokeWidth="1.5" />
              <text x={d.x + 4} y={pad + 10} fontSize="7" fill="#fbbf24"
                fontFamily={T.font} letterSpacing=".1em" opacity="0.8">
                {hol ? (hol.name_en ?? hol.name ?? "HOL").split(" ")[0].toUpperCase() : "HOL"}
              </text>
            </g>
          );
        })}

        {/* Confidence band */}
        {forecast.length > 0 && (
          <polygon points={bandPoly} fill={T.ok} opacity="0.06" />
        )}

        {/* Upper / lower dashed borders */}
        {upperPts.length > 0 && (
          <polyline
            points={[`${divX},${y(foreVals[0] ?? 0)}`, ...upperPts].join(" ")}
            fill="none" stroke={T.ok} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.35"
          />
        )}
        {lowerPtsRev.length > 0 && (
          <polyline
            points={forecast.map((d: any, i: number) => `${divX + (i + 1) * stepX},${y(lowerVals[i])}`).join(" ")}
            fill="none" stroke={T.ok} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.35"
          />
        )}

        {/* NOW divider */}
        <line x1={divX} x2={divX} y1={pad} y2={H - pad}
          stroke={T.ok} strokeOpacity="0.35" strokeDasharray="3 3" />
        <text x={divX + 5} y={pad + 12} fontSize="9" fill={T.ok}
          fontFamily={T.font} letterSpacing=".16em">NOW ?</text>

        {/* Historical line */}
        {histPts && (
          <polyline points={histPts} fill="none" stroke={T.fg3} strokeWidth="1.5" />
        )}

        {/* Forecast line */}
        {forePts && (
          <polyline points={forePts} fill="none" stroke={T.ok} strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 4px rgba(0,255,65,0.5))" }} />
        )}

        {/* X-axis ticks */}
        {ticks.map(t => (
          <text key={t.label} x={t.x} y={H + 16} fontSize="8" fill={T.fg5}
            textAnchor="middle" fontFamily={T.font} letterSpacing=".1em">{t.label}</text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 10, color: T.fg4, letterSpacing: ".1em", flexWrap: "wrap" }}>
        <span>
          <span style={{ display: "inline-block", width: 14, height: 2, background: T.fg3, verticalAlign: "middle", marginRight: 6 }} />
          HISTORICAL
        </span>
        <span>
          <span style={{ display: "inline-block", width: 14, height: 2, background: T.ok, verticalAlign: "middle", marginRight: 6, boxShadow: `0 0 4px ${T.ok}` }} />
          FORECAST
        </span>
        <span style={{ color: "#fbbf2480" }}>
          <span style={{ display: "inline-block", width: 14, height: 2, background: "#fbbf24", verticalAlign: "middle", marginRight: 6, opacity: 0.5 }} />
          HOLIDAYS
        </span>
        <span>
          <span style={{ display: "inline-block", width: 14, height: 8, background: `${T.ok}20`, border: `1px solid ${T.ok}40`, verticalAlign: "middle", marginRight: 6 }} />
          CONFIDENCE BAND
        </span>
      </div>

      {/* Upcoming holiday list */}
      {holidays.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {holidays.map((h: any, i: number) => (
            <span key={i} style={{ fontSize: 8, border: "1px solid #fbbf2440", color: "#fbbf24", padding: "1px 8px", letterSpacing: ".1em" }}>
              {h.date?.slice(5)} · {h.name_en ?? h.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Order Card ----------------------------------------------------
function OrderCard({ o, lang, onApprove, onReject, status }: {
  o: any; lang: string;
  onApprove: () => void; onReject: () => void;
  status: "pending" | "approved" | "rejected";
}) {
  const isDiscount = o.discount?.should_discount;
  const margin = o.gross_margin_pct;
  const marginColor = margin == null ? T.fg4 : margin > 30 ? T.ok : margin > 15 ? T.warn : T.err;
  const riskColor = o.risk_level === "CRITICAL" ? T.err : T.warn;
  const daysLeft = o.days_until_expiry ?? 0;

  return (
    <div style={{
      border: `1px solid ${status === "approved" ? T.ok + "60" : status === "rejected" ? T.fg5 + "40" : T.border1}`,
      background: status === "approved" ? `${T.ok}06` : status === "rejected" ? "rgba(255,255,255,0.01)" : T.bgPanel,
      padding: 14, display: "flex", flexDirection: "column", gap: 10,
      opacity: status === "rejected" ? 0.5 : 1,
      transition: "all .15s",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.fg1, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {o.product_name}
          </div>
          <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".08em" }}>
            {o.store_name} · {o.product_category}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 8, border: `1px solid ${riskColor}`, color: riskColor, padding: "2px 6px", letterSpacing: ".1em", fontWeight: 700 }}>{o.risk_level}</span>
          {margin != null && (
            <span style={{ fontSize: 8, border: `1px solid ${marginColor}50`, color: marginColor, padding: "2px 6px", letterSpacing: ".08em" }}>
              %{margin} {lang === "az" ? "MARJA" : "MARGIN"}
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        {[
          { label: lang === "az" ? "CARI STOK" : "STOCK",       value: String(o.current_stock ?? 0),                    color: T.fg2  },
          { label: lang === "az" ? "GÜNLÜK SATIS" : "DAILY SALES",  value: `${(o.avg_daily_sales ?? 0).toFixed(1)}/g`,       color: T.fg2  },
          { label: lang === "az" ? "SON TARIX" : "EXPIRES IN",   value: `${daysLeft}g`,                                  color: daysLeft < 5 ? T.err : daysLeft < 10 ? T.warn : T.fg2 },
          { label: lang === "az" ? "ITKI RISKI" : "LOSS RISK",   value: `?${(o.potential_loss ?? 0).toFixed(0)}`,        color: T.warn },
        ].map((m, i) => (
          <div key={i} style={{ background: T.bgElev, padding: "6px 8px" }}>
            <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".1em", marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Smart Discount decision */}
      <div style={{
        padding: "8px 12px",
        border: `1px solid ${isDiscount ? T.warn + "50" : T.ok + "40"}`,
        background: isDiscount ? `${T.warn}08` : `${T.ok}06`,
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <span style={{ fontSize: 13, flexShrink: 0 }}>{isDiscount ? "??" : "?"}</span>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: isDiscount ? T.warn : T.ok, letterSpacing: ".1em", marginBottom: 2 }}>
            {isDiscount
              ? (lang === "az" ? "ENDIRIM TÖVSIY?SI" : "DISCOUNT RECOMMENDED")
              : (lang === "az" ? "SMART: ENDIRIMSIZ SAT" : "SMART: SELLS NATURALLY")}
          </div>
          <div style={{ fontSize: 10, color: T.fg3, lineHeight: 1.5 }}>
            {lang === "az" ? o.reason : o.reason_en}
          </div>
          {o.order?.recommended_order > 0 && (
            <div style={{ marginTop: 4, fontSize: 10, color: T.info }}>
              {lang === "az" ? "Tövsiy? edil?n siparis:" : "Recommended order:"}{" "}
              <span style={{ fontWeight: 700, color: T.fg1 }}>+{o.order.recommended_order} {lang === "az" ? "vahid" : "units"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {status === "pending" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={onApprove} style={{
            fontFamily: "inherit", fontSize: 9, letterSpacing: ".14em", fontWeight: 700,
            padding: "8px 0", border: `1px solid ${T.ok}`, color: "#000",
            background: T.ok, cursor: "pointer", textTransform: "uppercase",
          }}>
            ? {lang === "az" ? "ONAYLA" : "APPROVE"}
          </button>
          <button onClick={onReject} style={{
            fontFamily: "inherit", fontSize: 9, letterSpacing: ".14em",
            padding: "8px 0", border: `1px solid ${T.border2}`, color: T.fg4,
            background: "transparent", cursor: "pointer", textTransform: "uppercase",
          }}>
            ? {lang === "az" ? "R?D ET" : "REJECT"}
          </button>
        </div>
      )}
      {status === "approved" && (
        <div style={{ fontSize: 10, color: T.ok, letterSpacing: ".12em", textAlign: "center", padding: "6px 0" }}>
          ? {lang === "az" ? "ONAYLANDI — Tedarikçiy? gönd?rildi" : "APPROVED — Sent to vendor"}
        </div>
      )}
      {status === "rejected" && (
        <div style={{ fontSize: 10, color: T.fg5, letterSpacing: ".12em", textAlign: "center", padding: "6px 0" }}>
          {lang === "az" ? "R?d edildi" : "Rejected"}
        </div>
      )}
    </div>
  );
}

// -- Main Page -----------------------------------------------------
export default function ForecastPage() {
  const { lang } = useLanguage();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [demand, setDemand]     = useState<any>(null);
  const [orders, setOrders]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [orderStatus, setOrderStatus] = useState<Record<string, "pending" | "approved" | "rejected">>({});
  const [showAll, setShowAll]   = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDemandForecast(category), fetchOrderRecommendations()])
      .then(([d, o]) => { setDemand(d); setOrders(Array.isArray(o) ? o : []); })
      .finally(() => setLoading(false));
  }, [category]);

  const holidays   = demand?.holidays ?? [];
  const historical = demand?.historical ?? [];
  const forecast   = demand?.forecast ?? [];
  const trend      = demand?.trend_pct ?? demand?.stats?.trend_pct ?? 0;
  const trendUp    = trend >= 0;

  const approvedCount = Object.values(orderStatus).filter(v => v === "approved").length;
  const rejectedCount = Object.values(orderStatus).filter(v => v === "rejected").length;
  const pendingOrders = orders.filter(o => {
    const k = `${o.product_name}-${o.store_name}`;
    return (orderStatus[k] ?? "pending") === "pending";
  });

  const visibleOrders = showAll ? orders : orders.slice(0, 8);

  return (
    <div className="bos-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <AnimCard delay={0}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
          {lang === "az" ? "T?L?B · TEST MODEL MODELI" : "DEMAND · TEST MODEL MODEL"}
        </div>
        <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, border: `1px solid ${T.ok}40`, color: T.ok, padding: "1px 7px", letterSpacing: ".12em" }}>TEST MODEL · TEST AI</span>
          <span style={{ fontSize: 9, border: "1px solid #fbbf2440", color: "#fbbf24", padding: "1px 7px", letterSpacing: ".12em" }}>AZ TATIL MARKERL?RI</span>
          <span style={{ fontSize: 9, border: `1px solid ${T.info}40`, color: T.info, padding: "1px 7px", letterSpacing: ".12em" }}>CONFIDENCE BAND</span>
          {approvedCount > 0 && <span style={{ fontSize: 9, border: `1px solid ${T.ok}50`, color: T.ok, padding: "1px 7px", letterSpacing: ".1em" }}>? {approvedCount} {lang === "az" ? "ONAYLANDI" : "APPROVED"}</span>}
        </div>
      </AnimCard>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border1}` }}>
        {CATEGORIES.map((cat, i) => {
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              flex: 1, padding: "8px 10px",
              background: active ? T.bgActive : "transparent",
              border: "none",
              borderRight: i < CATEGORIES.length - 1 ? `1px solid ${T.border1}` : "none",
              borderBottom: active ? `2px solid ${T.ok}` : "2px solid transparent",
              color: active ? T.ok : T.fg3,
              fontFamily: "inherit", fontSize: 10, letterSpacing: ".1em",
              cursor: "pointer", textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              {cat.split(" ")[0].toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <Panel
        id="FRC-01"
        title={lang === "az" ? "T?L?B · 60 GÜNLÜK P?NC?R?" : "DEMAND · 60-DAY WINDOW"}
        right={loading ? "LOADING..." : `MODEL: ${demand?.model_used ?? "TEST MODEL"}${demand?.rmse != null ? ` · RMSE ${demand.rmse.toFixed(1)}%` : ""}`}
      >
        {loading ? (
          <div style={{ color: T.fg4, fontSize: 11, padding: "40px 0", textAlign: "center", letterSpacing: ".1em" }}>
            RUNNING TEST MODEL MODEL...
          </div>
        ) : demand ? (
          <ForecastChart historical={historical} forecast={forecast} holidays={holidays} />
        ) : null}
      </Panel>

      {/* KPI metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <KpiBox
          id="MET-01"
          label={lang === "az" ? "ORTA GÜNLÜK" : "AVG DAILY · ALL SKU"}
          value={demand?.stats?.avg_daily_qty != null
            ? demand.stats.avg_daily_qty.toFixed(1)
            : demand?.avg_daily != null
              ? demand.avg_daily.toFixed(1)
              : "—"}
          sub="UNITS · ROLLING 30D"
        />
        <KpiBox
          id="MET-02"
          label={lang === "az" ? "TREND · 30G" : "TREND · 30D"}
          value={`${trend >= 0 ? "+" : ""}${Number(trend).toFixed(0)}%`}
          sub="VS LAST 30D"
          tone={trendUp ? "ok" : "err"}
        />
        <KpiBox
          id="MET-03"
          label={lang === "az" ? "30G PROQNOZ" : "30D FORECAST"}
          value={demand?.stats?.forecast_30d_total != null
            ? String(Math.round(demand.stats.forecast_30d_total))
            : demand?.total_forecast != null
              ? String(Math.round(demand.total_forecast))
              : "—"}
          sub="UNITS · ALL SKU"
        />
        <KpiBox
          id="MET-04"
          label={lang === "az" ? "TATIL T?SIRI" : "HOLIDAY UPLIFT"}
          value={demand?.holiday_impact != null
            ? `+${Number(demand.holiday_impact).toFixed(0)}%`
            : "—"}
          sub={holidays.length > 0
            ? (lang === "az" ? `${holidays.length} TATIL · ASKARLANDI` : `${holidays.length} HOLIDAYS DETECTED`)
            : (lang === "az" ? "TATIL MARKERL?RI" : "HOLIDAY MARKERS")}
          tone={demand?.holiday_impact != null ? "warn" : undefined}
        />
      </div>

      {/* Order recommendations */}
      <Panel
        id="ORD-01"
        title={lang === "az" ? "SMART SIPARIS TÖVSIY?L?RI" : "SMART ORDER RECOMMENDATIONS"}
        right={`${pendingOrders.length} ${lang === "az" ? "GÖZL?NIR" : "PENDING"} · ${approvedCount} ${lang === "az" ? "ONAYLANDI" : "APPROVED"}`}
      >
        {/* Summary bar */}
        {orders.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginBottom: 12, padding: "8px 12px", background: T.bgElev, border: `1px solid ${T.border1}` }}>
            <span style={{ fontSize: 10, color: T.fg3 }}>{lang === "az" ? "Toplam:" : "Total:"} <span style={{ color: T.fg1, fontWeight: 700 }}>{orders.length}</span></span>
            <span style={{ fontSize: 10, color: T.fg3 }}>{lang === "az" ? "Gözl?nir:" : "Pending:"} <span style={{ color: T.warn, fontWeight: 700 }}>{pendingOrders.length}</span></span>
            <span style={{ fontSize: 10, color: T.fg3 }}>{lang === "az" ? "Onaylandi:" : "Approved:"} <span style={{ color: T.ok, fontWeight: 700 }}>{approvedCount}</span></span>
            {rejectedCount > 0 && <span style={{ fontSize: 10, color: T.fg3 }}>{lang === "az" ? "R?d:" : "Rejected:"} <span style={{ color: T.fg5, fontWeight: 700 }}>{rejectedCount}</span></span>}
            <span style={{ marginLeft: "auto", fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>
              {lang === "az" ? "SISTEM TÖVSIY? EDIR — MÜDIR ONAYLI" : "AI RECOMMENDS — MANAGER APPROVES"}
            </span>
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ color: T.fg4, fontSize: 11, padding: "20px 0" }}>
            {lang === "az" ? "Aktiv siparis tövsiy?si yoxdur." : "No active order recommendations."}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {visibleOrders.map((o: any, i: number) => {
                const k = `${o.product_name}-${o.store_name}`;
                return (
                  <OrderCard
                    key={i}
                    o={o}
                    lang={lang}
                    status={orderStatus[k] ?? "pending"}
                    onApprove={() => setOrderStatus(prev => ({ ...prev, [k]: "approved" }))}
                    onReject={()  => setOrderStatus(prev => ({ ...prev, [k]: "rejected" }))}
                  />
                );
              })}
            </div>

            {orders.length > 8 && (
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  marginTop: 10, width: "100%", fontFamily: "inherit", fontSize: 9,
                  letterSpacing: ".14em", padding: "8px 0", border: `1px solid ${T.border2}`,
                  color: T.fg3, background: "transparent", cursor: "pointer",
                }}
              >
                {showAll
                  ? (lang === "az" ? "? DAHA AZ GÖST?R" : "? SHOW LESS")
                  : `? ${lang === "az" ? "HAMISINI GÖST?R" : "SHOW ALL"} (${orders.length})`}
              </button>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}
