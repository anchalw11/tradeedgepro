import React, { useState, useEffect } from 'react';
import { getTrades } from '../api';
import AddTradeModal from './AddTradeModal';

interface Trade {
  id: number;
  date: string;
  asset: string;
  direction: 'buy' | 'sell';
  outcome: 'win' | 'loss';
}

const TradesTable = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getTrades(params);
      setTrades(response.data.trades);
    } catch (err) {
      setError('Failed to fetch trades.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trades</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Trade
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-4">Date</th>
              <th className="p-4">Asset</th>
              <th className="p-4">Direction</th>
              <th className="p-4">Outcome</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4">{trade.date}</td>
                <td className="p-4">{trade.asset}</td>
                <td className={`p-4 ${trade.direction === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.direction}
                </td>
                <td className={`p-4 ${trade.outcome === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.outcome}
                </td>
                <td className="p-4">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddTradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTradeAdded={() => fetchTrades()}
      />
    </div>
  );
};

export default TradesTable;
