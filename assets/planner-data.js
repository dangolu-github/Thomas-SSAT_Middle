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
      assigned: { label: '现在完成', tone: 'assigned', checkable: true },
      scheduled: { label: '按日期完成', tone: 'scheduled', checkable: true },
      pending: { label: '完成前置任务后继续', tone: 'pending', checkable: false },
      conditional: { label: '完成复盘后继续', tone: 'conditional', checkable: false }
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
          task('ss-mock-02-0828', '8月28日 周五 · 20:00', 'Mock Exam', 'Mock 2 · 定制 Early Diagnostic', 'assigned', ['输入网站密码后进入完整 Mock 页面。', '试题与 A–E 作答区在同一页面。', 'Reading 1–40：40分钟；Verbal 1–60：30分钟。', '完成后正式提交，成绩稍后查看。'], '../practice/mock-exams/answer-sheet.html?mock=2'),
          task('ss-c05-reading-homework', '8月29日 周六 · 无截止时间', 'Reading 作业', 'Class 05 · The Map in the Hall', 'assigned', ['阅读全文并完成 Q1–Q10。', '每次修改都会自动保存。', '确认答案后点击“提交作业”；提交后自动批改。'], '../practice/class-05-reading/'),
          task('ss-c06-poetry-homework', '8月30日 周日 · 无截止时间', 'Reading 作业', 'Class 06 · Poetry Reading Q1–Q20', 'assigned', ['进入受保护作业页并完成四篇诗歌。', '完成 Q1–Q20，每题选择 A–E。', '答案自动保存为草稿；确认后点击“正式提交作业”。'], '../practice/class-06-poetry/')
        ]
      },
      {
        label: '第3周 · 9月2–8日',
        title: 'Grievance、Chronology 与结构阅读',
        focus: ['词汇：政治与历史语境中的精确词义。', 'Reading：Chronology、Cause and Effect 与 supported inference。', '复盘：只采用文本支持的最小结论，不补入背景结果。'],
        tasks: [
          task('ss-vocab-0903', '9月2日 周三 · 无截止时间', '生词本', '整理 9月2日历史阅读新增词汇', 'assigned', ['复习课堂总结中的新增词汇。', '注意 measure / policy、right / power 与 adopt 的语境义。', '与 handout Vocabulary Bridge 的 12 个词去重。'], '../2026-09-02/class-summary.html'),
          task('ss-c07-reading-homework', '9月2日 周三 · 无截止时间', 'Reading 作业', 'Class 07 · From Grievance to Declaration', 'assigned', ['阅读四段文章并完成 Q1–Q10。', '每题选择 A–E，只使用文章证据。', '自动保存只是草稿；确认后点击“正式提交作业”。'], '../practice/class-07-reading/'),
          task('ss-practice-verbal-0904', '9月6日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 复习', 'pending', ['先复习本周 Verbal 方法，并整理生词本。']),
          task('ss-vocab-0906', '9月5日 周六 · 课后 20:00前', '生词本', '录入 9月5日 Reading 课堂生词', 'scheduled', ['整理课堂生词并去重。']),
          task('ss-vocab-0907', '9月6日 周日 · 课后 20:00前', '生词本', '录入 9月6日复盘课生词', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-0907', '9月6日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-0908', '9月6日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 复习', 'pending', ['先复习本周 Reading 方法。'])
        ]
      },
      {
        label: '第4周 · 9月9–15日',
        title: 'Belonging、Language Use 与 Mock 3',
        focus: ['Verbal：Analogies 常见关系家族。', 'Reading：词句在上下文中的作用；跨文化 friendship。', '复盘：遗漏、二选一和关系误判。'],
        tasks: [
          task('ss-c11-reading-0912', '9月12日课堂作业 · 无截止日期', 'Reading Homework', 'Plastic in the Environment', 'assigned', ['完成完整文章、阅读短练习、七道选择题和一句总结。', '不限时；完成后点击正式提交作业。'], '../practice/class-11-reading/'),
          task('ss-mock-03-0911', '9月11日 周五 · 20:00', 'Mock Exam', 'Mock 3 · 定制 Mid-course Transfer', 'scheduled', ['输入网站密码后进入完整 Mock 页面。', '试题与 A–E 作答区在同一页面。', 'Reading 1–40：40分钟；Verbal 1–60：30分钟。', '完成后正式提交，成绩稍后查看。'], '../practice/mock-exams/answer-sheet.html?mock=3')
        ]
      },
      {
        label: '第5周 · 9月16–22日',
        title: 'Risk、Conflict 与 Community',
        focus: ['Verbal：Synonyms nuance、connotation 与程度。', 'Reading：灾难中的 risk、conflict、community response 与 tone。', '复盘：字面意思、表达效果和态度分开。'],
        tasks: [
          task('ss-vocab-0917', '9月16日 周三 · 课后 21:00前', '生词本', '录入 9月16日 Verbal 课堂生词', 'scheduled', ['加入近义词差别和主题词。']),
          task('ss-practice-verbal-0918', '9月20日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 复习', 'pending', ['先复习本周课堂笔记，再继续练习。']),
          task('ss-vocab-0920', '9月19日 周六 · 课后 20:00前', '生词本', '录入 9月19日 Reading 课堂生词', 'scheduled', ['整理课堂与已布置作业中的生词。']),
          task('ss-vocab-0921', '9月20日 周日 · 课后 20:00前', '生词本', '录入 9月20日复盘课生词并去重', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-0921', '9月20日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-0922', '9月20日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 复习', 'pending', ['先复习本周课堂笔记，再继续练习。'])
        ]
      },
      {
        label: '第6周 · 9月23–29日',
        title: 'Ambition、Responsibility 与人物变化',
        focus: ['Verbal：Analogies 难关系与同主题假关系。', 'Reading：人物目标、family、responsibility 与 community support。', '复盘：只处理已经提交并检查的本周错题。'],
        tasks: [
          task('ss-vocab-0924', '9月23日 周三 · 课后 21:00前', '生词本', '录入 9月23日 Verbal 课堂生词', 'scheduled', ['加入抽象关系词和主题词。']),
          task('ss-vocab-0927', '9月26日 周六 · 课后 20:00前', '生词本', '录入 9月26日 Reading 课堂生词', 'scheduled', ['整理课堂生词。']),
          task('ss-vocab-0928', '9月27日 周日 · 课后 20:00前', '生词本', '录入 9月27日复盘课生词并去重', 'scheduled', ['只保留仍需复习的词。']),
          task('ss-mistake-0928', '9月27日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/')
        ]
      },
      {
        label: '第7周 · 9月30日–10月6日',
        title: 'Narrator、Justice 与 Power',
        focus: ['Verbal：Synonyms / Analogies 流程切换。', 'Reading：narrator、motivation、justice、power 与 tone。', '复盘：把人物判断和文本证据分开。'],
        tasks: [
          task('ss-vocab-1001', '9月30日 周三 · 课后 21:00前', '生词本', '录入 9月30日 Verbal 课堂生词', 'scheduled', ['加入流程切换和主题词。']),
          task('ss-practice-verbal-1002', '10月4日 周日 · 10:00课前', 'Verbal 练习', '本周 Verbal 复习', 'pending', ['先复习本周课堂笔记，再继续练习。']),
          task('ss-vocab-1004', '10月3日 周六 · 课后 20:00前', '生词本', '录入 10月3日 Reading 课堂生词', 'scheduled', ['整理课堂生词。']),
          task('ss-vocab-1005', '10月4日 周日 · 课后 20:00前', '生词本', '录入 10月4日复盘课生词并去重', 'scheduled', ['保留仍不稳定的词。']),
          task('ss-mistake-1005', '10月4日 周日 · 10:00课前', '错题汇总', '汇总本周已提交练习的错因', 'scheduled', ['只处理已经提交后出现的错题。'], '../review/mistake-log/'),
          task('ss-practice-reading-1006', '10月4日 周日 · 10:00课前', 'Reading 练习', '本周 Reading 复习', 'pending', ['先复习本周课堂笔记，再继续练习。'])
        ]
      },
      {
        label: '第8周 · 10月7–13日',
        title: '旧式 Diction、人物声音与 Mock 4',
        focus: ['Verbal：速度、精度与最后两项排除。', 'Reading：较旧 diction、人物声音、家庭关系与社会期待。', '复盘：依据 Mock 4 与前三轮已检查记录形成最后修复清单。'],
        tasks: [
          task('ss-mock-04-1008', '10月8日 周四 · 20:00', 'Mock Exam', 'Mock 4 · 定制 Final Comprehensive', 'scheduled', ['输入网站密码后进入完整 Mock 页面。', '试题与 A–E 作答区在同一页面。', 'Reading 1–40：40分钟；Verbal 1–60：30分钟。', '完成后正式提交，成绩稍后查看。'], '../practice/mock-exams/answer-sheet.html?mock=4')
        ]
      },
      {
        label: '第9周 · 10月14–20日',
        title: 'Atmosphere、Symbolism 与个人高频错因',
        focus: ['Verbal：只修最高频的决策错误。', 'Reading：setting、atmosphere、conflict、symbolism、foreshadowing。', '复盘：确认仍未修复的 Reading / Verbal 错因。'],
        tasks: [
          task('ss-vocab-1015', '10月14日 周三 · 课后 21:00前', '生词本', '录入 10月14日 Verbal 课堂生词', 'scheduled', ['只加入仍会影响判断的词。']),
          task('ss-practice-verbal-1016', '10月18日 周日 · 10:00课前', 'Verbal 练习', '个人 Verbal 高频错因复习', 'pending', ['先整理最新错题，再完成同类练习。']),
          task('ss-vocab-1018', '10月17日 周六 · 课后 20:00前', '生词本', '录入 10月17日 Reading 课堂生词', 'scheduled', ['整理课堂生词。']),
          task('ss-vocab-1019', '10月18日 周日 · 课后 20:00前', '生词本', '录入 10月18日总复盘课生词并去重', 'scheduled', ['只保留个人高频词。']),
          task('ss-mistake-final-1019', '10月18日 周日 · 10:00课前', '错题汇总', '确认尚未修复的高频错因', 'scheduled', ['检查 Reading 与 Verbal。', '只保留仍需要处理的项目。'], '../review/mistake-log/')
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
