import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckSquare, AlertTriangle, Star, Trash2, Package, Download, ChevronRight, Play, Coffee, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(true);
  const [shiftTime, setShiftTime] = useState(0);
  const [breakRequested, setBreakRequested] = useState(false);

  useEffect(() => {
    if (!clockedIn) return;
    const timer = setInterval(() => setShiftTime(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, [clockedIn]);

  const baseMinutes = 3 * 60 + 28;
  const totalMin = baseMinutes + Math.floor(shiftTime / 60);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  const tasks = [
    { id: 1, name: 'Stock Check - Dairy Cooler', status: 'done', time: '8:30 AM', feedback: 'Good work, found 2 expiring items' },
    { id: 2, name: 'Receiving - PO-001234', status: 'progress', vendor: 'Dairy Fresh Co', expected: '10:30 AM' },
    { id: 3, name: 'Waste Log - Bakery Section', status: 'pending', due: '12:00 PM' },
    { id: 4, name: 'FEFO Rotation - Cooler B', status: 'pending', due: '2:00 PM' },
  ];

  const performance = { tasksCompleted: 12, tasksTotal: 15, wasteLogged: 45, wasteSaved: 112, onTime: 5, totalDays: 5, rating: 4.2 };
  const renderStars = (r: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill={i < Math.floor(r) ? 'var(--primary)' : 'transparent'} color={i < Math.floor(r) ? 'var(--primary)' : 'var(--text-dim)'} />);

  return (
    <div className="dashboard-container page-container terminal-ui">
      {/* Shift Header */}
      <header className="page-header glow-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>MY SHIFT</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Morning Shift (7:00 AM – 3:00 PM)</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: clockedIn ? 'var(--success)' : 'var(--danger)', boxShadow: clockedIn ? '0 0 8px var(--success)' : 'none' }} />
              <span style={{ fontWeight: 800, color: clockedIn ? 'var(--success)' : 'var(--danger)' }}>{clockedIn ? 'CLOCKED IN at 7:02 AM' : 'CLOCKED OUT'}</span>
            </div>
            <div style={{ padding: '6px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 8 }}>
              <span className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800 }}>TIME ON SHIFT</span>
              <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '1.1rem' }}>{hrs}h {mins}m</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className={clockedIn ? 'btn-secondary small' : 'btn-primary small'} onClick={() => setClockedIn(!clockedIn)} style={clockedIn ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}}>
            <Clock size={14} /> {clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
          </button>
          <button className="btn-secondary small" disabled={breakRequested} onClick={() => setBreakRequested(true)}>
            <Coffee size={14} /> {breakRequested ? 'BREAK REQUESTED ✓' : 'REQUEST BREAK'}
          </button>
          <button className="btn-secondary small" onClick={() => navigate('/alerts')}>
            <AlertTriangle size={14} /> REPORT ISSUE
          </button>
        </div>
      </header>

      {/* Tasks */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckSquare size={18} className="text-primary" /> MY TASKS FOR TODAY</h2>
          <span className="text-dim" style={{ fontSize: '0.75rem', fontWeight: 800 }}>{tasks.filter(t => t.status === 'done').length}/{tasks.length} completed</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tasks.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', background: t.status === 'progress' ? 'rgba(119,188,31,0.04)' : 'transparent', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.status === 'done' ? '✅' : t.status === 'progress' ? '🔄' : '⏳'}</span>
                  <span style={{ fontWeight: 800, color: t.status === 'done' ? 'var(--text-dim)' : 'var(--text-main)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.name}</span>
                </div>
                {t.status === 'done' && t.feedback && (
                  <div className="text-muted" style={{ fontSize: '0.75rem', marginLeft: 28 }}>Manager feedback: {t.feedback}</div>
                )}
                {t.status === 'done' && t.time && (
                  <div className="text-dim" style={{ fontSize: '0.7rem', marginLeft: 28 }}>Completed at {t.time}</div>
                )}
                {t.status === 'progress' && (
                  <div className="text-muted" style={{ fontSize: '0.75rem', marginLeft: 28 }}>Vendor: {t.vendor} │ Expected: {t.expected}</div>
                )}
                {t.status === 'pending' && (
                  <div className="text-dim" style={{ fontSize: '0.7rem', marginLeft: 28 }}>Due: {t.due}</div>
                )}
              </div>
              <div>
                {t.status === 'progress' && (
                  <button className="btn-primary small" onClick={() => navigate('/receiving')}><Play size={14} /> CONTINUE</button>
                )}
                {t.status === 'pending' && (
                  <button className="btn-secondary small" onClick={() => navigate(t.name.includes('Waste') ? '/waste-log' : t.name.includes('FEFO') ? '/inventory' : '/tasks')}><Play size={14} /> START</button>
                )}
                {t.status === 'done' && (
                  <span className="text-success" style={{ fontWeight: 800, fontSize: '0.75rem' }}>● DONE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
        <button className="panel" onClick={() => navigate('/waste-log')} style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-glass)', transition: 'var(--transition)' }}>
          <Trash2 size={20} className="text-warning" /><span style={{ fontWeight: 800 }}>LOG WASTE</span><ChevronRight size={16} className="text-dim" style={{ marginLeft: 'auto' }} />
        </button>
        <button className="panel" onClick={() => navigate('/receiving')} style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-glass)', transition: 'var(--transition)' }}>
          <Download size={20} className="text-primary" /><span style={{ fontWeight: 800 }}>RECEIVE DELIVERY</span><ChevronRight size={16} className="text-dim" style={{ marginLeft: 'auto' }} />
        </button>
        <button className="panel" onClick={() => navigate('/inventory')} style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-glass)', transition: 'var(--transition)' }}>
          <Package size={20} className="text-primary" /><span style={{ fontWeight: 800 }}>COUNT INVENTORY</span><ChevronRight size={16} className="text-dim" style={{ marginLeft: 'auto' }} />
        </button>
        <button className="panel" onClick={() => navigate('/alerts')} style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-glass)', transition: 'var(--transition)' }}>
          <AlertTriangle size={20} className="text-danger" /><span style={{ fontWeight: 800 }}>VIEW ALERTS</span><ChevronRight size={16} className="text-dim" style={{ marginLeft: 'auto' }} />
        </button>
      </div>

      {/* Performance */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={18} className="text-primary" /> MY PERFORMANCE THIS WEEK</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, padding: '8px 0' }}>
          <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-glass)', borderRadius: 8 }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 8 }}>TASKS COMPLETED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{performance.tasksCompleted}/{performance.tasksTotal}</div>
            <div className="progress-bar mt-2"><div className="progress" style={{ width: `${(performance.tasksCompleted / performance.tasksTotal) * 100}%`, background: 'var(--primary)' }} /></div>
            <div className="text-muted" style={{ fontSize: '0.7rem', marginTop: 4 }}>{Math.round((performance.tasksCompleted / performance.tasksTotal) * 100)}%</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-glass)', borderRadius: 8 }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 8 }}>WASTE LOGGED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{performance.wasteLogged} units</div>
            <div className="text-primary" style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: 4 }}>${performance.wasteSaved} saved</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-glass)', borderRadius: 8 }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 8 }}>ON-TIME CLOCK-INS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{performance.onTime}/{performance.totalDays} days</div>
            <div className="text-success" style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: 4 }}>✅ Perfect</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-glass)', borderRadius: 8 }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 8 }}>MANAGER RATING</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>{renderStars(performance.rating)}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{performance.rating}/5</div>
          </div>
        </div>
      </div>
    </div>
  );
};
