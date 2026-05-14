import React, { useState, useEffect } from 'react';
import { CheckSquare, PlayCircle, Info, MessageSquare, Loader2 } from 'lucide-react';
import { taskService } from '../../services/api';
import { Pagination } from '../../components/Pagination';
import './Tasks.css';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await taskService.getTasks({ page });
      const data = res.data;
      if (data.results) {
        setTasks(data.results);
        setTotalCount(data.count);
      } else {
        setTasks(Array.isArray(data) ? data : []);
        setTotalCount(tasks.length);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = tasks.filter(t => t.status === 'overdue');

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '🔴 HIGH PRIORITY';
      case 'medium': return '🟡 MEDIUM PRIORITY';
      case 'low': return '🟢 LOW PRIORITY';
      default: return priority.toUpperCase();
    }
  };

  return (
    <div className="tasks-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button className="btn-primary flex-1">📋 PENDING ({pendingTasks.length})</button>
        <button className="btn-secondary flex-1 text-success">✅ COMPLETED ({completedTasks.length})</button>
        <button className="btn-secondary flex-1 text-danger">⏰ OVERDUE ({overdueTasks.length})</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📋 PENDING TASKS</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="animate-spin text-primary mr-3" />
              <span className="font-bold">SYNCING TASKS...</span>
            </div>
          ) : (
          <div className="task-list">
            {pendingTasks.length === 0 ? (
              <div className="text-center p-10 text-dim">No pending tasks.</div>
            ) : (
              pendingTasks.map((t: any) => (
                <div key={t.id} className={`task-card ${getPriorityClass(t.priority)}`}>
                  <div className="task-header border-b border-glass pb-2 mb-2">
                    <div className={`${t.priority === 'high' ? 'text-danger' : t.priority === 'medium' ? 'text-warning' : 'text-success'} font-bold text-xs flex justify-between w-full`}>
                      <span>{getPriorityLabel(t.priority)}</span>
                      <span>Due: {new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="task-title text-main font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">📋</span> {t.title}
                  </div>
                  <div className="text-xs text-muted mb-3 flex gap-4">
                    <span>Assigned by: {t.created_by_name || 'System'}</span>
                    <span>Created: {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-sm text-dim mb-4 border-l-2 border-primary-dark pl-2">
                    {t.description}
                  </div>
                  <div className="task-actions border-t border-glass pt-3 mt-auto flex gap-2">
                    <button className="btn-primary small"><PlayCircle size={14} className="mr-1" /> START TASK</button>
                    <button className="btn-secondary small"><Info size={14} className="mr-1" /> VIEW DETAILS</button>
                    <button className="btn-secondary small text-warning ml-auto"><MessageSquare size={14} className="mr-1" /> REQUEST CLARIFICATION</button>
                  </div>
                </div>
              ))
            )}
            
            <Pagination 
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>✅ COMPLETED TODAY</h2>
          </div>
          <ul className="completed-list">
            {completedTasks.length === 0 ? (
              <li className="text-dim">No tasks completed today.</li>
            ) : (
              completedTasks.map((t: any) => (
                <li key={t.id}>
                  <CheckSquare size={14} className="text-success" />
                  <div className="comp-info">
                    <strong>{t.title}</strong>
                    <span>Completed at {new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Verified</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
