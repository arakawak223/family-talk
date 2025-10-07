// ======================================
// イベント・カレンダー TypeScript型定義
// ======================================

// イベントタイプ
export type EventType = 'birthday' | 'anniversary' | 'seasonal' | 'custom';

// 家族イベント
export interface FamilyEvent {
  id: string;
  family_id: string;
  created_by: string;
  event_type: EventType;
  title: string;
  description: string | null;
  event_date: string; // YYYY-MM-DD
  is_recurring: boolean;
  color: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// イベント通知設定
export interface EventNotificationSettings {
  id: string;
  user_id: string;
  family_id: string;
  notify_enabled: boolean;
  notify_3_days_before: boolean;
  notify_1_day_before: boolean;
  notify_on_day: boolean;
  created_at: string;
  updated_at: string;
}

// 通知タイプ
export type NotificationType = '3_days' | '1_day' | 'on_day';

// 送信済み通知履歴
export interface EventNotificationSent {
  id: string;
  event_id: string;
  user_id: string;
  notification_type: NotificationType;
  sent_at: string;
}

// ======================================
// UI表示用の拡張型
// ======================================

// カレンダーイベント（ビュー）
export interface CalendarEvent {
  id: string;
  family_id: string;
  event_type: EventType;
  title: string;
  description: string | null;
  event_date: string;
  is_recurring: boolean;
  color: string;
  icon: string | null;
  created_by: string;
  created_by_name: string | null;
}

// 今後のイベント
export interface UpcomingEvent extends CalendarEvent {
  days_until: number;
}

// カレンダー表示用（月別）
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  hasVoiceMessage: boolean; // メッセージがある日かどうか
}

// イベント作成フォーム
export interface CreateEventInput {
  family_id: string;
  event_type: EventType;
  title: string;
  description?: string;
  event_date: string;
  is_recurring: boolean;
  color?: string;
  icon?: string;
}

// イベント更新フォーム
export interface UpdateEventInput {
  title?: string;
  description?: string;
  event_date?: string;
  is_recurring?: boolean;
  color?: string;
  icon?: string;
}
