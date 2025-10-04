"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { upsertProfile, createFamily, joinFamilyByInviteCode, getUserFamilies, deleteFamily, leaveFamily, getCurrentUserProfile, updateAvatar } from "@/lib/auth-client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AvatarSelector } from "@/components/profile/avatar-selector";

type OnboardingStep = "profile" | "avatar" | "family-choice" | "create-family" | "join-family" | "manage-families";
type UserFamily = {
  id: string;
  family_id: string;
  role: string;
  family: {
    id: string;
    name: string;
    description: string | null;
    invite_code: string;
  };
};

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [families, setFamilies] = useState<UserFamily[]>([]);

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

  // 初期化：プロフィールと家族グループを確認
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      // 既存のプロフィールと家族を確認
      const currentProfile = await getCurrentUserProfile();
      const userFamilies = await getUserFamilies();

      setFamilies(userFamilies as UserFamily[]);

      if (currentProfile && currentProfile.display_name) {
        setProfile({
          display_name: currentProfile.display_name,
          phone: currentProfile.phone || ""
        });
        // プロフィールがある場合は家族管理画面から開始
        setStep("manage-families");
      }
    } catch (err) {
      console.error('ユーザー状態確認エラー:', err);
    }
  };

  const loadFamilies = async () => {
    try {
      const userFamilies = await getUserFamilies();
      setFamilies(userFamilies as UserFamily[]);
    } catch (err) {
      console.error('家族一覧取得エラー:', err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await upsertProfile(profile);
      setStep("avatar"); // アバター選択に進む
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    setLoading(true);
    setError("");

    try {
      await updateAvatar(avatarId);
      await loadFamilies();
      setStep("manage-families");
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
      await loadFamilies();
      setStep("manage-families");
      setFamilyInfo({ name: "", description: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFamily = async (familyId: string) => {
    setLoading(true);
    setError("");

    try {
      await deleteFamily(familyId);
      await loadFamilies();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveFamily = async (familyId: string) => {
    setLoading(true);
    setError("");

    try {
      await leaveFamily(familyId);
      await loadFamilies();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFamily = () => {
    router.push("/dashboard");
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await joinFamilyByInviteCode(inviteCode);
      await loadFamilies();
      setStep("manage-families");
      setInviteCode("");
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

  if (step === "avatar") {
    return (
      <div>
        {loading && (
          <div className="text-center py-4 text-gray-500">保存中...</div>
        )}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <AvatarSelector
          currentAvatarId={null}
          currentAvatarType={null}
          currentAvatarPhotoUrl={null}
          onAvatarSelect={handleAvatarSelect}
          onPhotoUpload={async () => {
            await loadFamilies();
            setStep("manage-families");
          }}
        />
      </div>
    );
  }

  if (step === "manage-families") {
    return (
      <div className="space-y-4">
        {families.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>既存の家族グループ</CardTitle>
              <CardDescription>
                家族グループを選択してダッシュボードに戻るか、管理できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {families.map((membership) => (
                <Card key={membership.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{membership.family.name}</h3>
                      {membership.family.description && (
                        <p className="text-sm text-gray-600 mt-1">{membership.family.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        招待コード: <span className="font-mono font-bold">{membership.family.invite_code}</span>
                        {membership.role === 'admin' && <span className="ml-2 text-blue-600">（管理者）</span>}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={handleSelectFamily}
                      >
                        選択
                      </Button>
                      {membership.role === 'admin' ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              削除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>家族グループを削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消せません。グループ内の全てのメンバーとデータが削除されます。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFamily(membership.family_id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              退出
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>家族グループから退出しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                退出後は、再度招待コードを使って参加する必要があります。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLeaveFamily(membership.family_id)}
                              >
                                退出する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>新しい家族グループ</CardTitle>
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

        {families.length > 0 && (
          <div className="text-center flex gap-2 justify-center">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
            >
              トップページ
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
            >
              ダッシュボードに戻る
            </Button>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
      </div>
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
                onClick={() => setStep("manage-families")}
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
                onClick={() => setStep("manage-families")}
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