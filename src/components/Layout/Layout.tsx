import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <motion.main 
          className="page-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </div>

      <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding-top: var(--header-height);
          min-height: 100vh;
          position: relative;
          background: #000;
        }

        .page-content {
          padding: 20px;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};
