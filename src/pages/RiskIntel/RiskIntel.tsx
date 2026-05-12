import React from 'react';
import { ShieldCheck, Terminal, AlertCircle, BarChart } from 'lucide-react';

export const RiskIntel: React.FC = () => {
  return (
    <div className="terminal-page animate-fade-in">
      <div className="terminal-header">
        <div className="header-breadcrumbs"><span>/// BRAVOOS / RISK_INTEL</span></div>
        <h1 className="font-heading">THREAT_INTELLIGENCE_CENTER <span className="cursor-block"></span></h1>
      </div>

      <div className="risk-grid">
        <div className="risk-card glass-terminal">
          <div className="card-header">
            <ShieldCheck size={20} className="text-primary" />
            <h3>GLOBAL RISK SCORE</h3>
          </div>
          <div className="global-score">
             <div className="score-value">74</div>
             <div className="score-meta">
               <span className="text-warning">MODERATE RISK</span>
               <p>Network stability is within normal parameters. 3 branches require attention.</p>
             </div>
          </div>
        </div>

        <div className="risk-card glass-terminal">
          <div className="card-header">
            <AlertCircle size={20} className="text-primary" />
            <h3>THREAT VECTORS</h3>
          </div>
          <div className="vector-list">
             <div className="vector">
               <div className="vector-label">Expiry Thresholds</div>
               <div className="vector-val high">HIGH RISK</div>
             </div>
             <div className="vector">
               <div className="vector-label">Cold Chain Integrity</div>
               <div className="vector-val safe">SECURE</div>
             </div>
             <div className="vector">
               <div className="vector-label">Stock Accuracy</div>
               <div className="vector-val med">MODERATE</div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .terminal-page { display: flex; flex-direction: column; gap: 24px; font-family: var(--font-mono); }
        .header-breadcrumbs { font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
        .font-heading { font-size: 1.75rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cursor-block { width: 12px; height: 24px; background: var(--primary); animation: blink 1s infinite; }

        .risk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .glass-terminal { background: #000; border: 1px solid var(--border-glass); padding: 24px; }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; }
        .card-header h3 { font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; }

        .global-score { display: flex; align-items: center; gap: 32px; }
        .score-value { font-size: 4rem; font-weight: 900; color: var(--primary); border: 2px solid var(--primary); padding: 10px 20px; box-shadow: 0 0 20px var(--primary-glow); }
        .score-meta { display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; }
        .score-meta span { font-weight: 900; letter-spacing: 1px; }

        .vector-list { display: flex; flex-direction: column; gap: 20px; }
        .vector { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px; }
        .vector-label { font-size: 0.85rem; color: var(--text-dim); }
        .vector-val { font-size: 0.75rem; font-weight: 800; }
        .vector-val.high { color: var(--danger); }
        .vector-val.med { color: var(--warning); }
        .vector-val.safe { color: var(--success); }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
