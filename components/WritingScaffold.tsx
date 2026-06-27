const USEFUL_PHRASES = [
  "I think ...",
  "I believe ...",
  "For example,",
  "Because ...",
  "Also,",
  "In addition,",
  "For this reason,",
  "Therefore,",
]

export default function WritingScaffold() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <p className="mb-1 text-sm font-bold text-amber-800">💡 書き方のヒント</p>
      <p className="mb-4 text-xs text-amber-600">まずはこの型を覚えよう！</p>

      {/* Essay structure */}
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
        <p className="mb-2.5 text-xs font-bold text-amber-700">⭐ よく使う便利な表現</p>
        <div className="flex flex-wrap gap-1.5">
          {USEFUL_PHRASES.map((phrase) => (
            <span
              key={phrase}
              className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700"
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* One-point advice */}
      <p className="mt-4 text-center text-xs leading-relaxed text-amber-500">
        最初は短くても大丈夫！
        <br />
        まずは型どおりに書いてみよう 😊
      </p>
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
