import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  total_trades: number;
  win_rate: number;
  average_rrr: number;
  most_used_strategy: string | null;
}

const DashboardSummary = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!stats) return <div className="text-center p-8">No stats available.</div>;

  const pnlData = [
    { name: 'Jan', pnl: 4000 },
    { name: 'Feb', pnl: 3000 },
    { name: 'Mar', pnl: 5000 },
    { name: 'Apr', pnl: 4500 },
    { name: 'May', pnl: 6000 },
    { name: 'Jun', pnl: 5500 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Trades</h3>
          <p className="text-2xl font-bold">{stats.total_trades}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Win Rate</h3>
          <p className="text-2xl font-bold">{stats.win_rate}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Average RRR</h3>
          <p className="text-2xl font-bold">{stats.average_rrr}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Most Used Strategy</h3>
          <p className="text-2xl font-bold">{stats.most_used_strategy || 'N/A'}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Profit & Loss</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pnlData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="pnl" stroke="#4299E1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSummary;
