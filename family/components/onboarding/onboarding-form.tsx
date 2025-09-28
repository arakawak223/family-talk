"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertProfile, createFamily, joinFamilyByInviteCode } from "@/lib/auth-client";

type OnboardingStep = "profile" | "family-choice" | "create-family" | "join-family";

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // プロフィール情報
  const [profile, setProfile] = useState({
    display_name: "",
    phone: ""
  });

  // 家族作成情報
  const [familyInfo, setFamilyInfo] = useState({
    name: "",
    description: ""
  });

  // 招待コード
  const [inviteCode, setInviteCode] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await upsertProfile(profile);
      setStep("family-choice");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createFamily(familyInfo.name, familyInfo.description);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await joinFamilyByInviteCode(inviteCode);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (step === "profile") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Label htmlFor="display_name">表示名 *</Label>
              <Input
                id="display_name"
                type="text"
                required
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="例: お母さん、太郎"
              />
            </div>

            <div>
              <Label htmlFor="phone">電話番号（任意）</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="例: 090-1234-5678"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "設定中..." : "次へ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === "family-choice") {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>家族グループの設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setStep("create-family")}
              className="w-full"
              variant="default"
            >
              新しい家族グループを作る
            </Button>
            <Button
              onClick={() => setStep("join-family")}
              className="w-full"
              variant="outline"
            >
              招待コードで参加する
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "create-family") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>家族グループを作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <div>
              <Label htmlFor="family_name">家族グループ名 *</Label>
              <Input
                id="family_name"
                type="text"
                required
                value={familyInfo.name}
                onChange={(e) => setFamilyInfo({ ...familyInfo, name: e.target.value })}
                placeholder="例: 田中家、山田ファミリー"
              />
            </div>

            <div>
              <Label htmlFor="family_description">説明（任意）</Label>
              <Textarea
                id="family_description"
                value={familyInfo.description}
                onChange={(e) => setFamilyInfo({ ...familyInfo, description: e.target.value })}
                placeholder="例: 家族みんなでコミュニケーションを取るグループです"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("family-choice")}
                className="flex-1"
              >
                戻る
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "作成中..." : "作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === "join-family") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>家族グループに参加</CardTitle>
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
                className="text-center font-mono text-lg"
              />
              <p className="text-sm text-gray-600 mt-1">
                家族から送られた6文字の招待コードを入力してください
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("family-choice")}
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
    );
  }

  return null;
}