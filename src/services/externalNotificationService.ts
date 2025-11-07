import { supabase } from '@/integrations/supabase/client';

export interface ExternalWebhook {
  id: string;
  platform: 'slack' | 'discord';
  webhook_url: string;
  name: string;
  description?: string;
  is_active: boolean;
  channels: string[];
  event_types: string[];
  created_at: string;
  updated_at: string;
}

export interface WebhookCreate {
  platform: 'slack' | 'discord';
  webhook_url: string;
  name: string;
  description?: string;
  channels?: string[];
  event_types?: string[];
}

class ExternalNotificationService {
  async getWebhooks(): Promise<ExternalWebhook[]> {
    const { data, error } = await supabase
      .from('external_notification_webhooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ExternalWebhook[];
  }

  async createWebhook(webhook: WebhookCreate): Promise<ExternalWebhook> {
    const { data, error } = await supabase
      .from('external_notification_webhooks')
      .insert({
        platform: webhook.platform,
        webhook_url: webhook.webhook_url,
        name: webhook.name,
        description: webhook.description,
        channels: webhook.channels || [],
        event_types: webhook.event_types || ['loan_funded', 'application_submitted', 'application_approved'],
      })
      .select()
      .single();

    if (error) throw error;
    return data as ExternalWebhook;
  }

  async updateWebhook(id: string, updates: Partial<WebhookCreate>): Promise<ExternalWebhook> {
    const { data, error } = await supabase
      .from('external_notification_webhooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ExternalWebhook;
  }

  async toggleWebhook(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('external_notification_webhooks')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteWebhook(id: string): Promise<void> {
    const { error } = await supabase
      .from('external_notification_webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async testWebhook(webhookUrl: string, platform: 'slack' | 'discord'): Promise<void> {
    const message = platform === 'slack' 
      ? {
          text: '🔔 Test notification from Heritage Business Funding',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Test Notification*\nYour webhook is configured correctly!'
              }
            }
          ]
        }
      : {
          content: '🔔 **Test notification from Heritage Business Funding**\nYour webhook is configured correctly!',
        };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Failed to send test notification: ${response.statusText}`);
    }
  }
}

export const externalNotificationService = new ExternalNotificationService();
