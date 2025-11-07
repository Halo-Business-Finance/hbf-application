import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  metadata: any;
  created_at: string;
  read_at: string | null;
}

class UserNotificationService {
  /**
   * Fetch user notifications
   */
  async getUserNotifications(limit: number = 50, unreadOnly: boolean = false) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const { error } = await supabase.rpc('mark_all_notifications_read');

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Subscribe to new notifications
   */
  subscribeToNotifications(callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const userNotificationService = new UserNotificationService();
