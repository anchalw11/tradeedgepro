interface TelegramMessage {
  id: number;
  text: string;
  timestamp: string;
  from: string;
  chat_id: number;
  message_id: number;
}

class TelegramService {
  private eventSource: EventSource | null = null;
  private subscribers: Map<string, (message: TelegramMessage) => void> = new Map();
  private apiUrl = 'http://localhost:3001';

  // Start listening for real-time messages
  startListening() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`${this.apiUrl}/telegram/stream`);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          // Notify all subscribers
          this.subscribers.forEach(callback => {
            callback(data.message);
          });
        } else if (data.type === 'init') {
          // Handle initial messages
          console.log('Connected to Telegram stream, received', data.messages.length, 'messages');
        }
      } catch (error) {
        console.error('Error parsing Telegram message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Telegram EventSource error:', error);
    };

    console.log('Started listening for Telegram messages');
  }

  // Stop listening
  stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    console.log('Stopped listening for Telegram messages');
  }

  // Subscribe to new messages
  subscribe(id: string, callback: (message: TelegramMessage) => void) {
    this.subscribers.set(id, callback);
  }

  // Unsubscribe from messages
  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  // Get all messages
  async getMessages(): Promise<TelegramMessage[]> {
    try {
      const response = await fetch(`${this.apiUrl}/telegram/messages`);
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching Telegram messages:', error);
      return [];
    }
  }

  // Clear all messages (for testing)
  async clearMessages(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/telegram/messages`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  }

  // Check if API is running
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const telegramService = new TelegramService();
export type { TelegramMessage };