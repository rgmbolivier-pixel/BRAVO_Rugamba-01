import React from 'react';
import { Truck, Package, Box, MapPin, Activity } from 'lucide-react';

export const SupplyChain: React.FC = () => {
  return (
    <div className="terminal-page animate-fade-in">
      <div className="terminal-header">
        <div className="header-breadcrumbs"><span>/// BRAVOOS / SUPPLY_CHAIN</span></div>
        <h1 className="font-heading">GLOBAL_SUPPLY_CHAIN_TRACKER <span className="cursor-block"></span></h1>
      </div>

      <div className="sc-grid">
        <div className="sc-card glass-terminal">
          <div className="card-header">
            <Truck size={20} className="text-primary" />
            <h3>IN-TRANSIT SHIPMENTS</h3>
          </div>
          <div className="shipment-list">
             {[
               { id: 'SH-102', from: 'Main Depot', to: 'Bravo Sahil', eta: '2h 15m', status: 'ON_TIME' },
               { id: 'SH-095', from: 'Vendor X', to: 'Main Depot', eta: '4h 45m', status: 'DELAYED' },
             ].map(s => (
               <div key={s.id} className="shipment-item">
                 <div className="item-header">
                   <span className="id">{s.id}</span>
                   <span className={`status ${s.status.toLowerCase()}`}>{s.status}</span>
                 </div>
                 <div className="route">{s.from} {'>>'} {s.to}</div>
                 <div className="eta">ETA: {s.eta}</div>
               </div>
             ))}
          </div>
        </div>

        <div className="sc-card glass-terminal">
          <div className="card-header">
            <Package size={20} className="text-primary" />
            <h3>WAREHOUSE EFFICIENCY</h3>
          </div>
          <div className="metrics-list">
             <div className="metric">
               <span>Utilization</span>
               <div className="bar"><div className="fill" style={{ width: '78%' }}></div></div>
             </div>
             <div className="metric">
               <span>Pick Accuracy</span>
               <div className="bar"><div className="fill" style={{ width: '99%' }}></div></div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .terminal-page { display: flex; flex-direction: column; gap: 24px; font-family: var(--font-mono); }
        .header-breadcrumbs { font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
        .font-heading { font-size: 1.75rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cursor-block { width: 12px; height: 24px; background: var(--primary); animation: blink 1s infinite; }

        .sc-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
        .glass-terminal { background: #000; border: 1px solid var(--border-glass); padding: 24px; }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; }
        .card-header h3 { font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; }

        .shipment-list { display: flex; flex-direction: column; gap: 16px; }
        .shipment-item { padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .item-header .id { font-weight: 800; color: var(--primary); }
        .item-header .status { font-size: 0.6rem; font-weight: 900; }
        .status.on_time { color: var(--success); }
        .status.delayed { color: var(--danger); }
        .route { font-size: 0.8rem; margin-bottom: 4px; }
        .eta { font-size: 0.7rem; color: var(--text-dim); }

        .metrics-list { display: flex; flex-direction: column; gap: 24px; }
        .metric { display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem; }
        .bar { height: 6px; background: rgba(255,255,255,0.05); }
        .bar .fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
