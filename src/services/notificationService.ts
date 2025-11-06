import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  type: 'email' | 'sms' | 'system';
  recipient: string;
  template: string;
  data: any;
  applicationId?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class NotificationService {
  /**
   * Send a single notification
   */
  async sendNotification(notificationData: NotificationData) {
    try {
      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'send',
          notificationData
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]) {
    try {
      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'send-bulk',
          notificationData: { notifications }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw new Error('Failed to send bulk notifications');
    }
  }

  /**
   * Get available email templates
   */
  async getEmailTemplates() {
    try {
      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'get-templates'
        }
      });

      if (error) throw error;

      return data.templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch email templates');
    }
  }

  /**
   * Handle application status change notification
   */
  async notifyApplicationStatusChange(
    applicationId: string,
    newStatus: string,
    applicantEmail: string,
    applicantName: string,
    applicationNumber: string
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('notification-service', {
        body: {
          action: 'application-status-change',
          notificationData: {
            applicationId,
            newStatus,
            applicantEmail,
            applicantName,
            applicationNumber
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending status change notification:', error);
      throw new Error('Failed to send status change notification');
    }
  }

  /**
   * Send application submitted notification
   */
  async sendApplicationSubmittedNotification(
    applicantEmail: string,
    applicantName: string,
    applicationNumber: string,
    applicationId: string
  ) {
    const emailNotification: NotificationData = {
      type: 'email',
      recipient: applicantEmail,
      template: 'application_submitted',
      data: {
        applicantName,
        applicationNumber
      },
      applicationId
    };

    const smsNotification: NotificationData = {
      type: 'sms',
      recipient: '+1234567890', // In real app, get from user profile
      template: 'application_submitted',
      data: {
        applicantName,
        applicationNumber
      },
      applicationId
    };

    // Send both email and SMS
    return await this.sendBulkNotifications([emailNotification, smsNotification]);
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(userEmail: string, userName: string) {
    const notification: NotificationData = {
      type: 'email',
      recipient: userEmail,
      template: 'welcome',
      data: {
        userName,
        loginUrl: `${window.location.origin}/`
      }
    };

    return await this.sendNotification(notification);
  }

  /**
   * Send reminder email for incomplete application
   */
  async sendApplicationReminderEmail(
    userEmail: string,
    userName: string,
    applicationId: string,
    daysAgo: number
  ) {
    const notification: NotificationData = {
      type: 'email',
      recipient: userEmail,
      template: 'application_reminder',
      data: {
        userName,
        daysAgo,
        continueUrl: `${window.location.origin}/?continue=${applicationId}`
      },
      applicationId
    };

    return await this.sendNotification(notification);
  }
}

export const notificationService = new NotificationService();