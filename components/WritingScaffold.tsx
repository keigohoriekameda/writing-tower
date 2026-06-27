const PHRASES = [
  { en: "I think ...", ja: "（私は〜と思います）" },
  { en: "I believe ...", ja: "（〜と信じています）" },
  { en: "Because ...", ja: "（なぜなら）" },
  { en: "Also,", ja: "（また）" },
  { en: "For example,", ja: "（例えば）" },
  { en: "In addition,", ja: "（さらに）" },
  { en: "For this reason,", ja: "（この理由から）" },
  { en: "Therefore,", ja: "（だから）" },
]

const HK_MESSAGES = [
  "最初から完璧に書ける人はいません。まずはこの型どおりに書いてみよう！AIが一緒に直してくれるから大丈夫。",
  "分からなくて当然！型を使えば、誰でも書けるようになります。最初は短くて大丈夫。まず書いてみよう！",
  "失敗を恐れないで。英作文は練習あるのみです。AIコーチが丁寧にフィードバックしてくれるよ 👍",
]

const dayNumber = Math.floor(Date.now() / 86400000)
const todayPhraseIndex = dayNumber % PHRASES.length
const todayMessageIndex = dayNumber % HK_MESSAGES.length

export default function WritingScaffold() {
  const featured = PHRASES[todayPhraseIndex]
  const hkMessage = HK_MESSAGES[todayMessageIndex]

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <p className="mb-1 text-sm font-bold text-amber-800">💡 書き方のヒント</p>
      <p className="mb-4 text-xs text-amber-600">まずはこの型を覚えよう！</p>

      {/* 4-step essay structure */}
      <div className="flex flex-col">
        <ScaffoldStep number={1} label="自分の意見">
          <PhrasePair a="I agree." b="I don't agree." />
        </ScaffoldStep>

        <StepArrow />

        <ScaffoldStep number={2} label="理由①">
          <Phrase text="First, ・・・" />
        </ScaffoldStep>

        <StepArrow />

        <ScaffoldStep number={3} label="理由②">
          <Phrase text="Second, ・・・" />
        </ScaffoldStep>

        <StepArrow />

        <ScaffoldStep number={4} label="まとめ">
          <PhrasePair
            a="So, I agree with this opinion."
            b="So, I don't agree with this opinion."
          />
        </ScaffoldStep>
      </div>

      {/* Useful phrases */}
      <div className="mt-4 border-t border-amber-100 pt-4">
        <p className="mb-3 text-xs font-bold text-amber-700">⭐ よく使う便利な表現</p>

        {/* Today's featured phrase */}
        <div className="mb-3 rounded-xl border border-amber-200 bg-white/80 p-3 text-center">
          <p className="mb-1.5 text-xs font-bold text-amber-500">⭐ 今日のおすすめ</p>
          <p className="text-sm font-bold text-indigo-600">{featured.en}</p>
          <p className="text-xs text-amber-500">{featured.ja}</p>
          <p className="mt-1.5 text-xs text-amber-400">今日はこれを1回使ってみよう！</p>
        </div>

        {/* All phrases with Japanese translation */}
        <div className="flex flex-wrap gap-2">
          {PHRASES.map(({ en, ja }, i) => (
            <div
              key={en}
              className={`flex flex-col rounded-xl px-3 py-2 ${
                i === todayPhraseIndex
                  ? "bg-amber-200/70 ring-1 ring-amber-300"
                  : "bg-amber-100"
              }`}
            >
              <span className="text-xs font-medium text-amber-800">{en}</span>
              <span className="text-xs text-amber-500">{ja}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HK先生からのひとこと */}
      <div className="mt-4 rounded-xl bg-indigo-50 p-3">
        <p className="mb-1 text-xs font-bold text-indigo-500">😊 HK先生より</p>
        <p className="text-xs leading-relaxed text-indigo-700">{hkMessage}</p>
      </div>
    </div>
  )
}

function ScaffoldStep({
  number,
  label,
  children,
}: {
  number: number
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white/70 p-3">
      <p className="mb-2 text-xs font-bold text-amber-700">
        {["①", "②", "③", "④"][number - 1]} {label}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

function Phrase({ text }: { text: string }) {
  return (
    <code className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">{text}</code>
  )
}

function PhrasePair({ a, b }: { a: string; b: string }) {
  return (
    <>
      <Phrase text={a} />
      <span className="text-xs text-amber-400">または</span>
      <Phrase text={b} />
    </>
  )
}

function StepArrow() {
  return <p className="py-1 text-center text-sm text-amber-300">↓</p>
}
