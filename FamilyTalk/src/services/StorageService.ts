import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'firebase/storage';
import { storage } from '../config/firebase';

export class StorageService {
  private static VOICE_MESSAGES_PATH = 'voice-messages';

  // 音声ファイルのアップロード
  static async uploadVoiceMessage(
    messageId: string,
    audioUri: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // ファイルをBlobとして読み込む
      const response = await fetch(audioUri);
      const blob = await response.blob();

      // ストレージ参照を作成
      const fileName = `${messageId}.m4a`;
      const storageRef = ref(storage, `${this.VOICE_MESSAGES_PATH}/${fileName}`);

      if (onProgress) {
        // 進行状況付きアップロード
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        // シンプルアップロード
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      }
    } catch (error) {
      console.error('Error uploading voice message:', error);
      throw error;
    }
  }

  // 音声ファイルのダウンロードURL取得
  static async getVoiceMessageDownloadURL(messageId: string): Promise<string> {
    try {
      const fileName = `${messageId}.m4a`;
      const storageRef = ref(storage, `${this.VOICE_MESSAGES_PATH}/${fileName}`);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // 音声ファイルの削除
  static async deleteVoiceMessage(messageId: string): Promise<void> {
    try {
      const fileName = `${messageId}.m4a`;
      const storageRef = ref(storage, `${this.VOICE_MESSAGES_PATH}/${fileName}`);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting voice message:', error);
      throw error;
    }
  }

  // ファイルのメタデータ取得
  static async getVoiceMessageMetadata(messageId: string): Promise<any> {
    try {
      const fileName = `${messageId}.m4a`;
      const storageRef = ref(storage, `${this.VOICE_MESSAGES_PATH}/${fileName}`);
      return await getMetadata(storageRef);
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw error;
    }
  }

  // 音声ファイルのキャッシュ用ローカルダウンロード
  static async downloadVoiceMessageForCache(
    messageId: string,
    _onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const downloadURL = await this.getVoiceMessageDownloadURL(messageId);

      // React Native環境では、ダウンロードしたファイルのローカルパスを返す
      // 実際の実装では react-native-fs などを使用
      return downloadURL;
    } catch (error) {
      console.error('Error downloading voice message for cache:', error);
      throw error;
    }
  }

  // プロフィール画像のアップロード（将来の拡張用）
  static async uploadProfileImage(
    userId: string,
    imageUri: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const fileName = `${userId}.jpg`;
      const storageRef = ref(storage, `profile-images/${fileName}`);

      if (onProgress) {
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }

  // ファイルサイズの制限チェック
  static checkFileSizeLimit(blob: Blob, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return blob.size <= maxSizeBytes;
  }

  // 音声ファイル形式の検証
  static isValidAudioFormat(mimeType: string): boolean {
    const validFormats = [
      'audio/mp4',
      'audio/m4a',
      'audio/aac',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/webm',
    ];
    return validFormats.includes(mimeType);
  }
}