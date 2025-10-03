"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAvatarDisplay } from "@/lib/avatars";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_id: string | null;
}

interface FamilyMember {
  user_id: string;
  profile: Profile | null;
}

interface RecipientSelectorProps {
  familyId: string;
  currentUserId: string;
  selectedRecipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
}

export function RecipientSelector({
  familyId,
  currentUserId,
  selectedRecipients,
  onRecipientsChange
}: RecipientSelectorProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    loadFamilyMembers();
  }, [familyId]);

  const loadFamilyMembers = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('family_members')
      .select(`
        user_id,
        profiles!family_members_user_id_fkey (
          id,
          display_name,
          avatar_id,
          email
        )
      `)
      .eq('family_id', familyId)
      .neq('user_id', currentUserId); // 自分以外

    if (error) {
      console.error('メンバー取得エラー:', error);
      return;
    }

    if (data) {
      const formattedMembers: FamilyMember[] = data.map(item => ({
        user_id: item.user_id as string,
        profile: (Array.isArray(item.profiles) ? item.profiles[0] : item.profiles) as Profile | null
      }));
      setMembers(formattedMembers);
      // 初期値として全員選択
      if (selectedRecipients.length === 0) {
        const allRecipients = data.map(m => m.user_id);
        onRecipientsChange(allRecipients);
      }
    }
  };

  const toggleRecipient = (userId: string) => {
    if (selectedRecipients.includes(userId)) {
      onRecipientsChange(selectedRecipients.filter(id => id !== userId));
    } else {
      onRecipientsChange([...selectedRecipients, userId]);
    }
  };

  const selectAll = () => {
    onRecipientsChange(members.map(m => m.user_id));
  };

  const deselectAll = () => {
    onRecipientsChange([]);
  };

  if (members.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        家族グループにメンバーがいません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">宛先を選択</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-blue-600 hover:underline"
          >
            全員選択
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs text-gray-600 hover:underline"
          >
            選択解除
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleRecipient(member.user_id)}
          >
            <Checkbox
              checked={selectedRecipients.includes(member.user_id)}
              onCheckedChange={() => toggleRecipient(member.user_id)}
            />
            <span className="text-2xl">{getAvatarDisplay(member.profile?.avatar_id)}</span>
            <span className="text-sm font-medium">
              {member.profile?.display_name || "名前未設定"}
            </span>
          </div>
        ))}
      </div>

      {selectedRecipients.length === 0 && (
        <p className="text-xs text-red-600">少なくとも1人選択してください</p>
      )}
    </div>
  );
}
