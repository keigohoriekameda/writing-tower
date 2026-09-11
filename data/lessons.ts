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
        kind: "choice",
        questionJa: "学校が検討している新しいルールは何ですか？",
        choices: ["自転車を禁止する", "自転車に乗るときヘルメットを着用する", "新しい制服にする"],
        correctIndex: 1,
        explanationJa: "自転車通学の生徒にヘルメット着用を求めるルールです。",
      },
      {
        kind: "choice",
        questionJa: "Miaはこのルールに賛成していますか、反対していますか？",
        choices: ["賛成している", "反対している"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Miaがヘルメットを良いと思う理由は何ですか？",
        answerJa: "転んだ時に安全を守ってくれるから(helmets keep us safe if we fall)",
      },
    ],
    keyExpressions: [
      { phrase: "should + 動詞の原形", meaningJa: "~すべきだ(義務・提案)" },
      { phrase: "But some people say ~.", meaningJa: "しかし、~と言う人もいる(軽い譲歩)" },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["wear", "should", "a helmet", "students", "a bike", "when", "they", "ride"],
        correctOrder: [3, 1, 0, 2, 5, 6, 7, 4],
        answer: "Students should wear a helmet when they ride a bike.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think all students ___ wear a helmet.",
        choices: ["should", "is", "does"],
        correctIndex: 0,
        explanationJa: "「~すべきだ」は should を使うよ。",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ people say helmets look strange, but I think safety is more important.",
        choices: ["But some", "So many", "And all"],
        correctIndex: 0,
        explanationJa: "軽く反対意見に触れるときは But some people say ~ を使うよ。",
      },
    ],
    writingHintJa:
      "自転車のヘルメット着用について、あなたの意見を書く問題です。まず反対意見にも軽く触れてから、自分の立場とその理由を2つ書きましょう。",
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
      { kind: "reveal", questionJa: "Alexは何を提案していますか？", answerJa: "一緒に京都へ旅行に行くこと" },
      {
        kind: "reveal",
        questionJa: "Alexは京都で何をしたいと言っていますか？(2つ)",
        answerJa: "お寺を訪れる/和菓子を食べる",
      },
      {
        kind: "choice",
        questionJa: "Alexは最後に何を聞いていますか？",
        choices: ["あなたの意見(どう思うか)", "あなたの誕生日", "あなたの学校名"],
        correctIndex: 0,
      },
    ],
    keyExpressions: [
      { phrase: "Why don't we ~?", meaningJa: "(一緒に)~しませんか(提案)" },
      { phrase: "That sounds great/fun!", meaningJa: "それはいいね！(相手の提案への反応)" },
      { phrase: "I'm planning to ~", meaningJa: "~するつもりです", reusedFromDay: 2 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["go", "why", "the park", "to", "we", "don't", "this weekend?"],
        correctOrder: [1, 5, 4, 0, 3, 2, 6],
        answer: "Why don't we go to the park this weekend?",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "That ___ like fun! I would love to join you.",
        choices: ["sounds", "sound", "sounding"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I ___ ___ to visit temples in Kyoto.",
        choices: ["would like", "am like", "will liking"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "Alexからの旅行の誘いに返信するメールです。お礼を伝え、誘いに乗ることを伝えたうえで、自分からも新しい提案を1つ加えてみましょう。",
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
      { kind: "reveal", questionJa: "Yuiが一人で勉強するのが好きな理由は何ですか？", answerJa: "静かで集中できるから" },
      {
        kind: "choice",
        questionJa: "Soraによると、友達と勉強することの良い点は何ですか？",
        choices: ["お互いに質問し合えること", "お菓子を食べられること", "早く終わること"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Yuiが指摘する、友達と勉強することの問題点は何ですか？",
        answerJa: "おしゃべりして勉強しなくなること",
      },
    ],
    keyExpressions: [
      { phrase: "I prefer A to B", meaningJa: "AよりBが好き" },
      { phrase: "On the other hand, ~", meaningJa: "一方で、~" },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["to", "I", "studying alone", "prefer", "studying with friends"],
        correctOrder: [1, 3, 2, 0, 4],
        answer: "I prefer studying alone to studying with friends.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Studying with friends is fun. ___ ___ ___, it can be noisy.",
        choices: ["On the other hand", "For example", "Because of this"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I prefer studying alone because it is quiet and I can ___.",
        choices: ["concentrate", "cook", "swim"],
        correctIndex: 0,
        explanationJa: "studying alone(一人で勉強すること)の良い点を選ぼう。",
      },
    ],
    writingHintJa:
      "一人で勉強するのと友達と勉強するの、どちらが自分に合っているかを考えて書く問題です。どちらか一方を選び、理由を書いたうえで、もう一方の側面にも軽く触れましょう。",
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
      {
        kind: "choice",
        questionJa: "Alexは今どんな状況ですか？",
        choices: ["来週大きなテストがあり不安に思っている", "旅行の予定を立てている", "部活で忙しい"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "Alexは何を求めていますか？", answerJa: "勉強法についてのアドバイス" },
    ],
    keyExpressions: [
      { phrase: "Don't worry.", meaningJa: "心配しないで(励まし)" },
      { phrase: "I think you should ~", meaningJa: "~した方がいいと思うよ(助言)", reusedFromDay: 8 },
      { phrase: "If you ~, you will ~", meaningJa: "もし~すれば、~だろう" },
    ],
    guidedPractice: [
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Don't worry. I think you ___ make a study schedule.",
        choices: ["should", "is", "did"],
        correctIndex: 0,
      },
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["study", "every day", "you", "will", "feel", "if", "better", "you"],
        correctOrder: [5, 2, 0, 1, 7, 3, 4, 6],
        answer: "If you study every day, you will feel better.",
      },
      {
        kind: "fillBlank",
        instruction: "選択",
        prompt: "友達を励ますときに使う表現はどちらですか？",
        choices: ["Don't worry.", "That's your problem."],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "テスト前で不安になっている友達を励ますメールです。まず励ましの言葉をかけ、そのあとで勉強法のアドバイスを1つ伝えましょう。",
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
      {
        kind: "choice",
        questionJa: "生徒は宿題のために何を使ってよいですか？",
        choices: ["本またはインターネット", "スマートフォンのみ", "友達のノートのみ"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Takuが普段使っているのはどちらですか？またその理由は？",
        answerJa: "インターネット。速いから",
      },
      { kind: "reveal", questionJa: "Takuが挙げている具体例は何ですか？", answerJa: "数秒で情報を見つけられること" },
    ],
    keyExpressions: [
      { phrase: "for example", meaningJa: "例えば" },
      { phrase: "A is more useful than B", meaningJa: "AはBより役立つ", reusedFromDay: 10 },
    ],
    guidedPractice: [
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "The Internet is very useful. ___ ___, I can find news from all over the world in one second.",
        choices: ["For example", "On the other hand", "But some"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think books are ___ ___ than the Internet because the information is often carefully checked.",
        choices: ["more useful", "less useful", "more famous"],
        correctIndex: 0,
      },
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["than the Internet", "for studying English", "I think", "are", "more useful", "books"],
        correctOrder: [2, 5, 3, 4, 0, 1],
        answer: "I think books are more useful than the Internet for studying English.",
      },
    ],
    writingHintJa:
      "本とインターネット、調べ物にはどちらが役立つかを考える問題です。どちらか一方を選び、具体例を1つ挙げながら理由を説明しましょう。",
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
      { kind: "reveal", questionJa: "Alexは何について尋ねていますか？", answerJa: "先週の文化祭がどうだったか" },
      {
        kind: "reveal",
        questionJa: "Alexが知りたいことは2つあります。それは何ですか？",
        answerJa: "文化祭がどうだったか/何をしたか",
      },
    ],
    keyExpressions: [
      { phrase: "We had ~ / I went to ~", meaningJa: "~があった/~に行った(過去形での出来事)" },
      { phrase: "It was ~ because ~", meaningJa: "それは~だった、なぜなら~", reusedFromDay: 6 },
    ],
    guidedPractice: [
      {
        kind: "fillBlank",
        instruction: "動詞の形",
        prompt: "My school ___ a school festival last week.",
        choices: ["had", "has", "having"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "It ___ a lot of fun because we sold snacks at our class shop.",
        choices: ["was", "is", "be"],
        correctIndex: 0,
      },
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["our class dance", "was", "The best part"],
        correctOrder: [2, 1, 0],
        answer: "The best part was our class dance.",
      },
    ],
    writingHintJa:
      "先週の文化祭について尋ねられたメールへの返信です。過去に起きたことを説明しながら、感想も伝えましょう。",
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
      {
        kind: "choice",
        questionJa: "生徒会が集めているものは何ですか？",
        choices: ["スマホ使用についての意見", "文化祭の出し物のアイデア", "部活動の予算"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "掲示物はあなたに何を含めるよう求めていますか？", answerJa: "理由と具体例" },
    ],
    keyExpressions: [
      { phrase: "In my opinion, ~ / Personally, I think ~", meaningJa: "私は~だと思う(意見表明のバリエーション)", reusedFromDay: 1 },
      { phrase: "for example", meaningJa: "例えば", reusedFromDay: 12 },
      { phrase: "but / on the other hand", meaningJa: "しかし/一方で(軽い譲歩)", reusedFromDay: 8 },
    ],
    guidedPractice: [
      {
        kind: "fillBlank",
        instruction: "選択",
        prompt: "「私は~だと思う」の別の言い方はどちらですか？",
        choices: ["In my opinion, ~", "My opinion said ~"],
        correctIndex: 0,
      },
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["can", "information quickly", "For example", "find", "students"],
        correctOrder: [2, 4, 0, 3, 1],
        answer: "For example, students can find information quickly.",
      },
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["but", "clear rules can help", "smartphones can distract students", "Some people say"],
        correctOrder: [3, 2, 0, 1],
        answer: "Some people say smartphones can distract students, but clear rules can help.",
      },
    ],
    writingHintJa:
      "スマホの校内使用について、これまで学んだ表現を使って書く総合問題です。理由を2つ挙げ、そのうち1つには具体例を添え、反対意見にも軽く触れてまとめましょう。",
    prompt:
      "Do you think students should be allowed to use smartphones at school? Start with \"In my opinion,\" or \"Personally, I think\", give two reasons (use \"for example\" for one of them), and add one sentence about the other side using \"but\" or \"on the other hand\".",
    wordCount: { min: 60, max: 90 },
    timeLimit: 12,
    answerExample:
      "In my opinion, students should be allowed to use smartphones at school. First, smartphones help students find information quickly. For example, they can check a word's meaning in a few seconds during class. Second, smartphones are useful in an emergency. Some people say smartphones can distract students, but clear rules can help. So, I believe smartphones can be a helpful tool for students.",
  },
  {
    id: "day-15",
    day: 15,
    type: "opinion",
    title: "Walking or Biking to School",
    topic: "Which is better for students, walking to school or riding a bike?",
    scene: {
      contextJa:
        "クラスで通学方法について話しています。徒歩通学と自転車通学、どちらがいいか考える場面です。新しい表現は登場せず、これまでの比較表現を新しい話題で練習します。",
      intro:
        "Mei: I walk to school every day. It takes twenty minutes, but I don't mind.\nSora: Really? I ride my bike. It's much faster than walking.\nMei: That's true, but walking is good exercise, and I can talk with my friends on the way.\nSora: I see your point. Both ways have good points.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Meiはどうやって学校に行っていますか？",
        choices: ["歩いて", "自転車で", "バスで"],
        correctIndex: 0,
      },
      {
        kind: "choice",
        questionJa: "Soraが自転車の良い点として挙げているのは何ですか？",
        choices: ["歩くより速いこと", "お金がかからないこと", "静かなこと"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Meiが徒歩通学の良い点として挙げていることは何ですか？(2つ)",
        answerJa: "良い運動になること/友達と話しながら行けること",
      },
    ],
    keyExpressions: [
      { phrase: "A is faster/better than B", meaningJa: "AはBより速い/良い", reusedFromDay: 10 },
      { phrase: "because ~", meaningJa: "なぜなら~", reusedFromDay: 1 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["than", "is", "riding a bike", "slower", "Walking"],
        correctOrder: [4, 1, 3, 0, 2],
        answer: "Walking is slower than riding a bike.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I prefer biking ___ walking because it is faster.",
        choices: ["to", "than", "from"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I like walking to school ___ I can talk with my friends.",
        choices: ["because", "but", "or"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "徒歩通学と自転車通学のどちらがいいか、あなたの意見を書く問題です。理由を1つ挙げ、比較表現(A is ~ than B)を使って説明してみましょう。",
    prompt:
      "Which do you think is better for students, walking to school or riding a bike? Choose one, and give one reason using a comparison (for example, \"~ is faster/better than ~\").",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I think riding a bike is better than walking to school. First, biking is much faster, so I can sleep a little longer in the morning. Second, I don't get tired before class starts. Walking is good exercise, but for busy mornings, I prefer biking to walking.",
  },
  {
    id: "day-16",
    day: 16,
    type: "email",
    title: "Asking for Help with Studying",
    topic: "Ask a friend for help studying for a test.",
    scene: {
      contextJa:
        "テストが近づいていて、数学がよく分からないところがあります。友達のAlexからの何気ないメールに返信しながら、勉強を手伝ってほしいとお願いする場面です。",
      intro:
        "Hi,\nThis weekend I don't have any plans. Maybe we can just relax and watch a movie or something.\nWhat are you doing this weekend?\n\nAlex",
    },
    comprehension: [
      {
        kind: "reveal",
        questionJa: "Alexは今週末どんな予定だと言っていますか？",
        answerJa: "特に予定はなく、映画でも見てゆっくりしようと思っている",
      },
      {
        kind: "choice",
        questionJa: "Alexは最後に何を聞いていますか？",
        choices: ["あなたの今週末の予定", "あなたの好きな映画", "あなたの誕生日"],
        correctIndex: 0,
      },
    ],
    keyExpressions: [
      { phrase: "Could you ~?", meaningJa: "~していただけますか(丁寧な依頼)" },
      { phrase: "Thank you for your email", meaningJa: "メールありがとう", reusedFromDay: 2 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["help me", "this weekend", "Could you", "study"],
        correctOrder: [2, 0, 3, 1],
        answer: "Could you help me study this weekend?",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ you show me how to solve this problem?",
        choices: ["Could", "Are", "Do"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I have a math test next week, ___ I don't understand some problems.",
        choices: ["and", "because", "but"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "友達に勉強を手伝ってほしいとお願いするメールです。テストで困っていることを伝えたうえで、Could you ~?を使って手伝ってほしいことを頼んでみましょう。",
    prompt:
      "You received an email from your friend, Alex. Write a reply. Tell Alex about your math test, and ask him to help you study using \"Could you ~?\".",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThanks for your email. That sounds relaxing! Actually, I have a math test next week, and I don't understand some of the problems. Could you help me study this weekend? We could also watch a movie after that.\n\nBest,\n[Your name]",
  },
  {
    id: "day-17",
    day: 17,
    type: "opinion",
    title: "Cleaning the Classroom",
    topic: "Should students clean their own classroom?",
    scene: {
      contextJa:
        "日本の学校では生徒が教室を掃除しますが、海外では業者が掃除する学校もあります。「生徒が自分たちで掃除すべきか」を考える場面です。新しい表現は登場せず、これまでの意見文の型をそのまま使います。",
      intro:
        "Teacher: In many countries, workers clean the school, not students. What do you think about that?\nYui: I think students should clean their own classroom. It teaches us to take care of our things.\nKenta: But cleaning takes time. We could use that time to study more.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "海外の学校では、誰が掃除をすることが多いと先生は言っていますか？",
        choices: ["生徒", "業者(掃除の人)", "先生"],
        correctIndex: 1,
      },
      {
        kind: "choice",
        questionJa: "Yuiは生徒が掃除すべきだと思っていますか？",
        choices: ["思っている", "思っていない"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Kentaが心配していることは何ですか？",
        answerJa: "掃除に時間がかかり、その分勉強する時間が減ってしまうこと",
      },
    ],
    keyExpressions: [
      { phrase: "should ~", meaningJa: "~すべきだ", reusedFromDay: 8 },
      { phrase: "First, ~. Second, ~. So, ~.", meaningJa: "意見文の基本の型", reusedFromDay: 1 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["clean", "their own classroom", "Students", "should"],
        correctOrder: [2, 3, 0, 1],
        answer: "Students should clean their own classroom.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Cleaning the classroom ___ students learn to take care of their things.",
        choices: ["helps", "help", "helping"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think students should clean the classroom ___ it teaches responsibility.",
        choices: ["because", "but", "or"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "生徒が教室を掃除すべきかどうかを考える問題です。Day1〜14で使った「意見→理由2つ→まとめ」の型を、新しい表現を足さずにそのまま使って書いてみましょう。",
    prompt:
      "Do you think students should clean their own classroom, or should workers do it instead? Write your opinion with two reasons.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I think students should clean their own classroom. First, cleaning helps students learn to take care of their things. Second, working together to clean makes the class feel like a team. So, I believe cleaning the classroom is a good experience for students, even though it takes some time.",
  },
  {
    id: "day-18",
    day: 18,
    type: "email",
    title: "Worried About a Friendship",
    topic: "Ask a friend for advice about a problem with another friend.",
    scene: {
      contextJa:
        "最近、仲の良かった友達と少しぎくしゃくしていて悩んでいます。信頼できる友達のAlexに相談のメールを送る場面です。",
      intro:
        "Yuna: You look worried today. Is everything okay?\nKai: Not really. My best friend hasn't talked to me much this week, and I don't know why.\nYuna: That sounds hard. Maybe you should write to someone you trust about it.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Kaiは今どんな気持ちですか？",
        choices: ["悩んでいる", "嬉しい", "怒っている"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Kaiが悩んでいる理由は何ですか？",
        answerJa: "親友が今週あまり話してくれず、理由が分からないから",
      },
      {
        kind: "choice",
        questionJa: "Yunaは何を勧めていますか？",
        choices: ["信頼できる人に相談してみること", "気にしないこと", "直接文句を言うこと"],
        correctIndex: 0,
      },
    ],
    keyExpressions: [
      { phrase: "What should I do?", meaningJa: "私はどうすればいいですか？(相談する表現)" },
      { phrase: "I think ~", meaningJa: "私は~だと思う", reusedFromDay: 1 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["about this", "should", "What", "I", "do"],
        correctOrder: [2, 1, 3, 4, 0],
        answer: "What should I do about this?",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "My friend hasn't talked to me much, and I ___ know why.",
        choices: ["don't", "doesn't", "not"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I feel worried, ___ I wanted to ask you for advice.",
        choices: ["so", "but", "or"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "友達関係の悩みをAlexに相談するメールです。何に悩んでいるかを説明し、最後にWhat should I do?を使って助言を求めてみましょう。",
    prompt:
      "Write an email to your friend Alex. Explain that you are worried because your best friend hasn't been talking to you much, and ask Alex \"What should I do?\".",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nI hope you are doing well. Actually, I have something I want to talk about. My best friend hasn't talked to me much this week, and I don't know why. I feel a little worried about it. What should I do? I would really like to hear your thoughts.\n\nBest,\n[Your name]",
  },
  {
    id: "day-19",
    day: 19,
    type: "opinion",
    title: "More School Events?",
    topic: "Should schools have more school events, like festivals or sports days?",
    scene: {
      contextJa: "生徒会が「学校行事をもっと増やすべきか」についてアンケートを取っている場面です。",
      intro:
        "Student council notice:\nSome students want more school events, like festivals and sports days. Other students think there are already enough events. What do you think?",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "この掲示物は何について意見を求めていますか？",
        choices: ["学校行事を増やすべきか", "給食のメニュー", "部活動の時間"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "行事を増やしたい生徒たちは、どんな行事の例を挙げていますか？",
        answerJa: "文化祭や運動会",
      },
    ],
    keyExpressions: [
      { phrase: "In addition, ~", meaningJa: "さらに、加えて(理由を追加する)" },
      { phrase: "for example", meaningJa: "例えば", reusedFromDay: 12 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["help students", "School events", "make new friends"],
        correctOrder: [1, 0, 2],
        answer: "School events help students make new friends.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "School events are fun. ___ ___, they help students work together as a team.",
        choices: ["In addition", "But some", "So many"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___, the school festival lets students show their talents.",
        choices: ["For example", "In addition", "But some"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "学校行事を増やすべきかどうかを考える問題です。理由を1つ挙げたあと、In additionを使ってもう1つ理由を追加してみましょう。",
    prompt:
      "Do you think schools should have more school events? Write your opinion with two reasons. Try using \"In addition\" to add your second reason.",
    wordCount: { min: 55, max: 85 },
    timeLimit: 10,
    answerExample:
      "I think schools should have more school events. First, events like festivals help students make new friends outside their own class. In addition, events give students a chance to show their talents, like singing or sports. So, I believe more school events would make school life more fun for everyone.",
  },
  {
    id: "day-20",
    day: 20,
    type: "email",
    title: "Studying Together",
    topic: "Reply to a friend who wants to study together.",
    scene: {
      contextJa: "友達のAlexから、一緒にテスト勉強をしようと誘うメールが届いた場面です。",
      intro:
        "Hi,\nWhy don't we study together for the science test this Saturday? I have some notes I can share with you.\n\nAlex",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Alexは何を提案していますか？",
        choices: ["土曜日に一緒に理科の勉強をすること", "一緒に映画を見ること", "一緒に買い物に行くこと"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "Alexが持っていると言っているものは何ですか？", answerJa: "共有できるノート" },
    ],
    keyExpressions: [
      { phrase: "Why don't we ~?", meaningJa: "~しませんか", reusedFromDay: 9 },
      { phrase: "Could you ~?", meaningJa: "~していただけますか", reusedFromDay: 16 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["your notes", "Could you", "on Saturday", "bring"],
        correctOrder: [1, 3, 0, 2],
        answer: "Could you bring your notes on Saturday?",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "That sounds great! ___ we meet at the library at 10?",
        choices: ["Why don't", "Could", "Are"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I ___ some questions about chapter 3, so I would like your help.",
        choices: ["have", "has", "having"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "Alexからの勉強の誘いに返信するメールです。誘いに乗ったうえで、Could you ~?を使って何か1つお願いしてみましょう。",
    prompt:
      "Reply to Alex's email. Say yes to studying together, and use \"Could you ~?\" to ask for one thing (for example, bringing notes or choosing a time).",
    wordCount: { min: 55, max: 85 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThank you for your email. That sounds great! I have some questions about chapter 3, so your help would be really useful. Could you bring your notes on Saturday? Why don't we meet at the library at 10?\n\nBest,\n[Your name]",
  },
  {
    id: "day-21",
    day: 21,
    type: "email",
    title: "Saying No Politely",
    topic: "Politely decline an invitation.",
    scene: {
      contextJa:
        "友達のAlexから週末に遊びに誘われましたが、その日は家族の用事があります。断りのメールを書く場面です。",
      intro: "Hi,\nDo you want to come to the amusement park with us this Sunday? It will be a lot of fun!\n\nAlex",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Alexは何に誘っていますか？",
        choices: ["日曜日に遊園地に行くこと", "勉強会", "誕生日パーティー"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "Alexは誘いについてどう言っていますか？", answerJa: "きっと楽しいはず、と言っている" },
    ],
    keyExpressions: [
      { phrase: "I'm afraid I can't ~ because ~", meaningJa: "残念ながら~できません、なぜなら~(丁寧な断り)" },
      { phrase: "Thank you for your email", meaningJa: "メールありがとう", reusedFromDay: 2 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["come", "I'm afraid", "this Sunday", "I can't"],
        correctOrder: [1, 3, 0, 2],
        answer: "I'm afraid I can't come this Sunday.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I'm afraid I can't join you ___ I have a family event that day.",
        choices: ["because", "so", "but"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ I can't go to the park, I hope you have a great time.",
        choices: ["I'm afraid", "Why don't", "So many"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "誘いを丁寧に断るメールです。まずお礼を言い、I'm afraid I can't~because~を使って行けない理由を伝えましょう。",
    prompt:
      "Reply to Alex's email. Thank him for the invitation, but politely say you can't come this Sunday because of a family event.",
    wordCount: { min: 55, max: 85 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThank you for your email. It sounds like a lot of fun! I'm afraid I can't come this Sunday because I have a family event that day. I hope you all have a great time. Let's do something together another day.\n\nBest,\n[Your name]",
  },
  {
    id: "day-22",
    day: 22,
    type: "opinion",
    title: "Reading or Video Games",
    topic: "Which is more helpful for students, reading books or playing video games?",
    scene: {
      contextJa: "「読書とゲーム、どちらが生徒にとって役立つか」について友達と話している場面です。",
      intro:
        "Ren: I spend most of my free time playing video games. It's really fun and helps me relax.\nHana: I like reading books instead. I learn a lot of new words and ideas.\nRen: That's true. Maybe both are useful in different ways.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Renは自由時間に主に何をしていますか？",
        choices: ["ゲームをする", "読書をする", "運動する"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Hanaが読書の良い点として挙げているのは何ですか？",
        answerJa: "新しい言葉や考え方をたくさん学べること",
      },
    ],
    keyExpressions: [
      { phrase: "In addition, ~", meaningJa: "さらに", reusedFromDay: 19 },
      { phrase: "for example", meaningJa: "例えば", reusedFromDay: 12 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["helps students", "Reading books", "learn new words"],
        correctOrder: [1, 0, 2],
        answer: "Reading books helps students learn new words.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Video games are fun. ___ ___, they can help students relax after school.",
        choices: ["In addition", "For example", "But some"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___, some games help students solve problems and think quickly.",
        choices: ["For example", "In addition", "So many"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "読書とゲーム、どちらが役立つかを考える問題です。理由を1つ挙げたあと、In additionでもう1つ理由を加えてみましょう。新しい表現は使わず、これまで学んだ型で書いてみましょう。",
    prompt:
      "Which do you think is more helpful for students, reading books or playing video games? Write your opinion with two reasons.",
    wordCount: { min: 60, max: 90 },
    timeLimit: 11,
    answerExample:
      "I think reading books is more helpful for students than playing video games. First, reading helps students learn new words and ideas. In addition, books can teach us about different people and places. For example, I learned a lot about space from a book last month. So, I believe reading is a great habit for students.",
  },
  {
    id: "day-23",
    day: 23,
    type: "email",
    title: "Changing Our Plans",
    topic: "Suggest a new day after you can't make the original plan.",
    scene: {
      contextJa:
        "以前約束していた日曜日の予定に行けなくなり、Alexに別の日を提案するメールを書く場面です。",
      intro:
        "Kenta: Didn't you and Alex plan to go to the museum this Sunday?\nYou: Yes, but something came up. I need to tell Alex and suggest another day.",
    },
    comprehension: [
      {
        kind: "reveal",
        questionJa: "あなたは何をAlexに伝える必要がありますか？",
        answerJa: "日曜日の予定に行けなくなったこと、そして別の日を提案すること",
      },
      {
        kind: "choice",
        questionJa: "予定していた行き先はどこですか？",
        choices: ["博物館", "遊園地", "図書館"],
        correctIndex: 0,
      },
    ],
    keyExpressions: [
      { phrase: "Would you like to ~?", meaningJa: "~しませんか(丁寧な誘い)" },
      { phrase: "I'm afraid I can't ~ because ~", meaningJa: "残念ながら~できません", reusedFromDay: 21 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["go", "Would you like to", "next Sunday", "instead"],
        correctOrder: [1, 0, 2, 3],
        answer: "Would you like to go next Sunday instead?",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I'm afraid I can't go this Sunday ___ I have to help my family.",
        choices: ["because", "so", "but"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ ___ visit the museum next weekend instead?",
        choices: ["Would you like to", "Could you", "I'm afraid"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "以前の予定に行けなくなったことを伝え、Would you like to~?を使って別の日を提案するメールです。I'm afraid I can't~because~(Day21)も一緒に使ってみましょう。",
    prompt:
      "Write an email to Alex. Tell him you can't go to the museum this Sunday, explain why, and use \"Would you like to ~?\" to suggest a new day.",
    wordCount: { min: 60, max: 90 },
    timeLimit: 11,
    answerExample:
      "Hi Alex,\n\nI'm really sorry, but I'm afraid I can't go to the museum this Sunday because I have to help my family with something. Would you like to go next Sunday instead? I still really want to see the dinosaur exhibit with you.\n\nBest,\n[Your name]",
  },
  {
    id: "day-24",
    day: 24,
    type: "opinion",
    title: "Movies: Theater or Home",
    topic: "Which is better, watching a movie at a theater or at home?",
    scene: {
      contextJa: "「映画館で見るのと家で見るの、どちらがいいか」について話している場面です。",
      intro:
        "Sara: I love watching movies at the theater. The big screen makes everything exciting.\nJun: I prefer watching at home. It's cheaper, and I can pause whenever I want.\nSara: That's a good point too.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "Saraが映画館を好きな理由は何ですか？",
        choices: ["大きなスクリーンが迫力があるから", "近いから", "安いから"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "Junが家で見ることの良い点として挙げているのは何ですか？(2つ)",
        answerJa: "安いこと/いつでも一時停止できること",
      },
    ],
    keyExpressions: [
      { phrase: "I prefer A to B", meaningJa: "AよりBが好き", reusedFromDay: 10 },
      { phrase: "On the other hand, ~", meaningJa: "一方で", reusedFromDay: 10 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["to going to the theater", "I prefer", "watching movies at home"],
        correctOrder: [1, 2, 0],
        answer: "I prefer watching movies at home to going to the theater.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Watching at the theater is exciting. ___ ___ ___, it can be expensive.",
        choices: ["On the other hand", "In addition", "For example"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I like watching movies at home ___ I can pause whenever I want.",
        choices: ["because", "but", "so"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "映画館と家、どちらで映画を見るのが良いかを考える問題です。比較表現(I prefer A to B)を使い、理由を挙げたあと、On the other handでもう一方の良い点にも触れてみましょう。",
    prompt:
      "Which do you think is better, watching a movie at a theater or at home? Write your opinion with a reason, and briefly mention the other side.",
    wordCount: { min: 60, max: 90 },
    timeLimit: 11,
    answerExample:
      "I prefer watching movies at home to going to the theater. First, it's cheaper because I don't need to buy a ticket. Second, I can pause the movie whenever I want. On the other hand, watching at the theater feels more exciting because of the big screen and sound. Still, I usually choose to watch at home.",
  },
  {
    id: "day-25",
    day: 25,
    type: "opinion",
    title: "School Uniforms, Once More",
    topic: "Should schools change the school uniform design?",
    scene: {
      contextJa: "生徒会が制服のデザインを変えるかどうかについてアンケート結果を発表している場面です。",
      intro:
        "Student council report:\nWe asked 100 students about the school uniform. 60 students said they want a new design. 40 students said the current uniform is fine.",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "アンケートで、何人の生徒が新しいデザインを望んでいますか？",
        choices: ["60人", "40人", "100人"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "このアンケートは何について尋ねたものですか？", answerJa: "制服のデザインを変えるべきかどうか" },
    ],
    keyExpressions: [
      { phrase: "According to ~", meaningJa: "~によると(情報の引用)" },
      { phrase: "for example", meaningJa: "例えば", reusedFromDay: 12 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["many students want a new design", "the survey", "According to"],
        correctOrder: [2, 1, 0],
        answer: "According to the survey, many students want a new design.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ the report, 60 percent of students want a change.",
        choices: ["According to", "For example", "In addition"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think the school should ask students ___ they want before making a decision.",
        choices: ["what", "how", "why"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "制服のデザインを変えるべきかどうかを考える問題です。According to~を使って、アンケート結果などの情報を引用しながら意見を述べてみましょう。",
    prompt:
      "Do you think the school should change the uniform design? Use \"According to ~\" to refer to the survey, and give your opinion with a reason.",
    wordCount: { min: 65, max: 95 },
    timeLimit: 12,
    answerExample:
      "According to the survey, 60 students want a new uniform design. In my opinion, the school should consider a change. First, a new design could make students feel more excited about wearing their uniform. Second, styles change over time, so an update seems natural. For these reasons, I think a new design would be a good idea.",
  },
  {
    id: "day-26",
    day: 26,
    type: "email",
    title: "Helping a Friend Decide",
    topic: "Reply to a friend who is asking for help and advice.",
    scene: {
      contextJa:
        "友達のAlexから、進路(部活動を続けるかどうか)について相談のメールが届いた場面です。相談する側と助言する側、両方の表現をまとめて使います。",
      intro:
        "Hi,\nI'm not sure if I should keep playing soccer next year. It takes a lot of time, but I really enjoy it.\nCould you give me some advice? What should I do?\n\nAlex",
    },
    comprehension: [
      { kind: "reveal", questionJa: "Alexは何について悩んでいますか？", answerJa: "来年もサッカーを続けるかどうか" },
      {
        kind: "choice",
        questionJa: "Alexがサッカーを続けることについて感じていることは何ですか？",
        choices: ["時間はかかるが、楽しんでいる", "嫌いになった", "もう飽きた"],
        correctIndex: 0,
      },
    ],
    keyExpressions: [
      { phrase: "Could you ~? / What should I do?", meaningJa: "助けを求める・相談する表現", reusedFromDay: 16 },
      { phrase: "I think you should ~", meaningJa: "~した方がいいと思うよ(助言)", reusedFromDay: 11 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["keep playing soccer", "I think", "you should"],
        correctOrder: [1, 2, 0],
        answer: "I think you should keep playing soccer.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think you ___ keep playing soccer if you really enjoy it.",
        choices: ["should", "is", "did"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "It's a hard choice, ___ I believe you can find time for both.",
        choices: ["but", "because", "so"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "サッカーを続けるか悩んでいるAlexにアドバイスするメールです。Day11で使ったI think you should~を使って、あなたの考えを伝えてみましょう。",
    prompt:
      "Reply to Alex's email. Give him advice about whether to keep playing soccer, using \"I think you should ~\".",
    wordCount: { min: 65, max: 95 },
    timeLimit: 12,
    answerExample:
      "Hi Alex,\n\nThank you for telling me about this. I think you should keep playing soccer, because you said you really enjoy it. You could also try to manage your time better so you don't fall behind on homework. Whatever you decide, I'm sure you'll make the right choice.\n\nBest,\n[Your name]",
  },
  {
    id: "day-27",
    day: 27,
    type: "email",
    title: "Thanking a Friend",
    topic: "Thank a friend for their help or a gift.",
    scene: {
      contextJa: "以前もらったアドバイスや助けに対して、Alexにお礼を伝えるメールを書く場面です。",
      intro: "Kenta: Did you thank Alex for helping you with your problem last week?\nYou: Not yet! I should write to him today.",
    },
    comprehension: [
      { kind: "reveal", questionJa: "あなたは今日何をする必要がありますか？", answerJa: "先週助けてくれたAlexにお礼を伝えること" },
    ],
    keyExpressions: [
      { phrase: "Thank you for ~", meaningJa: "~をありがとう", reusedFromDay: 2 },
      { phrase: "Would you like to ~?", meaningJa: "~しませんか", reusedFromDay: 23 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["your advice", "Thank you for", "last week"],
        correctOrder: [1, 0, 2],
        answer: "Thank you for your advice last week.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Your advice really ___ me feel better.",
        choices: ["helped", "helps", "helping"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ ___ come over this weekend to say thank you properly?",
        choices: ["Would you like to", "Could you", "I'm afraid"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "以前助けてもらったことへのお礼を伝えるメールです。何に感謝しているかを具体的に書き、最後にWould you like to~?で何か誘ってみましょう。",
    prompt:
      "Write an email to Alex to thank him for his advice or help last week. Explain what it helped you with, and invite him to do something using \"Would you like to ~?\".",
    wordCount: { min: 65, max: 95 },
    timeLimit: 12,
    answerExample:
      "Hi Alex,\n\nThank you for your advice last week. It really helped me feel better about my problem, and things are much better now. I'm really glad I talked to you about it. Would you like to hang out this weekend? It would be nice to properly say thank you.\n\nBest,\n[Your name]",
  },
  {
    id: "day-28",
    day: 28,
    type: "opinion",
    title: "The Most Important School Event",
    topic: "Which school event do you think is the most important?",
    scene: {
      contextJa: "学校には文化祭、運動会、遠足などいろいろな行事があります。その中でどれが一番大切かを考える場面です。",
      intro:
        "Ms. Tanaka: We have many school events every year, like the festival, sports day, and the school trip. Which one do you think is the most important?",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "田中先生は何について生徒に聞いていますか？",
        choices: ["一番大切な学校行事はどれか", "一番好きな給食のメニュー", "一番好きな教科"],
        correctIndex: 0,
      },
      {
        kind: "reveal",
        questionJa: "例として挙げられている学校行事を2つ書いてください。",
        answerJa: "文化祭・運動会・遠足のうち2つ(例: 文化祭と運動会)",
      },
    ],
    keyExpressions: [
      { phrase: "In addition, ~", meaningJa: "さらに", reusedFromDay: 19 },
      { phrase: "According to ~", meaningJa: "~によると", reusedFromDay: 25 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["work together as a team", "Sports day", "helps students"],
        correctOrder: [1, 2, 0],
        answer: "Sports day helps students work together as a team.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___ my classmates, the school festival is the most exciting event.",
        choices: ["According to", "In addition", "For example"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "The festival is fun. ___ ___, it lets students show their talents.",
        choices: ["In addition", "According to", "But some"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "学校行事の中で一番大切だと思うものを選ぶ問題です。理由を2つ挙げ、これまで学んだ表現(In addition, According toなど)を自由に組み合わせて使ってみましょう。",
    prompt:
      "Which school event do you think is the most important: the school festival, sports day, or the school trip? Choose one and give two reasons.",
    wordCount: { min: 65, max: 95 },
    timeLimit: 12,
    answerExample:
      "I think sports day is the most important school event. First, it helps students work together as a team through relay races and group activities. In addition, according to my classmates, sports day creates some of our best memories of the year. For these reasons, I believe sports day is the most valuable event for students.",
  },
  {
    id: "day-29",
    day: 29,
    type: "opinion",
    title: "Effort or Talent?",
    topic: "Which do you think is more important, effort or talent?",
    scene: {
      contextJa: "「努力と才能、どちらが大切か」という少し抽象的なテーマについて先輩と後輩が話している場面です。",
      intro:
        "Riku: Some people are just naturally good at things. I think talent matters more.\nEmi: I disagree. I think effort matters more, because even talented people need practice to improve.",
    },
    comprehension: [
      { kind: "choice", questionJa: "Rikuはどちらが大切だと思っていますか？", choices: ["才能", "努力"], correctIndex: 0 },
      {
        kind: "reveal",
        questionJa: "Emiが努力の方が大切だと思う理由は何ですか？",
        answerJa: "才能がある人でも上達するには練習が必要だから",
      },
    ],
    keyExpressions: [
      { phrase: "In the end, ~", meaningJa: "結局のところ、~(結論を導く)" },
      { phrase: "In my opinion / I think", meaningJa: "私は~だと思う", reusedFromDay: 1 },
    ],
    guidedPractice: [
      {
        kind: "wordOrder",
        instruction: "並べ替え",
        tokens: ["matters more than talent", "In the end", "effort"],
        correctOrder: [1, 2, 0],
        answer: "In the end, effort matters more than talent.",
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Talented people still need to practice. ___ ___ ___, effort is important for everyone.",
        choices: ["In the end", "In addition", "According to"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "I think effort is important ___ it helps anyone improve over time.",
        choices: ["because", "but", "so"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "努力と才能、どちらが大切かを考える問題です。難しい表現をたくさん使うことよりも、自分の立場→理由→具体例→結論を意味の通る英文で書くことを大切にしましょう。In the endは結論の一文で使ってみましょう。",
    prompt:
      "Which do you think is more important, effort or talent? Give your opinion with a reason and an example, and use \"In the end\" in your conclusion.",
    wordCount: { min: 65, max: 95 },
    timeLimit: 12,
    answerExample:
      "I think effort is more important than talent. Even talented people need to practice to get better. For example, many famous athletes practice every single day, even after they become successful. In the end, effort is something everyone can control, but talent is not. That is why I believe effort matters more.",
  },
  {
    id: "day-30",
    day: 30,
    type: "opinion",
    title: "The Most Important Skill for Junior High Students",
    topic: "What is the most important skill for junior high school students to learn?",
    scene: {
      contextJa:
        "これまで学んだ表現を自由に使って書く総合復習のDayです。テーマは「中学生にとって一番大切な力は何か」。新しい表現は登場しません。",
      intro:
        "Teacher: You have learned a lot this year — not just school subjects, but also skills like teamwork, time management, and communication. Which skill do you think is the most important for junior high school students?",
    },
    comprehension: [
      {
        kind: "choice",
        questionJa: "先生は生徒たちが学んできたものとして何を挙げていますか？",
        choices: ["教科の勉強だけでなく、チームワークや時間管理などの力", "スポーツの記録", "給食の作り方"],
        correctIndex: 0,
      },
      { kind: "reveal", questionJa: "先生が生徒に考えてほしいと言っていることは何ですか？", answerJa: "中学生にとって一番大切な力は何か" },
    ],
    keyExpressions: [
      { phrase: "In my opinion / I think", meaningJa: "私は~だと思う", reusedFromDay: 1 },
      { phrase: "because / for example", meaningJa: "理由・具体例を述べる表現", reusedFromDay: 1 },
      { phrase: "In the end, ~", meaningJa: "結局のところ", reusedFromDay: 29 },
    ],
    guidedPractice: [
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___, I think communication is the most important skill.",
        choices: ["In my opinion", "According to", "In addition"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "Good communication helps students ___ their ideas clearly.",
        choices: ["share", "shares", "sharing"],
        correctIndex: 0,
      },
      {
        kind: "fillBlank",
        instruction: "空欄補充",
        prompt: "___ ___, every skill we learn in junior high school can help us in the future.",
        choices: ["In the end", "For example", "But some"],
        correctIndex: 0,
      },
    ],
    writingHintJa:
      "これはDay15〜29の総合復習です。難しい表現を使うことが目標ではありません。自分の立場→理由→具体例→結論の順で、意味の通る英文を書くことを一番大切にしてください。表現はこれまで習ったものから自由に選んでかまいません。",
    prompt:
      "What do you think is the most important skill for junior high school students to learn? Give your opinion with a reason and an example, and end with a conclusion.",
    wordCount: { min: 70, max: 100 },
    timeLimit: 13,
    answerExample:
      "In my opinion, communication is the most important skill for junior high school students. First, good communication helps students share their ideas clearly with teachers and friends. For example, working well in group projects becomes much easier when students can explain their thoughts. In the end, no matter what job or path we choose in the future, being able to communicate well will always be useful.",
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
