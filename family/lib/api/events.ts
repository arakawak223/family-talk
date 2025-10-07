// ======================================
// イベント・カレンダー API関数
// ======================================

import { createClient } from "@/lib/supabase/client";
import {
  FamilyEvent,
  CalendarEvent,
  UpcomingEvent,
  EventNotificationSettings,
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/types/events";

/**
 * 家族のイベント一覧を取得
 */
export async function getFamilyEvents(familyId: string): Promise<FamilyEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("family_events")
    .select("*")
    .eq("family_id", familyId)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching family events:", error);
    return [];
  }

  return data || [];
}

/**
 * カレンダーイベント（誕生日含む）を取得
 */
export async function getCalendarEvents(
  familyId: string,
  startDate?: string,
  endDate?: string
): Promise<CalendarEvent[]> {
  const supabase = createClient();

  let query = supabase
    .from("calendar_events")
    .select("*")
    .eq("family_id", familyId);

  if (startDate) {
    query = query.gte("event_date", startDate);
  }
  if (endDate) {
    query = query.lte("event_date", endDate);
  }

  const { data, error } = await query.order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }

  return data || [];
}

/**
 * 今後のイベントを取得
 */
export async function getUpcomingEvents(
  familyId: string,
  daysAhead: number = 30
): Promise<UpcomingEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_upcoming_events", {
    p_family_id: familyId,
    p_days_ahead: daysAhead,
  });

  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }

  return data || [];
}

/**
 * 特定月のカレンダーイベントを取得
 */
export async function getMonthEvents(
  familyId: string,
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  return await getCalendarEvents(familyId, startDate, endDate);
}

/**
 * イベントを作成
 */
export async function createEvent(
  input: CreateEventInput
): Promise<FamilyEvent | null> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("family_events")
    .insert({
      ...input,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return null;
  }

  return data;
}

/**
 * イベントを更新
 */
export async function updateEvent(
  eventId: string,
  input: UpdateEventInput
): Promise<FamilyEvent | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("family_events")
    .update(input)
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return null;
  }

  return data;
}

/**
 * イベントを削除
 */
export async function deleteEvent(eventId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("family_events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    return false;
  }

  return true;
}

/**
 * ユーザーの通知設定を取得
 */
export async function getNotificationSettings(
  userId: string,
  familyId: string
): Promise<EventNotificationSettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_notification_settings")
    .select("*")
    .eq("user_id", userId)
    .eq("family_id", familyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching notification settings:", error);
    return null;
  }

  // 設定がない場合はデフォルトを作成
  if (!data) {
    return await createDefaultNotificationSettings(userId, familyId);
  }

  return data;
}

/**
 * デフォルトの通知設定を作成
 */
async function createDefaultNotificationSettings(
  userId: string,
  familyId: string
): Promise<EventNotificationSettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_notification_settings")
    .insert({
      user_id: userId,
      family_id: familyId,
      notify_enabled: true,
      notify_3_days_before: true,
      notify_1_day_before: true,
      notify_on_day: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification settings:", error);
    return null;
  }

  return data;
}

/**
 * 通知設定を更新
 */
export async function updateNotificationSettings(
  userId: string,
  familyId: string,
  settings: Partial<EventNotificationSettings>
): Promise<EventNotificationSettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_notification_settings")
    .update(settings)
    .eq("user_id", userId)
    .eq("family_id", familyId)
    .select()
    .single();

  if (error) {
    console.error("Error updating notification settings:", error);
    return null;
  }

  return data;
}

/**
 * プロフィールに誕生日を設定
 */
export async function updateBirthday(
  userId: string,
  birthday: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ birthday })
    .eq("id", userId);

  if (error) {
    console.error("Error updating birthday:", error);
    return false;
  }

  return true;
}

/**
 * 特定日のイベントを取得
 */
export async function getEventsForDate(
  familyId: string,
  date: string
): Promise<CalendarEvent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("family_id", familyId)
    .eq("event_date", date);

  if (error) {
    console.error("Error fetching events for date:", error);
    return [];
  }

  return data || [];
}
