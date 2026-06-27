export default function WelcomeCard() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">✨</span>
        <h2 className="text-base font-bold text-indigo-900">毎日コツコツ、未来をつくろう！</h2>
      </div>

      <ul className="mb-5 flex flex-col gap-2.5">
        <li className="flex items-start gap-2 text-sm leading-relaxed text-indigo-800">
          <span className="mt-0.5 shrink-0 text-indigo-400">✔</span>
          毎日続けることが、いちばんの近道です。
        </li>
        <li className="flex items-start gap-2 text-sm leading-relaxed text-indigo-800">
          <span className="mt-0.5 shrink-0 text-indigo-400">✔</span>
          90日間英作文を続けると、あなただけの超高層ビルが完成します。
        </li>
        <li className="flex items-start gap-2 text-sm leading-relaxed text-indigo-800">
          <span className="mt-0.5 shrink-0 text-indigo-400">✔</span>
          90日達成すると…何か特別なことが起こるかも！？ 🎉
        </li>
      </ul>

      <p className="mb-4 text-sm leading-relaxed text-indigo-700">
        今日の1階が、未来のあなたを支える土台になります。
      </p>

      <p className="text-sm font-bold text-indigo-900">
        さあ、今日も一緒に
        <br />
        <span className="text-indigo-600">1階ずつ積み上げていこう！ 🏗️</span>
      </p>
    </div>
  )
}
