import React from 'react';
import { Topbar } from './Topbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
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
          flex-direction: column;
          min-height: 100vh;
          background: var(--bg-deep);
        }

        .main-content {
          flex: 1;
          padding-top: var(--header-height);
          min-height: 100vh;
          position: relative;
        }

        .page-content {
          padding: var(--pad-page);
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .page-content {
            padding: var(--pad-page-sm);
          }
        }

        @media (max-width: 576px) {
          .page-content {
            padding: 12px max(12px, env(safe-area-inset-right)) 20px max(12px, env(safe-area-inset-left));
          }
        }
      `}</style>
    </div>
  );
};
