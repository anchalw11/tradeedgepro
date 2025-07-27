import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Store messages in memory (in production, use a database)
let telegramMessages: any[] = [];
let subscribers: ((message: any) => void)[] = [];

// Middleware
app.use(cors());
app.use(express.json());

// Telegram webhook endpoint
app.post('/telegram/webhook', (req, res) => {
  try {
    const update = req.body;
    
    // Check if it's a message update
    if (update.message) {
      const message = {
        id: update.message.message_id,
        text: update.message.text || '',
        timestamp: new Date(update.message.date * 1000).toISOString(),
        from: update.message.from.first_name || update.message.from.username || 'Unknown',
        chat_id: update.message.chat.id,
        message_id: update.message.message_id,
        update_id: update.update_id
      };

      // Store the message
      telegramMessages.unshift(message);
      
      // Keep only last 100 messages
      if (telegramMessages.length > 100) {
        telegramMessages = telegramMessages.slice(0, 100);
      }

      // Notify all subscribers
      subscribers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error notifying subscriber:', error);
        }
      });

      console.log('New Telegram message received:', message);
    }

    // Respond to Telegram
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages endpoint
app.get('/telegram/messages', (req, res) => {
  res.json({
    messages: telegramMessages,
    count: telegramMessages.length
  });
});

// Server-Sent Events for real-time updates
app.get('/telegram/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial data
  res.write(`data: ${JSON.stringify({ type: 'init', messages: telegramMessages })}\n\n`);

  // Add subscriber for new messages
  const subscriber = (message: any) => {
    res.write(`data: ${JSON.stringify({ type: 'message', message })}\n\n`);
  };

  subscribers.push(subscriber);

  // Clean up on client disconnect
  req.on('close', () => {
    const index = subscribers.indexOf(subscriber);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    messages_count: telegramMessages.length 
  });
});

// Clear messages endpoint (for testing)
app.delete('/telegram/messages', (req, res) => {
  telegramMessages = [];
  res.json({ message: 'Messages cleared' });
});

app.listen(PORT, () => {
  console.log(`🤖 Telegram Webhook API running on http://localhost:${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/telegram/webhook`);
  console.log(`📱 Set this URL in your Telegram bot webhook`);
});

export default app;