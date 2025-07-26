import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle, XCircle, Clock, Send, Copy } from 'lucide-react';

const WebhookTester = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io/');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [receivedData, setReceivedData] = useState<any[]>([]);

  // Simulate webhook data reception (in a real app, this would come from your backend)
  const simulateWebhookData = () => {
    const mockData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      event: 'trade.completed',
      data: {
        symbol: 'EURUSD',
        action: 'buy',
        price: 1.0850,
        quantity: 1.0,
        profit: 45.50,
        status: 'completed'
      },
      source: 'trading_platform'
    };
    
    setReceivedData(prev => [mockData, ...prev.slice(0, 9)]);
  };

  const testWebhook = async () => {
    setIsLoading(true);
    
    try {
      // Simulate sending test data to webhook
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Webhook test from TraderEdge Pro',
        data: {
          symbol: 'EURUSD',
          price: 1.0850,
          action: 'test'
        }
      };

      // In a real scenario, you would make an actual HTTP request
      // For demo purposes, we'll simulate the response
      setTimeout(() => {
        const result = {
          id: Date.now(),
          url: webhookUrl,
          status: 'success',
          statusCode: 200,
          response: 'Webhook received successfully',
          timestamp: new Date().toISOString(),
          payload: testPayload
        };
        
        setTestResults(prev => [result, ...prev.slice(0, 4)]);
        setIsLoading(false);
        
        // Simulate receiving the webhook data
        simulateWebhookData();
      }, 2000);

    } catch (error) {
      const result = {
        id: Date.now(),
        url: webhookUrl,
        status: 'error',
        statusCode: 0,
        response: 'Connection failed',
        timestamp: new Date().toISOString(),
        error: error
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 4)]);
      setIsLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
  };

  return (
    <div className="space-y-6">
      {/* Webhook URL Configuration */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Webhook Testing</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your webhook URL"
              />
              <button
                onClick={copyUrl}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={testWebhook}
              disabled={isLoading || !webhookUrl}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Test Webhook</span>
                </>
              )}
            </button>
            
            <button
              onClick={simulateWebhookData}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simulate Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outgoing Tests */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Test Results</h4>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tests performed yet</p>
              <p className="text-sm">Click "Test Webhook" to send a test payload</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className={`p-4 rounded-lg border ${
                  result.status === 'success' 
                    ? 'bg-green-600/20 border-green-600' 
                    : 'bg-red-600/20 border-red-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`font-medium ${
                        result.status === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>Status: {result.statusCode}</div>
                    <div>Response: {result.response}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Data */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Received Webhook Data</h4>
          
          {receivedData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No webhook data received</p>
              <p className="text-sm">Waiting for incoming webhooks...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedData.map((data) => (
                <div key={data.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-medium">{data.event}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Symbol: {data.data.symbol}</div>
                      <div>Action: {data.data.action}</div>
                      <div>Price: {data.data.price}</div>
                      <div>Quantity: {data.data.quantity}</div>
                    </div>
                    {data.data.profit && (
                      <div className="mt-2 text-green-400">
                        Profit: +${data.data.profit}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Webhook Information */}
      <div className="bg-blue-600/20 border border-blue-600 rounded-xl p-6">
        <h4 className="text-blue-400 font-semibold mb-3">Webhook Testing Information</h4>
        <div className="text-sm text-gray-300 space-y-2">
          <p>• This tool simulates webhook testing since I cannot directly access external URLs</p>
          <p>• In a real environment, you would need to:</p>
          <ul className="ml-4 space-y-1">
            <li>- Set up a webhook endpoint on your server</li>
            <li>- Configure your trading platform to send data to this URL</li>
            <li>- Verify the webhook receives and processes data correctly</li>
          </ul>
          <p>• Your webhook URL appears to be a local development server</p>
          <p>• Make sure your webhook endpoint can handle POST requests with JSON payloads</p>
        </div>
      </div>
    </div>
  );
};

export default WebhookTester;