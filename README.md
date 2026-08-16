# Thomas SSAT Student Portal

Learner portal for Thomas's Middle Level SSAT course.

## Current state

- Learner-safe source is maintained inside the private `teaching_projects_workbase` repository and published from the public learner-only `Thomas-SSAT_Middle` deployment mirror.
- The Trial Class handout, six-question Reading follow-up, and first 30-question Synonym/Analogy homework are the current release unit.
- Homework drafts and deliberate final submissions use a Thomas-only Apps Script service. The service does not return answers or correctness.
- The Chinese-first parent planner contains 30 dated sessions through the 2026-10-23 exam. Every checkbox is saved locally and synchronized as planner progress to the Thomas-only service.
- The public source contains no private answer keys, teacher notes, learner records, storage identifiers, credentials, local paths, or another learner's data.

## Information architecture

- `index.html`: date-first class logbook and course home.
- `learning/`: Reading, Verbal, and Writing Sample system.
- `practice/`: active assignments, timed checks, and mock routes.
- `review/`: checked review and retry route.
- `planner/`: ten-week, thirty-session Chinese parent plan with exact tasks, dates, and synchronized checkmarks.
- `assets/`: shared visual tokens and interaction behavior.

The structure mirrors the approved SAT portal information architecture, but all Thomas content, IDs, state, and services remain independent.

## Publication boundary

This repository is learner-facing only. Private teacher artifacts, answers, controls, responses, and evidence stay in authenticated or local private storage. The requested access word is implemented only as a static convenience gate and is not confidential authentication.
