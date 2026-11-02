# Stage 1 lesson audit (Day 1–30)

Method: every lesson read in full; structural checks automated in `data/lessons.test.ts`
(word-order permutations rebuild the stated answer, `correctIndex` valid, no duplicate
choices, model answers inside their own word range, `reusedFromDay` points backwards).

## Fixed in this PR (clear errors only)
- 20 model answers were shorter than the lesson's own minimum word count (Day 1, 6, 9, 11, 12, 15, 16, 17, 19–30), i.e. the sample could not have passed the app's own submit button. Lengthened with natural sentences.
- Day 10 model answer: "…quieter and easier to concentrate" (broken grammar) → "…quieter, so it is easier to concentrate".
- Ambiguous practice items with two acceptable answers: Day 19 (#3), Day 20 (#2: "Could we meet…?" is also correct), Day 22 (#2, #3), Day 29 (#2). Distractors replaced.
- Day 21 practice #3: comma splice and "the park" vs "amusement park".
- Prompts assumed Alex is male ("Thank him…", Day 9, 11, 16, 21, 23, 26, 27); Alex's gender is never stated.
- Metadata: Day 8 "should" glossed as 義務 (it is advice/suggestion); wrong `reusedFromDay` on Day 12/14/15/29/30.
- Building Check ("First / Second / So") was shown on email lessons where it makes no sense; now opinion-only.

## Verified correct
All 23 word-order items, 46 fill-blank items, and all comprehension answers matched their scene text. No wrong answer keys were found.

## Reported, not changed (needs a separate PR / teacher decision)
1. Day 1–7 have no Meaning First steps (scene, comprehension, key expressions, practice, writing hint) — a different screen flow from Day 8+. First/Second/So are never taught explicitly there.
2. Word-count targets (opinion 50–100, email 50–100) look larger than the Eiken Pre-2 format as commonly published (see below). Word counts include greeting and sign-off.
3. Difficulty is not monotonic: Day 14 (60–90 words, 12 min) is followed by Day 15–18 at 50–80 / 10 min; later days climb to 70–100.
4. Repetition: smartphones (Day 1, 14), uniforms (3, 25), "Why don't we" (9, 20), many "First/Second/So" answers. Some is intentional review.
5. Explanations: most fill-blank / word-order items have no `explanationJa`.
6. Day 18's scene is about Kai, but the task asks the student to write about themself.
7. All email lessons are with "Alex"; the email format never varies (no reply to a different sender/topic type).

## Eiken Grade Pre-2 format (verified against the official 2026年度 第2回 一次試験 問題冊子, provided by the school owner)
Writing has two tasks, both required:

| | 大問5 Eメール | 大問6 英作文(意見論述) |
|---|---|---|
| Task | Reply to Alex's email; **ask 2 specific questions about the underlined part** of Alex's email | Opinion on a QUESTION with **2 reasons** |
| Word target | **40–50 words** (the reply body) | **50–60 words** |
| Format notes | Greeting/sign-off are pre-printed ("Best wishes," is printed; **no name needed**); off-topic answers can score 0 | Off-topic answers can score 0 |

Differences from the current app (not changed in this PR; a separate curriculum PR is proposed):
1. Email word range is 50–100 in the app vs **40–50** officially (Day 2–6 are 50–80, later days up to 95).
2. Opinion range is 50–80 up to 70–100 in the app vs **50–60** officially.
3. Email tasks in the app ask the student to answer Alex's questions / give advice / decline etc. The real task is different: **ask two questions about an underlined phrase** in Alex's email. No lesson practises this.
4. App emails end with "Best, [Your name]"; the exam prints "Best wishes," and needs no name. The AI prompt currently checks "sign-off with the student's name".
5. App word counts include greeting and sign-off; the exam counts only the body written in the answer box.
