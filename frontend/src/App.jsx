import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, CheckCircle, Activity, Box } from 'lucide-react';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import JobForm from './components/JobForm';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/create', label: 'New Job', icon: PlusCircle }, // Optional: separate create page or just scroll
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen fixed">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xl">
          <Activity size={24} />
          <span>JobScheduler</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-2">
          <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          {/* Add more links if needed commonly */}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-slate-400 text-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold">
            US
          </div>
          <div>
            <p className="text-white font-medium">User</p>
            <p className="text-xs">Admin Workspace</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onJobCreated, triggerRefresh }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Manage and monitor your automated jobs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <JobForm onJobCreated={onJobCreated} />
        </div>
        <div className="lg:col-span-2">
          <JobList key={triggerRefresh} />
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard onJobCreated={handleJobCreated} triggerRefresh={refreshKey} />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
