import React, { useState } from 'react';
import { 
  Trash2, 
  Search, 
  Camera, 
  AlertTriangle,
  History,
  TrendingDown,
  ChevronRight,
  Plus,
  ArrowRight,
  FileText
} from 'lucide-react';

export const Waste: React.FC = () => {
  return (
    <div className="waste-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Waste Log</h1>
          <p className="text-muted">Record operational waste and identify mitigation patterns</p>
        </div>
      </div>

      <div className="waste-grid">
        <div className="log-form-container">
          <div className="glass-card log-waste glass">
            <div className="section-header">
              <h3>LOG NEW WASTE</h3>
              <button className="btn-secondary small"><FileText size={14} /> Batch Mode</button>
            </div>
            
            <form className="waste-form">
              <div className="form-group">
                <label>Product</label>
                <div className="search-box glass">
                  <Search size={18} />
                  <input type="text" placeholder="Scan barcode or type name..." />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" placeholder="0" className="glass-input" />
                </div>
                <div className="form-group">
                  <label>Batch ID</label>
                  <input type="text" placeholder="L2401" className="glass-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Waste</label>
                <div className="reason-grid">
                  <button type="button" className="reason-btn active">Expired</button>
                  <button type="button" className="reason-btn">Damaged</button>
                  <button type="button" className="reason-btn">Quality Issue</button>
                  <button type="button" className="reason-btn">Returns</button>
                </div>
              </div>

              <div className="form-group">
                <label>Evidence</label>
                <button type="button" className="photo-upload glass">
                  <Camera size={24} />
                  <span>Attach Photo or Scan</span>
                </button>
              </div>

              <button type="submit" className="btn-primary full-width">
                <Trash2 size={18} />
                SUBMIT WASTE LOG
              </button>
            </form>
          </div>
        </div>

        <div className="analytics-container">
          <div className="glass-card impact glass">
            <h3>TODAY'S IMPACT</h3>
            <div className="reason-chart">
              <div className="chart-row">
                <span className="label">Expired: $135 (45u)</span>
                <div className="bar-bg"><div className="bar-fill danger" style={{ width: '70%' }}></div></div>
              </div>
              <div className="chart-row">
                <span className="label">Damaged: $24 (8u)</span>
                <div className="bar-bg"><div className="bar-fill warning" style={{ width: '15%' }}></div></div>
              </div>
              <div className="chart-row">
                <span className="label">Quality: $42 (15u)</span>
                <div className="bar-bg"><div className="bar-fill secondary" style={{ width: '25%' }}></div></div>
              </div>
            </div>
            <div className="impact-footer">
              <div className="total">
                <span className="label">TOTAL TODAY</span>
                <span className="value">$201.00</span>
              </div>
            </div>
          </div>

          <div className="glass-card trend glass">
            <div className="trend-header">
              <h3>WEEKLY TREND</h3>
              <div className="trend-badge success"><TrendingDown size={14} /> -35% vs lw</div>
            </div>
            <div className="mini-bars">
              {[180, 201, 156, 134, 89, 67].map((val, i) => (
                <div key={i} className="mini-bar-col">
                  <div className="bar-fill" style={{ height: `${(val/210)*100}%` }}></div>
                  <span>{['M','T','W','T','F','S'][i]}</span>
                </div>
              ))}
            </div>
            <p className="trend-note">Improving! You've saved $1,240 this week through proactive discounting.</p>
          </div>

          <div className="glass-card history glass">
            <div className="section-header">
              <h3>RECENT ENTRIES</h3>
              <History size={16} className="text-dim" />
            </div>
            <div className="history-list">
              {[
                { time: '10:32 AM', product: '2% Milk', qty: '45u', reason: 'Expired', staff: 'Jane' },
                { time: '09:15 AM', product: 'Bread', qty: '12u', reason: 'Quality', staff: 'Mike' },
              ].map((item, i) => (
                <div key={i} className="history-item">
                  <div className="item-main">
                    <span className="time">{item.time}</span>
                    <span className="product">{item.product} ({item.qty})</span>
                  </div>
                  <div className="item-meta">
                    <span className="reason">{item.reason}</span>
                    <span className="staff">by {item.staff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .waste-page { display: flex; flex-direction: column; gap: 24px; }
        .waste-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        
        .glass-card { padding: 24px; border-radius: var(--radius-lg); margin-bottom: 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .section-header h3 { font-size: 0.9rem; font-weight: 800; color: var(--text-dim); }

        .waste-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .glass-input { background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-main); padding: 12px 16px; border-radius: 8px; outline: none; transition: var(--transition); }
        .glass-input:focus { border-color: var(--primary); }

        .reason-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .reason-btn { padding: 10px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-muted); font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: var(--transition); }
        .reason-btn:hover { border-color: var(--text-main); }
        .reason-btn.active { background: var(--primary-glow); border-color: var(--primary); color: var(--primary); }

        .photo-upload { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px; border: 2px dashed var(--border-glass); border-radius: 12px; color: var(--text-dim); cursor: pointer; transition: var(--transition); }
        .photo-upload:hover { border-color: var(--primary); color: var(--text-main); }
        .photo-upload span { font-size: 0.8rem; font-weight: 600; }

        .reason-chart { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .chart-row { display: flex; flex-direction: column; gap: 6px; }
        .chart-row .label { font-size: 0.8rem; font-weight: 600; }
        .bar-bg { height: 6px; background: var(--bg-glass); border-radius: 100px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 100px; }
        .bar-fill.danger { background: var(--danger); }
        .bar-fill.warning { background: var(--warning); }
        .bar-fill.secondary { background: var(--secondary); }

        .impact-footer { pt: 16px; border-top: 1px solid var(--border-glass); }
        .total { display: flex; justify-content: space-between; align-items: center; }
        .total .label { font-weight: 800; font-size: 0.8rem; color: var(--text-dim); }
        .total .value { font-weight: 800; font-size: 1.5rem; color: var(--primary); }

        .trend-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .trend-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px; }
        .trend-badge.success { background: var(--success-glow); color: var(--success); }
        
        .mini-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 60px; margin-bottom: 12px; }
        .mini-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
        .mini-bar-col .bar-fill { width: 80%; background: var(--primary); border-radius: 2px 2px 0 0; }
        .mini-bar-col span { font-size: 0.65rem; font-weight: 700; color: var(--text-dim); }
        .trend-note { font-size: 0.75rem; color: var(--text-muted); line-height: 1.4; }

        .history-list { display: flex; flex-direction: column; gap: 12px; }
        .history-item { padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; }
        .item-main { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .item-main .time { font-family: monospace; font-size: 0.75rem; color: var(--text-dim); }
        .item-main .product { font-weight: 700; font-size: 0.85rem; }
        .item-meta { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700; }
        .item-meta .reason { color: var(--danger); }
        .item-meta .staff { color: var(--text-dim); }

        .full-width { width: 100%; justify-content: center; }
      `}</style>
    </div>
  );
};
