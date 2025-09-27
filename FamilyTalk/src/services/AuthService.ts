import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { DatabaseService } from './DatabaseService';
import type { User } from '../types';

export class AuthService {
  // ユーザー登録
  static async signUp(
    email: string,
    password: string,
    userData: Omit<User, 'id'>
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firebase Authのプロフィールを更新
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Firestoreにユーザーデータを保存
      const user: User = {
        id: firebaseUser.uid,
        ...userData,
      };

      await DatabaseService.createUser(firebaseUser.uid, userData);

      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // ユーザーログイン
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firestoreからユーザーデータを取得
      const userData = await DatabaseService.getUser(firebaseUser.uid);

      if (!userData) {
        throw new Error('ユーザーデータが見つかりません');
      }

      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // ユーザーログアウト
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  // パスワードリセット
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // 認証状態の監視
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Firestoreからユーザーデータを取得
          const userData = await DatabaseService.getUser(firebaseUser.uid);

          if (userData) {
            callback(userData);
          } else {
            // Firestoreにデータがない場合は作成
            const newUserData: Omit<User, 'id'> = {
              name: firebaseUser.displayName || 'Unknown User',
              avatar: firebaseUser.photoURL || undefined,
              role: 'parent', // デフォルト役割
            };

            await DatabaseService.createUser(firebaseUser.uid, newUserData);

            const user: User = {
              id: firebaseUser.uid,
              ...newUserData,
            };

            callback(user);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // 現在のユーザーを取得
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // ユーザープロフィール更新
  static async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid === userId) {
        // Firebase Authのプロフィールも更新
        if (updates.name) {
          await updateProfile(currentUser, {
            displayName: updates.name,
          });
        }
      }

      // Firestoreのユーザーデータを更新
      await DatabaseService.updateUser(userId, updates);
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleAuthError(error);
    }
  }

  // 認証エラーのハンドリング
  private static handleAuthError(error: any): Error {
    let message = 'Unknown authentication error';

    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'ユーザーが見つかりません';
          break;
        case 'auth/wrong-password':
          message = 'パスワードが間違っています';
          break;
        case 'auth/email-already-in-use':
          message = 'このメールアドレスは既に使用されています';
          break;
        case 'auth/weak-password':
          message = 'パスワードが弱すぎます';
          break;
        case 'auth/invalid-email':
          message = 'メールアドレスの形式が正しくありません';
          break;
        case 'auth/user-disabled':
          message = 'このアカウントは無効化されています';
          break;
        case 'auth/too-many-requests':
          message = 'リクエストが多すぎます。しばらく待ってから再試行してください';
          break;
        case 'auth/network-request-failed':
          message = 'ネットワークエラーが発生しました';
          break;
        default:
          message = error.message || 'Authentication error';
      }
    }

    return new Error(message);
  }

  // バリデーション関数
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('パスワードは6文字以上で入力してください');
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push('パスワードには英字を含めてください');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('パスワードには数字を含めてください');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ゲストユーザー作成（デモ用）
  static async createGuestUser(name: string, role: User['role']): Promise<User> {
    try {
      // ゲスト用の一意なIDを生成
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const guestUser: User = {
        id: guestId,
        name,
        role,
      };

      // ローカルストレージに保存（実際のアプリでは適切な認証システムを使用）
      await DatabaseService.createUser(guestId, {
        name,
        role,
      });

      return guestUser;
    } catch (error) {
      console.error('Create guest user error:', error);
      throw error;
    }
  }
}