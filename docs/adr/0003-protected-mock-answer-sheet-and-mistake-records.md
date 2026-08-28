# ADR 0003: Authenticated integrated mock and mark release

## Status

Accepted on 2026-08-19; revised on 2026-08-26 when authenticated protected delivery became available.

## Context

Thomas needs dated Reading + Verbal mocks, automatic scoring, and a mistake log. The selected practice tests are protected third-party materials. The public learner portal uses a static convenience gate and cannot protect question text, answer keys, explanations, local paths, or teacher notes.

## Decision

- Keep the public repository limited to learner-safe Mock metadata and a launcher.
- Deliver each Mock only after separate server authentication.
- Display each protected source-page image and its A-E response controls in the same question block. Do not make the learner switch between a question file and a separate answer sheet.
- Preserve the Reading 1-40 / 40-minute and Verbal 1-60 / 30-minute section structure and require a deliberate final submit.
- Keep keys and exact source locators in the private Apps Script assignment registry.
- Score the final submission on the private server. Return no item keys, explanations, protected prompt, or teacher note.
- Hold the aggregate mark by default. The owner-only Teacher Portal provides `Release mark` and `Do not release`; only the released state exposes correct, incorrect, omitted, raw penalty, and accuracy to the learner.
- Generate Mistake Records only after final submission. Keep cognitive cause as `待确认` until a person selects it.
- Publish a Repair Task only after a source-backed similar-practice set exists.

## Consequences

- The authenticated Mock service reuses the existing Thomas website password; there is no separate Mock access code. Because the public site and Apps Script use different origins, the learner may be asked to enter that same password again.
- The static `yang` gate never becomes the security boundary for commercial content.
- Anonymous requests receive no protected page payload.
- Draft autosave remains separate from submission and cannot create a checked mistake.
- Automatic grading does not create an official SSAT scaled score or percentile because the forms are custom composites.
- Upload and publication do not make a scheduled Mock assigned, attempted, checked, or mastered.

## Alternatives rejected

- Upload or embed PDFs in the public repository. Rejected because the static gate is not confidential access control and at least one source prohibits redistribution.
- Keep a public answer sheet separate from a privately delivered PDF. Rejected because it creates avoidable page switching and does not meet the integrated learner workflow.
- Put answer keys in client-side JavaScript. Rejected because public assets remain readable.
- Infer cognitive error causes from the selected option. Rejected because a wrong answer does not prove why the learner chose it.
