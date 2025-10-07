import { createClient } from "@/lib/supabase/server";

// 管理者のメールアドレスリスト（環境変数で管理することを推奨）
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['arakawa@best-partners.co.jp'];

/**
 * 現在のユーザーが管理者かどうかをチェック
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log('[isAdmin] User email:', user?.email);
  console.log('[isAdmin] ADMIN_EMAILS array:', ADMIN_EMAILS);
  console.log('[isAdmin] process.env.ADMIN_EMAILS:', process.env.ADMIN_EMAILS);

  if (!user?.email) {
    console.log('[isAdmin] No user email found');
    return false;
  }

  const result = ADMIN_EMAILS.includes(user.email);
  console.log('[isAdmin] Check result:', result);

  return result;
}

/**
 * 全家族グループの利用状況を取得
 */
export async function getAllFamiliesWithStats() {
  const supabase = await createClient();

  // 家族グループ一覧を取得
  const { data: families, error: familiesError } = await supabase
    .from('families')
    .select(`
      id,
      name,
      description,
      invite_code,
      created_at,
      created_by,
      profiles!families_created_by_fkey(display_name, email)
    `)
    .order('created_at', { ascending: false });

  if (familiesError) throw familiesError;

  // 各家族の統計情報を取得
  const familiesWithStats = await Promise.all(
    (families || []).map(async (familyRaw) => {
      // profilesを配列から単一オブジェクトに変換
      const family = {
        ...familyRaw,
        profiles: Array.isArray(familyRaw.profiles)
          ? familyRaw.profiles[0] || null
          : familyRaw.profiles || null
      };

      // メンバー数を取得
      const { count: memberCount } = await supabase
        .from('family_members')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', family.id);

      // メッセージ数を取得
      const { count: messageCount } = await supabase
        .from('voice_messages')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', family.id);

      // 最新のメッセージ日時を取得
      const { data: latestMessage } = await supabase
        .from('voice_messages')
        .select('created_at')
        .eq('family_id', family.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 過去7日間のメッセージ数を取得
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentMessageCount } = await supabase
        .from('voice_messages')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', family.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      return {
        ...family,
        stats: {
          memberCount: memberCount || 0,
          messageCount: messageCount || 0,
          recentMessageCount: recentMessageCount || 0,
          lastActivityAt: latestMessage?.created_at || null,
        },
      };
    })
  );

  return familiesWithStats;
}

/**
 * 特定の家族グループの詳細情報を取得
 */
export async function getFamilyDetails(familyId: string) {
  const supabase = await createClient();

  // 家族情報を取得
  const { data: familyRaw, error: familyError } = await supabase
    .from('families')
    .select(`
      id,
      name,
      description,
      invite_code,
      created_at,
      created_by,
      profiles!families_created_by_fkey(display_name, email)
    `)
    .eq('id', familyId)
    .single();

  if (familyError) throw familyError;

  // profilesを配列から単一オブジェクトに変換
  const family = {
    ...familyRaw,
    profiles: Array.isArray(familyRaw?.profiles)
      ? familyRaw.profiles[0] || null
      : familyRaw?.profiles || null
  };

  // メンバー情報を取得
  const { data: membersRaw, error: membersError } = await supabase
    .from('family_members')
    .select(`
      id,
      role,
      joined_at,
      profiles!family_members_user_id_fkey(
        id,
        display_name,
        email,
        avatar_url,
        avatar_type,
        avatar_photo_url
      )
    `)
    .eq('family_id', familyId)
    .order('joined_at', { ascending: true });

  if (membersError) throw membersError;

  // profilesを配列から単一オブジェクトに変換
  const members = membersRaw?.map(member => ({
    ...member,
    profiles: Array.isArray(member.profiles)
      ? member.profiles[0] || null
      : member.profiles || null
  })) || [];

  // メッセージ統計を取得
  const { data: messages, error: messagesError } = await supabase
    .from('voice_messages')
    .select(`
      id,
      created_at,
      duration_seconds,
      sender_id,
      is_group_message
    `)
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });

  if (messagesError) throw messagesError;

  // 送信者別メッセージ数
  const messagesBySender = messages?.reduce((acc, msg) => {
    acc[msg.sender_id] = (acc[msg.sender_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 日別メッセージ数（過去30日）
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const messagesByDate = messages
    ?.filter(msg => new Date(msg.created_at) >= thirtyDaysAgo)
    .reduce((acc, msg) => {
      const date = new Date(msg.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return {
    family,
    members: members || [],
    messageStats: {
      total: messages?.length || 0,
      groupMessages: messages?.filter(m => m.is_group_message).length || 0,
      individualMessages: messages?.filter(m => !m.is_group_message).length || 0,
      totalDuration: messages?.reduce((sum, m) => sum + (m.duration_seconds || 0), 0) || 0,
      messagesBySender: messagesBySender || {},
      messagesByDate: messagesByDate || {},
    },
  };
}

/**
 * システム全体の統計情報を取得
 */
export async function getSystemStats() {
  const supabase = await createClient();

  // 総ユーザー数
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 総家族数
  const { count: totalFamilies } = await supabase
    .from('families')
    .select('*', { count: 'exact', head: true });

  // 総メッセージ数
  const { count: totalMessages } = await supabase
    .from('voice_messages')
    .select('*', { count: 'exact', head: true });

  // 今日の新規ユーザー数
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: newUsersToday } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // 今日の新規メッセージ数
  const { count: newMessagesToday } = await supabase
    .from('voice_messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // アクティブな家族数（過去7日間にメッセージがある）
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: activeFamilies } = await supabase
    .from('voice_messages')
    .select('family_id')
    .gte('created_at', sevenDaysAgo.toISOString());

  const activeFamilyCount = new Set(activeFamilies?.map(m => m.family_id)).size;

  return {
    totalUsers: totalUsers || 0,
    totalFamilies: totalFamilies || 0,
    totalMessages: totalMessages || 0,
    newUsersToday: newUsersToday || 0,
    newMessagesToday: newMessagesToday || 0,
    activeFamilies: activeFamilyCount,
  };
}
