"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DemoGuide() {
  const { t, lang } = useLanguage();
  const [open, setOpen]           = useState(false);
  const [stepIdx, setStepIdx]     = useState(0);
  const [tab, setTab]             = useState<"say" | "show" | "wow">("say");
  const [autoPlay, setAutoPlay]   = useState(false);
  const [countdown, setCountdown] = useState(0);
  const pathname                  = usePathname();
  const router                    = useRouter();

  // STEPS defined inside component so t() and lang are available
  const STEPS = [
    {
      page:     "/",
      duration: 55,
      title:    t("demo_step_dashboard"),
      say:  lang === "az"
        ? "TestOS TestAI — Test Marketin 10 filialinda real-vaxt fire izl?m? sistemi. Bu 4 KPI s?h?r miqyasinda h?r 15 d?qiq?d? yenil?nir."
        : "TestOS TestAI — real-time waste monitoring across Test's 10 Test City branches. These 4 KPIs refresh every 15 minutes.",
      show: lang === "az"
        ? "Qorunan Qazanc kartini göst?r. Kritik m?hsul gridini göst?r."
        : "Point to Saved Profit card. Show critical product grid.",
      wow: lang === "az"
        ? "R?q?ml?r canlidir — h?r d?f? açanda d?yisir."
        : "Numbers are live — they change every refresh.",
    },
    {
      page:     "/alerts",
      duration: 50,
      title:    t("demo_step_alerts"),
      say:  lang === "az"
        ? "CRITICAL, HIGH, MEDIUM — h?r x?b?rdarliq real Test m?hsuludur. 262 m?hsul, 10 filial, 90 günlük satis tarixi."
        : "CRITICAL, HIGH, MEDIUM — every alert is a real Test product. 262 products, 10 branches, 90 days of sales history.",
      show: lang === "az"
        ? "Bir CRITICAL x?b?rdarligi klikl?yin. M?hsul s?klini göst?rin."
        : "Click a CRITICAL alert. Show the product image.",
      wow: lang === "az"
        ? "Bütün m?hsul s?kill?ri real Wolt/Test kataloqdan ç?kilib."
        : "All product images pulled from real Wolt/Test catalog.",
    },
    {
      page:     "/actions",
      duration: 65,
      title:    t("demo_step_actions"),
      say:  lang === "az"
        ? "Sistem tövsiy? edir — müdir t?sdiq edir. Bu bizim ?sas prinsipimizdir. Smart Discount: h?r m?hsula endirim etmirik — ?vv?lc? satis sür?tin? baxiriq. ?g?r m?hsul öz-özün? satilacaqsa, marji qoruyuruq."
        : "System recommends — manager approves. This is our core principle. Smart Discount: we don't discount every product — we check sales velocity first. If it will sell naturally, we protect the margin.",
      show: lang === "az"
        ? "'Execute All Critical' düym?sini basin. Toast mesajini göst?rin."
        : "Press 'Execute All Critical'. Show the toast message.",
      wow: lang === "az"
        ? "R?qibl?rimiz (Wasteless, Symphony) h?r m?hsula endirim edir. Biz yox."
        : "Competitors (Wasteless, Symphony) discount everything. We don't.",
    },
    {
      page:     "/anomalies",
      duration: 50,
      title:    t("demo_step_anomalies"),
      say:  lang === "az"
        ? "Test AI — 25 milyon+ endüstri t?tbiqli açiq m?nb?li Test alqoritmi. Banklar kredit karti firildaqçiligini askarlamaq üçün eyni texnologiyani istifad? edir. Biz is? supermarket r?fl?rind?ki uyusmazliqlari tapiriq."
        : "Test AI — open-source Test algorithm with 25M+ industry deployments. Banks use the same technology to detect credit card fraud. We use it to find shelf discrepancies.",
      show: lang === "az"
        ? "HIGH anomaliyalari göst?rin. Test AI badge-l?rini göst?rin."
        : "Show HIGH anomalies. Point to the AI score badges.",
      wow: lang === "az"
        ? "?vv?l Isolation Forest istifad? edirdik. Test AI onu tam ?v?z etdi — daha d?qiq, daha sür?tli."
        : "We used Isolation Forest before. Test AI replaced it completely — more accurate, faster.",
    },
    {
      page:     "/analytics",
      duration: 55,
      title:    t("demo_step_analytics"),
      say:  lang === "az"
        ? "ROI Projector: 1-d?n 50 filialina q?d?r sürüsdürün. 50 filialda illik 482.880 manat q?na?t. Bu r?q?m real Test m?hsullarina, 10 filial datasina ?saslanir."
        : "ROI Projector: slide from 1 to 50 branches. At 50 branches, ?482,880 annual savings. This number is based on real Test products and 10-branch data.",
      show: lang === "az"
        ? "Slider-i 50-y? aparin. Smart Discount Impact bölm?sini göst?rin."
        : "Drag slider to 50. Show Smart Discount Impact section.",
      wow: lang === "az"
        ? "Smart Discount qorunan marj: lazimsiz endiriml?r edilm?diyin? gör? ?lav? g?lir."
        : "Smart Discount protected margin: extra revenue from discounts we didn't give.",
    },
    {
      page:     "/forecast",
      duration: 60,
      title:    t("demo_step_forecast"),
      say:  lang === "az"
        ? "Meta Test Model — Test Country bayramlarini öyr?n?n AI. Novruz, Qurban Bayrami, Z?f?r Günü — hamisi t?l?b proqnozuna daxildir. Bayram ?rzind?n ?vv?l sifarisi artiririq, bayramdan sonra azaldiriq."
        : "Meta Test Model — AI that learns Test Countryi holidays. Novruz, Gurban, Victory Day — all baked into demand forecasting. We order more before holidays, less after.",
      show: lang === "az"
        ? "Bayram marker-larini göst?rin. 'Test Model' badge-ini göst?rin. Trend oxunu göst?rin."
        : "Show holiday markers. Point to 'Test Model' badge. Show trend arrow.",
      wow: lang === "az"
        ? "Dünyada bu sah?d? istifad? edil?n ?n güclü açiq m?nb?li proqnoz sistemi."
        : "The most powerful open-source forecasting system used in this space globally.",
    },
    {
      page:     "/supply-chain",
      duration: 70,
      title:    t("demo_step_supply_chain"),
      say:  lang === "az"
        ? "Google Test Optimizer — riyazi optimallasdirma. 'Hansi m?hsul hansi filialdan hansi filialina getsin?' sualini h?ll edir. Vendor panelin? keçin: Test Optimizer kritik stok askarlayanda avtomatik satinalma sifarisi yaradir."
        : "Google Test Optimizer — mathematical optimization. Solves 'which product from which branch to which branch?' Switch to Vendor panel: Test Optimizer auto-creates purchase orders when critical stock is detected.",
      show: lang === "az"
        ? "'Vendor ?m?kdasligi' sekmesine keçin. '? Test Optimizer' badge-li PO-lari göst?rin. Avtomatlasma faizini göst?rin."
        : "Switch to 'Vendor Collaboration' tab. Show POs with '? Test Optimizer' badge. Show automation percentage.",
      wow: lang === "az"
        ? "Sifarisl?rin 75%-i avtomatik yaradilir. Müdir yalniz t?sdiql?yir — 2 klik."
        : "75% of orders are auto-generated. Manager just approves — 2 clicks.",
    },
    {
      page:     "/test-city",
      duration: 75,
      title:    t("demo_step_bravo_city"),
      say:  lang === "az"
        ? "TestCity — Bakinin r?q?msal ?kizi. 2 milyon sakin, 50 Test filiali. Bu x?rit?d? h?r nöqt? real Test City koordinatlarina malik Test marketidir. Canli alisveris axini simulyasiya aktivdir."
        : "TestCity — Test City's digital twin. 2 million residents, 50 Test branches. Every point on this map is a real Test City-coordinate Test store. Live purchase stream simulation is active.",
      show: lang === "az"
        ? "X?rit?ni göst?rin. Bir markeri klikl?yin. Canli axin panelini göst?rin. KPI counter-larinin artdigini göst?rin."
        : "Show the map. Click a marker. Show live feed panel. Show KPI counters ticking up.",
      wow: lang === "az"
        ? "Ayliq 694.540 manat fire önl?ndi. Illik 8.3 milyon manat. 12.400 ail? b?sl?ndi."
        : "?694,540 waste prevented monthly. ?8.3M annually. 12,400 families fed.",
    },
    {
      page:     "/test-city",
      duration: 60,
      title:    t("demo_step_qa"),
      say:  lang === "az"
        ? "1 filial, 90 gün, sifir donanim x?rci. Mövcud Symphony infrastrukturu üz?rind? isl?yir — heç n?yi d?yisdirmirik, AI qatini ?lav? edirik. Pilot üçün n? lazimdir: POS sistemin? oxuma icaz?si."
        : "1 branch, 90 days, zero hardware cost. Works on existing Symphony infrastructure — we don't change anything, we add the AI layer. What we need for pilot: read access to POS system.",
      show: lang === "az"
        ? "R?qib müqayis?si c?dv?lini göst?rin. '90 günlük Pilot' CTA-sini göst?rin."
        : "Show competitor comparison table. Point to '90-day Pilot' CTA.",
      wow: lang === "az"
        ? "Symphony RetailAI v? Wasteless bizi ?v?z etmir. Biz onlarin olmadigi AI qatini ?lav? edirik."
        : "We don't replace Symphony RetailAI or Wasteless. We add the AI layer they don't have.",
    },
  ];

  const goStep = (idx: number) => {
    setStepIdx(idx);
    router.push(STEPS[idx].page);
  };

  const prev = () => goStep(Math.max(0, stepIdx - 1));
  const next = () => goStep(Math.min(STEPS.length - 1, stepIdx + 1));

  // Sayfa degisince adimi güncelle
  useEffect(() => {
    const idx = STEPS.findIndex((s) => s.page === pathname);
    if (idx >= 0) setStepIdx(idx);
  }, [pathname]);

  // Klavye kisayollari
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "Escape")     setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, stepIdx]);

  // Auto-play: step duration seconds then advance
  useEffect(() => {
    if (!autoPlay || !open) return;
    const dur = STEPS[stepIdx].duration * 1000;
    setCountdown(STEPS[stepIdx].duration);
    const tick    = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    const advance = setTimeout(() => {
      if (stepIdx < STEPS.length - 1) {
        goStep(stepIdx + 1);
      } else {
        setAutoPlay(false);
      }
    }, dur);
    return () => { clearInterval(tick); clearTimeout(advance); };
  }, [autoPlay, open, stepIdx]);

  const step = STEPS[stepIdx];

  return (
    <>
      {/* Toggle butonu */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-2xl transition-all ${
          open
            ? "bg-orange-500 text-white"
            : "bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700"
        }`}
      >
        ?? {lang === "en" ? (open ? "Close" : "Demo Guide") : (open ? "Bagla" : "Demo Rehberi")}
      </button>

      {/* Rehber paneli */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-96 bg-gray-900 border border-orange-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/20 to-transparent border-b border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  {stepIdx + 1} / {STEPS.length}
                </span>
                <span className="text-white font-semibold text-sm">{step.title}</span>
              </div>
              <span className="text-gray-500 text-xs">? {step.duration}s</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            {/* Auto-play countdown bar */}
            {autoPlay && (
              <div className="mt-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${(countdown / STEPS[stepIdx].duration) * 100}%`,
                    transition: "width 1s linear",
                  }}
                />
              </div>
            )}
          </div>

          {/* Tab seçici */}
          <div className="flex border-b border-gray-800">
            {([
              { key: "say",  label: "?? De ki",   labelEn: "?? Say"  },
              { key: "show", label: "?? Göst?r",  labelEn: "?? Show" },
              { key: "wow",  label: "? WOW ani", labelEn: "? WOW"  },
            ] as const).map(({ key, label, labelEn }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  tab === key
                    ? "bg-orange-500/20 text-orange-400 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}>
                {lang === "en" ? labelEn : label}
              </button>
            ))}
          </div>

          {/* Içerik */}
          <div className="p-4 min-h-[120px]">
            <p className={`text-sm leading-relaxed ${
              tab === "wow"  ? "text-orange-300 font-medium" :
              tab === "show" ? "text-blue-300" : "text-gray-200"
            }`}>
              {step[tab]}
            </p>
          </div>

          {/* Adim navigasyonu */}
          <div className="px-4 pb-4">
            <div className="flex gap-1 mb-3 flex-wrap">
              {STEPS.map((s, i) => (
                <button key={i} onClick={() => goStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIdx ? "bg-orange-500 w-6" : "bg-gray-700 hover:bg-gray-500 w-3"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} disabled={stepIdx === 0}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-gray-300 text-sm rounded-xl transition-colors">
                ? {lang === "en" ? "Prev" : "?vv?l"}
              </button>
              <button
                onClick={() => setAutoPlay((v) => !v)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  autoPlay
                    ? "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
                title={lang === "en" ? "Auto-demo" : "Avtomatik demo"}
              >
                {autoPlay ? `? ${countdown}s` : "?"}
              </button>
              <button onClick={next} disabled={stepIdx === STEPS.length - 1}
                className="flex-1 py-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 text-white text-sm font-semibold rounded-xl transition-colors">
                {lang === "en" ? "Next" : "Ir?li"} ?
              </button>
            </div>
            <p className="text-center text-gray-700 text-[10px] mt-2">
              {lang === "en" ? "? ? arrow keys to navigate" : "? ? klaviatura il? keçid"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
