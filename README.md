# Thomas SSAT Student Portal

Learner portal for Thomas's Middle Level SSAT course.

## Current state

- Learner-safe source is maintained inside the private `teaching_projects_workbase` repository and published from the public learner-only `Thomas-SSAT_Middle` deployment mirror.
- The completed Trial Class handout, learner-facing class log, class review, six-question Reading follow-up, and first 30-question Synonym/Analogy homework are the current release unit.
- Trial Class records and homework show `Week 0`, `Class 00`, and the evidence-safe course-date value `待确认` until the actual lesson date is confirmed.
- Homework drafts and deliberate final submissions use a Thomas-only Apps Script service. The service does not return answers or correctness.
- The Chinese-first self-study planner contains 68 dated actions through the 2026-10-23 exam. Its 56 available checkboxes cover assigned/scheduled reading, vocabulary, homework, Mock, mistake review, and exam preparation; 12 future/conditional tasks remain disabled.
- Planner items distinguish `当前已布置`, `已安排`, `待发布`, and `按错题开放`. Every action has an exact due time and bullet-point requirements.
- Reading Skill Booster provides nine exact reading assignments plus one exam-week concept review without copying protected text.
- Three Reading + Verbal Mock answer sheets provide 40/30-minute timers and deliberate final submission. Public files contain no questions or keys.
- Final homework and Mock submissions generate minimal learner-visible wrong/omitted records. The private Teacher Portal retains choices and keys; cognitive causes remain `待确认` until selected.
- The public source contains no private answer keys, teacher notes, learner records, storage identifiers, credentials, local paths, or another learner's data.

## Information architecture

- `index.html`: date-first class logbook and course home.
- `learning/`: Reading, Verbal, Writing Sample, and Reading Skill Booster.
- `practice/`: active assignments plus three protected-source Mock answer sheets.
- `review/`: classroom review plus the final-submit Mistake Log.
- `planner/`: ten-week Chinese self-study plan with weekly focus bullets, exact deadlines, explicit states, and saved checkmarks.
- `assets/`: shared visual tokens and interaction behavior.

The structure mirrors the approved SAT portal information architecture, but all Thomas content, IDs, state, and services remain independent.

## Publication boundary

This repository is learner-facing only. Private teacher artifacts, answers, controls, responses, and evidence stay in authenticated or local private storage. The requested access word is implemented only as a static convenience gate and is not confidential authentication.
