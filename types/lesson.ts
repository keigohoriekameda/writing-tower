export type LessonType = "opinion" | "email"

export type LessonScene = {
  /** 場面の日本語説明: 誰が・どんな状況で・何のために書くのか */
  contextJa: string
  /** 生徒に最初に見せる英文・会話(複数行は \n で改行) */
  intro: string
}

export type ComprehensionQuestion = {
  question: string
  /** 選択式の場合のみ */
  choices?: string[]
  answerJa: string
}

export type KeyExpression = {
  phrase: string
  meaningJa: string
  /** この表現を最初に学んだDay番号(別場面での再利用を示す任意項目) */
  reusedFromDay?: number
}

export type GuidedPracticeItem = {
  /** 「並べ替え」「空欄補充」などの指示文 */
  instruction: string
  prompt: string
  answer: string
}

export type Lesson = {
  id: string
  day: number
  type: LessonType
  title: string
  topic: string
  /**
   * Meaning First学習フロー用の追加データ。未設定(Day1〜7)の場合は
   * 従来どおりQuestion+Start Writingのみの画面が表示される。
   */
  scene?: LessonScene
  comprehension?: ComprehensionQuestion[]
  keyExpressions?: KeyExpression[]
  guidedPractice?: GuidedPracticeItem[]
  prompt: string
  wordCount: { min: number; max: number }
  timeLimit: number
  answerExample?: string
}
