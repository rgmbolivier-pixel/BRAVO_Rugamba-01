"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const EVENTS_AZ = [
  "?? Test Branch 1 filiali — Test AI anbarda uygunsuzluq askarladi (+23%)",
  "?? Test Optimizer — Test Branch 2?Test Branch 1 45 ?d?d Süd m?hsulu transferi t?klif etdi",
  "?? Smart Discount — Z?f?r Günü önc?si Çör?k kateqoriyasi +18% t?l?b proqnozu",
  "?? Test Vendor A — 80 ?d?d süd m?hsulu sifarisi Test Optimizer t?r?find?n yaradildi",
  "?? CRITICAL — Test Branch 5 filiali, 3 m?hsul 48 saatdan az ömrü var",
  "?? Test Model — Novruz dövrü üçün t?l?b artimi askarlandi (+34%)",
  "?? Test Branch 3?Test Branch 4 28 ?d?d Et transferi icra edildi — ?196 fire önl?ndi",
  "?? Smart Discount — Bakkaliyy? kateqoriyasi: 12 m?hsul öz-özün? satilacaq, endirim yox",
  "?? Test Optimizer — Test Branch 6 filialinda kritik stok: Zir? Çör?k? avtomatik sifaris gönd?rildi",
  "?? TestAI — Bu saat ?rzind? ?2.340 fire önl?ndi",
];

const EVENTS_EN = [
  "?? Test Branch 1 branch — Test AI detected warehouse discrepancy (+23%)",
  "?? Test Optimizer — Proposed Test Branch 2?Test Branch 1 transfer: 45 units Dairy",
  "?? Smart Discount — Victory Day demand forecast for Bread: +18%",
  "?? Test Vendor A — 80 dairy units PO auto-created by Test Optimizer",
  "?? CRITICAL — Binagadi branch: 3 products under 48h expiry",
  "?? Test Model — Novruz season demand spike detected (+34%)",
  "?? Test Branch 3?Test Branch 4: 28 Meat units transferred — ?196 waste prevented",
  "?? Smart Discount — Grocery: 12 products will sell naturally, no discount needed",
  "?? Test Optimizer — Critical stock at Test Branch 6: auto-order sent to Zira Bread",
  "?? TestAI — ?2,340 waste prevented in the last hour",
];

export default function LiveTicker() {
  const { lang } = useLanguage();
  const EVENTS   = lang === "en" ? EVENTS_EN : EVENTS_AZ;
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);
  const [time, setTime]       = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString(lang === "az" ? "az-AZ" : "en-US", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const clock = setInterval(tick, 10000);
    return () => clearInterval(clock);
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % EVENTS.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [EVENTS.length]);

  const ev = EVENTS[idx];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-8 bg-gray-950 border-b border-gray-800/60 flex items-center px-4 gap-3 overflow-hidden">
      {/* Left: system badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] text-gray-500 font-medium">TestAI</span>
        <span className="text-[10px] text-gray-700">·</span>
        <span className="text-[10px] text-gray-600">{lang === "az" ? "Canli" : "Live"}</span>
      </div>

      <div className="w-px h-4 bg-gray-800 shrink-0" />

      {/* Ticker event — plain string format */}
      <div
        className={`text-[11px] text-gray-300 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {ev}
      </div>

      {/* Right: time */}
      <div className="ml-auto shrink-0 text-[10px] text-gray-700">{time}</div>
    </div>
  );
}
