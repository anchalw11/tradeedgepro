import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  // Valid credentials database (in real app, this would be backend validation)
  const validCredentials = [
    { email: 'demo@traderedgepro.com', password: 'demo123', name: 'Demo User', tier: 'professional' },
    { email: 'admin@traderedgepro.com', password: 'admin123', name: 'Admin User', tier: 'elite' },
    { email: 'test@example.com', password: 'test123', name: 'Test User', tier: 'basic' }
  ];

  const validateCredentials = (email: string, password: string) => {
    return validCredentials.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      const validUser = validateCredentials(email, password);
      
      if (validUser) {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: validUser.name,
          email: email,
          membershipTier: validUser.tier as 'basic' | 'professional' | 'institutional' | 'elite',
          accountType: 'funded' as const,
          riskTolerance: 'moderate' as const,
          isAuthenticated: true
        };
        setUser(newUser);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">TraderEdge Pro</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your trading dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error when user starts typing
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:border-transparent ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(''); // Clear error when user starts typing
                  }}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:border-transparent pr-12 ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Demo Login */}
        <div className="mt-6 p-4 bg-green-600/20 border border-green-600 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-green-400 font-semibold mb-2">Demo Login Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-green-300">📧 demo@traderedgepro.com | 🔑 demo123</p>
              <p className="text-xs text-green-300">📧 admin@traderedgepro.com | 🔑 admin123</p>
              <p className="text-xs text-green-300">📧 test@example.com | 🔑 test123</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">Use any of these credentials to test login</p>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Start your free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
