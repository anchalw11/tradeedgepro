import React, { useState, useEffect } from 'react';
import { Bot, Globe, CheckCircle, XCircle, AlertTriangle, Copy, RefreshCw, Send, Settings } from 'lucide-react';
import { TelegramWebhookManager } from '../utils/telegramWebhookSetup';

const TelegramWebhookSetup: React.FC = () => {
  const [botToken, setBotToken] = useState('8277818041:AAGAgj4MoUuMbg8ZnkAhsbawtJkioqRJWj4');
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:3001/telegram/webhook');
  const [detectedUrl, setDetectedUrl] = useState('');
  const [chatId, setChatId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'unknown' | 'set' | 'not_set' | 'error'>('unknown');
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [botInfo, setBotInfo] = useState<any>(null);
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string; timestamp: Date }>>([]);

  // Detect the correct webhook URL
  useEffect(() => {
    const detectWebhookUrl = () => {
      // Get current domain and port
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port;
      
      // For local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setDetectedUrl('http://localhost:3001/telegram/webhook');
        addLog('info', 'Local development detected - use ngrok for public URL');
        return;
      }
      
      // For StackBlitz/WebContainer environments
      if (hostname.includes('webcontainer') || hostname.includes('stackblitz')) {
        // Replace port 5173 with 3001 for webhook server
        const webhookHost = hostname.replace(/--5173--/, '--3001--');
        const publicUrl = `${protocol}//${webhookHost}/telegram/webhook`;
        setDetectedUrl(publicUrl);
        setWebhookUrl(publicUrl);
        addLog('success', `Detected public webhook URL: ${publicUrl}`);
        return;
      }
      
      // For other cloud environments
      const baseUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;
      const publicUrl = `${baseUrl}:3001/telegram/webhook`;
      setDetectedUrl(publicUrl);
      setWebhookUrl(publicUrl);
      addLog('info', `Generated webhook URL: ${publicUrl}`);
    };

    detectWebhookUrl();
  }, []);

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    setLogs(prev => [{ type, message, timestamp: new Date() }, ...prev.slice(0, 9)]);
  };

  const webhookManager = botToken ? new TelegramWebhookManager(botToken) : null;

  // Check webhook status when bot token changes
  useEffect(() => {
    if (botToken && webhookManager) {
      checkWebhookStatus();
      getBotInfo();
    }
  }, [botToken]);

  const checkWebhookStatus = async () => {
    if (!webhookManager) return;

    setIsLoading(true);
    try {
      const info = await webhookManager.getWebhookInfo();
      
      if (info.ok && info.result) {
        setWebhookInfo(info.result);
        if (info.result.url) {
          setWebhookStatus('set');
          addLog('info', `Webhook is set to: ${info.result.url}`);
        } else {
          setWebhookStatus('not_set');
          addLog('info', 'No webhook is currently set');
        }
      } else {
        setWebhookStatus('error');
        addLog('error', info.description || 'Failed to get webhook info');
      }
    } catch (error) {
      setWebhookStatus('error');
      addLog('error', `Error checking webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotInfo = async () => {
    if (!webhookManager) return;

    try {
      const info = await webhookManager.getBotInfo();
      if (info.ok && info.result) {
        setBotInfo(info.result);
        addLog('success', `Connected to bot: @${info.result.username}`);
      } else {
        addLog('error', info.description || 'Failed to get bot info');
      }
    } catch (error) {
      addLog('error', `Error getting bot info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const setWebhook = async () => {
    if (!webhookManager || !webhookUrl) return;

    setIsLoading(true);
    addLog('info', `Setting webhook to: ${webhookUrl}`);

    try {
      const result = await webhookManager.setWebhook(webhookUrl, {
        allowedUpdates: ['message', 'callback_query'],
        dropPendingUpdates: true,
        maxConnections: 40
      });

      if (result.ok) {
        setWebhookStatus('set');
        addLog('success', 'Webhook set successfully!');
        await checkWebhookStatus(); // Refresh status
      } else {
        setWebhookStatus('error');
        addLog('error', result.description || 'Failed to set webhook');
      }
    } catch (error) {
      setWebhookStatus('error');
      addLog('error', `Error setting webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWebhook = async () => {
    if (!webhookManager) return;

    setIsLoading(true);
    addLog('info', 'Deleting webhook...');

    try {
      const result = await webhookManager.deleteWebhook(true);

      if (result.ok) {
        setWebhookStatus('not_set');
        setWebhookInfo(null);
        addLog('success', 'Webhook deleted successfully!');
      } else {
        addLog('error', result.description || 'Failed to delete webhook');
      }
    } catch (error) {
      addLog('error', `Error deleting webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookManager || !chatId) {
      addLog('error', 'Please enter a chat ID to test the webhook');
      return;
    }

    setIsLoading(true);
    addLog('info', `Sending test message to chat ${chatId}...`);

    try {
      const result = await webhookManager.testWebhook(
        chatId,
        '🤖 <b>Webhook Test</b>\n\nThis is a test message from TraderEdge Pro to verify your webhook is working correctly!\n\n✅ If you see this message, your webhook is properly configured.'
      );

      if (result.ok) {
        addLog('success', 'Test message sent successfully! Check your Telegram chat.');
      } else {
        addLog('error', result.description || 'Failed to send test message');
      }
    } catch (error) {
      addLog('error', `Error sending test message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('info', 'Copied to clipboard');
  };

  const getStatusColor = () => {
    switch (webhookStatus) {
      case 'set': return 'text-green-400';
      case 'not_set': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (webhookStatus) {
      case 'set': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'not_set': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Telegram Webhook Setup</h2>
            <p className="text-gray-400">Configure your Telegram bot to send messages to TraderEdge Pro</p>
          </div>
        </div>

        {botInfo && (
          <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Bot Connected</span>
            </div>
            <div className="text-sm text-gray-300">
              <div><strong>Name:</strong> {botInfo.first_name}</div>
              <div><strong>Username:</strong> @{botInfo.username}</div>
              <div><strong>ID:</strong> {botInfo.id}</div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Configuration */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bot Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bot Token <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your bot token from @BotFather"
              />
              <p className="text-xs text-gray-400 mt-1">
                Get this from @BotFather on Telegram
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook URL
              </label>
              {detectedUrl && (
                <div className="mb-2 p-3 bg-blue-600/20 border border-blue-600 rounded-lg">
                  <div className="text-blue-400 font-semibold text-sm mb-1">Detected Public URL:</div>
                  <div className="text-blue-300 text-xs font-mono break-all">{detectedUrl}</div>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your public webhook URL"
                />
                <button
                  onClick={() => copyToClipboard(webhookUrl)}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Must be publicly accessible (not localhost)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chat ID (for testing)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Your chat ID or channel ID"
              />
              <p className="text-xs text-gray-400 mt-1">
                Send /start to your bot to get your chat ID
              </p>
            </div>
          </div>
        </div>

        {/* Webhook Status */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Webhook Status</h3>
            <button
              onClick={checkWebhookStatus}
              disabled={!botToken || isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <div className={`font-semibold ${getStatusColor()}`}>
                  {webhookStatus === 'set' ? 'Webhook Active' :
                   webhookStatus === 'not_set' ? 'No Webhook Set' :
                   webhookStatus === 'error' ? 'Error' : 'Unknown'}
                </div>
                {webhookInfo && (
                  <div className="text-sm text-gray-400">
                    {webhookInfo.url || 'No URL configured'}
                  </div>
                )}
              </div>
            </div>

            {webhookInfo && (
              <div className="bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Updates:</span>
                  <span className="text-white">{webhookInfo.pending_update_count}</span>
                </div>
                {webhookInfo.last_error_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Error:</span>
                    <span className="text-red-400">{new Date(webhookInfo.last_error_date * 1000).toLocaleString()}</span>
                  </div>
                )}
                {webhookInfo.last_error_message && (
                  <div className="text-red-400 text-xs">
                    {webhookInfo.last_error_message}
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={setWebhook}
                disabled={!botToken || !webhookUrl || isLoading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Set Webhook</span>
              </button>

              <button
                onClick={deleteWebhook}
                disabled={!botToken || isLoading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                onClick={testWebhook}
                disabled={!botToken || !chatId || isLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Step 1: Create Bot</div>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Message @BotFather on Telegram</li>
                <li>Send <code className="bg-gray-700 px-1 rounded">/newbot</code></li>
                <li>Choose a name and username</li>
                <li>Copy the bot token</li>
              </ol>
            </div>

            <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Step 2: Configure Webhook</div>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Paste your bot token above</li>
                <li>Make sure webhook URL is correct</li>
                <li>Click "Set Webhook"</li>
                <li>Verify status shows "Webhook Active"</li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Step 3: Test Connection</div>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Send <code className="bg-gray-700 px-1 rounded">/start</code> to your bot</li>
                <li>Copy your chat ID from the response</li>
                <li>Enter chat ID above</li>
                <li>Click "Test" to send a test message</li>
              </ol>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <div className="text-yellow-400 font-semibold mb-2">Step 4: Start Using</div>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Go to Trading Signals tab</li>
                <li>Click "Start Listening"</li>
                <li>Send messages to your bot</li>
                <li>Watch them appear in real-time!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>
        
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm">Configure your bot to see activity logs</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                log.type === 'success' ? 'bg-green-600/20 border-green-600' :
                log.type === 'error' ? 'bg-red-600/20 border-red-600' :
                'bg-blue-600/20 border-blue-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {log.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                     log.type === 'error' ? <XCircle className="w-4 h-4 text-red-400" /> :
                     <AlertTriangle className="w-4 h-4 text-blue-400" />}
                    <span className={`text-sm ${
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'error' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramWebhookSetup;