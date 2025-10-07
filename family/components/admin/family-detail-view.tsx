"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FamilyDetailViewProps {
  familyData: {
    family: {
      id: string;
      name: string;
      description: string | null;
      invite_code: string;
      created_at: string;
      profiles: {
        display_name: string | null;
        email: string;
      } | null;
    };
    members: Array<{
      id: string;
      role: string;
      joined_at: string;
      profiles: {
        id: string;
        display_name: string | null;
        email: string;
        avatar_url: string | null;
        avatar_type: string | null;
        avatar_photo_url: string | null;
      } | null;
    }>;
    messageStats: {
      total: number;
      groupMessages: number;
      individualMessages: number;
      totalDuration: number;
      messagesBySender: Record<string, number>;
      messagesByDate: Record<string, number>;
    };
  };
}

export function FamilyDetailView({ familyData }: FamilyDetailViewProps) {
  const { family, members, messageStats } = familyData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  const getAvatarUrl = (member: typeof members[0]) => {
    if (!member.profiles) return null;
    if (member.profiles.avatar_type === "photo" && member.profiles.avatar_photo_url) {
      return member.profiles.avatar_photo_url;
    }
    return member.profiles.avatar_url;
  };

  return (
    <div className="space-y-6">
      {/* 家族基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>家族情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">家族名</div>
            <div className="text-lg font-semibold">{family.name}</div>
          </div>
          {family.description && (
            <div>
              <div className="text-sm text-muted-foreground">説明</div>
              <div>{family.description}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">招待コード</div>
              <div className="font-mono">{family.invite_code}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">作成日</div>
              <div>{formatDate(family.created_at)}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">作成者</div>
            <div>
              {family.profiles?.display_name || "不明"}
              <span className="text-sm text-muted-foreground ml-2">
                ({family.profiles?.email})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メッセージ統計 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総メッセージ数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">グループメッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats.groupMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">個人メッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats.individualMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総再生時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(messageStats.totalDuration)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メンバー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>メンバー一覧 ({members.length}名)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => {
              const messageCount = messageStats.messagesBySender[member.profiles?.id || ""] || 0;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={getAvatarUrl(member) || undefined} />
                      <AvatarFallback>
                        {member.profiles?.display_name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.profiles?.display_name || "名前未設定"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.profiles?.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        参加日: {formatDate(member.joined_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="text-right mr-4">
                      <div className="text-sm text-muted-foreground">送信数</div>
                      <div className="text-lg font-semibold">{messageCount}</div>
                    </div>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role === "admin" ? "管理者" : "メンバー"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 日別メッセージ数（過去30日） */}
      <Card>
        <CardHeader>
          <CardTitle>メッセージ活動（過去30日）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(messageStats.messagesByDate)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 30)
              .map(([date, count]) => (
                <div key={date} className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground w-28">
                    {new Date(date).toLocaleDateString("ja-JP", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-primary h-full flex items-center justify-end pr-2 text-xs text-primary-foreground"
                      style={{
                        width: `${Math.min((count / Math.max(...Object.values(messageStats.messagesByDate))) * 100, 100)}%`,
                      }}
                    >
                      {count > 0 && count}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
