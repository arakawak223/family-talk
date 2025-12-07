'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Player,
  PLAYER_COLORS,
  PLAYER_AVATARS,
  createPlayer
} from '@/lib/game/player-manager';
import { AIRPORTS } from '@/lib/data/airports';
import { Users, Plus, Minus, Plane, Play, Shuffle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* タイトル */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            世界感動旅行ゲーム
          </h1>
          <p className="text-gray-600">家族や友達と感動ポイントを競おう！</p>
        </div>

        {/* プレイヤー人数 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              プレイヤー人数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePlayerCountChange(-1)}
                disabled={playerCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-4xl font-bold w-16 text-center">
                {playerCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePlayerCountChange(1)}
                disabled={playerCount >= 4}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              1〜4人まで参加できます
            </p>
          </CardContent>
        </Card>

        {/* プレイヤー設定 */}
        <Card>
          <CardHeader>
            <CardTitle>プレイヤー設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: playerCount }).map((_, index) => {
              const playerSetup = players[index];
              const playerColor = PLAYER_COLORS.find(c => c.id === playerSetup.colorId) || PLAYER_COLORS[0];

              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: playerColor.color }}
                >
                  <div className="flex items-center gap-3">
                    {/* アバター選択 */}
                    <div className="relative">
                      <button
                        className="text-4xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowAvatarPicker(showAvatarPicker === index ? null : index)}
                      >
                        {playerSetup.avatarEmoji}
                      </button>
                      {showAvatarPicker === index && (
                        <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border z-10 grid grid-cols-5 gap-1 w-48">
                          {PLAYER_AVATARS.map((emoji) => (
                            <button
                              key={emoji}
                              className={`text-2xl p-1 rounded hover:bg-gray-100 ${
                                playerSetup.avatarEmoji === emoji ? 'bg-blue-100' : ''
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
                      <div className="flex gap-2">
                        <Input
                          placeholder={`プレイヤー${index + 1}のニックネーム`}
                          value={playerSetup.nickname}
                          onChange={(e) => updatePlayer(index, 'nickname', e.target.value)}
                          maxLength={10}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRandomNickname(index)}
                          title="ランダム名前"
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* カラー選択 */}
                    <div className="flex gap-1">
                      {PLAYER_COLORS.map((color) => (
                        <button
                          key={color.id}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            playerSetup.colorId === color.id
                              ? 'scale-110 border-gray-800'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.color }}
                          onClick={() => updatePlayer(index, 'colorId', color.id)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ゲーム設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              ゲーム設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* スタート地点 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                スタート地点
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={startAirport}
                onChange={(e) => setStartAirport(e.target.value)}
              >
                {majorAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.icon} {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 目的地の数 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                目的地の数: <span className="text-2xl font-bold text-blue-600">{destinationCount}</span> か所
                <span className="text-gray-500 text-xs ml-2">
                  （最後はスタート地点に戻ります）
                </span>
              </label>
              <Slider
                value={[destinationCount]}
                onValueChange={(value) => setDestinationCount(value[0])}
                min={3}
                max={50}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3（短め）</span>
                <span>25（中程度）</span>
                <span>50（長め）</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ゲーム開始ボタン */}
        <Button
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleStartGame}
        >
          <Play className="h-6 w-6 mr-2" />
          ゲームスタート！
        </Button>

        {/* BGMテストへのリンク */}
        <div className="text-center">
          <a
            href="/world-tour/bgm-test"
            className="text-sm text-gray-500 hover:text-blue-600 underline"
          >
            BGMテスト画面
          </a>
        </div>
      </div>
    </div>
  );
}
