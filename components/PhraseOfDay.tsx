const PHRASES = [
  { en: "First,", ja: "（まず第一に）", tip: "最初の理由を紹介するときに使えます。" },
  { en: "Second,", ja: "（第二に）", tip: "2つ目の理由を書くときに使えます。" },
  { en: "For example,", ja: "（例えば）", tip: "理由をくわしく説明したいときに使えます。" },
  { en: "Because ...", ja: "（なぜなら）", tip: "理由を述べるときに使えます。" },
  { en: "Also,", ja: "（また）", tip: "追加の情報を加えるときに使えます。" },
  { en: "In addition,", ja: "（さらに）", tip: "もう一つ情報を足したいときに使えます。" },
  { en: "For this reason,", ja: "（この理由から）", tip: "まとめに向けて理由をつなぐときに使えます。" },
  { en: "Therefore,", ja: "（だから）", tip: "結論を述べるときに使えます。" },
  { en: "I think ...", ja: "（私は〜と思います）", tip: "自分の意見を伝えるときに使えます。" },
  { en: "I believe ...", ja: "（私は〜だと信じています）", tip: "強い意見や信念を表すときに使えます。" },
]

const todayIndex = Math.floor(Date.now() / 86400000) % PHRASES.length

export default function PhraseOfDay() {
  const { en, ja, tip } = PHRASES[todayIndex]
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
      <p className="mb-3 text-sm font-bold text-sky-700">📚 今日覚える1フレーズ</p>
      <div className="mb-3 rounded-xl bg-white/80 py-4 text-center">
        <p className="text-xl font-bold text-indigo-600">{en}</p>
        <p className="mt-1 text-sm text-sky-500">{ja}</p>
      </div>
      <p className="mb-2 text-xs leading-relaxed text-sky-600">{tip}</p>
      <p className="text-center text-xs font-bold text-sky-400">
        今日はこの表現を1回使えるようになろう！
      </p>
    </div>
  )
}
