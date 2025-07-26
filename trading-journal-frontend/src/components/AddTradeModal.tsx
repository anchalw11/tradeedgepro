import React, { useState } from 'react';
import { addTrade } from '../api';

const AddTradeModal = ({ isOpen, onClose, onTradeAdded }) => {
  const [formData, setFormData] = useState({
    date: '',
    asset: '',
    direction: 'buy',
    entry_price: '',
    exit_price: '',
    lot_size: '1',
    notes: '',
    outcome: 'win',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTrade({
        ...formData,
        entry_price: parseFloat(formData.entry_price),
        exit_price: parseFloat(formData.exit_price),
        lot_size: parseFloat(formData.lot_size),
        direction: formData.direction as 'buy' | 'sell',
        outcome: formData.outcome as 'win' | 'loss',
      });
      onTradeAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add trade:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add New Trade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded" />
          <input type="text" name="asset" value={formData.asset} onChange={handleChange} placeholder="Asset (e.g., EUR/USD)" required className="w-full bg-gray-700 p-2 rounded" />
          <select name="direction" value={formData.direction} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input type="number" step="any" name="entry_price" value={formData.entry_price} onChange={handleChange} placeholder="Entry Price" required className="w-full bg-gray-700 p-2 rounded" />
          <input type="number" step="any" name="exit_price" value={formData.exit_price} onChange={handleChange} placeholder="Exit Price" required className="w-full bg-gray-700 p-2 rounded" />
          <input type="number" step="any" name="lot_size" value={formData.lot_size} onChange={handleChange} placeholder="Lot Size" required className="w-full bg-gray-700 p-2 rounded" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full bg-gray-700 p-2 rounded"></textarea>
          <select name="outcome" value={formData.outcome} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded">
            <option value="win">Win</option>
            <option value="loss">Loss</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Add Trade</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;
