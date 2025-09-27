import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AudioRecorder {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private isRecording = false;
  private isPrepared = false;

  constructor() {
    this.setupAudio();
  }

  private async setupAudio() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isPrepared = true;
    } catch (error) {
      console.error('Audio setup failed:', error);
    }
  }

  async startRecording(): Promise<boolean> {
    if (!this.isPrepared) {
      await this.setupAudio();
    }

    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm;codecs=opus',
          bitsPerSecond: 128000,
        },
      };

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(recordingOptions);
      await this.recording.startAsync();
      this.isRecording = true;

      return true;
    } catch (error) {
      console.error('Start recording failed:', error);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording || !this.isRecording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      this.isRecording = false;

      const uri = this.recording.getURI();
      this.recording = null;

      return uri;
    } catch (error) {
      console.error('Stop recording failed:', error);
      return null;
    }
  }

  async playSound(uri: string): Promise<boolean> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      this.sound = sound;
      await sound.playAsync();

      return true;
    } catch (error) {
      console.error('Play sound failed:', error);
      return false;
    }
  }

  async stopSound(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  async getDuration(uri: string): Promise<number> {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync();

      if (status.isLoaded && status.durationMillis) {
        return Math.round(status.durationMillis / 1000);
      }
      return 0;
    } catch (error) {
      console.error('Get duration failed:', error);
      return 0;
    }
  }

  async saveRecording(uri: string, messageId: string): Promise<string | null> {
    try {
      const savedUri = `${messageId}.m4a`;
      await AsyncStorage.setItem(`recording_${messageId}`, uri);
      return savedUri;
    } catch (error) {
      console.error('Save recording failed:', error);
      return null;
    }
  }

  async loadRecording(messageId: string): Promise<string | null> {
    try {
      const uri = await AsyncStorage.getItem(`recording_${messageId}`);
      return uri;
    } catch (error) {
      console.error('Load recording failed:', error);
      return null;
    }
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  async cleanup(): Promise<void> {
    if (this.recording) {
      if (this.isRecording) {
        await this.recording.stopAndUnloadAsync();
      }
      this.recording = null;
    }

    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}