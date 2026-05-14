import React, { useState, useEffect } from 'react';
import { Clock, CheckSquare, AlertCircle, PlayCircle, Coffee, Calendar, LogOut, MessageSquare, ChevronRight, Star, Zap, Bell, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MyShift.css';

type ClockStatus = 'IN' | 'OUT';
type RequestStatus = 'PENDING' | 'APPROVED' | 'DENIED';

interface BreakRequest {
  id: string;
  time: string;
  duration: string;
  status: RequestStatus;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
}

interface IssueReport {
  id: string;
  type: string;
  issue: string;
  priority: string;
  reportedAt: string;
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  response?: string;
  respondedBy?: string;
}

interface ShiftTask {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedBy: string;
  dueTime: string;
  timeLeft?: string;
  instructions?: string;
  completedAt?: string;
  managerNote?: string;
}

import { taskService } from '../../services/api';
import { Pagination } from '../../components/Pagination';

export const MyShift: React.FC = () => {
  const { user } = useAuth();
  const [clockStatus, setClockStatus] = useState<ClockStatus>('IN');
  const [clockInTime, setClockInTime] = useState('7:02 AM');
  const [elapsed, setElapsed] = useState('0h 0m');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [breakDuration, setBreakDuration] = useState('30 minutes');
  const [breakReason, setBreakReason] = useState('');
  const [issueType, setIssueType] = useState('Temperature Issue');
  const [issueDesc, setIssueDesc] = useState('');
  const [issuePriority, setIssuePriority] = useState('Medium');
  const [activeTaskTab, setActiveTaskTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [tasks, setTasks] = useState<ShiftTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [breakRequests, setBreakRequests] = useState<BreakRequest[]>([]);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchTasks(currentPage);
    }
  }, [user, currentPage]);

  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await taskService.getTasks({ assigned_to: user?.id, page });
      const data = res.data;
      let results: any[] = [];
      
      if (data.results) {
        results = data.results;
        setTotalCount(data.count);
      } else {
        results = Array.isArray(data) ? data : [];
        setTotalCount(results.length);
      }
      
      const mapped: ShiftTask[] = results.map((t: any) => ({
        id: String(t.id),
        title: t.title,
        priority: t.priority.toUpperCase() as any,
        status: t.status.toUpperCase().replace(' ', '_') as any,
        assignedBy: t.created_by_name || 'System',
        dueTime: t.due_date ? new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        instructions: t.description
      }));
      setTasks(mapped);
    } catch (err) {
      console.error('Failed to fetch user tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const handleSubmitBreak = () => {
    const newReq: BreakRequest = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: breakDuration,
      status: 'PENDING'
    };
    setBreakRequests(prev => [newReq, ...prev]);
    setShowBreakModal(false);
    setBreakReason('');
  };

  const handleSubmitIssue = () => {
    const newIssue: IssueReport = {
      id: Date.now().toString(),
      type: issueType,
      issue: issueDesc,
      priority: issuePriority,
      reportedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };
    setIssueReports(prev => [newIssue, ...prev]);
    setShowIssueModal(false);
    setIssueDesc('');
  };

  const statusColor = (s: RequestStatus | 'IN_REVIEW' | 'RESOLVED') => {
    if (s === 'APPROVED' || s === 'RESOLVED') return 'badge-success';
    if (s === 'DENIED') return 'badge-danger';
    if (s === 'IN_REVIEW') return 'badge-warning';
    return 'badge-warning';
  };

  return (
    <div className="myshift-container page-container terminal-ui">
      {/* Header */}
      <header className="page-header glow-panel mb-4">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">TODAY'S SHIFT</span>
            <span className="stat-value text-bright">Morning (7:00 AM – 3:00 PM)</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">STATUS</span>
            <span className="stat-value">
              {clockStatus === 'IN'
                ? <span className="text-success flex items-center gap-2"><span className="pulse-dot"></span>CLOCKED IN at {clockInTime}</span>
                : <span className="text-dim">● CLOCKED OUT</span>}
            </span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TIME ON SHIFT</span>
            <span className="stat-value text-primary">{elapsed}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TASKS</span>
            <span className="stat-value text-success">{completedTasks.length}/{tasks.length} done</span>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="quick-actions-grid mb-4">
        <button
          className={`action-card action-clockout${clockStatus === 'OUT' ? ' disabled' : ''}`}
          onClick={() => clockStatus === 'IN' && setShowClockOutModal(true)}
          disabled={clockStatus === 'OUT'}
        >
          <div className="action-icon-wrap"><LogOut size={22} /></div>
          <div className="action-label">CLOCK OUT</div>
          {clockStatus === 'IN' && <div className="action-sub">End your shift</div>}
        </button>
        <button className="action-card action-break" onClick={() => setShowBreakModal(true)}>
          <div className="action-icon-wrap"><Coffee size={22} /></div>
          <div className="action-label">REQUEST BREAK</div>
          <div className="action-sub">Ask manager</div>
        </button>
        <button className="action-card action-issue" onClick={() => setShowIssueModal(true)}>
          <div className="action-icon-wrap"><AlertCircle size={22} /></div>
          <div className="action-label">REPORT ISSUE</div>
          <div className="action-sub">Flag a problem</div>
        </button>
        <button className="action-card action-schedule">
          <div className="action-icon-wrap"><Calendar size={22} /></div>
          <div className="action-label">VIEW SCHEDULE</div>
          <div className="action-sub">This week</div>
        </button>
      </div>

      <div className="main-grid">
        {/* Tasks Panel */}
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📋 MY TASKS</h2>
            <div className="flex gap-2">
              <button
                className={activeTaskTab === 'PENDING' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTaskTab('PENDING')}
              >
                PENDING ({pendingTasks.length})
              </button>
              <button
                className={activeTaskTab === 'COMPLETED' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTaskTab('COMPLETED')}
              >
                DONE ({completedTasks.length})
              </button>
            </div>
          </div>

          <div className="task-list">
            {activeTaskTab === 'PENDING' && pendingTasks.map(task => (
              <div key={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
                <div className="task-header">
                  <div className="flex items-center gap-3">
                    <span className={`priority-pip priority-${task.priority.toLowerCase()}`}></span>
                    <div>
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta-row">
                        <span>By: {task.assignedBy}</span>
                        <span>Due: {task.dueTime}</span>
                        {task.timeLeft && <span className="text-warning">⏱ {task.timeLeft} left</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${task.priority === 'HIGH' ? 'badge-danger' : task.priority === 'MEDIUM' ? 'badge-warning' : 'badge-success'}`}>
                    {task.priority}
                  </span>
                </div>
                {task.instructions && (
                  <div className="task-instructions">{task.instructions}</div>
                )}
                <div className="task-actions">
                  {task.status === 'IN_PROGRESS'
                    ? <button className="btn-primary small"><PlayCircle size={13} /> CONTINUE</button>
                    : <button className="btn-primary small"><PlayCircle size={13} /> START TASK</button>
                  }
                  <button className="btn-secondary small"><MessageSquare size={13} /> CLARIFY</button>
                  {task.status === 'IN_PROGRESS' && (
                    <span className="status-in-progress ml-auto">🔄 IN PROGRESS</span>
                  )}
                </div>
              </div>
            ))}

            {activeTaskTab === 'COMPLETED' && completedTasks.map(task => (
              <div key={task.id} className="task-card task-completed">
                <div className="task-header">
                  <div className="flex items-center gap-3">
                    <CheckSquare size={18} className="text-success" />
                    <div>
                      <div className="task-title text-muted">{task.title}</div>
                      <div className="task-meta-row">
                        <span>Completed at {task.completedAt}</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-success">DONE</span>
                </div>
                {task.managerNote && (
                  <div className="manager-note">
                    <Star size={12} className="text-warning" />
                    <span>Manager: "{task.managerNote}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* Performance */}
          <div className="panel mb-4">
            <div className="panel-header">
              <h2>📊 MY PERFORMANCE</h2>
            </div>
            <div className="perf-stats">
              <div className="perf-row">
                <span>Tasks completed</span>
                <span className="text-success">28/35 (80%)</span>
              </div>
              <div className="perf-row">
                <span>Waste logged</span>
                <span>67 units</span>
              </div>
              <div className="perf-row">
                <span>Waste prevented</span>
                <span className="text-primary">$340 saved</span>
              </div>
              <div className="perf-row">
                <span>Quality checks</span>
                <span>12 passed</span>
              </div>
            </div>
            <div className="perf-badge mt-3">
              <Zap size={14} className="text-warning" />
              <span>Top 3 staff this week!</span>
            </div>
          </div>

          {/* Requests & Responses */}
          <div className="panel">
            <div className="panel-header">
              <h2>💬 REQUESTS & RESPONSES</h2>
            </div>
            <div className="requests-list">
              {breakRequests.map(req => (
                <div key={req.id} className="request-item">
                  <div className="request-header">
                    <div className="flex items-center gap-2">
                      <Coffee size={14} className="text-primary" />
                      <span className="text-main font-bold text-xs">BREAK REQUEST</span>
                      <span className="text-dim text-xs">— {req.time}</span>
                    </div>
                    <span className={`badge ${statusColor(req.status)}`}>{req.status}</span>
                  </div>
                  <div className="request-detail">
                    <span className="text-dim">Duration: </span><span>{req.duration}</span>
                  </div>
                  {req.response && (
                    <div className="request-response">
                      <span className="text-dim">{req.respondedBy} at {req.respondedAt}:</span>
                      <p>"{req.response}"</p>
                    </div>
                  )}
                </div>
              ))}

              {issueReports.map(report => (
                <div key={report.id} className="request-item request-issue">
                  <div className="request-header">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-warning" />
                      <span className="text-main font-bold text-xs">ISSUE REPORTED</span>
                      <span className="text-dim text-xs">— {report.reportedAt}</span>
                    </div>
                    <span className={`badge ${statusColor(report.status)}`}>{report.status.replace('_', ' ')}</span>
                  </div>
                  <div className="request-detail">
                    <span className="text-dim">Type: </span><span>{report.type}</span>
                  </div>
                  <div className="request-detail">
                    <span className="text-dim">Issue: </span><span>{report.issue}</span>
                  </div>
                  {report.response && (
                    <div className="request-response">
                      <span className="text-dim">{report.respondedBy}:</span>
                      <p>"{report.response}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clock Out Modal */}
      {showClockOutModal && (
        <div className="modal-overlay" onClick={() => setShowClockOutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><LogOut size={16} /> CLOCK OUT</h3>
              <button className="btn-icon" onClick={() => setShowClockOutModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="clockout-summary">
                <div className="co-row"><span>Shift:</span><span>Morning (7:00 AM – 3:00 PM)</span></div>
                <div className="co-row"><span>Clocked in:</span><span>{clockInTime}</span></div>
                <div className="co-row"><span>Time worked:</span><span className="text-primary">{elapsed}</span></div>
                <div className="co-row"><span>Tasks completed:</span><span className="text-success">{completedTasks.length}/{tasks.length}</span></div>
              </div>
              <label className="text-xs text-muted block mb-1 mt-3">End of shift notes (optional)</label>
              <textarea className="terminal-input w-full" rows={3} placeholder="Any handover notes for the next shift..." />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowClockOutModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={() => { setClockStatus('OUT'); setShowClockOutModal(false); }}>
                CONFIRM CLOCK OUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Break Request Modal */}
      {showBreakModal && (
        <div className="modal-overlay" onClick={() => setShowBreakModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Coffee size={16} /> REQUEST BREAK</h3>
              <button className="btn-icon" onClick={() => setShowBreakModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <label className="text-xs text-muted block mb-1">Break Duration</label>
              <select className="terminal-select w-full mb-3" value={breakDuration} onChange={e => setBreakDuration(e.target.value)}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>1 hour</option>
              </select>
              <label className="text-xs text-muted block mb-1">Reason (optional)</label>
              <textarea className="terminal-input w-full" rows={3} placeholder="Optional reason..." value={breakReason} onChange={e => setBreakReason(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBreakModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={handleSubmitBreak}>SUBMIT REQUEST</button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Report Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><AlertCircle size={16} /> REPORT ISSUE</h3>
              <button className="btn-icon" onClick={() => setShowIssueModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <label className="text-xs text-muted block mb-1">Issue Type</label>
              <select className="terminal-select w-full mb-3" value={issueType} onChange={e => setIssueType(e.target.value)}>
                <option>Equipment Malfunction</option>
                <option>Temperature Issue</option>
                <option>Stock Discrepancy</option>
                <option>Safety Concern</option>
                <option>Other</option>
              </select>
              <label className="text-xs text-muted block mb-1">Description</label>
              <textarea className="terminal-input w-full mb-3" rows={4} placeholder="Describe the issue in detail..." value={issueDesc} onChange={e => setIssueDesc(e.target.value)} />
              <label className="text-xs text-muted block mb-1">Priority</label>
              <select className="terminal-select w-full" value={issuePriority} onChange={e => setIssuePriority(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowIssueModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={handleSubmitIssue}>SUBMIT REPORT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
