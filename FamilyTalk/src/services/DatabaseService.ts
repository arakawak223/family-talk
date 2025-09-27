import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { VoiceMessage, User, FamilyGroup } from '../types';

export class DatabaseService {
  // ユーザー関連
  static async createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // 家族グループ関連
  static async createFamilyGroup(groupData: Omit<FamilyGroup, 'id' | 'createdAt'>): Promise<string> {
    try {
      const groupRef = doc(collection(db, 'familyGroups'));
      await setDoc(groupRef, {
        ...groupData,
        createdAt: serverTimestamp(),
      });
      return groupRef.id;
    } catch (error) {
      console.error('Error creating family group:', error);
      throw error;
    }
  }

  static async getFamilyGroup(groupId: string): Promise<FamilyGroup | null> {
    try {
      const groupDoc = await getDoc(doc(db, 'familyGroups', groupId));
      if (groupDoc.exists()) {
        const data = groupDoc.data();
        return {
          id: groupDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as FamilyGroup;
      }
      return null;
    } catch (error) {
      console.error('Error getting family group:', error);
      throw error;
    }
  }

  static async getUserFamilyGroups(userId: string): Promise<FamilyGroup[]> {
    try {
      const q = query(
        collection(db, 'familyGroups'),
        where('members', 'array-contains', { id: userId })
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as FamilyGroup;
      });
    } catch (error) {
      console.error('Error getting user family groups:', error);
      throw error;
    }
  }

  static async addMemberToFamilyGroup(groupId: string, member: User): Promise<void> {
    try {
      const groupRef = doc(db, 'familyGroups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const currentMembers = groupDoc.data().members || [];
        const updatedMembers = [...currentMembers, member];

        await updateDoc(groupRef, {
          members: updatedMembers,
        });
      }
    } catch (error) {
      console.error('Error adding member to family group:', error);
      throw error;
    }
  }

  // ボイスメッセージ関連
  static async createVoiceMessage(messageData: Omit<VoiceMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const messageRef = doc(collection(db, 'voiceMessages'));
      await setDoc(messageRef, {
        ...messageData,
        timestamp: serverTimestamp(),
      });
      return messageRef.id;
    } catch (error) {
      console.error('Error creating voice message:', error);
      throw error;
    }
  }

  static async getVoiceMessage(messageId: string): Promise<VoiceMessage | null> {
    try {
      const messageDoc = await getDoc(doc(db, 'voiceMessages', messageId));
      if (messageDoc.exists()) {
        const data = messageDoc.data();
        return {
          id: messageDoc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as VoiceMessage;
      }
      return null;
    } catch (error) {
      console.error('Error getting voice message:', error);
      throw error;
    }
  }

  static async getFamilyMessages(receiverIds: string[]): Promise<VoiceMessage[]> {
    try {
      const q = query(
        collection(db, 'voiceMessages'),
        where('receiverIds', 'array-contains-any', receiverIds),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as VoiceMessage;
      });
    } catch (error) {
      console.error('Error getting family messages:', error);
      throw error;
    }
  }

  static async markMessageAsListened(messageId: string, userId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'voiceMessages', messageId);
      const messageDoc = await getDoc(messageRef);

      if (messageDoc.exists()) {
        const currentListenedBy = messageDoc.data().listenedBy || [];
        if (!currentListenedBy.includes(userId)) {
          const updatedListenedBy = [...currentListenedBy, userId];

          await updateDoc(messageRef, {
            listenedBy: updatedListenedBy,
          });
        }
      }
    } catch (error) {
      console.error('Error marking message as listened:', error);
      throw error;
    }
  }

  // リアルタイム更新のリスナー
  static subscribeToFamilyMessages(
    receiverIds: string[],
    callback: (messages: VoiceMessage[]) => void
  ): () => void {
    const q = query(
      collection(db, 'voiceMessages'),
      where('receiverIds', 'array-contains-any', receiverIds),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as VoiceMessage;
      });

      callback(messages);
    }, (error) => {
      console.error('Error in messages subscription:', error);
    });
  }

  // メッセージ削除
  static async deleteVoiceMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'voiceMessages', messageId));
    } catch (error) {
      console.error('Error deleting voice message:', error);
      throw error;
    }
  }
}