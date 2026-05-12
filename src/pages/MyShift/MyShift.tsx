import React from 'react';
import { Clock, CheckSquare, AlertCircle, PlayCircle, Info } from 'lucide-react';
import './MyShift.css';

export const MyShift: React.FC = () => {
  return (
    <div className="myshift-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">SHIFT</span>
            <span className="stat-value text-bright">Morning (7:00 AM - 3:00 PM)</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TIME CLOCKED IN</span>
            <span className="stat-value text-primary">2h 15m</span>
          </div>
          <div className="stat-group performance-banner" style={{background: 'rgba(0, 255, 65, 0.05)'}}>
            <span className="text-primary font-bold">You're on track! Complete 5 more tasks to hit your daily goal.</span>
          </div>
        </div>
      </header>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📋 MY TASKS FOR TODAY (6 pending)</h2>
          </div>
          <div className="task-list">
            <div className="task-card priority-high">
              <div className="task-header">
                <div className="task-title">
                  <span className="checkbox">☐</span> TASK #1 | STOCK CHECK - Dairy Cooler
                </div>
                <div className="task-meta">
                  <span className="badge badge-danger">HIGH PRIORITY</span>
                </div>
              </div>
              <div className="task-body">
                <div className="task-info">
                  <span><strong>Assigned by:</strong> Jane Smith</span>
                  <span><strong>Due:</strong> 11:00 AM</span>
                  <span className="text-warning"><strong>Time left:</strong> 1h 45m</span>
                </div>
                <p className="task-instructions">
                  Instructions: Check expiry dates for all dairy products. Report any items expiring within 7 days.
                </p>
                <div className="task-actions">
                  <button className="btn-primary small"><PlayCircle size={14} /> START TASK</button>
                  <button className="btn-secondary small"><Info size={14} /> VIEW DETAILS</button>
                </div>
              </div>
            </div>

            <div className="task-card priority-high">
              <div className="task-header">
                <div className="task-title">
                  <span className="checkbox">☐</span> TASK #2 | RECEIVE DELIVERY - PO-001234
                </div>
                <div className="task-meta">
                  <span className="badge badge-danger">HIGH PRIORITY</span>
                </div>
              </div>
              <div className="task-body">
                <div className="task-info">
                  <span><strong>Assigned by:</strong> Jane Smith</span>
                  <span><strong>Due:</strong> 10:30 AM</span>
                  <span className="text-warning"><strong>Time left:</strong> 1h 15m</span>
                </div>
                <p className="task-instructions">Vendor: Dairy Fresh Co | Items: 200u Milk, 150u Cheese</p>
                <div className="task-actions">
                  <button className="btn-primary small"><PlayCircle size={14} /> START TASK</button>
                </div>
              </div>
            </div>

            <div className="task-card priority-medium">
              <div className="task-header">
                <div className="task-title">
                  <span className="checkbox">☐</span> TASK #3 | WASTE LOGGING - Bakery Section
                </div>
                <div className="task-meta">
                  <span className="badge badge-warning">MEDIUM PRIORITY</span>
                </div>
              </div>
              <div className="task-body">
                <div className="task-info">
                  <span><strong>Assigned by:</strong> System (auto)</span>
                  <span><strong>Due:</strong> 12:00 PM</span>
                  <span><strong>Time left:</strong> 2h 45m</span>
                </div>
                <p className="task-instructions">Items expiring today: 15 units Sourdough Bread</p>
                <div className="task-actions">
                  <button className="btn-primary small"><PlayCircle size={14} /> START TASK</button>
                </div>
              </div>
            </div>

            <div className="task-card priority-low">
              <div className="task-header">
                <div className="task-title">
                  <span className="checkbox">☐</span> TASK #4 | SHELF RESTOCK - Produce Aisle
                </div>
                <div className="task-meta">
                  <span className="badge badge-success">LOW PRIORITY</span>
                </div>
              </div>
              <div className="task-body">
                <div className="task-info">
                  <span><strong>Assigned by:</strong> Mike Johnson</span>
                  <span><strong>Due:</strong> 2:00 PM</span>
                  <span><strong>Time left:</strong> 4h 45m</span>
                </div>
                <div className="task-actions">
                  <button className="btn-primary small"><PlayCircle size={14} /> START TASK</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-panels">
          <div className="panel mb-4">
            <div className="panel-header">
              <h2>✅ COMPLETED TODAY (4 tasks)</h2>
            </div>
            <ul className="completed-list">
              <li>
                <CheckSquare size={14} className="text-success" />
                <div className="comp-info">
                  <strong>Stock count - Produce</strong>
                  <span>Completed at 08:30 | Verified by System</span>
                </div>
              </li>
              <li>
                <CheckSquare size={14} className="text-success" />
                <div className="comp-info">
                  <strong>Temperature check - All coolers</strong>
                  <span>Completed at 08:00 | All good</span>
                </div>
              </li>
              <li>
                <CheckSquare size={14} className="text-success" />
                <div className="comp-info">
                  <strong>Waste log - Dairy</strong>
                  <span>Completed at 07:45 | 12 units recorded</span>
                </div>
              </li>
              <li>
                <CheckSquare size={14} className="text-success" />
                <div className="comp-info">
                  <strong>FEFO rotation - Dairy cooler</strong>
                  <span>Completed at 07:30 | <span className="text-warning">2 violations</span></span>
                </div>
              </li>
            </ul>
          </div>

          <div className="panel mb-4">
            <div className="panel-header">
              <h2>📊 MY PERFORMANCE THIS WEEK</h2>
            </div>
            <div className="perf-stats">
              <div className="perf-row"><span>Tasks completed:</span> <span>28/35 (80%)</span></div>
              <div className="perf-row"><span>Waste logged:</span> <span>67 units</span></div>
              <div className="perf-row"><span>Waste prevented:</span> <span className="text-primary">$340 saved</span></div>
              <div className="perf-row"><span>Quality checks:</span> <span>12 passed</span></div>
              <div className="mt-2 text-primary font-bold text-center">You're in the TOP 3 staff this week! 🎉</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>⏰ QUICK ACTIONS</h2>
            </div>
            <div className="quick-actions grid grid-cols-2 gap-2" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <button className="btn-secondary text-center justify-center">CLOCK OUT</button>
              <button className="btn-secondary text-center justify-center">REPORT ISSUE</button>
              <button className="btn-secondary text-center justify-center">REQUEST BREAK</button>
              <button className="btn-secondary text-center justify-center">VIEW SCHEDULE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
