#!/bin/bash
# ======================================
# フリーBGM素材ダウンロードスクリプト
#
# 使用する素材サイト:
# - 魔王魂 (https://maou.audio/) - 商用利用可、クレジット表記推奨
# - DOVA-SYNDROME (https://dova-s.jp/) - 商用利用可
# - 甘茶の音楽工房 (https://amachamusic.chagasi.com/) - 商用利用可
#
# 注意: 各サイトの利用規約を必ず確認してください
# ======================================

BGM_DIR="/workspaces/family-talk/family/public/audio/bgm"

# ディレクトリ作成
mkdir -p "$BGM_DIR"

echo "BGMディレクトリ: $BGM_DIR"
echo ""
echo "以下のBGMファイルが必要です："
echo ""
echo "1. title.mp3      - タイトル/メニュー用（明るく楽しい曲）"
echo "2. roulette.mp3   - ルーレット用（ドキドキ感のある曲）"
echo "3. dice.mp3       - サイコロ待機用（軽快なテンポの曲）"
echo "4. flying.mp3     - 飛行中用（冒険感のある曲）"
echo "5. quiz.mp3       - クイズ用（シンキングタイム的な曲）"
echo "6. comedy.mp3     - お笑いマス用（コミカルな曲）"
echo "7. message.mp3    - メッセージマス用（優しい曲）"
echo "8. arrival.mp3    - 到着ファンファーレ（短めの達成感ある曲）"
echo "9. power_spot.mp3 - パワースポット用（神秘的な曲）"
echo "10. ending.mp3    - エンディング用（壮大なフィナーレ曲）"
echo ""
echo "推奨フリー素材サイト:"
echo "- 魔王魂: https://maou.audio/"
echo "- DOVA-SYNDROME: https://dova-s.jp/"
echo "- 甘茶の音楽工房: https://amachamusic.chagasi.com/"
echo ""

# プレースホルダーファイルを作成（実際の音源がない場合のエラー防止）
for file in title roulette dice flying quiz comedy message arrival power_spot ending; do
  if [ ! -f "$BGM_DIR/$file.mp3" ]; then
    echo "プレースホルダー作成: $file.mp3"
    # 無音の短いファイルを作成（ffmpegがある場合）
    if command -v ffmpeg &> /dev/null; then
      ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 "$BGM_DIR/$file.mp3" -y 2>/dev/null
    else
      touch "$BGM_DIR/$file.mp3"
    fi
  fi
done

echo ""
echo "完了！BGMファイルを $BGM_DIR に配置してください。"
