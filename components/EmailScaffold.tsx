const PHRASES = [
  { en: "Thank you for your email.", ja: "（メールありがとう）" },
  { en: "I'm happy to hear from you.", ja: "（連絡もらえて嬉しいよ）" },
  { en: "I'm going to ...", ja: "（〜するつもりです）" },
  { en: "I want to ...", ja: "（〜したいです）" },
  { en: "Also, ...", ja: "（また）" },
  { en: "I like it because ...", ja: "（なぜなら好きだから）" },
  { en: "See you soon.", ja: "（またね）" },
  { en: "Write back soon.", ja: "（また書いてね）" },
]

const HK_MESSAGES = [
  "Eメールは友達への手紙です。堅くならず、気軽に書いてみよう！AIが一緒にチェックしてくれます 😊",
  "まずは型どおりに書いてOK！自分の言葉で答えを書いてみよう。",
  "知らない表現があっても大丈夫。ひとつずつ覚えていこう！",
]

const dayNumber = Math.floor(Date.now() / 86400000)
const todayPhraseIndex = dayNumber % PHRASES.length
const todayMessageIndex = dayNumber % HK_MESSAGES.length

export default function EmailScaffold() {
  const featured = PHRASES[todayPhraseIndex]
  const hkMessage = HK_MESSAGES[todayMessageIndex]

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <p className="mb-1 text-sm font-bold text-amber-800">💡 書き方のヒント</p>
      <p className="mb-4 text-xs text-amber-600">Eメールはこの型で書いてみよう！</p>

      {/* 6-step email structure */}
      <div className="flex flex-col">
        <EmailStep number={1} label="あいさつ">
          <Phrase text="Hi Alex," />
        </EmailStep>

        <StepArrow />

        <EmailStep number={2} label="お礼・反応">
          <PhrasePair a="Thank you for your email." b="I'm happy to hear from you." />
        </EmailStep>

        <StepArrow />

        <EmailStep number={3} label="質問への答え①">
          <PhrasePair a="I'm going to ..." b="I want to ..." />
        </EmailStep>

        <StepArrow />

        <EmailStep number={4} label="質問への答え②">
          <PhrasePair a="Also, I will ..." b="I like it because ..." />
        </EmailStep>

        <StepArrow />

        <EmailStep number={5} label="しめの文">
          <PhrasePair a="See you soon." b="Write back soon." />
        </EmailStep>

        <StepArrow />

        <EmailStep number={6} label="名前">
          <Phrase text="Keigo" />
        </EmailStep>
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

        {/* All phrases */}
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

function EmailStep({
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
        {["①", "②", "③", "④", "⑤", "⑥"][number - 1]} {label}
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
