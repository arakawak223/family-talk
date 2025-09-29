"use client";

import { useState } from "react";
import { VoiceMessageWithProfile } from "@/lib/voice-messages";
import { getAvatarDisplay } from "@/lib/avatars";

interface VoiceEnvelopeProps {
  message: VoiceMessageWithProfile;
  onOpen: (message: VoiceMessageWithProfile) => void;
  formatDateTime: (dateString: string) => string;
}

export function VoiceEnvelope({ message, onOpen, formatDateTime }: VoiceEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const playOpenSound = () => {
    // Create audio context for the pururururun sound effect
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Create the "pururururun♪" melody
    const notes = [
      { freq: 523.25, duration: 0.15 }, // C5
      { freq: 587.33, duration: 0.15 }, // D5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 698.46, duration: 0.15 }, // F5
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 880.00, duration: 0.15 }, // A5
      { freq: 987.77, duration: 0.3 },  // B5 (longer final note)
    ];

    let currentTime = audioContext.currentTime;

    notes.forEach((note) => {
      const noteOscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();

      noteOscillator.connect(noteGain);
      noteGain.connect(audioContext.destination);

      noteOscillator.frequency.setValueAtTime(note.freq, currentTime);
      noteOscillator.type = 'sine';

      // Envelope for each note
      noteGain.gain.setValueAtTime(0, currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

      noteOscillator.start(currentTime);
      noteOscillator.stop(currentTime + note.duration);

      currentTime += note.duration;
    });
  };

  const handleEnvelopeClick = () => {
    if (isOpening) return;

    setIsOpening(true);
    playOpenSound();

    // Wait for sound to finish before opening
    setTimeout(() => {
      onOpen(message);
      setIsOpening(false);
    }, 1200); // Duration of the sound effect
  };

  return (
    <div className="mr-4">
      <div
        onClick={handleEnvelopeClick}
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
          isOpening ? 'animate-pulse' : ''
        }`}
      >
        {/* Envelope Background */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-lg p-6 shadow-lg min-h-[120px] min-w-[180px] relative overflow-hidden">

          {/* Envelope Flap */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-yellow-200 to-yellow-300 border-b-2 border-yellow-400"
               style={{
                 clipPath: 'polygon(0 0, 50% 70%, 100% 0)'
               }}>
          </div>

          {/* Sealed Wax with Avatar */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-red-700">
            <span className="text-2xl">
              {getAvatarDisplay(message.sender_profile?.avatar_id)}
            </span>
          </div>

          {/* Content Area */}
          <div className="pt-12 text-center">
            <div className="text-sm font-medium text-yellow-800 mb-1">
              {message.sender_profile?.display_name || "家族"}さんから
            </div>

            <div className="text-xs text-yellow-700 mb-2">
              {formatDateTime(message.created_at)}
            </div>

            {message.custom_question && (
              <div className="text-xs text-yellow-600 italic px-2">
                &ldquo;{message.custom_question.slice(0, 20)}{message.custom_question.length > 20 ? '...' : ''}&rdquo;
              </div>
            )}

            {/* Envelope Decoration */}
            <div className="absolute bottom-2 right-2 text-yellow-600 text-xs">
              📮
            </div>
          </div>

          {/* Shimmer Effect */}
          {!isOpening && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-300"
                 style={{ left: '-100%', animation: 'shimmer 2s infinite' }}>
            </div>
          )}
        </div>

        {/* Click hint */}
        <div className="text-center mt-2">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span>📧</span>
            <span>タップして開封</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}