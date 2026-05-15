"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchKPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Panel, KpiBox, T } from "@/components/BravoUI";

const API = ""; // proxied via next.config.ts rewrites ? localhost:8000

// --- animated counter -----------------------------------------
function useCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    setValue(0);
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * ease));
      if (progress >= 1) { setValue(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return value;
}

const MONTHS_AZ = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avq","Sep","Okt","Noy","Dek"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const WASTE_BEFORE = [48200,47800,49100,48600,50200,47900,48800,49300,47600,48100,49500,48200];
const WASTE_AFTER  = [48200,38400,28600,19200,13400,10200,9100,8700,8400,8300,8200,8164];

interface CityOverview {
  city_total_sales: number;
  city_total_waste_prevented: number;
  city_co2_saved: number;
  city_active_discounts: number;
  city_transfers_executed: number;
  store_count: number;
  cohort_count: number;
  total_population: number;
  tick_number: number;
}
interface StoreData {
  id: number; name: string; district: string;
  lat: number; lng: number; size_sqm: number;
  daily_customers: number; monthly_revenue: number;
  waste_before: number; waste_after: number; waste_reduction_pct: number;
}
interface PurchaseEvent {
  id: number; cohort_name: string; store_name: string;
  product_category: string; amount: number;
  was_discounted: boolean; waste_prevented: boolean; created_at: string;
}
interface DistrictData {
  district: string; store_count: number;
  total_monthly_revenue: number; waste_reduction_pct: number;
  total_waste_before: number; total_waste_after: number;
}

// --- Test Map Map ----------------------------------------------
function CityMap({ stores, lang }: { stores: StoreData[]; lang: string }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return;

    let map: any = null;
    let cancelled = false;
    let scrollEnableTimer: ReturnType<typeof setTimeout> | null = null;
    let invalidateSizeTimer: ReturnType<typeof setTimeout> | null = null;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const container = mapRef.current as any;
      if (container._leaflet_id) { delete container._leaflet_id; }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(container, {
        center: [40.4050, 49.8700],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
        zoomAnimation: false,
      });

      scrollEnableTimer = setTimeout(() => {
        if (map && !cancelled) map.scrollWheelZoom.enable();
      }, 500);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      const storeIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:10px;height:10px;border-radius:50%;
          background:#00ff41;border:2px solid #000;
          box-shadow:0 0 10px #00ff41;
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      stores.forEach((store) => {
        const marker = L.marker([store.lat, store.lng], { icon: storeIcon }).addTo(map);
        marker.bindPopup(`
          <div style="color:#111;font-size:12px;min-width:190px;line-height:1.6;font-family:monospace">
            <b style="font-size:13px">${store.name}</b><br/>
            ${store.district}<br/>
            ${store.daily_customers.toLocaleString()} ${lang === "az" ? "günd?lik müst?ri" : "daily customers"}<br/>
            ?${Math.round(store.monthly_revenue).toLocaleString()} / ${lang === "az" ? "ay" : "mo"}<br/>
            ${store.waste_reduction_pct}% ${lang === "az" ? "israf azaldi" : "waste reduced"}
          </div>
        `);
      });

      invalidateSizeTimer = setTimeout(() => {
        if (map && !cancelled) map.invalidateSize();
      }, 150);
    });

    return () => {
      cancelled = true;
      if (scrollEnableTimer)   clearTimeout(scrollEnableTimer);
      if (invalidateSizeTimer) clearTimeout(invalidateSizeTimer);
      if (map) {
        try { map.scrollWheelZoom.disable(); } catch (_) {}
        try { map.stop(); } catch (_) {}
        try { map.remove(); } catch (_) {}
        map = null;
      }
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [stores, lang]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "420px", background: T.bgPanel }} />
  );
}

// --- Main Page ------------------------------------------------
export default function TestCityPage() {
  const { t, lang } = useLanguage();
  const [animated, setAnimated] = useState(false);
  const [kpi, setKpi] = useState<any>(null);
  const [cityOverview, setCityOverview] = useState<CityOverview | null>(null);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [feed, setFeed] = useState<PurchaseEvent[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [newEventIds, setNewEventIds] = useState<Set<number>>(new Set());
  const feedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCityData = useCallback(async () => {
    try {
      const [ovRes, stRes, feedRes, distRes] = await Promise.all([
        fetch(`${API}/api/city/overview`),
        fetch(`${API}/api/city/stores`),
        fetch(`${API}/api/city/live-feed?limit=15`),
        fetch(`${API}/api/city/districts`),
      ]);
      if (ovRes.ok)   setCityOverview(await ovRes.json());
      if (stRes.ok)   setStores(await stRes.json());
      if (feedRes.ok) {
        const newFeed: PurchaseEvent[] = await feedRes.json();
        setFeed((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const fresh = newFeed.filter((e) => !existingIds.has(e.id));
          if (fresh.length > 0) {
            setNewEventIds(new Set(fresh.map((e) => e.id)));
            setTimeout(() => setNewEventIds(new Set()), 2000);
          }
          return newFeed;
        });
      }
      if (distRes.ok) setDistricts(await distRes.json());
    } catch (_) {}
    finally { setCityLoading(false); }
  }, []);

  const advanceTick = useCallback(async () => {
    try { await fetch(`${API}/api/city/advance-tick`, { method: "POST" }); fetchCityData(); } catch (_) {}
  }, [fetchCityData]);

  useEffect(() => {
    fetchKPI().then(setKpi);
    const timer = setTimeout(() => setAnimated(true), 300);
    fetchCityData();
    feedIntervalRef.current = setInterval(fetchCityData, 8000);
    tickIntervalRef.current = setInterval(advanceTick, 15000);
    return () => {
      clearTimeout(timer);
      if (feedIntervalRef.current) clearInterval(feedIntervalRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [fetchCityData, advanceTick]);

  const savedMonth  = useCounter(39_636, 2200, animated);
  const savedYear   = useCounter(482_880, 2500, animated);
  const wasteAfter  = useCounter(8164,   2000, animated);
  const wasteBefore = useCounter(48200,  2000, animated);
  const reactionBef = useCounter(55,     1800, animated);
  const reactionAft = useCounter(4,      1800, animated);
  const roi         = useCounter(2012,   2500, animated);

  const cityTotal = useCounter(Math.round(cityOverview?.city_total_sales ?? 0), 1500, animated && !!cityOverview);
  const cityWaste = useCounter(Math.round(cityOverview?.city_total_waste_prevented ?? 0), 1500, animated && !!cityOverview);
  const cityCo2   = useCounter(Math.round(cityOverview?.city_co2_saved ?? 0), 1500, animated && !!cityOverview);
  const cityDisc  = useCounter(cityOverview?.city_active_discounts ?? 0, 1000, animated && !!cityOverview);

  const maxWaste = Math.max(...WASTE_BEFORE);
  const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_AZ;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* --- Header --- */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase" }}>
            {lang === "az" ? "TEST CITY LOGISTIKA HARIT?SI" : "TEST CITY LOGISTICS MAP"}
          </div>
          <span style={{ fontSize: 9, border: "1px solid #00bfa540", color: "#00bfa5", padding: "1px 7px", letterSpacing: ".12em" }}>TEST MAP · TEST SYSTEM</span>
        </div>
        <div style={{ fontSize: 11, color: T.fg3, letterSpacing: ".08em", marginTop: 4 }}>
          {lang === "az" ? "10 Test filiali · Canli simulyasiya · Real-time waste tracking" : "10 Test branches · Live simulation · Real-time waste tracking"}
        </div>
      </div>

      {/* --- City KPI row --- */}
      {cityOverview && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          <KpiBox id="BC-01" label={lang === "az" ? "S?H?RCIK SATISI" : "CITY SALES"} value={`?${cityTotal.toLocaleString()}`} sub={`${cityOverview.store_count} BRANCHES`} tone="ok" />
          <KpiBox id="BC-02" label={lang === "az" ? "ISRAF QARSISINA" : "WASTE PREVENTED"} value={`?${cityWaste.toLocaleString()}`} sub="MTD" tone="ok" />
          <KpiBox id="BC-03" label="CO2 SAVED" value={`${cityCo2.toLocaleString()} kg`} sub="ENVIRONMENTAL IMPACT" tone="ok" />
          <KpiBox id="BC-04" label={lang === "az" ? "AKTIV ENDIRIM" : "ACTIVE DISCOUNTS"} value={String(cityDisc)} sub="SMART DISCOUNT" tone="warn" />
        </div>
      )}

      {/* --- Map + Live Feed --- */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
        {/* Map panel */}
        <Panel id="MAP-01" title={lang === "az" ? "TEST CITY FILIAL X?RIT?SI" : "TEST CITY BRANCH MAP"} right={`${stores.length} STORES · LIVE`}>
          {stores.length > 0 ? (
            <>
              <CityMap stores={stores} lang={lang} />
              <div style={{ marginTop: 10, display: "flex", gap: 12, fontSize: 9, color: T.fg3 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, display: "inline-block", boxShadow: `0 0 6px ${T.green}` }} />
                  {lang === "az" ? "FILIAL" : "BRANCH"} ({stores.length})
                </span>
              </div>
            </>
          ) : (
            <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              {cityLoading ? (
                <div style={{ color: T.fg4, fontSize: 11, letterSpacing: ".1em" }}>LOADING MAP DATA...</div>
              ) : (
                <div style={{ color: T.fg4, fontSize: 11, letterSpacing: ".1em", textAlign: "center" }}>
                  <div style={{ marginBottom: 8, fontSize: 20 }}>?</div>
                  <div>{lang === "az" ? "Seed datasi yoxdur. python data/city_seed.py çalisdirin." : "No seed data. Run: python data/city_seed.py"}</div>
                </div>
              )}
            </div>
          )}
        </Panel>

        {/* Live feed panel */}
        <Panel id="FEED-01" title={lang === "az" ? "CANLI AXIN" : "LIVE FEED"} right="8s REFRESH">
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 480, overflowY: "auto" }}>
            {feed.length === 0 ? (
              <div style={{ color: T.fg4, fontSize: 11, textAlign: "center", padding: "20px 0", letterSpacing: ".1em" }}>
                {cityLoading ? "LOADING..." : lang === "az" ? "Hadis? yoxdur" : "No events yet"}
              </div>
            ) : (
              feed.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${T.border1}`,
                    background: newEventIds.has(ev.id) ? "rgba(0,255,65,0.05)" : "transparent",
                    transition: "background .5s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 10, color: T.fg2, fontWeight: 600 }}>{ev.product_category}</div>
                      <div style={{ fontSize: 9, color: T.fg4, marginTop: 2 }}>{ev.store_name}</div>
                    </div>
                    <span style={{ color: T.ok, fontWeight: 700, fontSize: 11 }}>?{ev.amount.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {ev.was_discounted && (
                      <span style={{ fontSize: 8, border: `1px solid ${T.warn}`, color: T.warn, padding: "1px 5px", letterSpacing: ".1em" }}>
                        DISC
                      </span>
                    )}
                    {ev.waste_prevented && (
                      <span style={{ fontSize: 8, border: `1px solid ${T.ok}`, color: T.ok, padding: "1px 5px", letterSpacing: ".1em" }}>
                        WASTE ?
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      {/* --- District performance table --- */}
      {districts.length > 0 && (
        <Panel id="DIST-01" title={lang === "az" ? "RAYON PERFORMANSI" : "DISTRICT PERFORMANCE"} right={`${districts.length} DISTRICTS`}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: T.bgElev }}>
                {[lang==="az"?"RAYON":"DISTRICT", lang==="az"?"FILIAL":"STORES", lang==="az"?"G?LIR":"REVENUE", lang==="az"?"ISRAF AZALMA":"WASTE RED."].map((h, i) => (
                  <th key={i} style={{ padding: "8px 10px", fontSize: 9, color: T.greenDim, letterSpacing: ".16em", textAlign: i > 0 ? "center" : "left", borderBottom: `1px solid ${T.border2}`, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => (
                <tr key={d.district} style={{ borderBottom: `1px solid ${T.border1}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "8px 10px", color: T.fg1, fontWeight: 600 }}>{d.district}</td>
                  <td style={{ padding: "8px 10px", color: T.fg2, textAlign: "center" }}>{d.store_count}</td>
                  <td style={{ padding: "8px 10px", color: T.ok, textAlign: "center", fontWeight: 600 }}>?{Math.round(d.total_monthly_revenue).toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", textAlign: "center" }}>
                    <span style={{ color: d.waste_reduction_pct >= 40 ? T.ok : T.warn, fontWeight: 700 }}>{d.waste_reduction_pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {/* --- Before / After comparison (simulated projection) --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Before */}
        <div style={{ border: `1px solid ${T.err}30`, background: "rgba(255,51,68,0.03)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, background: T.err, display: "inline-block" }} />
            <span style={{ fontSize: 9, color: T.err, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>{lang === "az" ? "TestAI ÖNC?SI" : "BEFORE TESTAI"}</span>
          </div>
          <StatRow label={lang === "az" ? "AYLIK ISRAF" : "MONTHLY WASTE"} value={`?${wasteBefore.toLocaleString()}`} sub={lang === "az" ? "ortalama" : "average"} color={T.err} big />
          <StatRow label={lang === "az" ? "ISRAF FAIZI" : "WASTE RATE"} value="12.4%" sub={lang === "az" ? "satilabilir m?hsuldan" : "of sellable products"} color={T.err} />
          <StatRow label={lang === "az" ? "MÜDAXIL?" : "RESPONSE TIME"} value={`${reactionBef} ${lang === "az" ? "saat" : "hrs"}`} sub={lang === "az" ? "ortalama" : "average"} color={T.warn} />
          <StatRow label={lang === "az" ? "YOXLAMA" : "CHECK FREQ"} value={lang === "az" ? "2-3 günd?" : "Every 2-3 days"} sub={lang === "az" ? "insan resursu" : "manual"} color={T.fg3} />
          <StatRow label={lang === "az" ? "UGUR NISB?TI" : "SUCCESS RATE"} value="28%" sub={lang === "az" ? "zamaninda h?r?k?t" : "on-time action"} color={T.err} />
        </div>

        {/* After */}
        <div style={{ border: `1px solid ${T.ok}30`, background: "rgba(0,255,65,0.03)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, background: T.ok, display: "inline-block" }} />
            <span style={{ fontSize: 9, color: T.ok, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>{lang === "az" ? "TestAI IL?" : "WITH TESTAI"}</span>
          </div>
          <StatRow label={lang === "az" ? "AYLIK ISRAF" : "MONTHLY WASTE"} value={`?${wasteAfter.toLocaleString()}`} sub="-83%" color={T.ok} big />
          <StatRow label={lang === "az" ? "ISRAF FAIZI" : "WASTE RATE"} value="2.1%" sub={lang === "az" ? "dünya standarti" : "world standard"} color={T.ok} />
          <StatRow label={lang === "az" ? "MÜDAXIL?" : "RESPONSE TIME"} value={`${reactionAft} ${lang === "az" ? "saat" : "hrs"}`} sub="-96%" color={T.ok} />
          <StatRow label={lang === "az" ? "YOXLAMA" : "CHECK FREQ"} value={lang === "az" ? "15 d?qiq?d?" : "Every 15 min"} sub={lang === "az" ? "AI dayanmadan" : "AI never stops"} color={T.ok} />
          <StatRow label={lang === "az" ? "UGUR NISB?TI" : "SUCCESS RATE"} value="91%" sub={lang === "az" ? "avtomatik aksiya" : "automated action"} color={T.ok} />
        </div>
      </div>

      {/* --- ROI Banner --- */}
      <div style={{ border: `1px solid ${T.warn}30`, background: "rgba(255,204,0,0.03)", padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: T.warn, fontVariantNumeric: "tabular-nums" }}>?{savedMonth.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".16em", marginTop: 4, textTransform: "uppercase" }}>{lang === "az" ? "AYLIK TASARRUF" : "MONTHLY SAVING"}</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: T.fg1, fontVariantNumeric: "tabular-nums" }}>?{savedYear.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".16em", marginTop: 4, textTransform: "uppercase" }}>{lang === "az" ? "ILLIK TASARRUF" : "ANNUAL SAVING"}</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: T.ok, fontVariantNumeric: "tabular-nums" }}>{roi.toLocaleString()}%</div>
            <div style={{ fontSize: 9, color: T.fg3, letterSpacing: ".16em", marginTop: 4, textTransform: "uppercase" }}>ROI</div>
          </div>
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${T.border1}`, textAlign: "center", fontSize: 9, color: T.fg4, letterSpacing: ".1em" }}>
          {lang === "az"
            ? "Hesablama: 262 real Test m?hsulu · 10 filial · ortalama günd?lik satis × risk günl?ri × marja (?4.20/unit)"
            : "Calculation: 262 real Test products · 10 branches · avg daily sales × risk days × margin (?4.20/unit)"}
        </div>
      </div>

      {/* --- Monthly waste chart --- */}
      <Panel id="WASTE-CHART" title={lang === "az" ? "AYLIK ISRAF TRENDI" : "MONTHLY WASTE TREND"} right={lang === "az" ? "SIMULYASIYA · 12 AY" : "SIMULATED · 12-MONTH"}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120 }}>
          {MONTHS.map((month, i) => (
            <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 100 }}>
                <div
                  style={{
                    width: "100%",
                    background: "rgba(255,51,68,0.25)",
                    borderTop: `1px solid ${T.err}60`,
                    height: animated ? `${(WASTE_BEFORE[i] / maxWaste) * 90}px` : "2px",
                    transition: `height .7s ease ${i * 40}ms`,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    background: "rgba(0,255,65,0.3)",
                    borderBottom: `1px solid ${T.ok}60`,
                    height: animated ? `${(WASTE_AFTER[i] / maxWaste) * 90}px` : "2px",
                    transition: `height .7s ease ${i * 40 + 200}ms`,
                  }}
                />
              </div>
              <div style={{ fontSize: 8, color: T.fg4 }}>{month}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 9, color: T.fg3 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 6, background: "rgba(255,51,68,0.3)", border: `1px solid ${T.err}60`, display: "inline-block" }} />
            {lang === "az" ? "ÖNC?SI" : "BEFORE"}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 6, background: "rgba(0,255,65,0.3)", border: `1px solid ${T.ok}60`, display: "inline-block" }} />
            {lang === "az" ? "IL?" : "AFTER"}
          </span>
          <span style={{ marginLeft: "auto", color: T.fg5, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {lang === "az" ? "SIMULASIYA · proqnoz m?lumati" : "SIMULATION · projected data"}
          </span>
        </div>
      </Panel>

      {/* --- Live backend KPIs --- */}
      {kpi && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          <KpiBox id="LV-01" label={lang === "az" ? "AKTIV X?B?RDARLIQ" : "ACTIVE ALERTS"} value={String(kpi.total_alerts)} sub="LIVE" tone="warn" />
          <KpiBox id="LV-02" label={lang === "az" ? "POTENSIAL ITKI" : "POTENTIAL LOSS"} value={`?${Math.round(kpi.potential_loss).toLocaleString()}`} sub="AT RISK" tone="err" />
          <KpiBox id="LV-03" label={lang === "az" ? "QORUNAN QAZANC" : "SAVED PROFIT"} value={`?${Math.round(kpi.saved_profit).toLocaleString()}`} sub="MTD" tone="ok" />
          <KpiBox id="LV-04" label={lang === "az" ? "30G SATIS" : "30D SALES"} value={`?${Math.round(kpi.total_sales_30d).toLocaleString()}`} sub="REAL DATA" tone="ok" />
        </div>
      )}

      {/* --- Smart Discount explanation --- */}
      <Panel id="SD-EXPLAIN" title={lang === "az" ? "SMART ENDIRIM ALQORITMI" : "SMART DISCOUNT ALGORITHM"} right="TESTAI · CORE IP">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: `1px solid ${T.err}30`, background: "rgba(255,51,68,0.03)", padding: 12 }}>
            <div style={{ fontSize: 9, color: T.err, letterSpacing: ".16em", marginBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>
              ? {lang === "az" ? "?N?N?VI SISTEML?R" : "TRADITIONAL SYSTEMS"}
            </div>
            <div style={{ fontSize: 10, color: T.fg3, lineHeight: 1.7 }}>
              {lang === "az"
                ? "Son tarix yaxinlasan h?r m?hsula avtomatik endirim t?tbiq edir. Sür?tli satilan m?hsullar da endirim? düsür — marja itkisi."
                : "Automatically applies discounts to every product nearing expiry. Fast-selling items get discounted too — margin loss."}
            </div>
          </div>
          <div style={{ border: `1px solid ${T.ok}30`, background: "rgba(0,255,65,0.03)", padding: 12 }}>
            <div style={{ fontSize: 9, color: T.ok, letterSpacing: ".16em", marginBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>
              ? TESTOS SMART DISCOUNT
            </div>
            <div style={{ fontSize: 10, color: T.fg3, lineHeight: 1.7 }}>
              {lang === "az"
                ? "Ortalama günd?lik satis ÷ cari stok hesablanir. M?hsul müdd?ti bitm?misd?n önc? satilacaqsa — endirim tövsiy? edilmir, marja qorunur."
                : "Average daily sales ÷ current stock calculated. If product sells before expiry — no discount recommended, margin protected."}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 12px", background: T.bgElev, border: `1px solid ${T.border2}`, fontSize: 10, color: T.fg3, lineHeight: 1.8 }}>
          <span style={{ color: T.fg2 }}>days_to_stockout</span> = stock ÷ avg_daily_sales<br />
          <span style={{ color: T.warn }}>if</span> days_to_stockout = days_until_expiry × 0.85 ? <span style={{ color: T.ok }}>{lang === "az" ? "endirim lazim deyil" : "no discount needed"}</span><br />
          <span style={{ color: T.warn }}>else</span> ? <span style={{ color: T.err }}>{lang === "az" ? "endirim + transfer tövsiy?si" : "discount + transfer recommended"}</span>
        </div>
      </Panel>

      {/* --- 90-Day Pilot CTA --- */}
      <div style={{ border: `2px solid ${T.warn}50`, background: "rgba(255,204,0,0.04)", padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 9, color: T.warn, letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 8 }}>COMMERCIAL OFFER</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: T.fg1, letterSpacing: "-.01em", textTransform: "uppercase", marginBottom: 8 }}>
          {lang === "az" ? "90 GÜNLÜK PILOT — SIFIR DONANIM X?RCI" : "90-DAY PILOT — ZERO HARDWARE COST"}
        </div>
        <div style={{ fontSize: 11, color: T.fg3, marginBottom: 20, maxWidth: 520, margin: "0 auto 20px" }}>
          {lang === "az"
            ? "1 Test filiali, 90 gün, mövcud Symphony altyapisi üz?rind?n. TestAI Symphony-ni ?v?z etmir — onun olmadigi AI qatini ?lav? edir."
            : "1 Test branch, 90 days, on top of existing Symphony infrastructure. TestAI doesn't replace Symphony — it adds the AI layer Symphony is missing."}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 420, margin: "0 auto" }}>
          {[
            { val: "90",  label: lang === "az" ? "GÜN PILOT" : "DAY PILOT" },
            { val: "1",   label: lang === "az" ? "FILIAL · SIFIR RISK" : "BRANCH · ZERO RISK" },
            { val: "?0",  label: lang === "az" ? "DONANIM X?RCI" : "HARDWARE COST" },
          ].map((s) => (
            <div key={s.val} style={{ border: `1px solid ${T.warn}40`, background: "rgba(255,204,0,0.05)", padding: "14px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: T.warn }}>{s.val}</div>
              <div style={{ fontSize: 8, color: T.fg4, letterSpacing: ".14em", marginTop: 4, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Competitor comparison --- */}
      <Panel id="COMP-01" title={lang === "az" ? "R?QIB MÜQAYIS?SI" : "COMPETITIVE COMPARISON"} right={lang === "az" ? "8 XÜSUSIYY?T" : "8 FEATURES"}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: T.bgElev }}>
              <th style={{ padding: "8px 10px", fontSize: 9, color: T.greenDim, letterSpacing: ".16em", textAlign: "left", borderBottom: `1px solid ${T.border2}`, fontWeight: 600, textTransform: "uppercase", width: 160 }}>{lang === "az" ? "XÜSUSIYY?T" : "FEATURE"}</th>
              {[
                { name: "Symphony RetailAI", color: T.fg3 },
                { name: "Wasteless",         color: T.fg3 },
                { name: "TestAI",       color: T.ok  },
              ].map((h) => (
                <th key={h.name} style={{ padding: "8px 10px", fontSize: 9, letterSpacing: ".12em", textAlign: "center", borderBottom: `1px solid ${T.border2}`, fontWeight: 700, color: h.color, textTransform: "uppercase" }}>{h.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { feat: "Smart Discount",                                           vals: ["?","PARTIAL","?"] },
              { feat: lang === "az" ? "FEFO IZL?NM?" : "FEFO TRACKING",          vals: ["MANUAL","?","? AUTO"] },
              { feat: lang === "az" ? "ANOMALIYA" : "ANOMALY DETECTION",          vals: ["?","?","? Test AI"] },
              { feat: lang === "az" ? "AZ T?TILL?R" : "AZ HOLIDAYS",             vals: ["?","?","?"] },
              { feat: lang === "az" ? "REAL-TIME (15 D?Q)" : "REAL-TIME (15 MIN)",vals: ["DAILY","HOURLY","?"] },
              { feat: lang === "az" ? "FILIAL TRANSFERI" : "CROSS-BRANCH XFER",  vals: ["MANUAL","?","? AI"] },
              { feat: lang === "az" ? "ROI PROYEKTORU" : "ROI PROJECTOR",         vals: ["?","?","?"] },
              { feat: lang === "az" ? "AZ?RB. BAZARI" : "AZ MARKET FIT",          vals: ["GLOBAL","GLOBAL","? TEST"] },
            ].map((row) => (
              <tr key={row.feat} style={{ borderBottom: `1px solid ${T.border1}` }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "8px 10px", color: T.fg3, fontSize: 10 }}>{row.feat}</td>
                {row.vals.map((v, i) => (
                  <td key={i} style={{
                    padding: "8px 10px", textAlign: "center", fontWeight: i === 2 ? 700 : 400,
                    color: i === 2 ? T.ok : v === "?" ? T.err + "80" : T.warn + "90",
                    fontSize: i === 2 ? 10 : 9,
                    background: i === 2 ? "rgba(0,255,65,0.03)" : "transparent",
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

// --- Helper sub-components ------------------------------------
function StatRow({ label, value, sub, color, big }: { label: string; value: string; sub: string; color: string; big?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px dashed ${T.border1}` }}>
      <div>
        <div style={{ fontSize: 9, color: T.fg4, letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 9, color: T.fg4, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontWeight: 700, color, fontSize: big ? 22 : 13, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{value}</div>
    </div>
  );
}
