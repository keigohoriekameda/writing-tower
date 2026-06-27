const MESSAGES = [
  "小さな積み重ねが、大きな未来をつくります。",
  "今日も1階積み上げよう！",
  "昨日より1歩前へ。",
  "続ける人が、一番強い。",
  "英作文は才能ではなく習慣です。",
  "未来の自分が、今日の努力にきっと感謝します。",
  "毎日の5分が、90日後の自信になります。",
  "焦らなくて大丈夫。今日も一歩ずつ。",
  "完成する頃には、英語を書くことが当たり前になっています。",
  "Build Your Future.",
]

const dayIndex = Math.floor(Date.now() / 86400000) % MESSAGES.length

export default function DailyMessage() {
  return (
    <p className="py-3 text-center text-sm italic leading-relaxed text-gray-400">
      {MESSAGES[dayIndex]}
    </p>
  )
}
