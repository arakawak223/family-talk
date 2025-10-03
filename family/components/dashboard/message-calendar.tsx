"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface MessageStats {
  date: string;
  sent: number;
  received: number;
}

interface MessageCalendarProps {
  familyId: string;
  userId: string;
}

export function MessageCalendar({ familyId, userId }: MessageCalendarProps) {
  const [stats, setStats] = useState<MessageStats[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadMessageStats();
  }, [familyId, currentMonth]);

  const loadMessageStats = async () => {
    const supabase = createClient();

    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // 送信メッセージ数を取得
    const { data: sentMessages } = await supabase
      .from('voice_messages')
      .select('created_at')
      .eq('family_id', familyId)
      .eq('sender_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 受信メッセージ数を取得（voice_messagesから自分以外が送信したもの）
    const { data: receivedMessages } = await supabase
      .from('voice_messages')
      .select('created_at')
      .eq('family_id', familyId)
      .neq('sender_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 日付ごとに集計
    const statsMap = new Map<string, MessageStats>();

    sentMessages?.forEach(msg => {
      const date = new Date(msg.created_at).toISOString().split('T')[0];
      const existing = statsMap.get(date) || { date, sent: 0, received: 0 };
      existing.sent += 1;
      statsMap.set(date, existing);
    });

    receivedMessages?.forEach(msg => {
      const date = new Date(msg.created_at).toISOString().split('T')[0];
      const existing = statsMap.get(date) || { date, sent: 0, received: 0 };
      existing.received += 1;
      statsMap.set(date, existing);
    });

    setStats(Array.from(statsMap.values()));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startDayOfWeek = firstDay.getDay();

    // 前月の日付で埋める
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 当月の日付
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getStatsForDate = (date: Date | null) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return stats.find(s => s.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth();
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📅 メッセージ履歴</span>
          <div className="flex items-center gap-2">
            <button onClick={previousMonth} className="px-2 py-1 hover:bg-gray-100 rounded">◀</button>
            <span className="text-base">
              {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
            </span>
            <button onClick={nextMonth} className="px-2 py-1 hover:bg-gray-100 rounded">▶</button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* 曜日ヘッダー */}
          {weekDays.map(day => (
            <div key={day} className="text-xs font-medium text-gray-600 py-1">
              {day}
            </div>
          ))}

          {/* カレンダーの日付 */}
          {days.map((date, index) => {
            const stat = getStatsForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`
                  aspect-square p-1 border rounded text-xs
                  ${date ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                `}
              >
                {date && (
                  <div className="h-full flex flex-col">
                    <div className="font-medium">{date.getDate()}</div>
                    {stat && (
                      <div className="flex-1 flex flex-col justify-center text-xs">
                        {stat.sent > 0 && (
                          <div className="text-blue-600">↑{stat.sent}</div>
                        )}
                        {stat.received > 0 && (
                          <div className="text-green-600">↓{stat.received}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 凡例 */}
        <div className="mt-4 flex gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">↑</span>
            <span>送信</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">↓</span>
            <span>受信</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
