"use client";

import { Database } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAvatarDisplay } from "@/lib/avatars";
import { removeFamilyMember } from "@/lib/auth-client";

type Family = Database['public']['Tables']['families']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface FamilyMember {
  user_id: string;
  role: string;
  profile: Profile | null;
}

interface FamilyInfoProps {
  families: Family[];
  selectedFamily: Family;
  onFamilyChange: (family: Family) => void;
}

export function FamilyInfo({ families, selectedFamily, onFamilyChange }: FamilyInfoProps) {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  useEffect(() => {
    loadFamilyMembers();
    loadCurrentUser();
  }, [selectedFamily.id]);

  const loadCurrentUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: membership } = await supabase
        .from('family_members')
        .select('role')
        .eq('family_id', selectedFamily.id)
        .eq('user_id', user.id)
        .single();

      if (membership) {
        setCurrentUserRole(membership.role);
      }
    }
  };

  const loadFamilyMembers = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('family_members')
      .select(`
        user_id,
        role,
        profiles!family_members_user_id_fkey (
          id,
          display_name,
          avatar_id,
          email
        )
      `)
      .eq('family_id', selectedFamily.id);

    if (error) {
      console.error('メンバー取得エラー:', error);
      return;
    }

    if (data) {
      const formattedMembers: FamilyMember[] = data.map(item => ({
        user_id: item.user_id as string,
        role: item.role as string,
        profile: (Array.isArray(item.profiles) ? item.profiles[0] : item.profiles) as Profile | null
      }));
      setMembers(formattedMembers);
    }
  };

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(selectedFamily.invite_code);
    alert("招待コードをコピーしました！");
  };

  const handleRemoveMember = async (userId: string, displayName: string) => {
    if (!confirm(`${displayName || "このメンバー"}を削除してもよろしいですか？`)) {
      return;
    }

    try {
      await removeFamilyMember(selectedFamily.id, userId);
      await loadFamilyMembers();
      alert("メンバーを削除しました");
    } catch (error) {
      alert(error instanceof Error ? error.message : "メンバー削除に失敗しました");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>👨‍👩‍👧‍👦 家族グループ</span>
          {families.length > 1 && (
            <select
              value={selectedFamily.id}
              onChange={(e) => {
                const family = families.find(f => f.id === e.target.value);
                if (family) onFamilyChange(family);
              }}
              className="text-sm border rounded px-2 py-1"
            >
              {families.map(family => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">{selectedFamily.name}</h3>
            {selectedFamily.description && (
              <p className="text-sm text-gray-600">{selectedFamily.description}</p>
            )}
          </div>

          {/* メンバー一覧 */}
          {members.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">メンバー ({members.length}人)</p>
              <div className="flex flex-wrap gap-3">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-2xl">{getAvatarDisplay(member.profile?.avatar_id)}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.profile?.display_name || "名前未設定"}</span>
                      {member.role === 'admin' && (
                        <span className="text-xs text-blue-600">管理者</span>
                      )}
                    </div>
                    {currentUserRole === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user_id, member.profile?.display_name || "名前未設定")}
                        className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteCode(!showInviteCode)}
            >
              {showInviteCode ? "招待コードを隠す" : "家族を招待"}
            </Button>
          </div>

          {showInviteCode && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-2">
                家族にこの招待コードを教えてください：
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-2 rounded border font-mono text-lg flex-1 text-center">
                  {selectedFamily.invite_code}
                </code>
                <Button onClick={copyInviteCode} size="sm">
                  コピー
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}