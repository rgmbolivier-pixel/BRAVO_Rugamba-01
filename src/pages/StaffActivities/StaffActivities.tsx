import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Plus, MessageSquare, CheckCircle, Clock, AlertCircle, X, ChevronDown, ChevronUp, UserCheck, Loader2 } from 'lucide-react';
import { userService, taskService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './StaffActivities.css';

type StaffStatus = 'ON_SHIFT' | 'OFF_SHIFT' | 'ON_BREAK';
type RequestStatus = 'PENDING' | 'APPROVED' | 'DENIED';

interface Task { id: string; name: string; status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'; time?: string; }
interface ActionTaken { description: string; time?: string; }
interface BreakRequest { time: string; status: RequestStatus; }
interface IssueReport { issue: string; status: 'IN_REVIEW' | 'RESOLVED'; }

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  clockInTime?: string;
  tasks: Task[];
  actionsTaken: ActionTaken[];
  breakRequest?: BreakRequest;
  issueReported?: IssueReport;
}

import { Pagination } from '../../components/Pagination';

export const StaffActivities: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [expandedStaff, setExpandedStaff] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        userService.getUsers({ page }),
        taskService.getTasks()
      ]);

      const usersData = usersRes.data;
      let users: any[] = [];
      if (usersData.results) {
        users = usersData.results;
        setTotalCount(usersData.count);
      } else {
        users = Array.isArray(usersData) ? usersData : [];
        setTotalCount(users.length);
      }
      
      const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : (tasksRes.data.results || []);

      const mapped = users.map((u: any) => ({
        id: String(u.id),
        name: `${u.first_name} ${u.last_name}`,
        role: u.role.toUpperCase(),
        status: u.status === 'active' ? 'ON_SHIFT' : 'OFF_SHIFT',
        clockInTime: u.last_login ? new Date(u.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        tasks: tasks.filter((t: any) => String(t.assigned_to) === String(u.id)).map((t: any) => ({
          id: String(t.id),
          name: t.title,
          status: t.status.toUpperCase() as any,
          time: t.due_date ? new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
        })),
        actionsTaken: [], // Would need a separate endpoint for activity logs
      }));

      setStaffMembers(mapped);
    } catch (err) {
      console.error('Failed to fetch staff data', err);
    } finally {
      setLoading(false);
    }
  };

  const onShiftCount = staffMembers.filter(s => s.status === 'ON_SHIFT').length;
  const tasksCompleted = staffMembers.reduce((a, s) => a + s.tasks.filter(t => t.status === 'COMPLETED').length, 0);
  const pendingRequests = staffMembers.filter(s => s.breakRequest?.status === 'PENDING');

  const filtered = staffMembers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ON_SHIFT' && s.status === 'ON_SHIFT') || (statusFilter === 'OFF_SHIFT' && s.status !== 'ON_SHIFT');
    return matchSearch && matchStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedStaff(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const openAssign = (staffId: string) => { setAssignTarget(staffId); setShowAssignModal(true); };

  const taskIcon = (s: Task['status']) => s === 'COMPLETED' ? '✅' : s === 'IN_PROGRESS' ? '🔄' : '⏳';
  const taskClass = (s: Task['status']) => s === 'COMPLETED' ? 'text-success' : s === 'IN_PROGRESS' ? 'text-primary' : 'text-muted';

  return (
    <div className="staff-activities-container page-container terminal-ui">
      {loading ? (
        <div className="panel flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-primary mr-3" />
          <span className="font-bold">SYNCING STAFF DATA...</span>
        </div>
      ) : (
        <>
      <header className="page-header glow-panel mb-4">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">BRANCH</span>
            <span className="stat-value text-bright">{staffMembers[0]?.branch_name || 'BRAVO STORE'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">ON SHIFT</span>
            <span className="stat-value text-primary">{onShiftCount}/{staffMembers.length}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TASKS DONE</span>
            <span className="stat-value text-success">{tasksCompleted}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">PENDING REQUESTS</span>
            <span className={`stat-value ${pendingRequests.length > 0 ? 'text-warning' : 'text-dim'}`}>{pendingRequests.length}</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sa-filters mb-4">
        <div className="input-with-icon flex-1">
          <Search className="input-icon" size={16} />
          <input type="text" className="terminal-input w-full" placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="terminal-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
          <option value="ALL">Status: All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button className="btn-secondary"><Download size={14} /> EXPORT</button>
      </div>

      <div className="main-grid">
        {/* Staff List */}
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>👥 ALL STAFF — TODAY'S ACTIVITIES</h2>
            <span className="text-dim text-xs">{filtered.length} staff members</span>
          </div>
          <div className="staff-list">
            {filtered.map(staff => {
              const isExpanded = expandedStaff.includes(staff.id);
              return (
                <div key={staff.id} className={`staff-card ${staff.status === 'OFF_SHIFT' ? 'staff-off' : ''}`}>
                  {/* Staff Header */}
                  <div className="staff-card-header" onClick={() => toggleExpand(staff.id)}>
                    <div className="staff-identity">
                      <div className="staff-avatar">{staff.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div className="staff-name">{staff.name.toUpperCase()}</div>
                        <div className="staff-role">{staff.role}</div>
                      </div>
                    </div>
                    <div className="staff-card-meta">
                      <span className={`shift-badge ${staff.status === 'ON_SHIFT' ? 'shift-on' : staff.status === 'ON_BREAK' ? 'shift-break' : 'shift-off'}`}>
                        <span className={`status-pip ${staff.status === 'ON_SHIFT' ? 'pip-on' : staff.status === 'ON_BREAK' ? 'pip-break' : 'pip-off'}`}></span>
                        {staff.status === 'ON_SHIFT' ? `ON SHIFT (Last login: ${staff.clockInTime})` : staff.status === 'ON_BREAK' ? 'ON BREAK' : 'OFF SHIFT'}
                      </span>
                      <div className="staff-quick-stats">
                        <span className="text-success text-xs">{staff.tasks.filter(t => t.status === 'COMPLETED').length} done</span>
                        <span className="text-dim text-xs">{staff.tasks.filter(t => t.status === 'PENDING').length} pending</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-dim" /> : <ChevronDown size={16} className="text-dim" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="staff-card-body">
                      <div className="staff-details-grid">
                        {/* Tasks */}
                        <div className="detail-col">
                          <h4 className="detail-heading">Today's Tasks</h4>
                          {staff.tasks.length === 0
                            ? <span className="text-dim text-xs">No tasks assigned</span>
                            : staff.tasks.map(task => (
                              <div key={task.id} className="task-mini-row">
                                <span>{taskIcon(task.status)}</span>
                                <span className={`task-mini-name ${taskClass(task.status)}`}>{task.name}</span>
                                {task.time && <span className="text-dim text-xs">({task.time})</span>}
                              </div>
                            ))
                          }
                        </div>

                        {/* Actions */}
                        <div className="detail-col">
                          <h4 className="detail-heading">Actions Taken Today</h4>
                          <span className="text-dim text-xs">Syncing logs...</span>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="staff-card-actions">
                        <button className="btn-primary small" onClick={() => openAssign(staff.id)}>
                          <Plus size={13} /> ASSIGN TASK
                        </button>
                        <button className="btn-secondary small">
                          <MessageSquare size={13} /> MESSAGE
                        </button>
                        <button className="btn-secondary small">VIEW DETAILS</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="panel mb-4 panel-warning">
              <div className="panel-header">
                <h2>⏰ PENDING REQUESTS</h2>
                <span className="badge badge-warning">{pendingRequests.length}</span>
              </div>
              <div className="pending-list">
                {pendingRequests.map(staff => (
                  <div key={staff.id} className="pending-card">
                    <div className="pending-info">
                      <strong className="text-main">{staff.name}</strong>
                      <span className="text-dim text-xs"> requested break at {staff.breakRequest?.time}</span>
                    </div>
                    <div className="pending-actions">
                      <button className="btn-primary small">APPROVE</button>
                      <button className="btn-secondary small text-danger">DENY</button>
                      <button className="btn-secondary small">DETAILS</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Summary */}
          <div className="panel mb-4">
            <div className="panel-header">
              <h2>📊 TODAY'S SUMMARY</h2>
            </div>
            <div className="summary-stats">
              <div className="summary-row">
                <span>Staff on shift</span>
                <span className="text-primary">{onShiftCount}/{staffMembers.length}</span>
              </div>
              <div className="summary-row">
                <span>Tasks completed</span>
                <span className="text-success">{tasksCompleted}</span>
              </div>
              <div className="summary-row">
                <span>Waste logged (Est)</span>
                <span className="text-warning">Syncing...</span>
              </div>
              <div className="summary-row">
                <span>Actions taken</span>
                <span className="text-primary">{staffMembers.reduce((a, s) => a + s.actionsTaken.length, 0)}</span>
              </div>
              <div className="summary-row">
                <span>Issues open</span>
                <span className="text-warning">0</span>
              </div>
            </div>
          </div>

          {/* Quick Assign */}
          <div className="panel">
            <div className="panel-header">
              <h2>⚡ QUICK ASSIGN</h2>
            </div>
            <div className="quick-assign-list">
              {staffMembers.filter(s => s.status === 'ON_SHIFT').map(s => (
                <div key={s.id} className="quick-assign-row">
                  <div className="qa-avatar">{s.name.split(' ').map(n => n[0]).join('')}</div>
                  <span className="text-main text-xs flex-1">{s.name}</span>
                  <button className="btn-secondary small" onClick={() => openAssign(s.id)}>
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Plus size={16} /> ASSIGN NEW TASK</h3>
              <button className="btn-icon" onClick={() => setShowAssignModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <label className="text-xs text-muted block mb-1">Assign to</label>
              <select className="terminal-select w-full mb-3" value={assignTarget} onChange={e => setAssignTarget(e.target.value)}>
                {staffMembers.filter(s => s.status === 'ON_SHIFT').map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <label className="text-xs text-muted block mb-1">Task Type</label>
              <select className="terminal-select w-full mb-3">
                <option>Stock Check</option>
                <option>FEFO Rotation</option>
                <option>Waste Logging</option>
                <option>Receiving</option>
                <option>Shelf Restock</option>
                <option>Temperature Check</option>
              </select>
              <label className="text-xs text-muted block mb-1">Location / Section</label>
              <input type="text" className="terminal-input w-full mb-3" placeholder="e.g., Dairy Cooler" />
              <label className="text-xs text-muted block mb-1">Due Time</label>
              <input type="time" className="terminal-input w-full mb-3" />
              <label className="text-xs text-muted block mb-1">Priority</label>
              <select className="terminal-select w-full mb-3">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <label className="text-xs text-muted block mb-1">Instructions</label>
              <textarea className="terminal-input w-full" rows={3} placeholder="Additional instructions..." />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={() => setShowAssignModal(false)}>ASSIGN TASK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
