import { Lesson } from "@/types/lesson"

export const lessons: Lesson[] = [
  {
    id: "day-1",
    day: 1,
    type: "opinion",
    title: "Smartphones at School",
    topic: "Should students use smartphones at school?",
    prompt:
      "Some people think students should be allowed to use smartphones at school. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I agree that students should be allowed to use smartphones at school. First, smartphones can help students find information quickly during class. Second, smartphones make it easy to contact parents in an emergency. So, smartphones are useful tools for students, and schools should allow them with clear rules.",
  },
  {
    id: "day-2",
    day: 2,
    type: "email",
    title: "Weekend Plans",
    topic: "Reply to Alex's email about your weekend plans.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI heard you have a long weekend soon.\nWhat are you going to do during the weekend?\nCan you tell me about your plans?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThank you for your email. I have a long weekend soon, and I'm planning to visit my grandparents in the countryside. We will cook dinner together and watch movies at night. I'm also going to finish my homework on Sunday morning.\n\nWhat about you? Do you have any plans for your weekend?\n\nBest,\n[Your name]",
  },
  {
    id: "day-3",
    day: 3,
    type: "opinion",
    title: "School Uniforms",
    topic: "Should students wear school uniforms?",
    prompt:
      "Some people think students should wear school uniforms. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I agree that students should wear school uniforms. First, uniforms save time in the morning because students don't need to choose their clothes. Second, uniforms make all students feel equal, no matter how rich or poor their families are. So, I believe uniforms are a good rule for schools to keep.",
  },
  {
    id: "day-4",
    day: 4,
    type: "email",
    title: "Club Activities",
    topic: "Reply to Alex's email about your club activities.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI heard many students in Japan join club activities.\nWhat club are you in?\nWhat do you like about it?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThanks for asking about my club. I'm in the tennis club at my school. We practice every Tuesday and Friday after class. I like my club because I can make new friends and get good exercise. Our team is preparing for a tournament next month, so we are practicing very hard.\n\nBest,\n[Your name]",
  },
  {
    id: "day-5",
    day: 5,
    type: "opinion",
    title: "Studying Abroad",
    topic: "Should high school students study abroad?",
    prompt:
      "Some people think high school students should study abroad. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I agree that high school students should study abroad. First, studying abroad helps students improve their English skills quickly because they use it every day. Second, it gives students a chance to learn about different cultures and make friends from other countries. So, studying abroad is a great experience for high school students.",
  },
  {
    id: "day-6",
    day: 6,
    type: "email",
    title: "Favorite Subject",
    topic: "Reply to Alex's email about your favorite subject.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI'm curious about school in Japan.\nWhat is your favorite subject?\nWhy do you like it?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThanks for your email. My favorite subject is English. I like it because I can talk with people from different countries. My teacher also makes the lessons fun with games and songs. I want to keep studying English so I can travel abroad someday.\n\nBest,\n[Your name]",
  },
  {
    id: "day-7",
    day: 7,
    type: "opinion",
    title: "Part-time Jobs",
    topic: "Should high school students have part-time jobs?",
    prompt:
      "Some people think high school students should have part-time jobs. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I agree that high school students should have part-time jobs. First, working part-time helps students learn how to manage their own money. Second, it teaches important skills like communication and responsibility that are useful in the future. So, I think part-time jobs are a valuable experience for high school students.",
  },
  {
    id: "day-8",
    day: 8,
    type: "opinion",
    title: "Bike Helmet Rules",
    topic: "Should all students wear a helmet when they ride a bike to school?",
    scene: {
      contextJa:
        "学校が「自転車通学の生徒全員にヘルメット着用を義務づける」新しいルールを検討しています。生徒会がこのルールについて意見を集めている場面です。",
      intro:
        "Ken: Did you hear? The school wants all students to wear a helmet when they ride a bike to school.\nMia: Really? Some students say it looks strange. But I think it's a good idea.\nKen: Why do you think so?\nMia: Because helmets keep us safe if we fall.",
    },
    comprehension: [
      {
        question: "What new rule is the school thinking about?",
        choices: ["a. No bikes at school", "b. Wearing a helmet when riding a bike", "c. A new school uniform"],
        answerJa: "b(自転車通学の生徒にヘルメット着用を求めるルール)",
      },
      {
        question: "Does Mia agree with the rule?",
        answerJa: "賛成している(a good idea だと言っている)",
      },
      {
        question: "Why does Mia think helmets are a good idea?",
        answerJa: "転んだ時に安全を守ってくれるから(helmets keep us safe if we fall)",
      },
    ],
    keyExpressions: [
      { phrase: "should + 動詞の原形", meaningJa: "~すべきだ(義務・提案)" },
      { phrase: "But some people say ~.", meaningJa: "しかし、~と言う人もいる(軽い譲歩)" },
    ],
    guidedPractice: [
      {
        instruction: "並べ替え",
        prompt: "wear / should / helmets / students / a bike / when / they / ride",
        answer: "Students should wear a helmet when they ride a bike.",
      },
      {
        instruction: "空欄補充",
        prompt: "I think all students ___ wear a helmet.",
        answer: "should",
      },
      {
        instruction: "空欄補充",
        prompt: "___ ___ people say helmets look strange, but I think safety is more important.",
        answer: "But some",
      },
    ],
    prompt:
      "Some people think all students should wear a helmet when they ride a bike to school. Do you agree with this idea? First, mention what some people say. Then, write your opinion with two reasons.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Some students say helmets look strange, but I think all students should wear a helmet when they ride a bike to school. First, helmets keep students safe if they fall. Second, wearing a helmet can become a good habit for their whole life. So, I believe schools should ask all students to wear helmets.",
  },
  {
    id: "day-9",
    day: 9,
    type: "email",
    title: "A Trip to Kyoto",
    topic: "Reply to Alex's email about a trip to Kyoto.",
    scene: {
      contextJa:
        "海外の友達Alexから、休みに一緒に京都へ旅行に行こうと誘うメールが届きました。誘いに答えて、自分の考えも伝える場面です。",
      intro:
        "Hi,\nI have an idea! Why don't we go to Kyoto together during the holidays? We can visit temples and try Japanese sweets. What do you think?\n\nAlex",
    },
    comprehension: [
      { question: "What is Alex suggesting?", answerJa: "一緒に京都へ旅行に行くこと" },
      { question: "What does Alex want to do in Kyoto? (2 things)", answerJa: "お寺を訪れる/和菓子を食べる" },
      { question: "What does Alex ask you at the end?", answerJa: "あなたがどう思うか(意見)" },
    ],
    keyExpressions: [
      { phrase: "Why don't we ~?", meaningJa: "(一緒に)~しませんか(提案)" },
      { phrase: "That sounds great/fun!", meaningJa: "それはいいね！(相手の提案への反応)" },
      { phrase: "I'm planning to ~", meaningJa: "~するつもりです", reusedFromDay: 2 },
    ],
    guidedPractice: [
      {
        instruction: "並べ替え",
        prompt: "why / go / the park / to / we / don't this weekend?",
        answer: "Why don't we go to the park this weekend?",
      },
      {
        instruction: "空欄補充",
        prompt: "That ___ like fun! I would love to join you.",
        answer: "sounds",
      },
      {
        instruction: "空欄補充",
        prompt: "I ___ ___ to visit temples in Kyoto.",
        answer: "would like",
      },
    ],
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI have an idea! Why don't we go to Kyoto together during the holidays? We can visit temples and try Japanese sweets. What do you think?\n\nAlex\n\nWrite an email to Alex. Thank him, say yes to the trip, and suggest one more thing you would like to do.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThank you for your email. That sounds like a great idea! I would love to go to Kyoto with you. Why don't we also visit a famous shrine there? I'm planning to bring my camera to take pictures of the temples.\n\nBest,\n[Your name]",
  },
  {
    id: "day-10",
    day: 10,
    type: "opinion",
    title: "Studying Alone or With Friends",
    topic: "Which do you think is better for studying, studying alone or studying with friends?",
    scene: {
      contextJa:
        "期末テスト前、クラスメートのYuiとSoraが勉強方法について話しています。一人で勉強するのと友達と勉強するのと、どちらがいいか考える場面です。",
      intro:
        "Yui: I always study alone in my room. It's quiet, so I can concentrate.\nSora: Really? I like studying with friends. We can ask each other questions.\nYui: That's true, but sometimes we just talk and don't study!",
    },
    comprehension: [
      { question: "Why does Yui like studying alone?", answerJa: "静かで集中できるから" },
      { question: "What is good about studying with friends, according to Sora?", answerJa: "お互いに質問し合えること" },
      { question: "What problem does Yui mention about studying with friends?", answerJa: "おしゃべりして勉強しなくなること" },
    ],
    keyExpressions: [
      { phrase: "I prefer A to B", meaningJa: "AよりBが好き" },
      { phrase: "On the other hand, ~", meaningJa: "一方で、~" },
    ],
    guidedPractice: [
      {
        instruction: "並べ替え",
        prompt: "to / I / studying alone / prefer / studying with friends",
        answer: "I prefer studying alone to studying with friends.",
      },
      {
        instruction: "空欄補充",
        prompt: "Studying with friends is fun. ___ ___ ___, it can be noisy.",
        answer: "On the other hand",
      },
      {
        instruction: "自由記述",
        prompt: "I prefer studying alone because ___.",
        answer: "(自分の理由を1文で書く。例: it is quiet and I can concentrate.)",
      },
    ],
    prompt:
      "Which do you think is better for studying, studying alone or studying with friends? Choose one, give one reason, and briefly mention the other side using \"On the other hand\".",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I prefer studying with friends to studying alone. First, we can ask each other questions when we don't understand something. On the other hand, studying alone can be quieter and easier to concentrate. So, I think studying with friends is more helpful for me because I can learn from them.",
  },
  {
    id: "day-11",
    day: 11,
    type: "email",
    title: "Advice Before a Test",
    topic: "Reply to Alex's email and give some advice about studying for a test.",
    scene: {
      contextJa:
        "友達のAlexが来週大きなテストがあり、不安に思っているというメールを送ってきました。励ましとアドバイスを送る場面です。",
      intro:
        "Hi,\nI have a big test next week, and I'm really worried. I don't know how to study for it. Do you have any advice for me?\n\nAlex",
    },
    comprehension: [
      { question: "What is Alex's situation?", answerJa: "来週大きなテストがあり、不安に思っている" },
      { question: "What is Alex asking for?", answerJa: "勉強法についてのアドバイス" },
    ],
    keyExpressions: [
      { phrase: "Don't worry.", meaningJa: "心配しないで(励まし)" },
      { phrase: "I think you should ~", meaningJa: "~した方がいいと思うよ(助言)", reusedFromDay: 8 },
      { phrase: "If you ~, you will ~", meaningJa: "もし~すれば、~だろう" },
    ],
    guidedPractice: [
      {
        instruction: "空欄補充",
        prompt: "Don't worry. I think you ___ make a study schedule.",
        answer: "should",
      },
      {
        instruction: "並べ替え",
        prompt: "study / every day / you / will / feel / if / better",
        answer: "If you study every day, you will feel better.",
      },
      {
        instruction: "選択式",
        prompt: "友達を励ますときに使う表現はどちら? a. Don't worry. b. That's your problem.",
        answer: "a",
      },
    ],
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI have a big test next week, and I'm really worried. I don't know how to study for it. Do you have any advice for me?\n\nAlex\n\nWrite an email to Alex. Encourage him and give him one piece of advice.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nDon't worry. Everyone feels nervous before a big test. I think you should make a study schedule and study a little every day. If you study every day, you will remember more and feel less worried. You can do it!\n\nBest,\n[Your name]",
  },
  {
    id: "day-12",
    day: 12,
    type: "opinion",
    title: "Books or the Internet",
    topic: "Which do you think is more useful for studying, books or the Internet?",
    scene: {
      contextJa:
        "授業で「調べ物をするとき、本とインターネットどちらが役に立つか」について発表の準備をしている場面です。",
      intro:
        "Teacher: For your homework, you can use books or the Internet. Which one do you usually use?\nTaku: I usually use the Internet because it's fast. For example, I can find information in just a few seconds.\nTeacher: That's true. But books have good points too.",
    },
    comprehension: [
      { question: "What can students use for their homework?", answerJa: "本またはインターネット" },
      { question: "Which does Taku usually use, and why?", answerJa: "インターネット。速いから" },
      { question: "What example does Taku give?", answerJa: "数秒で情報を見つけられること" },
    ],
    keyExpressions: [
      { phrase: "for example", meaningJa: "例えば" },
      { phrase: "A is more useful than B", meaningJa: "AはBより役立つ", reusedFromDay: 10 },
    ],
    guidedPractice: [
      {
        instruction: "空欄補充",
        prompt: "The Internet is very useful. ___ ___, I can find news from all over the world in one second.",
        answer: "For example",
      },
      {
        instruction: "空欄補充",
        prompt: "I think books are ___ ___ than the Internet because the information is often carefully checked.",
        answer: "more useful",
      },
      {
        instruction: "並べ替え",
        prompt: "is / than / the Internet / I think / more useful / books for studying English.",
        answer: "I think books are more useful than the Internet for studying English.",
      },
    ],
    prompt:
      "Which do you think is more useful for studying, books or the Internet? Choose one, give one reason with an example using \"for example\", and briefly mention the good point of the other one.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I think the Internet is more useful than books for studying. For example, I can find the newest information in just a few seconds. On the other hand, books can be useful because the information is often carefully checked. So, I usually use both books and the Internet together.",
  },
  {
    id: "day-13",
    day: 13,
    type: "email",
    title: "Our School Festival",
    topic: "Reply to Alex's email about your school festival last week.",
    scene: {
      contextJa:
        "先週行われた文化祭について、Alexが「どうだった?」と尋ねるメールを送ってきました。過去に起きたことを説明する場面です。",
      intro:
        "Hi,\nI heard your school had a school festival last week. How was it? What did you do?\n\nAlex",
    },
    comprehension: [
      { question: "What is Alex asking about?", answerJa: "先週の文化祭がどうだったか" },
      { question: "What two things does Alex want to know?", answerJa: "文化祭がどうだったか/何をしたか" },
    ],
    keyExpressions: [
      { phrase: "We had ~ / I went to ~", meaningJa: "~があった/~に行った(過去形での出来事)" },
      { phrase: "It was ~ because ~", meaningJa: "それは~だった、なぜなら~", reusedFromDay: 6 },
    ],
    guidedPractice: [
      {
        instruction: "動詞の形",
        prompt: "My school (have) ___ a school festival last week.",
        answer: "had",
      },
      {
        instruction: "空欄補充",
        prompt: "It ___ a lot of fun because we sold snacks at our class shop.",
        answer: "was",
      },
      {
        instruction: "並べ替え",
        prompt: "part / the best / dance / was / our class / the",
        answer: "The best part was our class dance.",
      },
    ],
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI heard your school had a school festival last week. How was it? What did you do?\n\nAlex\n\nWrite an email to Alex about your school festival.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThank you for your email. We had a school festival last week. My class sold snacks and drinks at our class shop. It was a lot of fun because many students came to buy our food. The best part was our class dance on the stage. I hope you can come to Japan and see it next year!\n\nBest,\n[Your name]",
  },
  {
    id: "day-14",
    day: 14,
    type: "opinion",
    title: "Smartphones at School, Revisited",
    topic: "Do you think students should be allowed to use smartphones at school?",
    scene: {
      contextJa:
        "Day1と同じ「スマホの校内使用」というテーマですが、今回は生徒会が理由に加えて具体例と反対意見への言及も求めています。これまで学んだ表現を組み合わせて書く総合回です。",
      intro:
        "Student council notice:\nWe are collecting students' opinions about smartphone use at school. Please tell us: Do you think students should be allowed to use smartphones at school? Give your reasons and one example.",
    },
    comprehension: [
      { question: "What is the student council collecting?", answerJa: "スマホ使用についての意見" },
      { question: "What does the notice ask you to include?", answerJa: "理由と具体例" },
    ],
    keyExpressions: [
      { phrase: "In my opinion, ~ / Personally, I think ~", meaningJa: "私は~だと思う(意見表明のバリエーション)", reusedFromDay: 1 },
      { phrase: "for example", meaningJa: "例えば", reusedFromDay: 12 },
      { phrase: "but / on the other hand", meaningJa: "しかし/一方で(軽い譲歩)", reusedFromDay: 8 },
    ],
    guidedPractice: [
      {
        instruction: "選択式",
        prompt: "「私は~だと思う」の別の言い方はどちら? a. In my opinion, ~ b. My opinion said ~",
        answer: "a",
      },
      {
        instruction: "並べ替え",
        prompt: "example / can / for / find / students / information / quickly",
        answer: "For example, students can find information quickly.",
      },
      {
        instruction: "並べ替え",
        prompt: "say / people / some / smartphones / can / distract / students / but / clear rules / can / help",
        answer: "Some people say smartphones can distract students, but clear rules can help.",
      },
    ],
    prompt:
      "Do you think students should be allowed to use smartphones at school? Start with \"In my opinion,\" or \"Personally, I think\", give two reasons (use \"for example\" for one of them), and add one sentence about the other side using \"but\" or \"on the other hand\".",
    wordCount: { min: 60, max: 90 },
    timeLimit: 12,
    answerExample:
      "In my opinion, students should be allowed to use smartphones at school. First, smartphones help students find information quickly. For example, they can check a word's meaning in a few seconds during class. Second, smartphones are useful in an emergency. Some people say smartphones can distract students, but clear rules can help. So, I believe smartphones can be a helpful tool for students.",
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
