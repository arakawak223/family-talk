import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Family = Database['public']['Tables']['families']['Row'];

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile | null;
  families: Family[];
}

// クライアントサイド用：プロフィール取得
export async function getCurrentUserProfile() {
  const supabase = createBrowserClient();

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

// サーバーサイド用：ユーザー情報と家族情報取得
export async function getCurrentUserWithFamilies() {
  const supabase = await createServerClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  // プロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 所属家族取得
  const { data: familyMemberships, error: familyError } = await supabase
    .from('family_members')
    .select(`
      families!family_members_family_id_fkey (*)
    `)
    .eq('user_id', user.id);

  console.log('[getCurrentUserWithFamilies] User ID:', user.id);
  console.log('[getCurrentUserWithFamilies] Family memberships raw:', familyMemberships);
  console.log('[getCurrentUserWithFamilies] Family error:', familyError);

  const families = familyMemberships?.map(membership =>
    Array.isArray(membership.families) ? membership.families[0] : membership.families
  ).filter(Boolean) as Family[] || [];

  console.log('[getCurrentUserWithFamilies] Processed families:', families);

  const result = {
    id: user.id,
    email: user.email!,
    profile,
    families: families.flat()
  } as UserWithProfile;

  console.log('[getCurrentUserWithFamilies] Final result:', result);

  return result;
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
  const supabase = createBrowserClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const inviteCode = generateInviteCode();

  // トランザクション的に家族作成とメンバー登録を実行
  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert({
      name,
      description,
      invite_code: inviteCode,
      created_by: user.id
    })
    .select()
    .single();

  if (familyError) {
    throw new Error(`家族作成エラー: ${familyError.message}`);
  }

  // 作成者を管理者として家族メンバーに追加
  const { error: memberError } = await supabase
    .from('family_members')
    .insert({
      family_id: family.id,
      user_id: user.id,
      role: 'admin'
    });

  if (memberError) {
    throw new Error(`メンバー追加エラー: ${memberError.message}`);
  }

  return family;
}

// 家族招待コードで参加
export async function joinFamilyByInviteCode(inviteCode: string) {
  const supabase = createBrowserClient();

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
    throw new Error('無効な招待コードです');
  }

  // 既に参加済みかチェック
  const { data: existingMember, error: checkError } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', family.id)
    .eq('user_id', user.id)
    .single();

  if (existingMember && !checkError) {
    throw new Error('既にこの家族に参加しています');
  }

  // 家族メンバーとして追加
  const { error: memberError } = await supabase
    .from('family_members')
    .insert({
      family_id: family.id,
      user_id: user.id,
      role: 'member'
    });

  if (memberError) {
    throw new Error(`家族参加エラー: ${memberError.message}`);
  }

  return family;
}

// プロフィール更新/作成
export async function upsertProfile(profile: Partial<Profile>) {
  const supabase = createBrowserClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email!,
      ...profile
    })
    .select()
    .single();

  if (error) {
    throw new Error(`プロフィール更新エラー: ${error.message}`);
  }

  return data;
}