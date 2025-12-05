import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-blue-100">
      {/* ヘッダー */}
      <nav className="w-full border-b border-border/10 h-16 bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center px-4 h-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <h1 className="text-xl font-bold text-sky-800">感動・世界旅ゲーム</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-16">
        {/* ヒーロセクション */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">✈️🌍💖</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sky-900">
            感動・世界旅ゲーム
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            家族で世界を旅しよう！<br />
            クイズに答え、名所を巡り、ボイスメッセージで絆を深める
          </p>
          <p className="text-lg text-sky-600 mb-8 max-w-2xl mx-auto">
            🌍 50の空港 • 🏛️ 世界の観光名所＆グルメ • ❓ クイズマス • ✉️ メッセージマス
          </p>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Link href="/world-tour" className="w-full max-w-sm">
                <Button size="lg" className="w-full text-lg px-8 py-6 bg-sky-600 hover:bg-sky-700">
                  🚀 冒険を始める
                </Button>
              </Link>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/auth/sign-up" className="w-full max-w-[170px]">
                <Button variant="outline" size="lg" className="w-full text-base px-4 py-6">
                  新規登録
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full max-w-[170px]">
                <Button variant="outline" size="lg" className="w-full text-base px-4 py-6">
                  ログイン
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ゲームの特徴 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-sky-200 bg-white/80">
            <CardHeader>
              <div className="text-4xl mb-2">✈️</div>
              <CardTitle className="text-sky-800">世界を旅しよう</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                サイコロを振って世界50の空港を巡ろう。各地の観光名所やご当地グルメを体験して感動ポイントをゲット！
              </p>
            </CardContent>
          </Card>

          <Card className="border-sky-200 bg-white/80">
            <CardHeader>
              <div className="text-4xl mb-2">❓</div>
              <CardTitle className="text-sky-800">クイズに挑戦</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                空路上のクイズマスに止まったら、地理・歴史・文化のクイズに挑戦！正解するとボーナスポイント獲得。
              </p>
            </CardContent>
          </Card>

          <Card className="border-sky-200 bg-white/80">
            <CardHeader>
              <div className="text-4xl mb-2">✉️</div>
              <CardTitle className="text-sky-800">家族とメッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                メッセージマスでは家族へのボイスメッセージを録音。「どんな〇〇？」の質問で心温まる会話が生まれます。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ゲームの流れ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-sky-900">ゲームの流れ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-6 rounded-lg border border-sky-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-800">
                🎯 目的地を設定
              </h3>
              <p className="text-gray-700 mb-2">
                世界地図から行きたい空港を選択
              </p>
              <p className="text-sm text-gray-600">
                距離に応じてマス数が決まります
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-amber-800">
                🎲 サイコロを振る
              </h3>
              <p className="text-gray-700 mb-2">
                出た目の数だけ空路を進む
              </p>
              <p className="text-sm text-gray-600">
                途中でクイズやメッセージマスに止まることも
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-800">
                ❓ クイズマス「Q」
              </h3>
              <p className="text-gray-700 mb-2">
                地理・歴史・文化のクイズに挑戦
              </p>
              <p className="text-sm text-gray-600">
                正解でボーナスポイント！不正解でも学びになる
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-800">
                ✉️ メッセージマス
              </h3>
              <p className="text-gray-700 mb-2">
                家族へボイスメッセージを送ろう
              </p>
              <p className="text-sm text-gray-600">
                「今日はどんな気分？」などの質問で絆を深める
              </p>
            </div>
          </div>
        </div>

        {/* 世界の感動 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-sky-900">5つの感動を集めよう</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 w-32">
              <div className="text-3xl mb-2">😆</div>
              <p className="font-semibold text-yellow-800">たのしい</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200 w-32">
              <div className="text-3xl mb-2">😊</div>
              <p className="font-semibold text-pink-800">うれしい</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200 w-32">
              <div className="text-3xl mb-2">😍</div>
              <p className="font-semibold text-purple-800">うつくしい</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 w-32">
              <div className="text-3xl mb-2">😲</div>
              <p className="font-semibold text-blue-800">おどろき</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 w-32">
              <div className="text-3xl mb-2">🥹</div>
              <p className="font-semibold text-green-800">しみじみ</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-sky-100 to-blue-100 p-12 rounded-lg border border-sky-200">
          <h2 className="text-3xl font-bold mb-4 text-sky-900">
            家族で世界旅行を始めよう！
          </h2>
          <p className="text-gray-600 mb-8">
            今すぐ世界旅行に出発しよう！
          </p>
          <div className="flex justify-center">
            <Link href="/world-tour" className="w-full max-w-sm">
              <Button size="lg" className="w-full text-lg px-12 py-6 bg-sky-600 hover:bg-sky-700">
                ✈️ 世界旅行に出発！
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="w-full border-t border-border/10 py-8 bg-white/50">
        <div className="w-full max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 感動・世界旅ゲーム - 家族の絆を深める世界旅行ゲーム</p>
        </div>
      </footer>
    </div>
  );
}
