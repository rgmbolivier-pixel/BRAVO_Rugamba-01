import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { StaffDashboard } from './StaffDashboard';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role ?? 'STAFF';

  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'MANAGER') return <ManagerDashboard />;
  return <StaffDashboard />;
};
