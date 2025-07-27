import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MembershipPlans from './components/MembershipPlans';
import PropFirmSelection from './components/PropFirmSelection';
import AccountConfiguration from './components/AccountConfiguration';
import RiskConfiguration from './components/RiskConfiguration';
import TradingPlanGeneration from './components/TradingPlanGenerator';
import PaymentFlow from './components/PaymentFlow';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import { UserProvider } from './contexts/UserContext';
import { TradingPlanProvider } from './contexts/TradingPlanContext';
import { AdminProvider } from './contexts/AdminContext';
import { SignalDistributionProvider } from './components/SignalDistributionService';

function App() {
  return (
    <SignalDistributionProvider>
      <AdminProvider>
        <UserProvider>
          <TradingPlanProvider>
            <Router>
              <div className="min-h-screen bg-gray-950">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/membership" element={<MembershipPlans />} />
                  <Route path="/payment" element={<PaymentFlow />} />
                  <Route path="/setup/prop-firm" element={<PropFirmSelection />} />
                  <Route path="/setup/account" element={<AccountConfiguration />} />
                  <Route path="/setup/risk" element={<RiskConfiguration />} />
                  <Route path="/setup/plan" element={<TradingPlanGeneration />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminLogin />} />
                </Routes>
              </div>
            </Router>
          </TradingPlanProvider>
        </UserProvider>
      </AdminProvider>
    </SignalDistributionProvider>
  );
}

export default App;