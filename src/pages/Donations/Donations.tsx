import React, { useState } from 'react';
import { Heart, Package, Truck, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Donations: React.FC = () => {
  const location = useLocation();
  const fromAlert = (location.state as { fromAlert?: string } | null)?.fromAlert;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page-container terminal-ui">
      <header className="page-header glow-panel mb-4" style={{ padding: '20px' }}>
        <h1 className="text-primary m-0" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={22} /> CHARITY DONATION DISPOSAL
        </h1>
        <p className="text-muted" style={{ marginTop: '8px', maxWidth: '640px' }}>
          Earmark safe, near-expiry inventory for verified food-bank partners. HQ schedules pickup and sends you a confirmation label.
        </p>
        {fromAlert && (
          <p className="text-primary" style={{ marginTop: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
            Linked from alert #{fromAlert} — pre-fill quantities from that SKU when logging pickup.
          </p>
        )}
      </header>

      <div className="panel" style={{ padding: '24px', maxWidth: '720px' }}>
        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0', textAlign: 'center' }}>
            <CheckCircle size={48} className="text-primary" />
            <p className="text-main font-bold m-0">Donation request logged</p>
            <p className="text-muted text-sm m-0">Partner dispatch will contact the store within 24h.</p>
          </div>
        ) : (
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label className="text-xs text-muted block mb-1">Product / SKU</label>
              <input type="text" className="terminal-input w-full" placeholder="e.g. 2% Milk — MK-2001" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="text-xs text-muted block mb-1">Units to donate</label>
                <input type="number" className="terminal-input w-full" min={1} defaultValue={12} />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Pickup window</label>
                <select className="terminal-select w-full">
                  <option>Tomorrow AM</option>
                  <option>Tomorrow PM</option>
                  <option>Within 48h</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Partner (auto-routed)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }} className="text-muted">
                <Truck size={16} className="text-primary" />
                <span>Metro Food Rescue (nearest cold chain)</span>
              </div>
            </div>
            <div
              className="text-muted text-xs"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                border: '1px solid var(--border-glass)',
                padding: '12px',
                borderRadius: '4px',
              }}
            >
              <Package size={16} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Donations must meet temperature logs and packaging rules. Damaged or opened goods should use <strong className="text-main">Waste Log</strong> instead.
              </span>
            </div>
            <button type="submit" className="btn-primary w-full" style={{ justifyContent: 'center' }}>
              SUBMIT DONATION REQUEST
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
