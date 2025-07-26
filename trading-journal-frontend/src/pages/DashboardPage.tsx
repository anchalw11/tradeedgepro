import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardSummary from '../components/DashboardSummary';
import TradesTable from '../components/TradesTable';
import PerformanceAnalytics from '../components/PerformanceAnalytics';

const DashboardPage = ({ onLogout }) => {
  return (
    <div className="flex h-screen">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardSummary />} />
          <Route path="/trades" element={<TradesTable />} />
          <Route path="/analytics" element={<PerformanceAnalytics />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardPage;
