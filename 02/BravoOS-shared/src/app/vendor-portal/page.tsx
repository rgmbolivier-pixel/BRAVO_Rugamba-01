"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchVendors, fetchVendorPurchaseOrders, acceptPO, rejectPO, payInvoice } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { T } from "@/components/BravoUI";

// ---------------------------------------------------------------------
// Vendor Portal — 3 ekran: Login ? Siparisler ? PO detay
// ---------------------------------------------------------------------

const STATUS_COLOR: Record<string, string> = {
  PENDING:   T.fg4,
  SENT:      T.warn,
  CONFIRMED: T.info,
  DELIVERED: T.ok,
  INVOICED:  "#a78bfa",
  PAID:      T.ok,
  REJECTED:  T.err,
};

const STATUS_LABEL: Record<string, { az: string; en: string }> = {
  PENDING:   { az: "Gözl?nir",      en: "Pending"   },
  SENT:      { az: "Yeni Sifaris",  en: "New Order"  },
  CONFIRMED: { az: "T?sdiql?ndi",   en: "Confirmed"  },
  DELIVERED: { az: "Çatdirildi",    en: "Delivered"  },
  INVOICED:  { az: "Faktura",       en: "Invoiced"   },
  PAID:      { az: "Öd?nildi",      en: "Paid"       },
  REJECTED:  { az: "R?dd Edildi",   en: "Rejected"   },
};

// -- Screen 1: Vendor seçimi -------------------------------------------
function VendorLogin({ vendors, onSelect, lang }: {
  vendors: any[];
  onSelect: (v: any) => void;
  lang: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 9, color: T.greenDim, letterSpacing: ".3em", marginBottom: 8 }}>
          TESTAI · B2B PORTAL
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: T.fg1, letterSpacing: "-.02em" }}>
          {lang === "az" ? "Vendor girisi" : "Vendor Login"}
        </div>
        <div style={{ fontSize: 12, color: T.fg4, marginTop: 8 }}>
          {lang === "az"
            ? "Sirk?tinizi seçin — sifarisl?rinizi görün"
            : "Select your company to view your orders"}
        </div>
      </div>

      {/* Vendor kartlari */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 240px)", gap: 12, width: "100%", maxWidth: 500 }}>
        {vendors.map((v) => {
          const pendingCount = v._pending ?? 0;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              style={{
                fontFamily: "inherit",
                background: T.bgPanel,
                border: `1px solid ${pendingCount > 0 ? T.warn + "60" : T.border2}`,
                padding: "20px 16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color .15s, background .15s",
                position: "relative",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = T.ok)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = pendingCount > 0 ? T.warn + "60" : T.border2)}
            >
              {/* Bekleyen siparis badge */}
              {pendingCount > 0 && (
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  background: T.warn, color: "#000",
                  fontSize: 9, fontWeight: 700, padding: "2px 7px",
                  letterSpacing: ".08em",
                }}>
                  {pendingCount} {lang === "az" ? "YENI" : "NEW"}
                </div>
              )}
              <div style={{ fontSize: 22, marginBottom: 10 }}>??</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.fg1, marginBottom: 4 }}>{v.name}</div>
              <div style={{ fontSize: 10, color: T.fg4, marginBottom: 8 }}>{v.category}</div>
              <div style={{ fontSize: 9, color: T.fg5 }}>
                {lang === "az" ? "Etibarliliq" : "Reliability"}: <span style={{ color: v.reliability_score >= 90 ? T.ok : T.warn }}>{v.reliability_score}%</span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 32, fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>
        {lang === "az"
          ? "Bütün ?m?liyyatlar kagizsiz · Telefon z?ngi yox · E-poçt yox"
          : "Fully paperless · No phone calls · No email threads"}
      </div>
    </div>
  );
}

// -- Screen 2: Seçilen vendorun siparisleri ----------------------------
function OrderList({ vendor, pos, lang, onRefresh, onBack }: {
  vendor: any;
  pos: any[];
  lang: string;
  onRefresh: () => void;
  onBack: () => void;
}) {
  const [busy, setBusy] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sadece bu vendor'in PO'lari
  const myPOs = pos.filter(p =>
    p.vendor?.id === vendor.id ||
    p.vendor_name === vendor.name
  );

  // Sirala: önce SENT/PENDING, sonra CONFIRMED, sonra digerleri
  const priority = (s: string) =>
    s === "SENT" || s === "PENDING" ? 0 :
    s === "CONFIRMED" ? 1 :
    s === "DELIVERED" ? 2 :
    s === "INVOICED"  ? 3 :
    s === "PAID"      ? 4 : 5;
  const sorted = [...myPOs].sort((a, b) => priority(a.status) - priority(b.status));

  const handleAccept = async (po: any) => {
    setBusy(po.id);
    const vendor_lead = vendor.lead_time_days ?? 3;
    const eta = new Date();
    eta.setDate(eta.getDate() + vendor_lead);
    await acceptPO(po.id, { expected_delivery: eta.toISOString().split("T")[0] });
    setBusy(null);
    showToast(lang === "az" ? `PO-${String(po.id).padStart(4,"0")} q?bul edildi ?` : `PO-${String(po.id).padStart(4,"0")} accepted ?`);
    onRefresh();
  };

  const handleReject = async (po: any) => {
    setBusy(po.id);
    await rejectPO(po.id, lang === "az" ? "Stok mövcud deyil" : "Out of stock");
    setBusy(null);
    showToast(lang === "az" ? "Sifaris r?dd edildi" : "Order rejected");
    onRefresh();
  };

  const handlePay = async (po: any) => {
    setBusy(po.id);
    await payInvoice(po.id);
    setBusy(null);
    showToast(lang === "az" ? "Öd?nis qeyd? alindi ?" : "Payment recorded ?");
    onRefresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{
          fontFamily: "inherit", fontSize: 9, letterSpacing: ".1em",
          padding: "5px 12px", border: `1px solid ${T.border2}`,
          color: T.fg4, background: "transparent", cursor: "pointer",
        }}>? {lang === "az" ? "GERI" : "BACK"}</button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.fg1 }}>?? {vendor.name}</div>
          <div style={{ fontSize: 10, color: T.fg4, marginTop: 2 }}>
            {vendor.category} · {vendor.email} · {lang === "az" ? "Teslimat" : "Lead time"}: {vendor.lead_time_days} {lang === "az" ? "gün" : "d"}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.warn, fontVariantNumeric: "tabular-nums" }}>
            {myPOs.filter(p => ["SENT","PENDING"].includes(p.status)).length}
          </div>
          <div style={{ fontSize: 9, color: T.fg5, letterSpacing: ".1em" }}>
            {lang === "az" ? "YENI SIFARIS" : "NEW ORDERS"}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ border: `1px solid ${T.ok}`, background: `${T.ok}08`, padding: "10px 14px", fontSize: 11, color: T.ok, marginBottom: 12 }}>
          ? {toast}
        </div>
      )}

      {/* Siparis listesi */}
      {sorted.length === 0 ? (
        <div style={{ color: T.fg4, fontSize: 13, padding: "40px 0", textAlign: "center" }}>
          {lang === "az" ? "Sifaris yoxdur." : "No orders yet."}
        </div>
      ) : (
        sorted.map((po) => {
          const sc = STATUS_COLOR[po.status] ?? T.fg4;
          const sl = STATUS_LABEL[po.status];
          const isNew  = ["SENT","PENDING"].includes(po.status);
          const isBusy = busy === po.id;

          return (
            <div key={po.id} style={{
              border: `1px solid ${isNew ? T.warn + "50" : T.border1}`,
              background: isNew ? `${T.warn}04` : T.bgPanel,
              padding: "16px 18px",
              marginBottom: 8,
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}>
              {/* Ürün görseli */}
              {po.product?.image_url && (
                <img
                  src={po.product.image_url}
                  alt=""
                  style={{ width: 48, height: 48, objectFit: "cover", border: `1px solid ${T.border1}`, flexShrink: 0 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}

              {/* Bilgi */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.fg1, marginBottom: 3 }}>
                  {po.product_name}
                </div>
                <div style={{ fontSize: 10, color: T.fg4 }}>
                  {po.store_name} · {po.quantity} {lang === "az" ? "?d?d" : "units"} · ?{(po.total_amount ?? 0).toFixed(0)}
                </div>
                {po.expected_delivery && (
                  <div style={{ fontSize: 9, color: T.info, marginTop: 3 }}>
                    ETA: {new Date(po.expected_delivery).toLocaleDateString()}
                  </div>
                )}
                {po.invoice_number && (
                  <div style={{ fontSize: 9, color: "#a78bfa", marginTop: 3 }}>
                    {po.invoice_number} · ?{(po.invoice_amount ?? 0).toFixed(0)}
                    {po.match_status && (
                      <span style={{ marginLeft: 8, color: po.match_status === "EXACT" ? T.ok : T.warn }}>
                        3-way: {po.match_status}
                      </span>
                    )}
                  </div>
                )}
                {po.rejection_reason && (
                  <div style={{ fontSize: 9, color: T.err, marginTop: 3 }}>{po.rejection_reason}</div>
                )}
                {po.triggered_by === "Test Optimizer" && (
                  <div style={{ marginTop: 4, fontSize: 8, color: T.ok, letterSpacing: ".08em", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>?</span>
                    <span>Test Optimizer AI · {lang === "az" ? "Kritik stok s?viyy?si askarlandi" : "Critical stock level detected"}</span>
                  </div>
                )}
              </div>

              {/* Status + Buton */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                <span style={{ fontSize: 9, border: `1px solid ${sc}40`, color: sc, padding: "2px 8px", letterSpacing: ".1em", whiteSpace: "nowrap" }}>
                  {sl?.[lang as "az"|"en"] ?? po.status}
                </span>

                {!isBusy && (
                  <>
                    {/* YENI SIFARIS ? Q?bul et / R?dd et */}
                    {isNew && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleAccept(po)} style={{
                          fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                          padding: "6px 16px", border: `1px solid ${T.ok}`,
                          background: T.ok, color: "#000", cursor: "pointer",
                        }}>? {lang === "az" ? "Q?BUL ET" : "ACCEPT"}</button>
                        <button onClick={() => handleReject(po)} style={{
                          fontFamily: "inherit", fontSize: 10, padding: "6px 10px",
                          border: `1px solid ${T.err}40`, color: T.err,
                          background: "transparent", cursor: "pointer",
                        }}>?</button>
                      </div>
                    )}

                    {/* T?SDIQL?NDI ? Test anbari t?r?find?n q?bul edilir */}
                    {po.status === "CONFIRMED" && (
                      <div style={{ fontSize: 9, color: T.info, textAlign: "right", lineHeight: 1.5 }}>
                        ?? {lang === "az" ? "Test anbari q?bul ed?c?k" : "Test warehouse will receive"}
                        {po.expected_delivery && (
                          <div style={{ color: T.fg4, marginTop: 2 }}>
                            {lang === "az" ? "Gözl?nilir" : "Expected"}: {new Date(po.expected_delivery).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAKTURA ? Öd? */}
                    {po.status === "INVOICED" && (
                      <button onClick={() => handlePay(po)} style={{
                        fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                        padding: "6px 16px", border: `1px solid #a78bfa`,
                        background: "rgba(167,139,250,0.1)", color: "#a78bfa", cursor: "pointer",
                      }}>?? {lang === "az" ? "ÖD?" : "PAY"}</button>
                    )}
                  </>
                )}

                {isBusy && (
                  <span style={{ fontSize: 9, color: T.info, letterSpacing: ".1em" }}>?...</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// -- Ana sayfa ---------------------------------------------------------
export default function VendorPortalPage() {
  const { lang } = useLanguage();
  const [vendors,  setVendors]  = useState<any[]>([]);
  const [allPOs,   setAllPOs]   = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    const [v, p] = await Promise.all([fetchVendors(), fetchVendorPurchaseOrders()]);
    const vArr = Array.isArray(v) ? v : [];
    const pArr = Array.isArray(p) ? p : [];

    // Her vendora bekleyen siparis sayisini ekle (login ekraninda badge için)
    const enriched = vArr.map((vendor: any) => ({
      ...vendor,
      _pending: pArr.filter((po: any) =>
        (po.vendor?.id === vendor.id || po.vendor_name === vendor.name) &&
        ["SENT","PENDING"].includes(po.status)
      ).length,
    }));

    setVendors(enriched);
    setAllPOs(pArr);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Aktif vendor seçiliyse 8s'de bir poll
  useEffect(() => {
    if (!selected) return;
    const iv = setInterval(load, 8000);
    return () => clearInterval(iv);
  }, [selected, load]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: T.fg4, fontSize: 11, letterSpacing: ".1em" }}>
        YÜKL?NIR...
      </div>
    );
  }

  return (
    <div className="bos-fadein" style={{ maxWidth: 640, margin: "0 auto" }}>
      {!selected ? (
        <VendorLogin
          vendors={vendors}
          onSelect={setSelected}
          lang={lang}
        />
      ) : (
        <OrderList
          vendor={selected}
          pos={allPOs}
          lang={lang}
          onRefresh={load}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  );
}
