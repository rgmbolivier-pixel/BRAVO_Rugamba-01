import React from 'react';
import { ShieldAlert, Terminal, AlertTriangle, Search } from 'lucide-react';

export const Anomalies: React.FC = () => {
  return (
    <div className="terminal-page animate-fade-in">
      <div className="terminal-header">
        <div className="header-breadcrumbs"><span>/// BRAVOOS / ANOMALIES</span></div>
        <h1 className="font-heading">DETECTED_SYSTEM_ANOMALIES <span className="cursor-block"></span></h1>
      </div>

      <div className="anomaly-list glass-terminal">
        <div className="list-header">
          <div className="search-box">
             <Search size={14} className="text-primary" />
             <input type="text" placeholder="FILTER BY BRANCH/ID..." />
          </div>
          <div className="status-meta">TOTAL UNRESOLVED: 12</div>
        </div>

        <table className="terminal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>BRANCH</th>
              <th>TYPE</th>
              <th>SEVERITY</th>
              <th>TIMESTAMP</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'AN-902', branch: 'Bravo Sahil', type: 'INVENTORY DISCREPANCY', sev: 'HIGH', time: '14:30:22', status: 'UNRESOLVED' },
              { id: 'AN-884', branch: 'Bravo Yasamal', type: 'PRICE MISMATCH', sev: 'MED', time: '12:15:10', status: 'INVESTIGATING' },
              { id: 'AN-852', branch: 'Bravo Nizami', type: 'SUPPLY CHAIN DELAY', sev: 'LOW', time: '11:05:44', status: 'RESOLVED' },
            ].map(row => (
              <tr key={row.id}>
                <td className="text-primary">{row.id}</td>
                <td>{row.branch}</td>
                <td>{row.type}</td>
                <td className={row.sev === 'HIGH' ? 'text-danger' : 'text-warning'}>{row.sev}</td>
                <td>{row.time}</td>
                <td><span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .terminal-page { display: flex; flex-direction: column; gap: 24px; font-family: var(--font-mono); }
        .header-breadcrumbs { font-size: 0.7rem; color: var(--primary); font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
        .font-heading { font-size: 1.75rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cursor-block { width: 12px; height: 24px; background: var(--primary); animation: blink 1s infinite; }

        .glass-terminal { background: #000; border: 1px solid var(--border-glass); padding: 24px; }
        
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass); }
        .search-box { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); padding: 8px 16px; width: 300px; border: 1px solid var(--border-glass); }
        .search-box input { background: transparent; border: none; color: var(--text-main); font-family: var(--font-mono); font-size: 0.7rem; outline: none; width: 100%; }
        .status-meta { font-size: 0.7rem; font-weight: 800; color: var(--text-dim); }

        .terminal-table { width: 100%; border-collapse: collapse; text-align: left; }
        .terminal-table th { font-size: 0.65rem; text-transform: uppercase; color: var(--text-dim); padding: 12px; border-bottom: 1px solid var(--border-glass); }
        .terminal-table td { font-size: 0.8rem; padding: 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.02); }

        .status-pill { font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border: 1px solid currentColor; }
        .status-pill.unresolved { color: var(--danger); }
        .status-pill.investigating { color: var(--warning); }
        .status-pill.resolved { color: var(--success); }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
