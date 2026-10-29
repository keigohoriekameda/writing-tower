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

## Eiken Grade Pre-2 format — NOT verified against official material
The official site (eiken.or.jp) could not be reached from this environment (host not on the session network allow-list), so no official figures were confirmed. Secondary sources (publisher pages) confirm only that from the 2024 renewal Pre-2 writing has two tasks (an email-reply task added to the opinion essay). My recollection — unverified — is email ≈ 15–25 words and opinion ≈ 50–60 words, which would mean the app's email tasks (50–100 words) differ substantially from the real exam. Please check the current official "問題形式・採点基準" page before any curriculum revision.
