import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { DatabaseService } from '../../services/DatabaseService';
import { AuthService } from '../../services/AuthService';
import type { FamilyGroup, User } from '../../types';

interface FamilyGroupScreenProps {
  navigation: any;
}

const FamilyGroupScreen: React.FC<FamilyGroupScreenProps> = ({ navigation }) => {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadFamilyGroups();
  }, []);

  const loadFamilyGroups = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      const groups = await DatabaseService.getUserFamilyGroups(currentUser.uid);
      setFamilyGroups(groups);
    } catch (error) {
      console.error('家族グループ読み込みエラー:', error);
      Alert.alert('エラー', '家族グループの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const createFamilyGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('エラー', 'グループ名を入力してください。');
      return;
    }

    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      const userData = await DatabaseService.getUser(currentUser.uid);
      if (!userData) return;

      const groupData = {
        name: newGroupName.trim(),
        adminId: currentUser.uid,
        members: [userData],
      };

      await DatabaseService.createFamilyGroup(groupData);
      setNewGroupName('');
      setShowCreateModal(false);
      loadFamilyGroups();
      Alert.alert('成功', '家族グループを作成しました！');
    } catch (error) {
      console.error('グループ作成エラー:', error);
      Alert.alert('エラー', 'グループの作成に失敗しました。');
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selectedGroup) {
      Alert.alert('エラー', 'メールアドレスを入力してください。');
      return;
    }

    try {
      // 実際の実装では、招待システムを作成する必要があります
      // ここでは簡易的にアラートで通知
      Alert.alert(
        '招待を送信しました',
        `${inviteEmail} に招待メールを送信しました。\n（実装では実際のメール送信機能が必要です）`
      );
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('招待エラー:', error);
      Alert.alert('エラー', '招待の送信に失敗しました。');
    }
  };

  const renderGroupItem = ({ item }: { item: FamilyGroup }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.members.length}人</Text>
      </View>

      <View style={styles.membersList}>
        {item.members.map((member, index) => (
          <View key={member.id} style={styles.memberItem}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitial}>
                {member.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{getRoleLabel(member.role)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.groupActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedGroup(item);
            setShowInviteModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>👥 メンバー招待</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.navigate('QuestionSelect', { familyGroup: item })}
        >
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
            💭 質問を選ぶ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getRoleLabel = (role: User['role']): string => {
    switch (role) {
      case 'parent':
        return 'お父さん・お母さん';
      case 'child':
        return 'お子さん';
      case 'grandparent':
        return 'おじいちゃん・おばあちゃん';
      case 'sibling':
        return 'きょうだい';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>家族グループ</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ 新しいグループ</Text>
        </TouchableOpacity>
      </View>

      {familyGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.emptyTitle}>家族グループがありません</Text>
          <Text style={styles.emptyDescription}>
            新しいグループを作成して、{'\n'}家族とのコミュニケーションを始めましょう！
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.emptyButtonText}>最初のグループを作成</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={familyGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* グループ作成モーダル */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新しい家族グループ</Text>

            <TextInput
              style={styles.input}
              placeholder="グループ名を入力"
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={createFamilyGroup}
              >
                <Text style={[styles.modalButtonText, styles.modalPrimaryButtonText]}>
                  作成
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* メンバー招待モーダル */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>メンバーを招待</Text>
            <Text style={styles.modalSubtitle}>
              {selectedGroup?.name} に招待するメンバーのメールアドレスを入力してください
            </Text>

            <TextInput
              style={styles.input}
              placeholder="メールアドレス"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.modalButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={inviteMember}
              >
                <Text style={[styles.modalButtonText, styles.modalPrimaryButtonText]}>
                  招待を送信
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  createButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  memberCount: {
    fontSize: 14,
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membersList: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  memberRole: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  groupActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  primaryButton: {
    backgroundColor: '#27ae60',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  modalPrimaryButton: {
    backgroundColor: '#3498db',
  },
  modalPrimaryButtonText: {
    color: '#ffffff',
  },
});

export default FamilyGroupScreen;