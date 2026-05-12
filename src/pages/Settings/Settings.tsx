import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Database, Save, Server, Monitor, Download, Trash2 } from 'lucide-react';
import './Settings.css';

export const Settings: React.FC = () => {
  return (
    <div className="settings-container page-container terminal-ui">
      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2><SettingsIcon size={18} className="text-primary inline mr-2" /> SYSTEM CONFIGURATION</h2>
            <button className="btn-primary small"><Save size={14} className="mr-1" /> SAVE ALL CHANGES</button>
          </div>
          
          <div className="settings-section mb-6">
            <h3 className="flex items-center gap-2 text-main mb-4 border-b border-glass pb-2">
              <Monitor size={16} className="text-primary" /> GENERAL PREFERENCES
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">System Name:</label>
                <input type="text" className="terminal-input w-full" defaultValue="BravoOS Production" />
              </div>
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Timezone:</label>
                <select className="terminal-select w-full">
                  <option>EST (Eastern Standard Time)</option>
                  <option>CST (Central Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                  <option>UTC</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Currency Format:</label>
                <select className="terminal-select w-full">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Date Format:</label>
                <select className="terminal-select w-full">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section mb-6">
            <h3 className="flex items-center gap-2 text-main mb-4 border-b border-glass pb-2">
              <Shield size={16} className="text-primary" /> SECURITY & ACCESS
            </h3>
            <div className="flex flex-col gap-3">
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1"></div>
                <div>
                  <div className="text-main">Require Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-muted">Enforce 2FA for all ADMIN and MANAGER accounts.</div>
                </div>
              </label>
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1"></div>
                <div>
                  <div className="text-main">Session Timeout</div>
                  <div className="text-xs text-muted">Automatically log out users after 30 minutes of inactivity.</div>
                </div>
              </label>
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" />
                <div className="checkbox-custom mt-1"></div>
                <div>
                  <div className="text-main">IP Whitelisting</div>
                  <div className="text-xs text-muted">Only allow logins from registered store network IPs.</div>
                </div>
              </label>
            </div>
            <div className="mt-4 pt-4 border-t border-glass">
              <button className="btn-secondary small text-danger border-danger">RESET ALL PASSWORDS</button>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="flex items-center gap-2 text-main mb-4 border-b border-glass pb-2">
              <Bell size={16} className="text-primary" /> ALERTS & NOTIFICATIONS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-dark p-3 rounded border border-glass">
                <h4 className="text-sm text-main mb-2">Critical Alerts (Expiry &lt; 24h)</h4>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked /> In-App Notification</label>
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked /> Email</label>
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked /> SMS (Managers only)</label>
                </div>
              </div>
              <div className="bg-primary-dark p-3 rounded border border-glass">
                <h4 className="text-sm text-main mb-2">Warning Alerts (Expiry &lt; 3 days)</h4>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked /> In-App Notification</label>
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" /> Email</label>
                  <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" /> SMS</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-panels">
          <div className="panel mb-4">
            <div className="panel-header">
              <h2><Server size={18} className="text-primary inline mr-2"/> SYSTEM STATUS</h2>
            </div>
            <div className="flex flex-col gap-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Version:</span>
                <span className="text-main">v1.4.2-prod</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last Update:</span>
                <span className="text-main">Dec 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Uptime:</span>
                <span className="text-main">99.99% (45 days)</span>
              </div>
              <div className="flex justify-between border-t border-glass pt-2">
                <span className="text-muted">Database:</span>
                <span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">AI Engine:</span>
                <span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Sync Service:</span>
                <span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4 justify-center">RUN DIAGNOSTICS</button>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2><Database size={18} className="text-primary inline mr-2"/> DATA MANAGEMENT</h2>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted">Manage system backups and historical data retention.</p>
              <button className="btn-secondary w-full justify-start"><Download size={14} className="mr-2"/> EXPORT ALL DATA (.CSV)</button>
              <button className="btn-secondary w-full justify-start"><Database size={14} className="mr-2"/> INITIATE MANUAL BACKUP</button>
              <button className="btn-secondary w-full justify-start text-danger border-danger"><Trash2 size={14} className="mr-2"/> PURGE LOGS (OLDER THAN 90D)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
