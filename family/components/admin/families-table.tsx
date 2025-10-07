"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

interface FamilyWithStats {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    email: string;
  } | null;
  stats: {
    memberCount: number;
    messageCount: number;
    recentMessageCount: number;
    lastActivityAt: string | null;
  };
}

interface FamiliesTableProps {
  families: FamilyWithStats[];
}

export function FamiliesTable({ families }: FamiliesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActivityBadge = (recentCount: number) => {
    if (recentCount === 0) {
      return <Badge variant="outline">非アクティブ</Badge>;
    } else if (recentCount < 5) {
      return <Badge variant="secondary">低</Badge>;
    } else if (recentCount < 20) {
      return <Badge variant="default">中</Badge>;
    } else {
      return <Badge className="bg-green-600">高</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>家族グループ一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">家族名</th>
                <th className="text-left p-2">作成者</th>
                <th className="text-right p-2">メンバー</th>
                <th className="text-right p-2">総メッセージ</th>
                <th className="text-right p-2">週間活動</th>
                <th className="text-left p-2">最終活動</th>
                <th className="text-left p-2">作成日</th>
                <th className="text-center p-2">アクション</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr key={family.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{family.name}</div>
                      {family.description && (
                        <div className="text-xs text-muted-foreground">
                          {family.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-sm">
                      {family.profiles?.display_name || "不明"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {family.profiles?.email}
                    </div>
                  </td>
                  <td className="text-right p-2">
                    <Badge variant="outline">{family.stats.memberCount}</Badge>
                  </td>
                  <td className="text-right p-2">{family.stats.messageCount}</td>
                  <td className="text-right p-2">
                    <div className="flex justify-end gap-2 items-center">
                      <span className="text-sm">{family.stats.recentMessageCount}</span>
                      {getActivityBadge(family.stats.recentMessageCount)}
                    </div>
                  </td>
                  <td className="p-2 text-sm">
                    {family.stats.lastActivityAt
                      ? formatDate(family.stats.lastActivityAt)
                      : "-"}
                  </td>
                  <td className="p-2 text-sm">{formatDate(family.created_at)}</td>
                  <td className="text-center p-2">
                    <Link href={`/admin/families/${family.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
