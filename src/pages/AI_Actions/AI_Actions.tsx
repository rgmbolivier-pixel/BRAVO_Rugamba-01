import React from 'react';
import { Zap, Terminal, Activity, ShieldCheck, Cpu } from 'lucide-react';

export const AI_Actions: React.FC = () => {
  return (
    <div className="terminal-page animate-fade-in">
      <div className="terminal-header">
        <div className="header-breadcrumbs"><span>/// BRAVOOS / AI_ACTIONS</span></div>
        <h1 className="font-heading">AUTONOMOUS_INTERVENTIONS <span className="cursor-block"></span></h1>
      </div>

      <div className="actions-grid">
        <div className="action-card glass-terminal">
          <div className="action-header">
            <Cpu size={20} className="text-primary" />
            <h3>ACTIVE NEURAL MODELS</h3>
          </div>
          <div className="model-list">
            <div className="model-item">
              <span>Expiry Predictor v4.2</span>
              <span className="status-tag success">RUNNING</span>
            </div>
            <div className="model-item">
              <span>Demand Forecaster v2.1</span>
              <span className="status-tag success">RUNNING</span>
            </div>
            <div className="model-item">
              <span>Anomaly Detector v1.0</span>
              <span className="status-tag warning">TUNING</span>
            </div>
          </div>
        </div>

        <div className="action-card glass-terminal highlight">
          <div className="action-header">
            <Zap size={20} />
            <h3>PENDING ACTIONS (5)</h3>
          </div>
          <div className="pending-list">
             <div className="pending-item">
               <p>Apply 40% discount to "Bravo Yasamal" batch #B2284</p>
               <button className="btn-action">EXECUTE</button>
             </div>
             <div className="pending-item">
               <p>Transfer 45 units "Whole Milk" to "Bravo Nizami"</p>
               <button className="btn-action">EXECUTE</button>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .terminal-page { display: flex; flex-direction: column; gap: 24px; font-family: var(--font-mono); }
        .header-breadcrumbs { font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
        .font-heading { font-size: 1.75rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cursor-block { width: 12px; height: 24px; background: var(--primary); animation: blink 1s infinite; }

        .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .glass-terminal { background: #000; border: 1px solid var(--border-glass); padding: 24px; }
        .glass-terminal.highlight { border-color: var(--primary); box-shadow: inset 0 0 10px var(--primary-glow); }
        
        .action-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; }
        .action-header h3 { font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; }

        .model-list { display: flex; flex-direction: column; gap: 16px; }
        .model-item { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; }
        .status-tag { font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 2px; }
        .status-tag.success { background: var(--success-glow); color: var(--success); border: 1px solid var(--success); }
        .status-tag.warning { background: rgba(250, 204, 21, 0.1); color: var(--warning); border: 1px solid var(--warning); }

        .pending-list { display: flex; flex-direction: column; gap: 20px; }
        .pending-item { display: flex; justify-content: space-between; align-items: center; gap: 20px; font-size: 0.85rem; }
        .btn-action { background: var(--primary); color: #000; border: none; padding: 6px 16px; font-size: 0.75rem; font-weight: 900; cursor: pointer; }
        .btn-action:hover { background: #fff; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
