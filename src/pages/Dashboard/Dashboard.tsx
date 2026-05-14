import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { StaffDashboard } from './StaffDashboard';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role ?? 'staff';

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'manager') return <ManagerDashboard />;
  return <StaffDashboard />;
};
