# AI feedback v2 (PR #5)

Replaces the "2 good points + 1 improvement" feedback with a structured review: estimated score, server-counted
word count, quoted strengths, at most 2 priority fixes, a rewrite mission, and a re-review.

## 1. Gap analysis (before -> after)

| Before (v1) | After (v2) |
|---|---|
| praise / 2 good points / 1 improvement / 1 example sentence | estimated score + per-criterion reasons, word count, quoted strengths, <=2 priority items, weakness tags |
| No score | EMAIL 12 (content, vocabulary, grammar) / OPINION 16 (content, structure, vocabulary, grammar), each 0-4, **total computed by the server** |
| Word range enforced as a hard gate (400) | Any answer of 8+ words is reviewed; the server reports TOO_SHORT / IN_RANGE / TOO_LONG. **The Day completes only when the reviewed answer is IN_RANGE** (and never for demo feedback) |
| One AI call, review ends | Review -> rewrite mission -> re-review (`revision` request) with per-problem FIXED / PARTLY_FIXED / NOT_FIXED |
| Model answer shown immediately | Model answer hidden until the student asks (shown by default after a re-review) |
| Building Check (First/Second/So) | unchanged, opinion tasks only |

## 2. Design decisions

- **Practice vs exam rubric.** Day1-30 are practice tasks (their word ranges and email tasks differ from the real exam; a full
  revision is a separate PR). Exam-only rules (e.g. "2 questions about the underlined part", `ERR_EMAIL_QUESTION_MISSING`)
  apply only to a lesson with `examFormat: true` (+ `underlinedPhrase`). No current Day sets it, so today every Day is scored
  against its own prompt (`rubric: "practice"`). The official-format Day revision can switch it on per lesson.
- **The server owns everything countable or checkable**: word count, score totals, weakness tags, quote verification, item
  ordering/limit. The model only supplies judgement (scores 0-4, reasons, quotes, explanations).
- **Items are validated one by one.** A bad item (unknown code, code not valid for the task, quote not in the student's text,
  duplicate, English title, a "fix" that changes nothing or only swaps an acceptable connector, a form problem without a
  concrete fix) is dropped; the review still shows. A bad *review* (not JSON, a score outside 0-4 / not an integer / missing,
  non-Japanese comment, strengths that are all unverifiable) is rejected -> 502 `ai_failed` with a retry message.
- **Quotes are separated by source**: `original_snippet` is always from the student's text; `task_snippet` is from the task /
  received email; each is verified against its own source.
- **Fill-in drills (虫食い)** exist only for form problems (grammar, order, tense, article, spelling, word choice). The server
  accepts a drill only if it has exactly one blank, is built from the student's own sentence, and an answer rebuilds the
  suggested correction; alternative answers are kept. Meaning/logic problems (contradiction, missing reason, unclear
  reference, repeated question...) are never drills; they go to free rewriting. The student types the answer, confirms the
  completed sentence, and chooses to apply it to their own text.
- **Standard / advanced model answers.** Only the existing lesson `answerExample` (standard) is shown, hidden until requested.
  No AI-generated advanced answer: it would add cost per review and the existing examples already cover the need. An
  `advancedAnswerExample` can be added to the lesson data later.
- **Cost.** A review is one call (~1.5k input tokens); a rewrite adds one more. Each counts against the existing per-student
  limits (5 s / 20 per hour / 60 per day).
- **Weakness tags** are returned (derived from item codes + word status, e.g. `EMAIL_REPETITIVE_QUESTION`, `WORD_COUNT_SHORT`)
  but not stored. `wt_day_progress` and the database are untouched.
- **Not adopted from the NotebookLM draft**: the `user_progress` JSONB SQL; the "always replace such/this" rule; the
  "always use *the*" rule.

## 3. Response contract (`POST /api/feedback`)

Request: `{ lessonId, essay, revision?: { previousEssay, previousItems: [{ error_code, original_snippet }] } }`
(user id is never taken from the body; `revision` is re-validated: <=2 items, known codes, size-capped, must differ from the new text).

Response (`version: 2`): `task_type`, `rubric`, `overall_comment_ja`, `score_summary { total_score, max_score, breakdown, reasons_ja, disclaimer_ja }`,
`word_count_analysis { actual_count, min, max, status }`, `good_points[] { original_snippet, explanation_ja }`,
`priority_feedback_items[] { error_code, title_ja, explanation_ja, original_snippet, task_snippet?, suggested_snippet?, fill_blank? }`,
`weakness_tags[]`, `revision_check[]?`.
Legacy v1 fields (`praise`, `goodPoints`, `oneImprovement`, `example`) are still returned, derived from the same review.
`score_summary.total_score` always equals the sum of `breakdown`; each criterion is an integer 0-4.

Error codes (`lib/feedback/errorCodes.ts`): content - OFF_TOPIC, EMAIL_NO_ANSWER, EMAIL_REPETITIVE_QUESTION,
EMAIL_DUPLICATE_QUESTIONS, EMAIL_QUESTION_MISSING (exam only), EMAIL_REASON_LINK, OPINION_CONTRADICTION, OPINION_ONE_REASON,
OPINION_WEAK_SUPPORT, UNCLEAR_REFERENCE, UNCLEAR_MEANING; form - EMAIL_QUESTION_FORM, GRAMMAR, WORD_ORDER, TENSE, ARTICLE,
VOCABULARY, SPELLING. Meaning problems always rank above form problems.

## 4. Safety measures kept

Server-side login + product-access check, per-student rate limits (DB RPC + in-memory), 8 KB / 1,200-char caps (plus a new
2x-max-words cap), data-delimited prompt with forged-tag neutralisation (now also for the previous version), schema validation,
student text kept on error and as a device draft, double-submit guard, unchanged progress sync. No mock feedback outside
local development.

## 5. What is NOT verified

- **How a real model judges each case** (e.g. whether it really flags only genuinely repetitive questions, or leaves
  Firstly/Secondly alone) could not be tested: there is no API key in the development environment. The tests prove the prompt
  contains each rule and that the server pipeline handles, orders, limits and sanitises outputs correctly; the deterministic
  guards (no-op/connector-swap filter, unknown-code filter, quote verification) work regardless of the model.
  **Run each of the 17 scenarios once against the real model on a Preview before relying on it.**
- Score stability: scores are an estimate and can vary between runs (`temperature` 0.2); the UI says so.
- Pass/fail is never stated.

## 6. Sample reviews (model output mocked; everything else produced by the real server pipeline)

Email, official format (sample 5): the already-answered question is flagged, the email's own words are quoted separately, and
the server added the count and tag.

```json
{
  "version": 2,
  "task_type": "EMAIL",
  "rubric": "exam",
  "overall_comment_ja": "メールの形がきれいで、ていねいに書けています。質問を1つ見直すと、もっと良くなります。",
  "score_summary": {
    "total_score": 8,
    "max_score": 12,
    "breakdown": {
      "content": 2,
      "vocabulary": 3,
      "grammar": 3
    },
    "reasons_ja": {
      "content": "Alexの質問に答えられていますが、質問の1つはメールに書かれている情報です。",
      "vocabulary": "やさしい語で正しく書けています。",
      "grammar": "大きな誤りはありません。"
    },
    "disclaimer_ja": "学習用の推定スコアです。英検の本当の得点や合否を示すものではありません。AIの採点には多少のゆれがあります。"
  },
  "word_count_analysis": {
    "actual_count": 46,
    "min": 40,
    "max": 50,
    "status": "IN_RANGE"
  },
  "good_points": [
    {
      "original_snippet": "What time did it start?",
      "explanation_ja": "メールに書かれていない情報を、正しい語順でたずねられています。"
    },
    {
      "original_snippet": "I often join school events because they are fun.",
      "explanation_ja": "Alexの質問に、理由つきで答えられています。"
    }
  ],
  "priority_feedback_items": [
    {
      "error_code": "ERR_EMAIL_REPETITIVE_QUESTION",
      "title_ja": "質問を見直そう",
      "explanation_ja": "Alexのメールに「日曜日に運動会へ行った」と書いてあるので、いつ行ったかはすでに分かっています。まだ分からないことをたずねましょう。",
      "original_snippet": "When did you go to the sports day?",
      "task_snippet": "I went to the sports day on Sunday",
      "suggested_snippet": "Who ran the last part of the relay race?"
    }
  ],
  "weakness_tags": [
    "EMAIL_REPETITIVE_QUESTION"
  ]
}
```

Opinion, contradiction (sample 8): model returned 3 items (contradiction, article, and a "spelling" fix that changed nothing).
The no-op was dropped, the contradiction ranks first, and only the article problem got a fill-in drill.

```json
{
  "version": 2,
  "task_type": "OPINION",
  "rubric": "practice",
  "overall_comment_ja": "自分の意見をはっきり書けています。理由が意見と合っているかを見直しましょう。",
  "score_summary": {
    "total_score": 11,
    "max_score": 16,
    "breakdown": {
      "content": 1,
      "structure": 3,
      "vocabulary": 3,
      "grammar": 4
    },
    "reasons_ja": {
      "content": "意見と1つ目の理由が反対の向きになっています。",
      "structure": "意見→理由→まとめの流れは分かりやすいです。",
      "vocabulary": "やさしい語で書けています。",
      "grammar": "文法の誤りはほとんどありません。"
    },
    "disclaimer_ja": "学習用の推定スコアです。英検の本当の得点や合否を示すものではありません。AIの採点には多少のゆれがあります。"
  },
  "word_count_analysis": {
    "actual_count": 51,
    "min": 50,
    "max": 80,
    "status": "IN_RANGE"
  },
  "good_points": [
    {
      "original_snippet": "I do not think traveling with friends is good for students.",
      "explanation_ja": "意見が最初の文ではっきり書けています。"
    }
  ],
  "priority_feedback_items": [
    {
      "error_code": "ERR_OPINION_CONTRADICTION",
      "title_ja": "意見と理由が合っていません",
      "explanation_ja": "「友達と旅行するのは良くない」と書いたのに、理由が「楽しい」という良い点になっています。反対の意見の理由（お金や時間など）に変えましょう。",
      "original_snippet": "First, traveling with friends makes us happy.",
      "suggested_snippet": "First, traveling with friends costs a lot of money."
    },
    {
      "error_code": "ERR_ARTICLE",
      "title_ja": "冠詞",
      "explanation_ja": "ここは the が自然です。",
      "original_snippet": "enjoy new places",
      "suggested_snippet": "enjoy the new places",
      "fill_blank": {
        "prompt": "enjoy ___ new places",
        "acceptable_answers": [
          "the"
        ],
        "completed_sentence": "enjoy the new places"
      }
    }
  ],
  "weakness_tags": [
    "OPINION_CONTRADICTION",
    "ARTICLE"
  ]
}
```
