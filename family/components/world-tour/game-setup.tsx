'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Player,
  PLAYER_COLORS,
  PLAYER_AVATARS,
  createPlayer
} from '@/lib/game/player-manager';
import { AIRPORTS } from '@/lib/data/airports';
import { Users, Plus, Minus, Plane, Play, Shuffle, Globe, MapPin, Sparkles } from 'lucide-react';

interface PlayerSetup {
  nickname: string;
  avatarEmoji: string;
  colorId: string;
}

interface GameSetupProps {
  onStartGame: (players: Player[], destinationCount: number, startAirport: string) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<PlayerSetup[]>([
    { nickname: '', avatarEmoji: '👦', colorId: 'red' },
    { nickname: '', avatarEmoji: '👧', colorId: 'blue' },
    { nickname: '', avatarEmoji: '👨', colorId: 'green' },
    { nickname: '', avatarEmoji: '👩', colorId: 'yellow' },
  ]);
  const [destinationCount, setDestinationCount] = useState(5);
  const [startAirport, setStartAirport] = useState('NRT');
  const [showAvatarPicker, setShowAvatarPicker] = useState<number | null>(null);

  // プレイヤー数を変更
  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(4, playerCount + delta));
    setPlayerCount(newCount);
  };

  // プレイヤー情報を更新
  const updatePlayer = (index: number, field: keyof PlayerSetup, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  // ランダムニックネームを設定
  const setRandomNickname = (index: number) => {
    const randomNames = [
      'たびびと', 'ぼうけんか', 'せかいじん', 'とらべらー',
      'パイロット', 'キャプテン', 'エクスプローラー', 'ナビゲーター',
      'スカイウォーカー', 'グローブトロッター', 'ワールドマスター', 'ジェットセッター'
    ];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    updatePlayer(index, 'nickname', randomName);
  };

  // ゲーム開始
  const handleStartGame = () => {
    const gamePlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const setup = players[i];
      const player = createPlayer(
        i,
        setup.nickname || `プレイヤー${i + 1}`,
        setup.avatarEmoji,
        startAirport
      );
      player.color = setup.colorId;
      gamePlayers.push(player);
    }
    onStartGame(gamePlayers, destinationCount, startAirport);
  };

  // 主要空港リスト（スタート地点用）
  const majorAirports = AIRPORTS.filter(a => a.hub);

  return (
    <div className="world-tour-bg min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* タイトルセクション */}
        <div className="text-center py-8 fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Globe className="h-10 w-10 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-white title-glow">
              ライトフライヤー21
            </h1>
            <p className="text-xl text-yellow-300 font-medium mt-1">感動・世界旅</p>
            <Plane className="h-10 w-10 text-yellow-400 airplane-flying" />
          </div>
          <p className="text-white/80 text-lg">
            ✨ 家族や友達と世界中を旅して感動ポイントを競おう！ ✨
          </p>
          <div className="flex justify-center gap-4 mt-4 text-white/60 text-sm">
            <span>🗼 世界50都市</span>
            <span>🎯 クイズ＆イベント</span>
            <span>🏆 感動ポイント</span>
          </div>
        </div>

        {/* プレイヤー人数 */}
        <div className="glass-card p-6 slide-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">プレイヤー人数</h2>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              className="w-14 h-14 rounded-full glass-card-light flex items-center justify-center text-white hover:scale-110 transition-transform disabled:opacity-50"
              onClick={() => handlePlayerCountChange(-1)}
              disabled={playerCount <= 1}
            >
              <Minus className="h-6 w-6" />
            </button>
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 title-glow">
                {playerCount}
              </div>
              <p className="text-white/60 text-sm mt-1">人参加</p>
            </div>
            <button
              className="w-14 h-14 rounded-full glass-card-light flex items-center justify-center text-white hover:scale-110 transition-transform disabled:opacity-50"
              onClick={() => handlePlayerCountChange(1)}
              disabled={playerCount >= 4}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-all ${
                  num <= playerCount
                    ? 'bg-yellow-400 scale-100'
                    : 'bg-white/20 scale-75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* プレイヤー設定 */}
        <div className="glass-card p-6 slide-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">プレイヤー設定</h2>
          </div>

          <div className="space-y-4">
            {Array.from({ length: playerCount }).map((_, index) => {
              const playerSetup = players[index];
              const playerColor = PLAYER_COLORS.find(c => c.id === playerSetup.colorId) || PLAYER_COLORS[0];

              return (
                <div
                  key={index}
                  className="player-card p-4 relative overflow-hidden"
                  style={{
                    borderColor: `${playerColor.color}60`,
                    background: `linear-gradient(135deg, ${playerColor.color}15 0%, transparent 100%)`
                  }}
                >
                  {/* プレイヤー番号バッジ */}
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg"
                    style={{ backgroundColor: playerColor.color }}
                  >
                    P{index + 1}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* アバター選択 */}
                    <div className="relative">
                      <button
                        className="w-16 h-16 rounded-full bg-white/10 border-2 flex items-center justify-center text-4xl hover:scale-110 transition-all"
                        style={{ borderColor: playerColor.color }}
                        onClick={() => setShowAvatarPicker(showAvatarPicker === index ? null : index)}
                      >
                        {playerSetup.avatarEmoji}
                      </button>
                      {showAvatarPicker === index && (
                        <div className="absolute top-full left-0 mt-2 p-3 glass-card z-20 grid grid-cols-5 gap-2 w-56">
                          {PLAYER_AVATARS.map((emoji) => (
                            <button
                              key={emoji}
                              className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                                playerSetup.avatarEmoji === emoji
                                  ? 'bg-yellow-400/30 ring-2 ring-yellow-400'
                                  : 'hover:bg-white/20'
                              }`}
                              onClick={() => {
                                updatePlayer(index, 'avatarEmoji', emoji);
                                setShowAvatarPicker(null);
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ニックネーム入力 */}
                    <div className="flex-1">
                      <label className="text-white/60 text-xs mb-1 block">ニックネーム</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={`プレイヤー${index + 1}`}
                          value={playerSetup.nickname}
                          onChange={(e) => updatePlayer(index, 'nickname', e.target.value)}
                          maxLength={10}
                          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-400"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRandomNickname(index)}
                          title="ランダム名前"
                          className="border-white/30 text-white hover:bg-white/20"
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* カラー選択 */}
                    <div>
                      <label className="text-white/60 text-xs mb-1 block">カラー</label>
                      <div className="flex gap-2">
                        {PLAYER_COLORS.map((color) => (
                          <button
                            key={color.id}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              playerSetup.colorId === color.id
                                ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-transparent'
                                : 'hover:scale-110 border-transparent'
                            }`}
                            style={{
                              backgroundColor: color.color,
                              borderColor: playerSetup.colorId === color.id ? 'white' : 'transparent'
                            }}
                            onClick={() => updatePlayer(index, 'colorId', color.id)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ゲーム設定 */}
        <div className="glass-card p-6 slide-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">ゲーム設定</h2>
          </div>

          <div className="space-y-8">
            {/* スタート地点 */}
            <div>
              <label className="flex items-center gap-2 text-white font-medium mb-3">
                <MapPin className="h-4 w-4 text-yellow-400" />
                スタート地点
              </label>
              <div className="relative">
                <select
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer hover:bg-white/15 transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  value={startAirport}
                  onChange={(e) => setStartAirport(e.target.value)}
                >
                  {majorAirports.map((airport) => (
                    <option key={airport.code} value={airport.code} className="bg-slate-800 text-white">
                      {airport.icon} {airport.city} ({airport.code}) - {airport.country}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
                  ▼
                </div>
              </div>
            </div>

            {/* 目的地の数 */}
            <div>
              <label className="flex items-center justify-between text-white font-medium mb-3">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-yellow-400" />
                  目的地の数
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  {destinationCount}
                  <span className="text-lg text-white/60 ml-1">か所</span>
                </span>
              </label>

              <div className="glass-card-light p-4 rounded-xl">
                <Slider
                  value={[destinationCount]}
                  onValueChange={(value) => setDestinationCount(value[0])}
                  min={3}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <span className="text-2xl">🚀</span>
                    <p className="text-xs text-white/60 mt-1">お試し</p>
                    <p className="text-white/40 text-xs">3-10</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl">✈️</span>
                    <p className="text-xs text-white/60 mt-1">スタンダード</p>
                    <p className="text-white/40 text-xs">11-25</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl">🌍</span>
                    <p className="text-xs text-white/60 mt-1">世界一周</p>
                    <p className="text-white/40 text-xs">26-50</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-white/50 text-sm mt-3">
                最後の目的地でスタート地点に戻ってゴール！
              </p>
            </div>
          </div>
        </div>

        {/* ゲーム開始ボタン */}
        <button
          className="btn-travel w-full h-20 text-2xl font-bold flex items-center justify-center gap-3 group"
          onClick={handleStartGame}
        >
          <Play className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span>ゲームスタート！</span>
          <span className="text-3xl group-hover:animate-bounce">✈️</span>
        </button>

        {/* フッター情報 */}
        <div className="text-center space-y-2 pb-8">
          <div className="flex justify-center gap-6 text-white/40 text-sm">
            <span>🎲 サイコロで進む</span>
            <span>❓ クイズに挑戦</span>
            <span>🏆 感動を集めよう</span>
          </div>
          <a
            href="/world-tour/bgm-test"
            className="text-sm text-white/30 hover:text-white/60 underline transition-colors"
          >
            BGMテスト画面
          </a>
        </div>
      </div>
    </div>
  );
}
