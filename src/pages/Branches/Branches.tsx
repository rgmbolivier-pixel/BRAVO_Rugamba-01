import React from 'react';
import { Search, MapPin, Users, Clock, Plus, BarChart2, Edit2, Settings, Power } from 'lucide-react';
import './Branches.css';

export const Branches: React.FC = () => {
  return (
    <div className="branches-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <div className="input-with-icon flex-2">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search branches..." />
        </div>
        <div className="filters flex-1 flex gap-2">
          <select className="terminal-select flex-1">
            <option>Status: All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select className="terminal-select flex-1">
            <option>Region: All</option>
            <option>North</option>
            <option>South</option>
            <option>East</option>
            <option>West</option>
          </select>
        </div>
        <button className="btn-primary"><Plus size={16} className="mr-1" /> ADD BRANCH</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="branch-list">
            <div className="branch-card border-l-4 border-success p-4 mb-4 bg-black bg-opacity-40">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-glass">
                <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                  <MapPin className="text-primary" /> DOWNTOWN STORE
                </h3>
                <span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted mb-4">
                <div>
                  <div className="mb-1"><strong className="text-main">Location:</strong> 123 Main St, New York, NY 10001</div>
                  <div className="mb-1"><strong className="text-main">Manager:</strong> Jane Smith (jane@downtown.com)</div>
                  <div><strong className="text-main">Phone:</strong> (212) 555-0100</div>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1"><Users size={14} className="text-primary" /> <strong className="text-main">Staff:</strong> 8</div>
                  <div className="flex items-center gap-1"><Clock size={14} className="text-primary" /> <strong className="text-main">Hours:</strong> 7am - 11pm Daily</div>
                </div>
              </div>
              <div className="bg-primary-dark p-3 rounded mb-4 flex justify-between items-center text-sm font-mono border border-primary-dark">
                <div className="flex gap-4">
                  <span>Waste: <span className="text-primary">$1,240 ▼12%</span></span>
                  <span>Saved: <span className="text-primary">$3,450 ▲8%</span></span>
                </div>
                <div className="text-success font-bold text-lg">Score: 94/100</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary small flex-1 justify-center">VIEW DETAILS</button>
                <button className="btn-secondary small flex-1 justify-center"><Edit2 size={14} className="mr-1" /> EDIT</button>
                <button className="btn-secondary small flex-1 justify-center"><Users size={14} className="mr-1" /> STAFF</button>
                <button className="btn-secondary small flex-1 justify-center text-danger border-danger"><Power size={14} className="mr-1" /> DEACTIVATE</button>
                <button className="btn-primary small flex-1 justify-center"><BarChart2 size={14} className="mr-1" /> ANALYTICS</button>
              </div>
            </div>

            <div className="branch-card border-l-4 border-success p-4 mb-4 bg-black bg-opacity-40">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-glass">
                <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                  <MapPin className="text-primary" /> UPTOWN STORE
                </h3>
                <span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted mb-4">
                <div>
                  <div className="mb-1"><strong className="text-main">Location:</strong> 456 Broadway, New York, NY 10002</div>
                  <div className="mb-1"><strong className="text-main">Manager:</strong> Mike Johnson (mike@uptown.com)</div>
                  <div><strong className="text-main">Phone:</strong> (212) 555-0101</div>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1"><Users size={14} className="text-primary" /> <strong className="text-main">Staff:</strong> 6</div>
                  <div className="flex items-center gap-1"><Clock size={14} className="text-primary" /> <strong className="text-main">Hours:</strong> 8am - 10pm Daily</div>
                </div>
              </div>
              <div className="bg-primary-dark p-3 rounded mb-4 flex justify-between items-center text-sm font-mono border border-primary-dark">
                <div className="flex gap-4">
                  <span>Waste: <span className="text-warning">$1,890 ▲5%</span></span>
                  <span>Saved: <span className="text-warning">$2,100 ▼3%</span></span>
                </div>
                <div className="text-success font-bold text-lg">Score: 88/100</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary small flex-1 justify-center">VIEW DETAILS</button>
                <button className="btn-secondary small flex-1 justify-center"><Edit2 size={14} className="mr-1" /> EDIT</button>
                <button className="btn-secondary small flex-1 justify-center"><Users size={14} className="mr-1" /> STAFF</button>
                <button className="btn-secondary small flex-1 justify-center text-danger border-danger"><Power size={14} className="mr-1" /> DEACTIVATE</button>
                <button className="btn-primary small flex-1 justify-center"><BarChart2 size={14} className="mr-1" /> ANALYTICS</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="flex items-center gap-2"><Plus size={18} className="text-primary" /> ADD NEW BRANCH</h2>
          </div>
          <form className="add-branch-form text-sm">
            <div className="form-group mb-3">
              <label className="text-muted block mb-1">Store Name:</label>
              <input type="text" className="terminal-input w-full" placeholder="e.g. Westside Store" />
            </div>
            <div className="form-group mb-3">
              <label className="text-muted block mb-1">Address:</label>
              <input type="text" className="terminal-input w-full" placeholder="Street address" />
            </div>
            <div className="form-group mb-3">
              <label className="text-muted block mb-1">City:</label>
              <input type="text" className="terminal-input w-full" placeholder="City" />
            </div>
            <div className="form-group mb-3">
              <label className="text-muted block mb-1">Phone:</label>
              <input type="text" className="terminal-input w-full" placeholder="(555) 555-5555" />
            </div>
            <div className="form-group mb-3">
              <label className="text-muted block mb-1">Manager Email:</label>
              <input type="email" className="terminal-input w-full" placeholder="manager@store.com" />
            </div>
            <div className="form-group mb-4">
              <label className="text-muted block mb-1">Opening Hours:</label>
              <div className="flex gap-2 items-center">
                <input type="time" className="terminal-input flex-1" defaultValue="08:00" />
                <span className="text-dim">to</span>
                <input type="time" className="terminal-input flex-1" defaultValue="22:00" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <button type="button" className="btn-primary w-full justify-center">CREATE BRANCH</button>
              <button type="button" className="btn-secondary w-full justify-center">CANCEL</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
