type CheckResult = {
  hasOpinion: boolean
  hasFirst: boolean
  hasSecond: boolean
  hasConclusion: boolean
}

function analyzeEssay(essay: string): CheckResult {
  return {
    hasOpinion: /\b(i agree|i don'?t agree|i think|i believe)\b/i.test(essay),
    hasFirst: /\bfirst\b/i.test(essay),
    hasSecond: /\bsecond\b/i.test(essay),
    hasConclusion: /\b(so|therefore|for this reason)\b/i.test(essay),
  }
}

const CHECKS: Array<{ key: keyof CheckResult; ok: string; next: string }> = [
  {
    key: "hasOpinion",
    ok: "自分の意見が書けた！",
    next: "次は I agree. や I think から書き始めてみよう！",
  },
  {
    key: "hasFirst",
    ok: "First が使えた！",
    next: "First, を使って最初の理由を書いてみよう！",
  },
  {
    key: "hasSecond",
    ok: "Second が使えた！",
    next: "Second, で2つ目の理由を加えると、さらに良くなるよ！",
  },
  {
    key: "hasConclusion",
    ok: "So でまとめられた！",
    next: "So や Therefore で締めくくると、型が完成するよ！",
  },
]

export default function BuildingCheck({ essay }: { essay: string }) {
  const result = analyzeEssay(essay)
  const passedCount = Object.values(result).filter(Boolean).length

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-bold text-gray-700">🏗️ Building Check</p>

      <div className="mb-4 flex flex-col gap-2">
        {CHECKS.map(({ key, ok, next }) =>
          result[key] ? (
            <div key={key} className="flex items-start gap-2 text-sm text-green-700">
              <span className="shrink-0">✅</span>
              <span>{ok}</span>
            </div>
          ) : (
            <div key={key} className="flex items-start gap-2 text-sm text-emerald-600">
              <span className="shrink-0">🌱</span>
              <span>{next}</span>
            </div>
          )
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        {passedCount === 4
          ? "完璧な型で書けています！素晴らしい！🎉"
          : passedCount >= 2
            ? "ここまで書けたら十分です。今日の一歩はしっかり積み上がっています！"
            : "型を意識して書くと、もっと伝わる文章になるよ。次回試してみよう！"}
      </p>
    </div>
  )
}
