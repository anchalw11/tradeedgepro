import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 ${
      isActive ? 'bg-gray-700 text-white' : ''
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-800 p-4 flex flex-col">
      <div className="text-2xl font-bold text-white mb-8">TradeJournal</div>
      <nav className="flex-1 space-y-2">
        <NavLink to="/" className={navLinkClass}>
          <LayoutDashboard className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/trades" className={navLinkClass}>
          <BookOpen className="mr-3" />
          Trades
        </NavLink>
        <NavLink to="/analytics" className={navLinkClass}>
          <BarChart2 className="mr-3" />
          Analytics
        </NavLink>
      </nav>
      <button
        onClick={onLogout}
        className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700"
      >
        <LogOut className="mr-3" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
