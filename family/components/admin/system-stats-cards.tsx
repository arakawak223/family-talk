"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, MessageSquare, TrendingUp } from "lucide-react";

interface SystemStatsCardsProps {
  stats: {
    totalUsers: number;
    totalFamilies: number;
    totalMessages: number;
    newUsersToday: number;
    newMessagesToday: number;
    activeFamilies: number;
  };
}

export function SystemStatsCards({ stats }: SystemStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            今日: +{stats.newUsersToday}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総家族数</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFamilies}</div>
          <p className="text-xs text-muted-foreground">
            アクティブ: {stats.activeFamilies}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総メッセージ数</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            今日: +{stats.newMessagesToday}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">週間活動率</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalFamilies > 0
              ? Math.round((stats.activeFamilies / stats.totalFamilies) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            過去7日間にメッセージあり
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
