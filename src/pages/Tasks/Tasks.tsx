import React from 'react';
import { CheckSquare, PlayCircle, Info, MessageSquare } from 'lucide-react';
import './Tasks.css';

export const Tasks: React.FC = () => {
  return (
    <div className="tasks-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button className="btn-primary flex-1">📋 PENDING (6)</button>
        <button className="btn-secondary flex-1 text-success">✅ COMPLETED (4)</button>
        <button className="btn-secondary flex-1 text-danger">⏰ OVERDUE (0)</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📋 PENDING TASKS</h2>
          </div>
          <div className="task-list">
            <div className="task-card priority-high">
              <div className="task-header border-b border-glass pb-2 mb-2">
                <div className="text-danger font-bold text-xs flex justify-between w-full">
                  <span>🔴 HIGH PRIORITY</span>
                  <span>Due in 1h 15m</span>
                </div>
              </div>
              <div className="task-title text-main font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">🥛</span> Stock Check - Dairy Cooler
              </div>
              <div className="text-xs text-muted mb-3 flex gap-4">
                <span>Assigned by: Jane Smith</span>
                <span>Created: 08:00 AM</span>
              </div>
              <div className="text-sm text-dim mb-4 border-l-2 border-primary-dark pl-2">
                Instructions: Check all expiry dates in Cooler A. Report any items expiring within 7 days.
              </div>
              <div className="task-actions border-t border-glass pt-3 mt-auto flex gap-2">
                <button className="btn-primary small"><PlayCircle size={14} className="mr-1" /> START TASK</button>
                <button className="btn-secondary small"><Info size={14} className="mr-1" /> VIEW DETAILS</button>
                <button className="btn-secondary small text-warning ml-auto"><MessageSquare size={14} className="mr-1" /> REQUEST CLARIFICATION</button>
              </div>
            </div>

            <div className="task-card priority-medium">
              <div className="task-header border-b border-glass pb-2 mb-2">
                <div className="text-warning font-bold text-xs flex justify-between w-full">
                  <span>🟡 MEDIUM PRIORITY</span>
                  <span>Due in 2h 45m</span>
                </div>
              </div>
              <div className="task-title text-main font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">🍞</span> Waste Logging - Bakery Section
              </div>
              <div className="text-xs text-muted mb-3 flex gap-4">
                <span>Assigned by: System (auto)</span>
                <span>Created: 09:00 AM</span>
              </div>
              <div className="text-sm text-dim mb-4 border-l-2 border-primary-dark pl-2">
                Items expiring today: 15 units Sourdough Bread
              </div>
              <div className="task-actions border-t border-glass pt-3 mt-auto flex gap-2">
                <button className="btn-primary small"><PlayCircle size={14} className="mr-1" /> START TASK</button>
                <button className="btn-secondary small"><Info size={14} className="mr-1" /> VIEW DETAILS</button>
              </div>
            </div>

            <div className="task-card priority-low">
              <div className="task-header border-b border-glass pb-2 mb-2">
                <div className="text-success font-bold text-xs flex justify-between w-full">
                  <span>🟢 LOW PRIORITY</span>
                  <span>Due in 4h 45m</span>
                </div>
              </div>
              <div className="task-title text-main font-bold mb-2 flex items-center gap-2">
                <span className="text-xl">📦</span> Shelf Restock - Produce Aisle
              </div>
              <div className="text-xs text-muted mb-3 flex gap-4">
                <span>Assigned by: Mike Johnson</span>
                <span>Created: 08:30 AM</span>
              </div>
              <div className="text-sm text-dim mb-4 border-l-2 border-primary-dark pl-2">
                Standard restock procedure for organic section.
              </div>
              <div className="task-actions border-t border-glass pt-3 mt-auto flex gap-2">
                <button className="btn-primary small"><PlayCircle size={14} className="mr-1" /> START TASK</button>
                <button className="btn-secondary small"><Info size={14} className="mr-1" /> VIEW DETAILS</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>✅ COMPLETED TODAY</h2>
          </div>
          <ul className="completed-list">
            <li>
              <CheckSquare size={14} className="text-success" />
              <div className="comp-info">
                <strong>Stock count - Produce</strong>
                <span>Completed at 08:30 | Verified</span>
              </div>
            </li>
            <li>
              <CheckSquare size={14} className="text-success" />
              <div className="comp-info">
                <strong>Temp check - Coolers</strong>
                <span>Completed at 08:00 | Verified</span>
              </div>
            </li>
            <li>
              <CheckSquare size={14} className="text-success" />
              <div className="comp-info">
                <strong>Waste log - Dairy</strong>
                <span>Completed at 07:45 | 12 units</span>
              </div>
            </li>
            <li>
              <CheckSquare size={14} className="text-success" />
              <div className="comp-info">
                <strong>FEFO rotation - Dairy</strong>
                <span>Completed at 07:30 | Auto-verified</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
