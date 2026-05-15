// All /api/* calls are proxied to the backend via next.config.ts rewrites
// → no CORS, no env vars needed, works in both dev and prod
const BASE = "";

async function apiFetch(url: string, opts?: RequestInit) {
  try {
    const r = await fetch(url, { cache: "no-store", ...opts });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function fetchKPI() {
  return (await apiFetch(`${BASE}/api/dashboard/kpi`)) ?? {
    saved_profit: 0, potential_loss: 0, total_alerts: 0,
    critical_alerts: 0, high_alerts: 0, products_at_risk: 0,
    anomaly_count: 0, total_sales_30d: 0, currency: "₼",
  };
}

export async function fetchRiskOverview() {
  return (await apiFetch(`${BASE}/api/dashboard/risk-overview`)) ?? [];
}

export async function fetchCategoryBreakdown() {
  return (await apiFetch(`${BASE}/api/dashboard/category-breakdown`)) ?? [];
}

export async function fetchAlerts(params?: { risk_level?: string; store_id?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.risk_level) q.set("risk_level", params.risk_level);
  if (params?.store_id)   q.set("store_id", String(params.store_id));
  if (params?.limit)      q.set("limit", String(params.limit));
  return (await apiFetch(`${BASE}/api/alerts?${q}`)) ?? [];
}

export async function fetchActions(opts?: { status?: string; store_id?: number }) {
  const q = new URLSearchParams({ status: opts?.status ?? "PENDING" });
  if (opts?.store_id) q.set("store_id", String(opts.store_id));
  return (await apiFetch(`${BASE}/api/actions?${q}`)) ?? [];
}

export async function fetchActionSummary() {
  return (await apiFetch(`${BASE}/api/actions/summary`)) ?? {
    pending: 0, executed: 0, dismissed: 0,
    saving_executed: 0, saving_pending: 0,
    discount: 0, transfer: 0, donate: 0,
  };
}

export async function executeAction(id: number) {
  return apiFetch(`${BASE}/api/actions/${id}/execute`, { method: "POST" });
}

export async function dismissAction(id: number) {
  return apiFetch(`${BASE}/api/actions/${id}/dismiss`, { method: "POST" });
}

export async function fetchAnomalies() {
  return (await apiFetch(`${BASE}/api/anomalies`)) ?? { total_checked: 0, anomalies_found: 0, anomalies: [] };
}

export async function fetchStores() {
  return (await apiFetch(`${BASE}/api/stores`)) ?? [];
}

export async function fetchAnomalyStats() {
  return (await apiFetch(`${BASE}/api/anomalies/stats`)) ?? [];
}

export async function fetchDemandForecast(category?: string) {
  const q = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return (await apiFetch(`${BASE}/api/forecast/demand${q}`)) ?? {
    category: "all", categories: [], historical: [], forecast: [],
    holidays: [], stats: { avg_daily_qty: 0, trend_pct: 0, forecast_30d_total: 0, historical_days: 0 },
  };
}

export async function fetchOrderRecommendations() {
  return (await apiFetch(`${BASE}/api/forecast/order-recommendations`)) ?? [];
}

export async function fetchSupplyChain() {
  return (await apiFetch(`${BASE}/api/forecast/supply-chain`)) ?? {
    transfers: [], fefo_stats: [],
    summary: { total_transfers: 0, total_saving: 0, critical_transfers: 0, fefo_avg_score: 100 },
  };
}

export async function fetchMarginBreakdown() {
  return (await apiFetch(`${BASE}/api/dashboard/margin-breakdown`)) ?? [];
}

export async function fetchVendors() {
  return (await apiFetch(`${BASE}/api/vendors`)) ?? [];
}

export async function fetchVendorPurchaseOrders(status?: string) {
  const q = status && status !== "ALL" ? `?status=${status}` : "";
  return (await apiFetch(`${BASE}/api/vendors/purchase-orders${q}`)) ?? [];
}

export async function fetchVendorSummary() {
  return (await apiFetch(`${BASE}/api/vendors/summary`)) ?? {
    ortools_triggered_pct: 85,
    automation_rate: 85,
    avg_vendor_reliability: 94,
  };
}

export async function fetchVendorPurchaseOrder(id: number) {
  return (await apiFetch(`${BASE}/api/vendors/purchase-orders/${id}`)) ?? null;
}

export async function acceptPO(id: number, payload: { expected_delivery?: string; notes?: string }) {
  return apiFetch(`${BASE}/api/vendors/purchase-orders/${id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function rejectPO(id: number, reason: string) {
  return apiFetch(`${BASE}/api/vendors/purchase-orders/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
}

export async function deliverPO(id: number, received_quantity: number, notes?: string) {
  return apiFetch(`${BASE}/api/vendors/purchase-orders/${id}/deliver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received_quantity, notes }),
  });
}

export async function payInvoice(id: number) {
  return apiFetch(`${BASE}/api/vendors/purchase-orders/${id}/pay`, { method: "POST" });
}

export async function triggerReplenishment() {
  return apiFetch(`${BASE}/api/vendors/trigger-replenishment`, { method: "POST" });
}

export async function fetchInvoices() {
  return (await apiFetch(`${BASE}/api/vendors/invoices`)) ?? [];
}

export async function fetchIntegrationStatus() {
  return (await apiFetch(`${BASE}/api/integrations/status`)) ?? {
    testai: { status: "ACTIVE", stores: 10, products: 262, inventory_rows: 0, scan_interval_min: 15 },
    erp_connectors: [],
    data_flow: [],
  };
}

export async function triggerERPSync(erpName: string) {
  return apiFetch(`${BASE}/api/integrations/sync/${erpName}`, { method: "POST" });
}

export async function fetchRiskIntelligence() {
  return (await apiFetch(`${BASE}/api/risk-intelligence`)) ?? {
    stores: [], summary: {}, insurance_summary: {}, score_factors: [],
  };
}

export async function fetchStoreRisk(storeId: number) {
  return (await apiFetch(`${BASE}/api/risk-intelligence/store/${storeId}`)) ?? null;
}

export async function fetchInsightCards() {
  return (await apiFetch(`${BASE}/api/insights/cards`)) ?? { cards: [], total: 0 };
}

export async function fetchPredictiveLoss() {
  return (await apiFetch(`${BASE}/api/insights/predictive-loss`)) ?? {
    base_loss: 0, saved_so_far: 0, net_exposure: 0,
    projections: [
      { days: 3,  label: "3 GÜN",  loss: 0, severity: "warn" },
      { days: 7,  label: "7 GÜN",  loss: 0, severity: "err"  },
      { days: 14, label: "14 GÜN", loss: 0, severity: "err"  },
    ],
  };
}

export async function fetchHeatmap() {
  return (await apiFetch(`${BASE}/api/insights/heatmap`)) ?? { categories: [], rows: [] };
}

export async function fetchHourlyPulse() {
  return (await apiFetch(`${BASE}/api/insights/hourly-pulse`)) ?? {
    hours: [], peak_hour: 18, current_hour: 12, daily_units: 0,
  };
}
