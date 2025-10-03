"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserProfile, upsertProfile, updateAvatar } from "@/lib/auth-client";
import { AvatarSelector } from "@/components/profile/avatar-selector";
import { getAvatarDisplay } from "@/lib/avatars";
import { Database } from "@/lib/types/database";

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    display_name: "",
    phone: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentProfile = await getCurrentUserProfile();
      if (currentProfile) {
        setProfile(currentProfile);
        setFormData({
          display_name: currentProfile.display_name || "",
          phone: currentProfile.phone || ""
        });
      }
    } catch (err) {
      console.error('プロフィール取得エラー:', err);
      setError("プロフィールの読み込みに失敗しました");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await upsertProfile(formData);
      setSuccess("プロフィールを更新しました");
      await loadProfile();
      // 1秒後にダッシュボードに戻る
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateAvatar(avatarId);
      setSuccess("アバターを更新しました");
      setShowAvatarSelector(false);
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (showAvatarSelector) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setShowAvatarSelector(false)}
            variant="outline"
            className="mb-4"
          >
            ← 戻る
          </Button>
          {loading && (
            <div className="text-center py-4 text-gray-500">保存中...</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <AvatarSelector
            currentAvatarId={profile?.avatar_id || null}
            onAvatarSelect={handleAvatarSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
          >
            ← ダッシュボードに戻る
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>プロフィール設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* アバター表示と変更 */}
            <div>
              <Label>アバター</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-6xl">
                  {getAvatarDisplay(profile?.avatar_id || null)}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAvatarSelector(true)}
                >
                  アバターを変更
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="display_name">表示名 *</Label>
                <Input
                  id="display_name"
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="例: お母さん、太郎"
                />
              </div>

              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  メールアドレスは変更できません
                </p>
              </div>

              <div>
                <Label htmlFor="phone">電話番号（任意）</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="例: 090-1234-5678"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "保存中..." : "保存"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
