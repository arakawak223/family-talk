'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getBGMManager,
  BGM_TRACKS,
  type BGMScene
} from '@/lib/audio/bgm-manager';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Music,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// シーンごとのアイコンと色
const sceneStyles: Record<BGMScene, { icon: string; color: string; bgColor: string }> = {
  title: { icon: '🎮', color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  roulette: { icon: '🎰', color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
  dice_wait: { icon: '🎲', color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  flying: { icon: '✈️', color: 'text-sky-600', bgColor: 'bg-sky-50 hover:bg-sky-100' },
  quiz: { icon: '❓', color: 'text-yellow-600', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
  comedy: { icon: '😂', color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
  message: { icon: '💌', color: 'text-pink-600', bgColor: 'bg-pink-50 hover:bg-pink-100' },
  arrival: { icon: '🎉', color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' },
  power_spot: { icon: '⛩️', color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100' },
  ending: { icon: '🏆', color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
};

export default function BGMTestPage() {
  const [currentScene, setCurrentScene] = useState<BGMScene | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bgm = getBGMManager();
    setVolume(bgm.getVolume());
    setIsMuted(bgm.getMuted());
  }, []);

  const handlePlay = async (scene: BGMScene) => {
    setError(null);
    try {
      const bgm = getBGMManager();
      await bgm.play(scene);
      setCurrentScene(scene);
      setIsPlaying(true);
    } catch (err) {
      setError(`再生エラー: ${err}`);
    }
  };

  const handleStop = async () => {
    const bgm = getBGMManager();
    await bgm.stop();
    setCurrentScene(null);
    setIsPlaying(false);
  };

  const handlePause = () => {
    const bgm = getBGMManager();
    if (isPlaying) {
      bgm.pause();
      setIsPlaying(false);
    } else {
      bgm.resume();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const bgm = getBGMManager();
    bgm.setVolume(value[0]);
    setVolume(value[0]);
  };

  const handleMuteToggle = () => {
    const bgm = getBGMManager();
    const newMuted = bgm.toggleMute();
    setIsMuted(newMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/world-tour">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6" />
            BGMテスト画面
          </h1>
        </div>

        {/* コントロールパネル */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎛️ コントロール
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* 現在再生中 */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-gray-500 mb-1">現在再生中:</p>
                <p className="font-bold text-lg">
                  {currentScene ? (
                    <>
                      {sceneStyles[currentScene].icon}{' '}
                      {BGM_TRACKS.find(t => t.scene === currentScene)?.name}
                    </>
                  ) : (
                    <span className="text-gray-400">なし</span>
                  )}
                </p>
              </div>

              {/* 再生コントロール */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePause}
                  disabled={!currentScene}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleStop}
                  disabled={!currentScene}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>

              {/* ボリューム */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-32"
                />
                <span className="text-sm w-12">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* BGMリスト */}
        <Card>
          <CardHeader>
            <CardTitle>🎵 BGMリスト（10パターン）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {BGM_TRACKS.map((track, index) => {
                const style = sceneStyles[track.scene];
                const isCurrentTrack = currentScene === track.scene;

                return (
                  <div
                    key={track.scene}
                    className={`
                      p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${isCurrentTrack
                        ? `border-${style.color.split('-')[1]}-500 ring-2 ring-${style.color.split('-')[1]}-200`
                        : 'border-transparent'}
                      ${style.bgColor}
                    `}
                    onClick={() => handlePlay(track.scene)}
                  >
                    <div className="flex items-center gap-4">
                      {/* 番号とアイコン */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono w-6">{index + 1}.</span>
                        <span className="text-2xl">{style.icon}</span>
                      </div>

                      {/* 曲情報 */}
                      <div className="flex-1">
                        <h3 className={`font-bold ${style.color}`}>
                          {track.name}
                        </h3>
                        <p className="text-sm text-gray-600">{track.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          シーン: {track.scene} | ループ: {track.loop ? 'あり' : 'なし'}
                        </p>
                      </div>

                      {/* 再生状態 */}
                      <div className="flex items-center gap-2">
                        {isCurrentTrack && isPlaying && (
                          <div className="flex gap-1">
                            <span className="w-1 h-4 bg-current animate-pulse rounded" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-6 bg-current animate-pulse rounded" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-3 bg-current animate-pulse rounded" style={{ animationDelay: '300ms' }} />
                            <span className="w-1 h-5 bg-current animate-pulse rounded" style={{ animationDelay: '450ms' }} />
                          </div>
                        )}
                        <Button
                          variant={isCurrentTrack ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrentTrack && isPlaying) {
                              handlePause();
                            } else {
                              handlePlay(track.scene);
                            }
                          }}
                        >
                          {isCurrentTrack && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📝 BGM素材について</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              このゲームでは、以下のフリーBGM素材サイトから楽曲を使用することを推奨しています：
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>魔王魂</strong> - https://maou.audio/ （商用利用可、クレジット表記推奨）</li>
              <li><strong>DOVA-SYNDROME</strong> - https://dova-s.jp/ （商用利用可）</li>
              <li><strong>甘茶の音楽工房</strong> - https://amachamusic.chagasi.com/ （商用利用可）</li>
            </ul>
            <p className="mt-4">
              BGMファイルは <code className="bg-gray-100 px-1 rounded">/public/audio/bgm/</code> ディレクトリに配置してください。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
