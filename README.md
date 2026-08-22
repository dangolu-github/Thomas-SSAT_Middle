# Thomas SSAT Student Portal

Learner portal for Thomas's Middle Level SSAT course.

## Current state

- Learner-safe source is maintained inside the private `teaching_projects_workbase` repository and published from the public learner-only `Thomas-SSAT_Middle` deployment mirror.
- The current release includes the completed Trial Class unit and Class 01 (2026-08-19): the taught-boundary handout, Chinese class summary, 30-question thematic Verbal homework, and ten-question `The Shortcut at the Exhibit` Reading homework.
- Trial Class records and homework show `Week 0`, `Class 00`, and the evidence-safe course-date value `待确认` until the actual lesson date is confirmed.
- Homework drafts and deliberate final submissions use a Thomas-only Apps Script service. The service does not return answers or correctness. When correction is enabled, the first submission remains immutable and correction is stored as a separate attempt.
- The Chinese-first self-study planner contains the course-linked actions through the 2026-10-23 exam. The two Class 01 assignments are due 2026-08-23 at 10:00 before the Sunday Review Class; other scheduled actions retain their stated dates.
- Planner items distinguish `当前已布置`, `已安排`, `待发布`, and `按错题开放`. Each action has bullet-point requirements and an exact due time. Unless Lucy sets another deadline, class-assigned homework is due before the same week's Sunday Review Class at 10:00.
- Reading Skill Booster provides nine exact reading assignments plus one exam-week concept review. The public-domain poem `The Road Not Taken` is available in an attributed native toggle; protected novel text remains external to the portal.
- Three Reading + Verbal Mock answer sheets provide 40/30-minute timers and deliberate final submission. Public files contain no questions or keys.
- Final homework and Mock submissions generate minimal learner-visible wrong/omitted records. The private Teacher Portal retains choices and keys; cognitive causes remain `待确认` until selected.
- Released handouts can display published classroom highlights, underlines, and text comments. The learner view is read-only and shows nothing until a classroom-annotation version is explicitly released.
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
