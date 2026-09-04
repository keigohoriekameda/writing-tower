export type LessonType = "opinion" | "email"

export type LessonScene = {
  /** 場面の日本語説明: 誰が・どんな状況で・何のために書くのか */
  contextJa: string
  /** 生徒に最初に見せる英文・会話(複数行は \n で改行) */
  intro: string
}

/** タップして選ぶ選択式。回答後に○/×と正解を表示する。 */
export type ChoiceComprehensionQuestion = {
  kind: "choice"
  questionJa: string
  choices: string[]
  correctIndex: number
  explanationJa?: string
}

/** 複雑な文字入力を求めず、「答えを見る」で正答を確認する形式。 */
export type RevealComprehensionQuestion = {
  kind: "reveal"
  questionJa: string
  answerJa: string
}

export type ComprehensionQuestion = ChoiceComprehensionQuestion | RevealComprehensionQuestion

export type KeyExpression = {
  phrase: string
  meaningJa: string
  /** この表現を最初に学んだDay番号(別場面での再利用を示す任意項目) */
  reusedFromDay?: number
}

/** 単語カードをタップして正しい語順に並べる練習。 */
export type WordOrderPracticeItem = {
  kind: "wordOrder"
  instruction: string
  /** タップ候補として表示する単語・フレーズ(表示順=出題時の並び) */
  tokens: string[]
  /** tokens を正しい英文にするためのインデックス順 */
  correctOrder: number[]
  /** 正解の英文全体(答え合わせ後に表示) */
  answer: string
  explanationJa?: string
}

/** 2〜4択から選ぶ空欄補充・選択問題。 */
export type FillBlankPracticeItem = {
  kind: "fillBlank"
  instruction: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanationJa?: string
}

export type GuidedPracticeItem = WordOrderPracticeItem | FillBlankPracticeItem

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
  /** Writingステップで英語のQUESTIONの下に添える、課題の意味を取り違えないための短い日本語ヒント */
  writingHintJa?: string
  prompt: string
  wordCount: { min: number; max: number }
  timeLimit: number
  answerExample?: string
}
