import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <nav className="w-full border-b border-border/10 h-16">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center px-4 h-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <h1 className="text-xl font-bold">ひと言しつもんアプリ</h1>
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
          <div className="text-6xl mb-6">🎤💕</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            家族の絆を深める<br />
            ひと言しつもんアプリ
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            離れて暮らす家族や引きこもりがちな家族と、<br />
            「どんな〇〇？」の質問を通じて温かいコミュニケーションを
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                🚀 始めてみる
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                ログイン
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/join-family">
              <Button variant="link" className="text-base">
                📨 招待コードで家族グループに参加
              </Button>
            </Link>
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🤔</div>
              <CardTitle>気持ちベースの質問</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                「関心を示したい」「励ましたい」など、あなたの気持ちに合わせて質問を提案。家族への想いが伝わります。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🎤</div>
              <CardTitle>簡単ボイスメッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                電話やLINEよりも手軽に。録音ボタンを押すだけで、温かい声のメッセージを家族に送れます。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
              <CardTitle>家族限定の安心空間</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                招待制で家族だけが参加。祖父母から孫まで、多世代が直感的に使える優しい設計です。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 利用シーン */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">こんなときに</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🌅 朝のひと言
              </h3>
              <p className="text-gray-700 mb-2">
                「おはよう」+ 「今日はどんな予定？」
              </p>
              <p className="text-sm text-gray-600">
                一日の始まりに家族のことを思う温かい習慣
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🌙 夜のひと言
              </h3>
              <p className="text-gray-700 mb-2">
                「おやすみ」+ 「今日はどんな一日だった？」
              </p>
              <p className="text-sm text-gray-600">
                一日の終わりに家族の顔を思い浮かべて
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🎂 特別な日
              </h3>
              <p className="text-gray-700 mb-2">
                「おめでとう」+ 「どんな気持ち？」
              </p>
              <p className="text-sm text-gray-600">
                誕生日や記念日に心からのお祝いメッセージ
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                💪 応援したいとき
              </h3>
              <p className="text-gray-700 mb-2">
                「がんばってるね」+ 「何か手伝えることある？」
              </p>
              <p className="text-sm text-gray-600">
                家族を支えたい気持ちを声で伝える
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            今日から家族との新しいコミュニケーションを始めませんか？
          </h2>
          <p className="text-gray-600 mb-8">
            無料でご利用いただけます。招待コードで家族をお招きして、温かいひと言を交換しましょう。
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg px-12 py-6">
              🎤 無料で始める
            </Button>
          </Link>
        </div>
      </main>

      {/* フッター */}
      <footer className="w-full border-t border-border/10 py-8">
        <div className="w-full max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 ひと言しつもんアプリ - 家族の絆を深めるボイスメッセージアプリ</p>
        </div>
      </footer>
    </div>
  );
}