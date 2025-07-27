interface WebhookResponse {
  ok: boolean;
  result?: boolean;
  description?: string;
  error_code?: number;
}

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
  allowed_updates?: string[];
}

class TelegramWebhookManager {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  // Set webhook URL
  async setWebhook(webhookUrl: string, options?: {
    certificate?: File;
    ipAddress?: string;
    maxConnections?: number;
    allowedUpdates?: string[];
    dropPendingUpdates?: boolean;
    secretToken?: string;
  }): Promise<WebhookResponse> {
    const formData = new FormData();
    formData.append('url', webhookUrl);

    if (options?.certificate) {
      formData.append('certificate', options.certificate);
    }
    if (options?.ipAddress) {
      formData.append('ip_address', options.ipAddress);
    }
    if (options?.maxConnections) {
      formData.append('max_connections', options.maxConnections.toString());
    }
    if (options?.allowedUpdates) {
      formData.append('allowed_updates', JSON.stringify(options.allowedUpdates));
    }
    if (options?.dropPendingUpdates) {
      formData.append('drop_pending_updates', 'true');
    }
    if (options?.secretToken) {
      formData.append('secret_token', options.secretToken);
    }

    try {
      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: 'POST',
        body: formData
      });

      const result: WebhookResponse = await response.json();
      return result;
    } catch (error) {
      return {
        ok: false,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get current webhook info
  async getWebhookInfo(): Promise<{ ok: boolean; result?: WebhookInfo; description?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/getWebhookInfo`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        ok: false,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Delete webhook (switch back to polling)
  async deleteWebhook(dropPendingUpdates?: boolean): Promise<WebhookResponse> {
    const params = new URLSearchParams();
    if (dropPendingUpdates) {
      params.append('drop_pending_updates', 'true');
    }

    try {
      const response = await fetch(`${this.baseUrl}/deleteWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const result: WebhookResponse = await response.json();
      return result;
    } catch (error) {
      return {
        ok: false,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Test webhook by sending a test message
  async testWebhook(chatId: string, message: string = 'Webhook test from TraderEdge Pro'): Promise<WebhookResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result: WebhookResponse = await response.json();
      return result;
    } catch (error) {
      return {
        ok: false,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get bot info
  async getBotInfo(): Promise<{ ok: boolean; result?: any; description?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        ok: false,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export { TelegramWebhookManager };
export type { WebhookResponse, WebhookInfo };