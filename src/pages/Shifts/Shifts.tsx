import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const weekDays = [
  { date: 'Mon Dec 18', shifts: { morning: ['Sarah', 'John'], evening: ['Lisa'] } },
  { date: 'Tue Dec 19', shifts: { morning: ['Mike'], evening: ['Sarah'] } },
  { date: 'Wed Dec 20', shifts: { morning: ['Sarah', 'Mike'], evening: ['John'] } },
  { date: 'Thu Dec 21', shifts: { morning: ['John'], evening: ['Lisa'] } },
  { date: 'Fri Dec 22', shifts: { morning: ['Lisa', 'Mike'], evening: ['Sarah'] } },
];

export const Shifts: React.FC = () => {
  return (
    <div className="shifts-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Shift Management</h1>
          <p className="text-muted">Staff scheduling and operational performance tracking</p>
        </div>
        <div className="header-actions">
          <div className="week-selector glass">
            <ChevronLeft size={18} />
            <span>Week of Dec 18, 2026</span>
            <ChevronRight size={18} />
          </div>
          <button className="btn-primary">
            <Plus size={18} />
            Assign Shift
          </button>
        </div>
      </div>

      <div className="shifts-grid">
        <div className="calendar-view glass">
          <div className="calendar-grid">
            {weekDays.map(day => (
              <div key={day.date} className="day-column">
                <div className="day-header">
                  <span className="day-name">{day.date.split(' ')[0]}</span>
                  <span className="day-date">{day.date.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="shift-slot morning">
                  <span className="slot-label">Morning</span>
                  {day.shifts.morning.map(staff => (
                    <div key={staff} className="staff-tag">
                      <div className="staff-avatar">{staff[0]}</div>
                      {staff}
                    </div>
                  ))}
                </div>
                <div className="shift-slot evening">
                  <span className="slot-label">Evening</span>
                  {day.shifts.evening.map(staff => (
                    <div key={staff} className="staff-tag">
                      <div className="staff-avatar">{staff[0]}</div>
                      {staff}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="performance-panel">
          <div className="glass-card performance glass">
            <h3>Shift Performance</h3>
            <div className="perf-item">
              <div className="perf-header">
                <span className="shift-type">Morning Shift</span>
                <span className="trend down"><TrendingDown size={14} /> Waste 12kg ↓</span>
              </div>
              <p className="perf-note">High efficiency in alert resolution (92%)</p>
            </div>
            <div className="perf-divider"></div>
            <div className="perf-item warning">
              <div className="perf-header">
                <span className="shift-type">Evening Shift</span>
                <span className="trend up"><TrendingUp size={14} /> Waste 23kg ↑</span>
              </div>
              <p className="perf-note">Training recommended for new staff on FEFO procedures.</p>
              <button className="training-btn">Schedule Training</button>
            </div>
          </div>

          <div className="glass-card quick-actions glass">
            <h3>Staff Requests</h3>
            <div className="request-list">
              <div className="request-item">
                <div className="request-info">
                  <span className="staff">Sarah L.</span>
                  <span className="desc">Shift Swap: Dec 20 → Dec 22</span>
                </div>
                <div className="request-btns">
                  <button className="approve-btn">Approve</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shifts-page { display: flex; flex-direction: column; gap: 24px; }
        .header-actions { display: flex; gap: 12px; }
        .week-selector { display: flex; align-items: center; gap: 16px; padding: 10px 20px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }

        .shifts-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        .calendar-view { padding: 24px; border-radius: var(--radius-lg); overflow-x: auto; }
        .calendar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-md); overflow: hidden; }
        
        .day-column { background: var(--bg-deep); display: flex; flex-direction: column; min-height: 400px; }
        .day-header { padding: 16px; border-bottom: 1px solid var(--border-glass); text-align: center; display: flex; flex-direction: column; gap: 4px; }
        .day-name { font-weight: 800; font-size: 0.9rem; }
        .day-date { font-size: 0.75rem; color: var(--text-dim); }

        .shift-slot { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--border-glass); }
        .shift-slot.evening { border-bottom: none; }
        .slot-label { font-size: 0.65rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700; margin-bottom: 4px; }

        .staff-tag { display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
        .staff-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }

        .performance-panel { display: flex; flex-direction: column; gap: 24px; }
        .glass-card { padding: 24px; border-radius: var(--radius-lg); }
        .perf-item { display: flex; flex-direction: column; gap: 8px; }
        .perf-header { display: flex; justify-content: space-between; align-items: center; }
        .shift-type { font-weight: 700; font-size: 1rem; }
        .trend { font-size: 0.75rem; font-weight: 700; }
        .trend.down { color: var(--success); }
        .trend.up { color: var(--danger); }
        .perf-note { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
        .perf-divider { height: 1px; background: var(--border-glass); margin: 16px 0; }

        .training-btn { margin-top: 12px; background: var(--danger-glow); color: var(--danger); border: 1px solid var(--danger); padding: 8px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.8rem; }
        
        .request-list { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .request-item { padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .request-info { display: flex; flex-direction: column; }
        .request-info .staff { font-weight: 700; font-size: 0.9rem; }
        .request-info .desc { font-size: 0.75rem; color: var(--text-dim); }
        .approve-btn { background: var(--primary); color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};
