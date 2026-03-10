import { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";

const CORRECT_PIN = "1185";

function PinLock({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKey = (digit) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          onUnlock();
        } else {
          setShake(true);
          setError(true);
          setTimeout(() => { setPin(""); setShake(false); }, 600);
        }
      }, 150);
    }
  };

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setError(false); };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e8e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .pin-btn { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #e8e8f0; border-radius: 50%; width: 72px; height: 72px; font-size: 22px; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: 'Syne', sans-serif; } .pin-btn:hover { background: rgba(61,90,254,0.25); border-color: #3d5afe; } .pin-btn:active { transform: scale(0.92); } @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }`}</style>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#3d5afe,#7c4dff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>💰</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>DivRadar <span style={{ color: "#3d5afe" }}>Pro</span></div>
      <div style={{ fontSize: 12, color: "#556", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 40 }}>INTRODUCE TU PIN</div>

      <div style={{ display: "flex", gap: 16, marginBottom: 40, animation: shake ? "shake 0.5s ease" : "none" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: pin.length > i ? (error ? "#ff5252" : "#3d5afe") : "rgba(255,255,255,0.15)", transition: "all 0.2s", boxShadow: pin.length > i && !error ? "0 0 10px rgba(61,90,254,0.6)" : "none" }} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 14 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} className="pin-btn" onClick={() => handleKey(String(n))}>{n}</button>
        ))}
        <div />
        <button className="pin-btn" onClick={() => handleKey("0")}>0</button>
        <button className="pin-btn" onClick={handleDelete} style={{ fontSize: 18 }}>⌫</button>
      </div>

      {error && <div style={{ marginTop: 24, color: "#ff5252", fontSize: 13, fontWeight: 600 }}>PIN incorrecto. Inténtalo de nuevo.</div>}
    </div>
  );
}

const COUNTRIES = [
  { code: "ALL", name: "🌍 Todo el mundo" },
  { code: "US", name: "🇺🇸 Estados Unidos" },
  { code: "GB", name: "🇬🇧 Reino Unido" },
  { code: "DE", name: "🇩🇪 Alemania" },
  { code: "FR", name: "🇫🇷 Francia" },
  { code: "ES", name: "🇪🇸 España" },
  { code: "IT", name: "🇮🇹 Italia" },
  { code: "NL", name: "🇳🇱 Países Bajos" },
  { code: "CH", name: "🇨🇭 Suiza" },
  { code: "AU", name: "🇦🇺 Australia" },
  { code: "CA", name: "🇨🇦 Canadá" },
  { code: "JP", name: "🇯🇵 Japón" },
  { code: "HK", name: "🇭🇰 Hong Kong" },
  { code: "SG", name: "🇸🇬 Singapur" },
  { code: "SE", name: "🇸🇪 Suecia" },
  { code: "NO", name: "🇳🇴 Noruega" },
];

const SECTORS = [
  "Todos", "Utilities", "Financiero", "Energía", "Telecomunicaciones",
  "Consumo", "Salud", "Industriales", "Real Estate", "Materiales", "Tecnología"
];

const MOCK_STOCKS = [
  { ticker: "ABBV", name: "AbbVie Inc.", country: "US", sector: "Salud", yield: 4.8, payout: 58, debtEbitda: 1.9, divGrowth5y: 7.2, marketCap: 285000, price: 178.42, priceChange: 0.54, currency: "USD", lastDiv: 1.55, exDate: "2025-04-14" },
  { ticker: "ENB", name: "Enbridge Inc.", country: "CA", sector: "Energía", yield: 7.1, payout: 65, debtEbitda: 2.8, divGrowth5y: 6.1, marketCap: 78000, price: 38.21, priceChange: -0.22, currency: "CAD", lastDiv: 0.915, exDate: "2025-05-08" },
  { ticker: "REP", name: "Repsol S.A.", country: "ES", sector: "Energía", yield: 5.8, payout: 42, debtEbitda: 1.2, divGrowth5y: 8.4, marketCap: 16200, price: 14.87, priceChange: 1.1, currency: "EUR", lastDiv: 0.39, exDate: "2025-06-02" },
  { ticker: "SHEL", name: "Shell PLC", country: "GB", sector: "Energía", yield: 4.3, payout: 36, debtEbitda: 0.8, divGrowth5y: 5.9, marketCap: 195000, price: 32.18, priceChange: 0.78, currency: "USD", lastDiv: 0.344, exDate: "2025-05-15" },
  { ticker: "BASF", name: "BASF SE", country: "DE", sector: "Materiales", yield: 6.8, payout: 62, debtEbitda: 2.4, divGrowth5y: 5.3, marketCap: 38500, price: 44.12, priceChange: -1.03, currency: "EUR", lastDiv: 3.4, exDate: "2025-04-28" },
  { ticker: "T", name: "AT&T Inc.", country: "US", sector: "Telecomunicaciones", yield: 5.6, payout: 53, debtEbitda: 2.9, divGrowth5y: 5.1, marketCap: 144000, price: 18.74, priceChange: 0.32, currency: "USD", lastDiv: 0.2775, exDate: "2025-07-09" },
  { ticker: "BHP", name: "BHP Group Ltd.", country: "AU", sector: "Materiales", yield: 5.2, payout: 55, debtEbitda: 0.6, divGrowth5y: 9.8, marketCap: 112000, price: 42.88, priceChange: 2.14, currency: "AUD", lastDiv: 1.46, exDate: "2025-03-04" },
  { ticker: "VOD", name: "Vodafone Group", country: "GB", sector: "Telecomunicaciones", yield: 9.2, payout: 68, debtEbitda: 2.7, divGrowth5y: -2.1, marketCap: 22000, price: 0.72, priceChange: -0.55, currency: "GBP", lastDiv: 0.045, exDate: "2025-06-18" },
  { ticker: "VZ", name: "Verizon Comm.", country: "US", sector: "Telecomunicaciones", yield: 6.4, payout: 56, debtEbitda: 2.8, divGrowth5y: 2.0, marketCap: 169000, price: 40.87, priceChange: -0.18, currency: "USD", lastDiv: 0.665, exDate: "2025-07-09" },
  { ticker: "NEE", name: "NextEra Energy", country: "US", sector: "Utilities", yield: 4.1, payout: 61, debtEbitda: 2.5, divGrowth5y: 10.3, marketCap: 139000, price: 70.12, priceChange: 0.87, currency: "USD", lastDiv: 0.515, exDate: "2025-05-29" },
  { ticker: "IBE", name: "Iberdrola S.A.", country: "ES", sector: "Utilities", yield: 4.4, payout: 52, debtEbitda: 2.3, divGrowth5y: 6.7, marketCap: 84000, price: 14.04, priceChange: 0.43, currency: "EUR", lastDiv: 0.31, exDate: "2025-04-07" },
  { ticker: "ING", name: "ING Groep N.V.", country: "NL", sector: "Financiero", yield: 7.3, payout: 45, debtEbitda: 1.8, divGrowth5y: 12.1, marketCap: 52000, price: 16.22, priceChange: 1.44, currency: "EUR", lastDiv: 0.756, exDate: "2025-05-20" },
  { ticker: "AZN", name: "AstraZeneca", country: "GB", sector: "Salud", yield: 2.1, payout: 82, debtEbitda: 3.8, divGrowth5y: 1.0, marketCap: 221000, price: 128.44, priceChange: 0.24, currency: "USD", lastDiv: 1.0, exDate: "2025-03-20" },
  { ticker: "TD", name: "Toronto-Dom. Bank", country: "CA", sector: "Financiero", yield: 5.1, payout: 48, debtEbitda: 1.4, divGrowth5y: 7.9, marketCap: 98000, price: 55.34, priceChange: -0.88, currency: "CAD", lastDiv: 1.02, exDate: "2025-04-02" },
  { ticker: "AEP", name: "Amer. Elec. Power", country: "US", sector: "Utilities", yield: 4.6, payout: 64, debtEbitda: 2.9, divGrowth5y: 6.2, marketCap: 52000, price: 96.44, priceChange: 0.11, currency: "USD", lastDiv: 0.88, exDate: "2025-05-08" },
  { ticker: "ENEL", name: "Enel SpA", country: "IT", sector: "Utilities", yield: 5.9, payout: 57, debtEbitda: 2.6, divGrowth5y: 5.8, marketCap: 65000, price: 7.12, priceChange: 0.55, currency: "EUR", lastDiv: 0.43, exDate: "2025-01-22" },
  { ticker: "WES", name: "Western Midstream", country: "US", sector: "Energía", yield: 8.4, payout: 62, debtEbitda: 2.7, divGrowth5y: 11.2, marketCap: 14800, price: 37.55, priceChange: 1.25, currency: "USD", lastDiv: 0.875, exDate: "2025-05-01" },
  { ticker: "BNS", name: "Bank of Nova Scotia", country: "CA", sector: "Financiero", yield: 6.2, payout: 54, debtEbitda: 1.6, divGrowth5y: 5.4, marketCap: 67000, price: 56.78, priceChange: -0.31, currency: "CAD", lastDiv: 1.06, exDate: "2025-04-02" },
  { ticker: "HRZN", name: "Horizon Technology", country: "US", sector: "Financiero", yield: 12.1, payout: 88, debtEbitda: 3.5, divGrowth5y: 1.2, marketCap: 350, price: 10.22, priceChange: -1.02, currency: "USD", lastDiv: 0.11, exDate: "2025-04-15" },
  { ticker: "TOTB", name: "TotalEnergies SE", country: "FR", sector: "Energía", yield: 5.3, payout: 44, debtEbitda: 1.1, divGrowth5y: 6.3, marketCap: 142000, price: 62.34, priceChange: 0.67, currency: "EUR", lastDiv: 0.795, exDate: "2025-06-23" },
];

const DEFAULT_FILTERS = {
  yieldMin: 4, payoutMax: 70, debtEbitdaMax: 3,
  divGrowth5yMin: 5, marketCapMin: 5000, country: "ALL", sector: "Todos",
};

function matchesFilters(stock, filters) {
  if (filters.country !== "ALL" && stock.country !== filters.country) return false;
  if (filters.sector !== "Todos" && stock.sector !== filters.sector) return false;
  if (stock.yield < filters.yieldMin) return false;
  if (stock.payout > filters.payoutMax) return false;
  if (stock.debtEbitda > filters.debtEbitdaMax) return false;
  if (stock.divGrowth5y < filters.divGrowth5yMin) return false;
  if (stock.marketCap < filters.marketCapMin) return false;
  return true;
}

const ALERT_CONDITIONS = ["mayor que", "menor que"];

function DividendScreener() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tempFilters, setTempFilters] = useState(DEFAULT_FILTERS);
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("yield");
  const [sortDir, setSortDir] = useState("desc");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [newAlert, setNewAlert] = useState({ ticker: "", metric: "yield", condition: "mayor que", value: "" });
  const [notification, setNotification] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const intervalRef = useRef(null);

  const simulatePriceUpdate = useCallback(() => {
    setStocks(prev => prev.map(s => ({
      ...s,
      price: +(s.price * (1 + (Math.random() - 0.5) * 0.003)).toFixed(2),
      priceChange: +((Math.random() - 0.48) * 2).toFixed(2),
      yield: +(s.yield * (1 + (Math.random() - 0.5) * 0.005)).toFixed(2),
    })));
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(simulatePriceUpdate, 4000);
    return () => clearInterval(intervalRef.current);
  }, [simulatePriceUpdate]);

  useEffect(() => {
    const result = stocks
      .filter(s => matchesFilters(s, filters))
      .sort((a, b) => {
        const dir = sortDir === "desc" ? -1 : 1;
        return (a[sortBy] - b[sortBy]) * dir;
      });
    setFilteredStocks(result);
  }, [stocks, filters, sortBy, sortDir]);

  useEffect(() => {
    alerts.forEach(alert => {
      const stock = stocks.find(s => s.ticker === alert.ticker);
      if (!stock) return;
      const val = stock[alert.metric];
      const triggered = alert.condition === "mayor que" ? val > alert.value : val < alert.value;
      if (triggered) {
        const key = `${alert.ticker}-${alert.metric}-${alert.condition}-${alert.value}`;
        if (!triggeredAlerts.includes(key)) {
          setTriggeredAlerts(prev => [...prev, key]);
          setNotification({ ticker: alert.ticker, message: `⚡ ${alert.ticker}: ${alert.metric} es ${alert.condition} ${alert.value}`, type: "alert" });
          setTimeout(() => setNotification(null), 5000);
        }
      }
    });
  }, [stocks, alerts]);

  const exportToExcel = () => {
    const countryName = (code) => COUNTRIES.find(c => c.code === code)?.name.replace(/[^\w\s]/g, "").trim() || code;
    const stockRows = filteredStocks.map(s => ({
      "Ticker": s.ticker, "Empresa": s.name, "País": countryName(s.country), "Sector": s.sector,
      "Precio": s.price, "Moneda": s.currency, "Var. Precio (%)": s.priceChange,
      "Dividend Yield (%)": +s.yield.toFixed(2), "Payout Ratio (%)": s.payout,
      "Deuda Neta / EBITDA (x)": s.debtEbitda, "Div. Growth 5 años (%)": s.divGrowth5y,
      "Market Cap (M€)": s.marketCap, "Último Dividendo": s.lastDiv, "Ex-Dividend Date": s.exDate,
    }));
    const filterRows = [
      { "Parámetro": "Dividend Yield mínimo (%)", "Valor": filters.yieldMin },
      { "Parámetro": "Payout máximo (%)", "Valor": filters.payoutMax },
      { "Parámetro": "Deuda Neta/EBITDA máximo (x)", "Valor": filters.debtEbitdaMax },
      { "Parámetro": "Div. Growth 5 años mínimo (%)", "Valor": filters.divGrowth5yMin },
      { "Parámetro": "Market Cap mínimo (M€)", "Valor": filters.marketCapMin },
      { "Parámetro": "País", "Valor": countryName(filters.country) },
      { "Parámetro": "Sector", "Valor": filters.sector },
      { "Parámetro": "Fecha de exportación", "Valor": new Date().toLocaleString("es-ES") },
      { "Parámetro": "Acciones encontradas", "Valor": filteredStocks.length },
    ];
    const alertRows = alerts.length > 0
      ? alerts.map(a => ({ "Ticker": a.ticker, "Métrica": metricOptions.find(m => m.value === a.metric)?.label || a.metric, "Condición": a.condition, "Valor objetivo": a.value }))
      : [{ "Ticker": "—", "Métrica": "No hay alertas configuradas", "Condición": "", "Valor objetivo": "" }];
    const wb = XLSX.utils.book_new();
    const wsStocks = XLSX.utils.json_to_sheet(stockRows);
    wsStocks["!cols"] = [8,28,18,18,10,8,14,18,16,22,20,16,16,16].map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, wsStocks, "Acciones Filtradas");
    const wsFilters = XLSX.utils.json_to_sheet(filterRows);
    wsFilters["!cols"] = [{ wch: 36 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsFilters, "Filtros Aplicados");
    const wsAlerts = XLSX.utils.json_to_sheet(alertRows);
    wsAlerts["!cols"] = [{ wch: 10 }, { wch: 24 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsAlerts, "Alertas");
    const date = new Date().toISOString().slice(0,10);
    const filename = `DivRadar_Export_${date}.xlsx`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      window.open(URL.createObjectURL(blob), "_blank");
      showNotif("📂 Pulsa el icono ↑ de Safari → 'Guardar en Archivos'", "success");
    } else {
      XLSX.writeFile(wb, filename);
      showNotif("✅ Excel descargado en tu carpeta Descargas", "success");
    }
  };

  const applyFilters = () => { setFilters({ ...tempFilters }); setShowFilterPanel(false); };
  const resetFilters = () => { setTempFilters(DEFAULT_FILTERS); setFilters(DEFAULT_FILTERS); };
  const showNotif = (msg, type) => { setNotification({ message: msg, type }); setTimeout(() => setNotification(null), 3500); };
  const addAlert = () => {
    if (!newAlert.ticker || !newAlert.value) return;
    setAlerts(prev => [...prev, { ...newAlert, value: parseFloat(newAlert.value), id: Date.now() }]);
    setNewAlert({ ticker: "", metric: "yield", condition: "mayor que", value: "" });
    showNotif("✅ Alerta creada correctamente", "success");
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortDir("desc"); }
  };
  const getAiInsight = async (stock) => {
    setSelectedStock(stock); setAiLoading(true); setShowAiPanel(true); setAiInsight("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Eres un analista financiero experto en dividendos. Analiza esta acción de forma concisa y profesional en español. Proporciona: 1) Evaluación del dividendo (2-3 frases), 2) Principales fortalezas (3 bullets), 3) Principales riesgos (2 bullets), 4) Veredicto de inversión para dividendos (1 frase). Datos: Ticker: ${stock.ticker} | Empresa: ${stock.name} | País: ${stock.country} | Sector: ${stock.sector} | Precio: ${stock.price} ${stock.currency} | Dividend Yield: ${stock.yield.toFixed(2)}% | Payout Ratio: ${stock.payout}% | Deuda Neta/EBITDA: ${stock.debtEbitda}x | Crecimiento Dividendo 5 años: ${stock.divGrowth5y}% | Market Cap: ${(stock.marketCap/1000).toFixed(1)}B € | Último dividendo: ${stock.lastDiv} ${stock.currency}. Sé directo y usa formato markdown básico.` }]
        })
      });
      const data = await response.json();
      setAiInsight(data.content?.map(b => b.text || "").join("") || "No se pudo obtener el análisis.");
    } catch { setAiInsight("Error al conectar. Inténtalo de nuevo."); }
    setAiLoading(false);
  };

  const metricOptions = [
    { value: "yield", label: "Dividend Yield (%)" }, { value: "payout", label: "Payout Ratio (%)" },
    { value: "debtEbitda", label: "Deuda/EBITDA (x)" }, { value: "divGrowth5y", label: "Div. Growth 5y (%)" },
    { value: "price", label: "Precio" },
  ];

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#0a0e1a", minHeight: "100vh", color: "#e8e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #2a3050; border-radius: 3px; }
        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
        .glass-bright { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        .badge-green { background: rgba(0,230,118,0.12); color: #00e676; border: 1px solid rgba(0,230,118,0.25); }
        .badge-red { background: rgba(255,82,82,0.12); color: #ff5252; border: 1px solid rgba(255,82,82,0.25); }
        .badge-amber { background: rgba(255,193,7,0.12); color: #ffc107; border: 1px solid rgba(255,193,7,0.25); }
        .btn-primary { background: linear-gradient(135deg, #5c6bc0, #3d5afe); border: none; color: white; cursor: pointer; transition: all 0.2s; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 600; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(61,90,254,0.4); }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #aab; cursor: pointer; transition: all 0.2s; border-radius: 8px; font-family: 'Syne', sans-serif; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: #e8e8f0; background: rgba(255,255,255,0.05); }
        .ticker-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .ticker-row:hover { background: rgba(255,255,255,0.04); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
        input, select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #e8e8f0; border-radius: 8px; padding: 8px 12px; font-family: 'Syne', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; width: 100%; }
        input:focus, select:focus { border-color: #3d5afe; }
        select option { background: #1a1f35; }
        label { font-size: 11px; color: #778; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; display: block; }
        .ai-text h2, .ai-text h3 { color: #c3cff5; font-size: 14px; margin: 12px 0 6px; }
        .ai-text p { color: #aab4cc; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
        .ai-text ul { padding-left: 16px; }
        .ai-text li { color: #aab4cc; font-size: 13px; line-height: 1.7; }
        .ai-text strong { color: #e8e8f0; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #00e676; animation: livePulse 1.5s infinite; display: inline-block; }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0.5)} 50%{box-shadow:0 0 0 6px rgba(0,230,118,0)} }
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100, padding: "12px 20px", borderRadius: 12, maxWidth: 360, background: notification.type === "alert" ? "rgba(255,193,7,0.15)" : "rgba(0,230,118,0.12)", border: `1px solid ${notification.type === "alert" ? "rgba(255,193,7,0.4)" : "rgba(0,230,118,0.3)"}`, color: notification.type === "alert" ? "#ffc107" : "#00e676", fontWeight: 600, fontSize: 13, backdropFilter: "blur(12px)" }} className="slide-in">
          {notification.message}
        </div>
      )}

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px" }} className="glass">
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#3d5afe,#7c4dff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💰</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>DivRadar <span style={{ color: "#3d5afe" }}>Pro</span></div>
              <div style={{ fontSize: 11, color: "#556", letterSpacing: "0.1em", fontWeight: 600 }}>GLOBAL DIVIDEND SCREENER</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#778" }}>
              <span className="live-dot"></span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{lastUpdated.toLocaleTimeString("es-ES")}</span>
            </div>
            <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowFilterPanel(true)}>⚙️ Filtros</button>
            <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAlertModal(true)}>
              🔔 Alertas {alerts.length > 0 && <span style={{ background: "#3d5afe", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginLeft: 6 }}>{alerts.length}</span>}
            </button>
            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={exportToExcel}>📥 Exportar .xlsx</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Acciones encontradas", value: filteredStocks.length, icon: "📊", color: "#3d5afe" },
            { label: "Yield promedio", value: filteredStocks.length ? (filteredStocks.reduce((s,x)=>s+x.yield,0)/filteredStocks.length).toFixed(1)+"%" : "—", icon: "💸", color: "#00e676" },
            { label: "Payout promedio", value: filteredStocks.length ? Math.round(filteredStocks.reduce((s,x)=>s+x.payout,0)/filteredStocks.length)+"%" : "—", icon: "📈", color: "#ffc107" },
            { label: "Alertas activas", value: alerts.length, icon: "🔔", color: "#ff6d6d" },
            { label: "Universo total", value: MOCK_STOCKS.length, icon: "🌍", color: "#7c4dff" },
          ].map((stat, i) => (
            <div key={i} className="glass" style={{ borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 22 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "#556", fontWeight: 600, letterSpacing: "0.05em" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#556", fontWeight: 600 }}>FILTROS ACTIVOS:</span>
          {[
            { label: `Yield > ${filters.yieldMin}%` }, { label: `Payout < ${filters.payoutMax}%` },
            { label: `Deuda/EBITDA < ${filters.debtEbitdaMax}x` }, { label: `Div. Growth > ${filters.divGrowth5yMin}%` },
            { label: `Cap > ${filters.marketCapMin.toLocaleString()}M€` },
            filters.country !== "ALL" && { label: COUNTRIES.find(c=>c.code===filters.country)?.name },
            filters.sector !== "Todos" && { label: filters.sector },
          ].filter(Boolean).map((f, i) => (
            <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }} className="badge-green">{f.label}</span>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "rgba(61,90,254,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {[
                    { key: "ticker", label: "Ticker" }, { key: "country", label: "País" }, { key: "sector", label: "Sector" },
                    { key: "price", label: "Precio" }, { key: "yield", label: "Yield" }, { key: "payout", label: "Payout" },
                    { key: "debtEbitda", label: "Deuda/EBITDA" }, { key: "divGrowth5y", label: "Div. Growth 5y" },
                    { key: "marketCap", label: "Market Cap" }, { key: "exDate", label: "Ex-Date" }, { key: "actions", label: "IA" },
                  ].map(col => (
                    <th key={col.key} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#7788aa", letterSpacing: "0.08em", whiteSpace: "nowrap", cursor: col.key !== "actions" && col.key !== "country" ? "pointer" : "default" }}
                      onClick={() => col.key !== "actions" && col.key !== "exDate" && col.key !== "sector" && col.key !== "country" && handleSort(col.key)}>
                      {col.label}{sortBy === col.key && <span style={{ marginLeft: 4, color: "#3d5afe" }}>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr><td colSpan={11} style={{ padding: 40, textAlign: "center", color: "#556" }}>No se encontraron acciones. Ajusta los filtros.</td></tr>
                ) : filteredStocks.map(stock => (
                  <tr key={stock.ticker} className="ticker-row">
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#c3cff5", fontFamily: "'JetBrains Mono', monospace" }}>{stock.ticker}</div>
                      <div style={{ fontSize: 11, color: "#556", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stock.name}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 18 }}>{COUNTRIES.find(c=>c.code===stock.country)?.name.split(" ")[0] || "🌍"}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(124,77,255,0.12)", color: "#b39ddb", border: "1px solid rgba(124,77,255,0.2)" }}>{stock.sector}</span></td>
                    <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{ fontWeight: 600 }}>{stock.price.toFixed(2)} <span style={{ fontSize: 10, color: "#556" }}>{stock.currency}</span></div>
                      <div style={{ fontSize: 11, color: stock.priceChange >= 0 ? "#00e676" : "#ff5252" }}>{stock.priceChange >= 0 ? "▲" : "▼"} {Math.abs(stock.priceChange).toFixed(2)}%</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} className={stock.yield >= 7 ? "badge-amber" : "badge-green"}>{stock.yield.toFixed(2)}%</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace" }}><span style={{ fontWeight: 600, color: stock.payout > 65 ? "#ffc107" : "#aab" }}>{stock.payout}%</span></td>
                    <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace" }}><span style={{ fontWeight: 600, color: stock.debtEbitda > 2.5 ? "#ffc107" : "#aab" }}>{stock.debtEbitda.toFixed(1)}x</span></td>
                    <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace" }}><span style={{ fontWeight: 600, color: stock.divGrowth5y < 0 ? "#ff5252" : stock.divGrowth5y > 8 ? "#00e676" : "#aab" }}>{stock.divGrowth5y > 0 ? "+" : ""}{stock.divGrowth5y.toFixed(1)}%</span></td>
                    <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#aab" }}>{stock.marketCap >= 1000 ? (stock.marketCap/1000).toFixed(1)+"B" : stock.marketCap+"M"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#778", fontFamily: "'JetBrains Mono', monospace" }}>{stock.exDate}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => getAiInsight(stock)} style={{ background: "linear-gradient(135deg,rgba(61,90,254,0.2),rgba(124,77,255,0.2))", border: "1px solid rgba(61,90,254,0.3)", color: "#c3cff5", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 600, transition: "all 0.2s" }}>✨ AI</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: "#445", textAlign: "center" }}>⚠️ Datos simulados. Para producción conectar APIs reales.</div>
      </div>

      {showFilterPanel && (
        <div className="modal-bg" onClick={() => setShowFilterPanel(false)}>
          <div className="glass-bright" style={{ borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>⚙️ Configurar Filtros</div>
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setShowFilterPanel(false)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { key: "yieldMin", label: "Yield mínimo (%)", step: 0.5 },
                { key: "payoutMax", label: "Payout máximo (%)", step: 5 },
                { key: "debtEbitdaMax", label: "Deuda neta/EBITDA máx.", step: 0.5 },
                { key: "divGrowth5yMin", label: "Div. Growth 5y mín. (%)", step: 1 },
                { key: "marketCapMin", label: "Market Cap mín. (M€)", step: 1000 },
              ].map(f => (
                <div key={f.key}>
                  <label>{f.label}</label>
                  <input type="number" step={f.step} value={tempFilters[f.key]} onChange={e => setTempFilters(p => ({ ...p, [f.key]: parseFloat(e.target.value) || 0 }))} />
                </div>
              ))}
              <div><label>País</label><select value={tempFilters.country} onChange={e => setTempFilters(p => ({ ...p, country: e.target.value }))}>{COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
              <div><label>Sector</label><select value={tempFilters.sector} onChange={e => setTempFilters(p => ({ ...p, sector: e.target.value }))}>{SECTORS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, padding: "12px" }} onClick={applyFilters}>Aplicar filtros</button>
              <button className="btn-ghost" style={{ padding: "12px 16px" }} onClick={resetFilters}>↺ Reset</button>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="modal-bg" onClick={() => setShowAlertModal(false)}>
          <div className="glass-bright" style={{ borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>🔔 Gestión de Alertas</div>
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setShowAlertModal(false)}>✕</button>
            </div>
            <div style={{ background: "rgba(61,90,254,0.08)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7788aa", marginBottom: 12, letterSpacing: "0.08em" }}>NUEVA ALERTA</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><label>Ticker</label><input placeholder="ej: ABBV" value={newAlert.ticker} onChange={e => setNewAlert(p=>({...p,ticker:e.target.value.toUpperCase()}))} style={{ textTransform: "uppercase" }} /></div>
                <div><label>Métrica</label><select value={newAlert.metric} onChange={e => setNewAlert(p=>({...p,metric:e.target.value}))}>{metricOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
                <div><label>Condición</label><select value={newAlert.condition} onChange={e => setNewAlert(p=>({...p,condition:e.target.value}))}>{ALERT_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label>Valor</label><input type="number" placeholder="ej: 5.5" value={newAlert.value} onChange={e => setNewAlert(p=>({...p,value:e.target.value}))} /></div>
              </div>
              <button className="btn-primary" style={{ width: "100%", padding: 10, fontSize: 13 }} onClick={addAlert}>+ Crear alerta</button>
            </div>
            {alerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "#445", fontSize: 13 }}>No hay alertas configuradas</div>
            ) : alerts.map(alert => (
              <div key={alert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#c3cff5" }}>{alert.ticker}</span>
                  <span style={{ fontSize: 12, color: "#778", marginLeft: 8 }}>{metricOptions.find(m=>m.value===alert.metric)?.label} {alert.condition} {alert.value}</span>
                </div>
                <button onClick={() => removeAlert(alert.id)} style={{ background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAiPanel && (
        <div className="modal-bg" onClick={() => setShowAiPanel(false)}>
          <div className="glass-bright" style={{ borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>✨ Análisis IA — {selectedStock?.ticker}</div>
                <div style={{ fontSize: 12, color: "#556" }}>{selectedStock?.name}</div>
              </div>
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setShowAiPanel(false)}>✕</button>
            </div>
            {selectedStock && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                {[
                  { label: "Yield", value: selectedStock.yield.toFixed(2)+"%", color: "#00e676" },
                  { label: "Payout", value: selectedStock.payout+"%", color: "#ffc107" },
                  { label: "Deuda/EBITDA", value: selectedStock.debtEbitda+"x", color: "#7c4dff" },
                  { label: "Div. Growth 5y", value: selectedStock.divGrowth5y+"%", color: "#3d5afe" },
                  { label: "Market Cap", value: selectedStock.marketCap>=1000?(selectedStock.marketCap/1000).toFixed(1)+"B€":selectedStock.marketCap+"M€", color: "#aab" },
                  { label: "Precio", value: selectedStock.price.toFixed(2)+" "+selectedStock.currency, color: "#aab" },
                ].map((m,i)=>(
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#556", fontWeight: 600, letterSpacing: "0.08em" }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                  </div>
                ))}
              </div>
            )}
            {aiLoading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div className="pulse" style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
                <div style={{ color: "#556", fontSize: 13 }}>Analizando con IA...</div>
              </div>
            ) : (
              <div className="ai-text" style={{ lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: aiInsight.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/#{1,3}\s(.*)/g,'<h3>$1</h3>').replace(/\n/g,'<br/>').replace(/\- (.*)/g,'<li>$1</li>') }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <PinLock onUnlock={() => setUnlocked(true)} />;
  return <DividendScreener />;
}
