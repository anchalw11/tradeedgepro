import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Shield,
  Target,
  Calendar,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import SignalsFeed from './SignalsFeed';
import PerformanceAnalytics from './PerformanceAnalytics';
import RiskManagement from './RiskManagement';
import AlertSystem from './AlertSystem';
import LivePriceTicker from './LivePriceTicker';
import TradingChart from './TradingChart';
import WebhookTester from './WebhookTester';
import TelegramWebhookSetup from './TelegramWebhookSetup';
import { Bot } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useUser();
  const { propFirm, accountConfig, riskConfig, tradingPlan } = useTradingPlan();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user?.isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'signals', label: 'Trading Signals', icon: <Zap className="w-4 h-4" /> },
    { id: 'analytics', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'risk', label: 'Risk Management', icon: <Shield className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhook Testing', icon: <Activity className="w-4 h-4" /> },
    { id: 'telegram-setup', label: 'Telegram Setup', icon: <Bot className="w-4 h-4" /> },
    ...(user.membershipTier === 'enterprise'
      ? [{ id: 'journal', label: 'Trading Journal', icon: <BookOpen className="w-4 h-4" /> }]
      : [])
  ];

  const stats = [
    {
      label: 'Account Balance',
      value: accountConfig ? `$${accountConfig.size.toLocaleString()}` : '$10,000',
      change: '+2.4%',
      positive: true,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      label: 'Today\'s P&L',
      value: '+$347',
      change: '+1.2%',
      positive: true,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      label: 'Win Rate',
      value: '87.3%',
      change: '+5.1%',
      positive: true,
      icon: <Target className="w-5 h-5" />
    },
    {
      label: 'Active Trades',
      value: '3',
      change: 'Live',
      positive: true,
      icon: <Activity className="w-5 h-5" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'journal':
        if (user.journalLink) {
          window.location.href = user.journalLink;
        }
        return null;
      case 'overview':
        return (
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setActiveTab('signals')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
              >
                <Zap className="w-5 h-5" />
                <span>View Signals</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
              >
                <Shield className="w-5 h-5" />
                <span>Risk Tools</span>
              </button>
              <button
                onClick={() => navigate('/setup/prop-firm')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors flex items-center space-x-3"
              >
                <Settings className="w-5 h-5" />
                <span>Setup Plan</span>
              </button>
            </div>

            {/* TradingView Chart */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
              <div className="h-96">
                <TradingChart />
              </div>
            </div>

            {/* Payment Integration Notice */}
            {!user.membershipTier || user.membershipTier === 'basic' ? (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upgrade Your Plan</h3>
                    <p className="text-gray-300 mb-4">
                      Unlock advanced features including premium signals, risk management tools, and priority support.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Premium Signals</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Advanced Analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Priority Support</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => navigate('/membership')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <span>Upgrade Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-gray-400 mt-2">Starting at $99/month</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-600/20 border border-green-500 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Plan Active
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  You have access to all premium features and professional trading guidance.
                </p>
              </div>
            )}
          </div>
        );
      case 'signals':
        return <SignalsFeed />;
      case 'analytics':
        return <PerformanceAnalytics />;
      case 'risk':
        return <RiskManagement />;
      case 'alerts':
        return <AlertSystem />;
      case 'webhooks':
        return <WebhookTester />;
      case 'telegram-setup':
        return <TelegramWebhookSetup />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">TraderEdge Pro</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live Trading Session</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.membershipTier}</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                  <div className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
