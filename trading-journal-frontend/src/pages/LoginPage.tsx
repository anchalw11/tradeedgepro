import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      onLogin(token);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Enterprise Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token" className="text-sm font-medium text-gray-400">
              Enterprise Access Token
            </label>
            <input
              id="token"
              name="token"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your enterprise token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
