"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { joinFamilyByInviteCode } from "@/lib/auth-client";
import { AvatarSelector } from "@/components/profile/avatar-selector";
import { getAvatarDisplay } from "@/lib/avatars";

export default function JoinFamilyPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAvatarId) {
      setError("アバターを選択してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await joinFamilyByInviteCode(inviteCode, selectedAvatarId);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (showAvatarSelector) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <AvatarSelector
          currentAvatarId={selectedAvatarId}
          onAvatarSelect={(avatarId) => {
            setSelectedAvatarId(avatarId);
            setShowAvatarSelector(false);
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>家族グループに参加</CardTitle>
            <CardDescription>
              家族から送られた招待コードを入力してグループに参加しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <div>
                <Label htmlFor="invite_code">招待コード *</Label>
                <Input
                  id="invite_code"
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="例: ABC123"
                  maxLength={6}
                  className="text-center font-mono text-2xl tracking-wider"
                />
                <p className="text-sm text-gray-600 mt-2">
                  家族から送られた6文字の招待コードを入力してください
                </p>
              </div>

              <div>
                <Label>あなたのアバター *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAvatarSelector(true)}
                  className="w-full h-auto py-4 mt-2"
                >
                  {selectedAvatarId ? (
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getAvatarDisplay(selectedAvatarId)}</span>
                      <span>アバターを変更</span>
                    </div>
                  ) : (
                    <span>アバターを選択してください</span>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  戻る
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "参加中..." : "参加"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
