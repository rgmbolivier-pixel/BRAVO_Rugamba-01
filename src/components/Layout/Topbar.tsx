import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Topbar: React.FC = () => {
  const now = new Date();
  const timeString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <header className="topbar terminal-ui">
      <div className="topbar-left">
        <div className="status-indicator">
          <div className="dot"></div>
          <span>ONLINE</span>
        </div>
        <div className="divider"></div>
        <div className="branch-info">
          <span>BRANCH: ALL (8)</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="sys-metrics">
          <span className="metric">SYS_LOAD 0.42</span>
          <span className="metric">UPTIME 187h</span>
        </div>
        <div className="time-display">
          {timeString}
        </div>
      </div>

      <style>{`
        .topbar {
          height: var(--header-height);
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: #000;
          border-bottom: 1px solid var(--border-glass);
          z-index: 90;
          font-family: var(--font-mono);
        }

        .topbar-left, .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border: 1px solid var(--primary);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--primary);
        }

        .status-indicator .dot {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary);
        }

        .divider {
          width: 1px;
          height: 16px;
          background: var(--border-glass);
        }

        .branch-info {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .sys-metrics {
          display: flex;
          gap: 16px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1px;
        }

        .time-display {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
        }
      `}</style>
    </header>
  );
};
