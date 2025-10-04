import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/database";

type Profile = Database['public']['Tables']['profiles']['Row'];

// クライアントサイド用：プロフィール取得
export async function getCurrentUserProfile() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('プロフィール取得エラー:', profileError);
    return null;
  }

  return profile;
}

// 家族招待コード生成
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 家族作成
export async function createFamily(name: string, description?: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const inviteCode = generateInviteCode();

  // トランザクション的に家族作成とメンバー登録を実行
  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert([{
      name,
      description,
      invite_code: inviteCode,
      created_by: user.id
    }])
    .select()
    .single();

  if (familyError) {
    throw new Error(`家族作成エラー: ${familyError.message}`);
  }

  // 作成者を管理者として家族メンバーに追加
  const { error: memberError } = await supabase
    .from('family_members')
    .insert([{
      family_id: family.id,
      user_id: user.id,
      role: 'admin'
    }]);

  if (memberError) {
    throw new Error(`メンバー追加エラー: ${memberError.message}`);
  }

  return family;
}

// 家族招待コードで参加
export async function joinFamilyByInviteCode(inviteCode: string, avatarId?: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  // 招待コードで家族を検索
  const { data: family, error: familyError } = await supabase
    .from('families')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (familyError || !family) {
    console.error('招待コード検索エラー:', familyError);
    console.log('入力された招待コード:', inviteCode.toUpperCase());
    throw new Error('無効な招待コードです');
  }

  // 既に参加済みかチェック
  const { data: existingMember } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', family.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingMember) {
    throw new Error('既にこの家族に参加しています');
  }

  // プロフィールを作成/更新
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert([{
      id: user.id,
      email: user.email!,
      avatar_id: avatarId || null,
      display_name: user.email?.split('@')[0] || 'ユーザー'
    }]);

  if (profileError) {
    console.error('プロフィール作成エラー:', profileError);
  }

  // 家族メンバーとして追加
  console.log('家族メンバー追加:', { family_id: family.id, user_id: user.id });
  const { data: memberData, error: memberError } = await supabase
    .from('family_members')
    .insert([{
      family_id: family.id,
      user_id: user.id,
      role: 'member'
    }])
    .select();

  if (memberError) {
    console.error('家族メンバー追加エラー:', memberError);
    throw new Error(`家族参加エラー: ${memberError.message}`);
  }

  console.log('家族メンバー追加成功:', memberData);
  return family;
}

// プロフィール更新/作成
export async function upsertProfile(profile: Partial<Profile>) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert([{
      id: user.id,
      email: user.email!,
      ...profile
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`プロフィール更新エラー: ${error.message}`);
  }

  return data;
}

// アバターのみ更新（絵文字）
export async function updateAvatar(avatarId: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      avatar_id: avatarId,
      avatar_type: 'emoji'
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`アバター更新エラー: ${error.message}`);
  }

  return data;
}

// 画像リサイズ関数
async function resizeImage(file: File, maxWidth: number = 200, maxHeight: number = 200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // アスペクト比を保持してリサイズ
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('画像のリサイズに失敗しました'));
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

// 写真アバターをアップロード
export async function uploadPhotoAvatar(file: File) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  // 画像ファイルのバリデーション
  if (!file.type.startsWith('image/')) {
    throw new Error('画像ファイルを選択してください');
  }

  // ファイルサイズチェック (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('ファイルサイズは5MB以下にしてください');
  }

  try {
    // 画像をリサイズ
    const resizedBlob = await resizeImage(file);

    // 既存の写真アバターを削除
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_photo_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_photo_url) {
      const oldPath = profile.avatar_photo_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldPath}`]);
      }
    }

    // 新しい写真をアップロード
    const timestamp = Date.now();
    const fileName = `avatar-${timestamp}.jpg`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, resizedBlob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`アップロードエラー: ${uploadError.message}`);
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // プロフィールを更新
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_photo_url: urlData.publicUrl,
        avatar_type: 'photo'
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`プロフィール更新エラー: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('写真アバターアップロードエラー:', error);
    throw error;
  }
}

// ユーザーの家族グループ一覧を取得
export async function getUserFamilies() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { data: memberships, error: memberError } = await supabase
    .from('family_members')
    .select(`
      *,
      family:families(*)
    `)
    .eq('user_id', user.id);

  if (memberError) {
    throw new Error(`家族取得エラー: ${memberError.message}`);
  }

  return memberships || [];
}

// 家族グループを削除（管理者のみ）
export async function deleteFamily(familyId: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  // 管理者権限チェック
  const { data: membership, error: checkError } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', familyId)
    .eq('user_id', user.id)
    .single();

  if (checkError || !membership) {
    throw new Error('この家族グループにアクセスできません');
  }

  if (membership.role !== 'admin') {
    throw new Error('管理者のみが家族グループを削除できます');
  }

  // 家族グループを削除（カスケード削除でメンバーも削除される）
  const { error: deleteError } = await supabase
    .from('families')
    .delete()
    .eq('id', familyId);

  if (deleteError) {
    throw new Error(`家族削除エラー: ${deleteError.message}`);
  }
}

// 家族グループから退出
export async function leaveFamily(familyId: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  // メンバーシップを削除
  const { error: deleteError } = await supabase
    .from('family_members')
    .delete()
    .eq('family_id', familyId)
    .eq('user_id', user.id);

  if (deleteError) {
    throw new Error(`退出エラー: ${deleteError.message}`);
  }
}

// メンバーを削除（管理者のみ）
export async function removeFamilyMember(familyId: string, targetUserId: string) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  // 管理者権限チェック
  const { data: membership, error: checkError } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', familyId)
    .eq('user_id', user.id)
    .single();

  if (checkError || !membership) {
    throw new Error('この家族グループにアクセスできません');
  }

  if (membership.role !== 'admin') {
    throw new Error('管理者のみがメンバーを削除できます');
  }

  // メンバーを削除
  const { error: deleteError } = await supabase
    .from('family_members')
    .delete()
    .eq('family_id', familyId)
    .eq('user_id', targetUserId);

  if (deleteError) {
    throw new Error(`メンバー削除エラー: ${deleteError.message}`);
  }
}