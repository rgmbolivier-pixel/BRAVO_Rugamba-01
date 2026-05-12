import React from 'react';
import { Building, MapPin, Activity, Terminal } from 'lucide-react';

export const BravoCity: React.FC = () => {
  return (
    <div className="terminal-page animate-fade-in">
      <div className="terminal-header">
        <div className="header-breadcrumbs"><span>/// BRAVOOS / BRAVO_CITY</span></div>
        <h1 className="font-heading">METROPOLITAN_DEMAND_SIMULATOR <span className="cursor-block"></span></h1>
      </div>

      <div className="city-grid">
        <div className="map-view glass-terminal">
          <div className="map-header">
            <span className="tag">SIM-88</span>
            <h3>BAKU_CENTRAL_DISTRICT</h3>
          </div>
          <div className="map-container">
             {/* Mock Map Grid */}
             <div className="map-grid-visual">
               {[...Array(16)].map((_, i) => (
                 <div key={i} className="grid-cell">
                   {i === 5 && <div className="branch-marker active"><MapPin size={12} /></div>}
                   {i === 10 && <div className="branch-marker warning"><MapPin size={12} /></div>}
                   {i === 15 && <div className="branch-marker active"><MapPin size={12} /></div>}
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="city-stats glass-terminal">
           <div className="card-header">
             <Activity size={20} className="text-primary" />
             <h3>CITY_VITAL_SIGNS</h3>
           </div>
           <div className="vital-stats">
              <div className="stat">
                <span>Active Demand Centers</span>
                <span className="val">8 Branches</span>
              </div>
              <div className="stat">
                <span>Current Foot Traffic</span>
                <span className="val text-primary">88% Capacity</span>
              </div>
              <div className="stat">
                <span>Waste Mitigation Rate</span>
                <span className="val text-success">92.4%</span>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .terminal-page { display: flex; flex-direction: column; gap: 24px; font-family: var(--font-mono); }
        .header-breadcrumbs { font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
        .font-heading { font-size: 1.75rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cursor-block { width: 12px; height: 24px; background: var(--primary); animation: blink 1s infinite; }

        .city-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
        .glass-terminal { background: #000; border: 1px solid var(--border-glass); padding: 24px; }
        .map-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; }
        .map-header .tag { font-size: 0.55rem; color: #000; background: var(--primary); padding: 1px 4px; font-weight: 900; }
        .map-header h3 { font-size: 0.85rem; font-weight: 800; }

        .map-container { background: rgba(0,255,65,0.02); height: 300px; border: 1px solid rgba(0,255,65,0.1); position: relative; }
        .map-grid-visual { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); height: 100%; width: 100%; }
        .grid-cell { border: 1px solid rgba(0,255,65,0.05); position: relative; display: flex; align-items: center; justify-content: center; }
        
        .branch-marker { color: var(--primary); animation: pulse 2s infinite; }
        .branch-marker.warning { color: var(--warning); }
        
        .vital-stats { display: flex; flex-direction: column; gap: 20px; }
        .stat { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; }
        .stat span:first-child { color: var(--text-dim); }
        .stat .val { font-weight: 800; font-size: 1.1rem; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};
