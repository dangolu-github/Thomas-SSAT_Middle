(function () {
  'use strict';

  var endpoint = 'https://script.google.com/macros/s/AKfycbzF6aQZPpbL34Of--5r8zRZGI8Av2e8zTp11D_w820I9fNzLEAyY_YtvzLZ0-OVPFFw/exec';
  function task(id, date, type, title, state, bullets, href, resources) {
    return { id: id, date: date, type: type, title: title, state: state, bullets: bullets, href: href || '', resources: resources || [] };
  }

  window.THOMAS_SELF_STUDY = {
    id: 'THO-SSAT-PARENT-PLAN-2026-10-23',
    endpoint: endpoint,
    examDate: '2026年10月23日',
    states: {
      assigned: { label: '当前已布置', tone: 'assigned', checkable: true },
      scheduled: { label: '已安排', tone: 'scheduled', checkable: true },
      pending: { label: '待发布', tone: 'pending', checkable: false },
      conditional: { label: '按错题开放', tone: 'conditional', checkable: false }
    },
    readingLinks: {
      road: 'https://www.gutenberg.org/cache/epub/29345/pg29345-images.html#THE_ROAD_NOT_TAKEN',
      roadAcademy: 'https://poets.org/poem/road-not-taken',
      roll: 'https://www.penguinrandomhouse.com/books/320401/roll-of-thunder-hear-my-cry-by-mildred-d-taylor/',
      littleWomen: 'https://www.gutenberg.org/ebooks/514'
    },
    weeks: [
      {
        label: '第1周 · 8月19–25日',
        title: 'Choice、Authorial Intent 与诗歌多义',
        focus: ['Verbal：Synonyms 核心义、词性与跳题。', 'Reading：Authorial Intent；speaker、choice、ambiguity 与 tone。', '复盘：只处理已经提交的 Trial Reading 错题。'],
        tasks: [
          task('ss-vocab-0820', '8月19日 周三 · 课后 21:00前', '生词本', '录入 8月19日 Verbal 课堂生词', 'scheduled', ['加入课堂中不认识或不确定的词。', '只处理这次课堂内容。']),
          task('ss-read-road-0821', '8月22日 周六 · 14:00课前', 'Reading Skill Booster', 'The Road Not Taken · 全诗', 'scheduled', ['在 Reading Skill Booster 页面展开并阅读全诗。', '关注 speaker、imagery、choice、ambiguity、tone。', '标出不认识或不确定的词；不要求逐段笔记。'], '../learning/reading-booster/#road-not-taken', [{ label: 'Project Gutenberg 全文', href: 'https://www.gutenberg.org/cache/epub/29345/pg29345-images.html#THE_ROAD_NOT_TAKEN' }, { label: 'Academy 参考页', href: 'https://poets.org/poem/road-not-taken' }]),
          task('ss-c02-poetry-q1-10-0823', 'Class 02 + Class 03', 'Reading 作业', 'Poetry Reading · Q1–Q20', 'assigned', ['完成 Reading 1：The Road Not Taken Q1–Q10。', '完成 Reading 2：In the Garden Q11–Q20。', '在同一答题窗口记录每题 A–E。', '确认 20 题答案后点击“提交作业”。'], '../practice/class-02-poetry/'),
          task('ss-c01-verbal-open', '8月23日 周日 · 10:00课前', 'Verbal 作业', 'Class 01 · Choice, Judgment, and Responsibility', 'assigned', ['完成 Synonyms Q1–15。', '完成 Analogies Q1–15。', '预计 30 分钟；在作业页面提交。', '将不认识或不确定的词加入生词本。'], '../practice/class-01-verbal/'),
          task('ss-c01-reading-open', '8月23日 周日 · 10:00课前', 'Reading 作业', 'Class 01 · The Shortcut at the Exhibit', 'assigned', ['阅读全文并完成 Q1–Q10。', '预计 25 分钟；在作业页面提交。', '将不认识或不确定的词加入生词本。'], '../practice/class-01-reading/'),
          task('ss-hm-verbal-syn-0821', '8月23日 周日 · 10:00课前', 'Verbal 作业', 'Verbal Homework 1 · Synonyms Q1–15', 'assigned', ['完成 Q1–15。', '本次保存进度；Q16–30 完成后再提交整份作业。'], '../practice/verbal-homework-1/'),
          task('ss-vocab-0823', '8月22日 周六 · 课后 20:00前', '生词本', '录入 8月22日 Reading 与诗歌生词', 'scheduled', ['合并课堂与本周指定阅读中的生词。', '删除重复词。']),
          task('ss-vocab-0824', '8月23日 周日 · 课后 20:00前', '生词本', '录入 8月23日复盘课生词', 'scheduled', ['加入复盘课中仍不确定的词。', '与本周已有词条去重。']),
          task('ss-hm-reading-0825', '8月23日 周日 · 10:00课前', 'Reading 作业', 'Trial Reading · Q3–Q8', 'assigned', ['完成 Reading 1 Q3–Q4。', '完成 Reading 2 Q5–Q8。', '点击“提交作业”。'], '../trial-class/reading-homework.html'),
          task('ss-mistake-0825', '8月23日 周日 · 10:00课前', '错题汇总', '确认本周已提交作业的错因', 'scheduled', ['打开错题本。', '有错题时选择原因；没有错题时直接核对记录。'], '../review/mistake-log/')
        ]
      },
      {
        label: '第2周 · 8月26日–9月1日',
        title: 'Identity、Belonging 与第一轮新 Mock',
        focus: ['Verbal：Analogies bridge、方向与强弱。', 'Reading：Inference 的最小证据边界；人物身份与归属。', '复盘：Mock 2 的 wrong / omitted 与确认错因。'],
        tasks: [
          task('ss-vocab-0827', '8月26日 周三 · 课后 21:00前', '生词本', '录入 8月26日 Verbal 课堂生词', 'scheduled', ['加入课堂和 Verbal Homework 1 中不认识或不确定的词。']),
          task('ss-read-dragon-01-0827', '8月29日 周六 · 14:00课前', 'Reading Skill Booster', 'Dragonwings · Chapter 1', 'scheduled', ['使用授权版本阅读 Chapter 1。', '关注 Moon Shadow 的 identity，以及想象与现实中的 belonging。'], '../learning/reading-booster/#ss-read-dragon-01-0827'),
          task('ss-hm-verbal-submit-0827', '8月30日 周日 · 10:00课前', 'Verbal 作业', 'Verbal Homework 1 · Analogies Q16–30', 'assigned', ['完成 Q16–30。', '核对 Q1–15 已保存后，提交整份 30 题作业。'], '../practice/verbal-homework-1/'),
          task('ss-mock-02-0828', '8月28日 周五 · 20:00', 'Mock Exam', 'Mock 2 · Tutorverse Diagnostic Form A', 'scheduled', ['使用老师提供的试卷。', 'Reading 1–40：40分钟。', 'Verbal 1–60：30分钟。', '在网站答题卡正式提交。'], '../practice/mock-exams/answer-sheet.html?mock=2'),
          task('ss-vocab-0830', '8月29日 周六 · 课后 20:00前', '生词本', '录入 8月29日 Reading 课堂生词', 'scheduled', ['合并课堂、Chapter 1 与 Mock 2 中不确定的词。']),
          task('ss-vocab-0831', '8月30日 周日 · 课后 20:00前', '生词本', '录入 8月30日复盘课生词并去重', 'scheduled', ['只保留仍需复习的词。']),
          task('ss-mistake-mock2-0831', '8月30日 周日 · 10:00课前', '错题汇总', '确认 Mock 2 错因', 'scheduled', ['逐项查看 wrong / omitted。', '把“待确认”改为最符合的原因。'], '../review/mistake-log/'),
          task('ss-repair-mock2-0901', '8月30日 周日 · 课后按材料开放', '错题巩固', 'Mock 2 同类巩固', 'conditional', ['同类题发布后开放。', '没有发布材料时不自行找替代题。'], '../review/mistake-log/')
        ]
      },
      {
        label: '第3周 · 9月2–8日',
        title: 'Ambition、Invention 与结构阅读',
        focus: ['Verbal：morphology、词性与可验证的排除。', 'Reading：Main Idea、Passage Structure；ambition 与 invention。', '复盘：方法错误与知识缺口分开记录。'],
        tasks: [
          task('ss-vocab-0903', '9月2日 周三 · 课后 21:00前', '生词本', '录入 9月2日 Verbal 课堂生词', 'scheduled', ['加入课堂中的词根、词缀和主题词。']),
          task('ss-read-dragon-03-0904', '9月5日 周六 · 14:00课前', 'Reading Skill Booster', 'Dragonwings · Chapter 3', 'scheduled', ['使用授权版本阅读 Chapter 3。', '关注 Windrider 的 ambition、invention 与父子关系。'], '../learning/reading-booster/#ss-read-dragon-03-0904'),
          task('ss-practice-verbal-0904', '9月6日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 练习', 'pending', ['材料发布后在这里显示。', '当前不需要自行找题。']),
          task('ss-vocab-0906', '9月5日 周六 · 课后 20:00前', '生词本', '录入 9月5日 Reading 与 Chapter 3 生词', 'scheduled', ['合并课堂与章节生词并去重。']),
          task('ss-vocab-0907', '9月6日 周日 · 课后 20:00前', '生词本', '录入 9月6日复盘课生词', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-0907', '9月6日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-0908', '9月6日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 练习', 'pending', ['材料发布后开放。', '当前不需要自行找题。'])
        ]
      },
      {
        label: '第4周 · 9月9–15日',
        title: 'Belonging、Language Use 与 Mock 3',
        focus: ['Verbal：Analogies 常见关系家族。', 'Reading：词句在上下文中的作用；跨文化 friendship。', '复盘：遗漏、二选一和关系误判。'],
        tasks: [
          task('ss-vocab-0910', '9月9日 周三 · 课后 21:00前', '生词本', '录入 9月9日 Verbal 课堂生词', 'scheduled', ['加入关系词与主题词。']),
          task('ss-read-dragon-07-0910', '9月12日 周六 · 14:00课前', 'Reading Skill Booster', 'Dragonwings · Chapter 7', 'scheduled', ['使用授权版本阅读 Chapter 7。', '关注学习、发明、friendship 与 belonging 的变化。'], '../learning/reading-booster/#ss-read-dragon-07-0910'),
          task('ss-mock-03-0911', '9月11日 周五 · 20:00', 'Mock Exam', 'Mock 3 · Ivy Global Test 1', 'scheduled', ['从 Ivy 页面取得试卷。', 'Section 2 Reading：40分钟。', 'Section 3 Verbal：30分钟。', '在网站答题卡正式提交。'], '../practice/mock-exams/answer-sheet.html?mock=3'),
          task('ss-vocab-0913', '9月12日 周六 · 课后 20:00前', '生词本', '录入 9月12日 Reading 课堂生词', 'scheduled', ['合并课堂、Chapter 7 与 Mock 3 生词。']),
          task('ss-vocab-0914', '9月13日 周日 · 课后 20:00前', '生词本', '录入 9月13日复盘课生词并去重', 'scheduled', ['只保留仍需复习的词。']),
          task('ss-mistake-mock3-0914', '9月13日 周日 · 10:00课前', '错题汇总', '确认 Mock 3 错因', 'scheduled', ['逐项查看 wrong / omitted。', '确认每条错因。'], '../review/mistake-log/'),
          task('ss-repair-mock3-0915', '9月13日 周日 · 课后按材料开放', '错题巩固', 'Mock 3 同类巩固', 'conditional', ['同类题发布后开放。'], '../review/mistake-log/')
        ]
      },
      {
        label: '第5周 · 9月16–22日',
        title: 'Risk、Conflict 与 Community',
        focus: ['Verbal：Synonyms nuance、connotation 与程度。', 'Reading：灾难中的 risk、conflict、community response 与 tone。', '复盘：字面意思、表达效果和态度分开。'],
        tasks: [
          task('ss-vocab-0917', '9月16日 周三 · 课后 21:00前', '生词本', '录入 9月16日 Verbal 课堂生词', 'scheduled', ['加入近义词差别和主题词。']),
          task('ss-read-dragon-09-10-0918', '9月19日 周六 · 14:00课前', 'Reading Skill Booster', 'Dragonwings · Chapters 9–10', 'scheduled', ['使用授权版本阅读 Chapters 9–10。', '关注 earthquake、risk、conflict 与 community response。'], '../learning/reading-booster/#ss-read-dragon-09-10-0918'),
          task('ss-practice-verbal-0918', '9月20日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 练习', 'pending', ['材料发布后开放。']),
          task('ss-vocab-0920', '9月19日 周六 · 课后 20:00前', '生词本', '录入 9月19日 Reading 与章节生词', 'scheduled', ['合并课堂与阅读生词。']),
          task('ss-vocab-0921', '9月20日 周日 · 课后 20:00前', '生词本', '录入 9月20日复盘课生词并去重', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-0921', '9月20日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-0922', '9月20日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 练习', 'pending', ['材料发布后开放。'])
        ]
      },
      {
        label: '第6周 · 9月23–29日',
        title: 'Ambition、Responsibility 与 Mock 4',
        focus: ['Verbal：Analogies 难关系与同主题假关系。', 'Reading：人物目标、family、responsibility 与 community support。', '复盘：比较 Mock 2–4 的重复错因。'],
        tasks: [
          task('ss-vocab-0924', '9月23日 周三 · 课后 21:00前', '生词本', '录入 9月23日 Verbal 课堂生词', 'scheduled', ['加入抽象关系词和主题词。']),
          task('ss-read-dragon-12-0924', '9月26日 周六 · 14:00课前', 'Reading Skill Booster', 'Dragonwings · Chapter 12', 'scheduled', ['使用授权版本阅读 Chapter 12。', '关注 ambition、family、responsibility 与 community support。'], '../learning/reading-booster/#ss-read-dragon-12-0924'),
          task('ss-mock-04-0925', '9月25日 周五 · 20:00', 'Mock Exam', 'Mock 4 · Tutorverse Final Form B', 'scheduled', ['使用老师提供的试卷。', 'Reading 1–40：40分钟。', 'Verbal 1–60：30分钟。', '在网站答题卡正式提交。'], '../practice/mock-exams/answer-sheet.html?mock=4'),
          task('ss-vocab-0927', '9月26日 周六 · 课后 20:00前', '生词本', '录入 9月26日 Reading 课堂生词', 'scheduled', ['合并课堂、Chapter 12 与 Mock 4 生词。']),
          task('ss-vocab-0928', '9月27日 周日 · 课后 20:00前', '生词本', '录入 9月27日复盘课生词并去重', 'scheduled', ['只保留仍需复习的词。']),
          task('ss-mistake-mock4-0928', '9月27日 周日 · 10:00课前', '错题汇总', '确认 Mock 4 错因', 'scheduled', ['逐项查看 wrong / omitted。', '比较 Mock 2–4 的重复错误。'], '../review/mistake-log/'),
          task('ss-repair-mock4-0929', '9月27日 周日 · 课后按材料开放', '错题巩固', 'Mock 4 同类巩固', 'conditional', ['同类题发布后开放。'], '../review/mistake-log/')
        ]
      },
      {
        label: '第7周 · 9月30日–10月6日',
        title: 'Narrator、Justice 与 Power',
        focus: ['Verbal：Synonyms / Analogies 流程切换。', 'Reading：narrator、motivation、justice、power 与 tone。', '复盘：把人物判断和文本证据分开。'],
        tasks: [
          task('ss-vocab-1001', '9月30日 周三 · 课后 21:00前', '生词本', '录入 9月30日 Verbal 课堂生词', 'scheduled', ['加入流程切换和主题词。']),
          task('ss-read-roll-01-1002', '10月3日 周六 · 14:00课前', 'Reading Skill Booster', 'Roll of Thunder, Hear My Cry · Chapter 1', 'scheduled', ['使用授权版本阅读 Chapter 1。', '关注 narrator、motivation、justice、power、tone。'], '../learning/reading-booster/#ss-read-roll-01-1002'),
          task('ss-practice-verbal-1002', '10月4日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 练习', 'pending', ['材料发布后开放。']),
          task('ss-vocab-1004', '10月3日 周六 · 课后 20:00前', '生词本', '录入 10月3日 Reading 与章节生词', 'scheduled', ['合并课堂与 Chapter 1 生词。']),
          task('ss-vocab-1005', '10月4日 周日 · 课后 20:00前', '生词本', '录入 10月4日复盘课生词并去重', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-1005', '10月4日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-1006', '10月4日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 练习', 'pending', ['材料发布后开放。'])
        ]
      },
      {
        label: '第8周 · 10月7–13日',
        title: '旧式 Diction、人物声音与社会关系',
        focus: ['Verbal：速度、精度与最后两项排除。', 'Reading：较旧 diction、人物声音、家庭关系与社会期待。', '复盘：比较 narrator、tone 与文体差异。'],
        tasks: [
          task('ss-vocab-1008', '10月7日 周三 · 课后 21:00前', '生词本', '录入 10月7日 Verbal 课堂生词', 'scheduled', ['加入个人易混词和主题词。']),
          task('ss-read-little-women-1009', '10月10日 周六 · 14:00课前', 'Reading Skill Booster', 'Little Women · Chapters 1–2', 'scheduled', ['从 Project Gutenberg 阅读 Chapters 1–2。', '关注较旧 diction、人物声音、家庭关系与社会期待。'], '../learning/reading-booster/#ss-read-little-women-1009'),
          task('ss-practice-verbal-1009', '10月11日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 练习', 'pending', ['材料发布后开放。']),
          task('ss-vocab-1011', '10月10日 周六 · 课后 20:00前', '生词本', '录入 10月10日 Reading 与章节生词', 'scheduled', ['合并课堂与 Chapters 1–2 生词。']),
          task('ss-vocab-1012', '10月11日 周日 · 课后 20:00前', '生词本', '录入 10月11日复盘课生词并去重', 'scheduled', ['只复习仍不稳定的词。']),
          task('ss-mistake-1012', '10月11日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['同时检查 Mock 1–4 的重复错因。'], '../review/mistake-log/'),
          task('ss-practice-reading-1013', '10月11日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 练习', 'pending', ['材料发布后开放。'])
        ]
      },
      {
        label: '第9周 · 10月14–20日',
        title: 'Atmosphere、Symbolism 与个人高频错因',
        focus: ['Verbal：只修最高频的决策错误。', 'Reading：setting、atmosphere、conflict、symbolism、foreshadowing。', '复盘：确认仍未修复的 Reading / Verbal 错因。'],
        tasks: [
          task('ss-vocab-1015', '10月14日 周三 · 课后 21:00前', '生词本', '录入 10月14日 Verbal 课堂生词', 'scheduled', ['只加入仍会影响判断的词。']),
          task('ss-read-dark-01-03-1016', '10月17日 周六 · 14:00课前', 'Reading Skill Booster', 'The Dark Is Rising · Chapters 1–3', 'scheduled', ['使用授权版本阅读 Chapters 1–3。', '关注 setting、atmosphere、conflict、symbolism、foreshadowing。'], '../learning/reading-booster/#ss-read-dark-01-03-1016'),
          task('ss-practice-verbal-1016', '10月18日 周日 · 10:00课前', 'Verbal 练习', '个人 Verbal 高频错因练习', 'pending', ['按最新错题发布。']),
          task('ss-vocab-1018', '10月17日 周六 · 课后 20:00前', '生词本', '录入 10月17日 Reading 与章节生词', 'scheduled', ['合并课堂与 Chapters 1–3 生词。']),
          task('ss-vocab-1019', '10月18日 周日 · 课后 20:00前', '生词本', '录入 10月18日总复盘课生词并去重', 'scheduled', ['只保留个人高频词。']),
          task('ss-mistake-final-1019', '10月18日 周日 · 10:00课前', '错题汇总', '确认尚未修复的高频错因', 'scheduled', ['检查 Reading 与 Verbal。', '只保留仍需要处理的项目。'], '../review/mistake-log/'),
          task('ss-reading-review-1020', '10月18日 周日 · 10:00课前', 'Reading Skill Booster', '文学概念回顾', 'scheduled', ['不读新章节。', '回看 speaker / narrator、tone、motivation、setting、symbolism 的已读例子。'], '../learning/reading-booster/#ss-reading-review-1020')
        ]
      },
      {
        label: '考试周 · 10月21–23日',
        title: '减量、归因、停止新题',
        focus: ['不讲新知识，不增加新阅读。', '只回看个人高频词、错因与节奏。', '10月22日 20:30 后停止新题。'],
        tasks: [
          task('ss-vocab-1021', '10月21日 周三 · 课后 21:00前', '生词本', '录入最后一节巩固课中仍不确定的词', 'scheduled', ['不扩大词表。', '只补真正影响判断的词。']),
          task('ss-vocab-review-1022', '10月22日 周四 · 12:00', '生词本', '复习个人高频词与错因清单', 'scheduled', ['不加入新词。', '只回看已有高频词。']),
          task('ss-mistake-check-1022', '10月22日 周四 · 20:00', '错题汇总', '检查所有作业与 Mock 错题是否已归因', 'scheduled', ['仍是“待确认”的项目逐条处理。', '不再增加新的巩固题。'], '../review/mistake-log/'),
          task('ss-exam-ready-1022', '10月22日 周四 · 20:30', '考前准备', '停止新题并确认考试安排', 'scheduled', ['确认考试物品与到场时间。', '停止新阅读、新词和新练习。'])
        ]
      }
    ]
  };
}());
