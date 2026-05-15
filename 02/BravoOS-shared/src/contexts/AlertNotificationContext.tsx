"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { fetchAlerts } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";
import { T } from "@/components/BravoUI";

export interface AppNotification {
  id: string;
  alertId: number;
  productName: string;
  storeName: string;
  daysLeft: number;
  potentialLoss: number;
  arrivedAt: string; // ISO
  read: boolean;
}

interface NotifContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

const NotifContext = createContext<NotifContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  dismiss: () => {},
});

const POLL_MS  = 30_000; // 30 saniyede bir
const MAX_KEEP = 20;     // max 20 bildirim tut

export function AlertNotificationProvider({ children }: { children: ReactNode }) {
  const { profile } = useUser();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts,        setToasts]        = useState<AppNotification[]>([]);
  const seenIds  = useRef<Set<number>>(new Set());
  const isInit   = useRef(false);

  // Sadece admin ve store_manager için çalis
  const active = profile?.role === "admin" || profile?.role === "store_manager";

  const poll = async () => {
    if (!active) return;
    try {
      const data = await fetchAlerts({ risk_level: "CRITICAL", limit: 50 });
      const arr  = Array.isArray(data) ? data : [];

      if (!isInit.current) {
        // Ilk yükleme: mevcut ID'leri kaydet, bildirim gösterme
        arr.forEach((a: any) => seenIds.current.add(a.id));
        isInit.current = true;
        return;
      }

      // Yeni CRITICAL alert'ler
      const fresh = arr.filter((a: any) => !seenIds.current.has(a.id));
      if (fresh.length === 0) return;

      fresh.forEach((a: any) => seenIds.current.add(a.id));

      const newNotifs: AppNotification[] = fresh.map((a: any) => ({
        id:            `notif-${a.id}-${Date.now()}`,
        alertId:       a.id,
        productName:   a.product?.name ?? a.product_name ?? "—",
        storeName:     a.store?.name  ?? a.store_name  ?? "—",
        daysLeft:      a.days_until_expiry ?? 0,
        potentialLoss: a.potential_loss ?? 0,
        arrivedAt:     new Date().toISOString(),
        read:          false,
      }));

      setNotifications(prev => [...newNotifs, ...prev].slice(0, MAX_KEEP));
      setToasts(prev => [...newNotifs, ...prev].slice(0, 3)); // max 3 toast ayni anda
    } catch {
      // Backend çalismiyorsa sessizce geç
    }
  };

  useEffect(() => {
    if (!active) return;
    poll(); // ilk çagri
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [active]);

  // Profile degisince (logout/login) sifirla
  useEffect(() => {
    seenIds.current = new Set();
    isInit.current  = false;
    setNotifications([]);
    setToasts([]);
  }, [profile?.role]);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const dismiss     = (id: string) => {
    setNotifications(n => n.filter(x => x.id !== id));
    setToasts(t => t.filter(x => x.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Toast auto-dismiss
  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => {
      setToasts(prev => prev.slice(0, -1));
    }, 5000);
    return () => clearTimeout(id);
  }, [toasts]);

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markAllRead, dismiss }}>
      {children}
      {/* Toast overlay */}
      {toasts.length > 0 && (
        <div style={{
          position: "fixed", top: 70, right: 16, zIndex: 9999,
          display: "flex", flexDirection: "column", gap: 8,
          pointerEvents: "none",
        }}>
          {toasts.map((t, i) => (
            <div
              key={t.id}
              style={{
                width: 300,
                background: "#0a0a0a",
                border: `1px solid ${T.err}`,
                borderLeft: `3px solid ${T.err}`,
                padding: "12px 14px",
                fontFamily: T.font,
                pointerEvents: "all",
                animation: "bos-slidein-right .25s cubic-bezier(.22,1,.36,1) both",
                opacity: 1 - i * 0.15,
                transform: `translateY(${i * 4}px)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="bos-pulse" style={{ width: 6, height: 6, background: T.err, borderRadius: "50%", display: "inline-block", boxShadow: `0 0 6px ${T.err}` }} />
                  <span style={{ fontSize: 8, color: T.err, letterSpacing: ".2em", fontWeight: 700 }}>KRITIK X?B?RDARLIQ</span>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  style={{ background: "none", border: "none", color: T.fg4, cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1, fontFamily: T.font }}
                >×</button>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.fg1, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.productName}
              </div>
              <div style={{ fontSize: 9, color: T.fg3, marginBottom: 6, letterSpacing: ".06em" }}>
                {t.storeName} · <span style={{ color: t.daysLeft <= 1 ? T.err : T.warn }}>{t.daysLeft} gün qalib</span> · <span style={{ color: T.err }}>?{t.potentialLoss.toFixed(0)} risk</span>
              </div>
              <div style={{ fontSize: 8, color: T.fg5, letterSpacing: ".1em" }}>
                {new Date(t.arrivedAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </NotifContext.Provider>
  );
}

export function useAlertNotifications() {
  return useContext(NotifContext);
}
