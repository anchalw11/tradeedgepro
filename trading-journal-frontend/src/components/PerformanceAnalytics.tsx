import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceAnalytics = () => {
  const winRateData = [{ name: 'Wins', value: 70 }, { name: 'Losses', value: 30 }];
  const profitByDayData = [
    { day: 'Mon', profit: 400 },
    { day: 'Tue', profit: -200 },
    { day: 'Wed', profit: 800 },
    { day: 'Thu', profit: 150 },
    { day: 'Fri', profit: -50 },
  ];
  const rrrData = [
    { name: '1:1', value: 20 },
    { name: '1:2', value: 50 },
    { name: '1:3', value: 25 },
    { name: '>1:3', value: 5 },
  ];
  const equityCurveData = [
    { name: 'Trade 1', equity: 1000 },
    { name: 'Trade 2', equity: 1100 },
    { name: 'Trade 3', equity: 1050 },
    { name: 'Trade 4', equity: 1250 },
    { name: 'Trade 5', equity: 1400 },
  ];
  const COLORS = ['#4299E1', '#F56565'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Performance Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Win Rate by Session</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={winRateData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {winRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Profit by Day of Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitByDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="day" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
              <Bar dataKey="profit">
                {profitByDayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#48BB78' : '#F56565'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">RRR Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
              <Bar dataKey="value" fill="#4299E1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Equity Curve</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
              <Line type="monotone" dataKey="equity" stroke="#48BB78" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
