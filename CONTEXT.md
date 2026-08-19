# Thomas SSAT Portal Glossary

## Course Truth

The private set of authoritative course records describing current learner evidence, materials, sources, assignments, and next gates.

## Learner Portal

The learner-safe delivery and interaction surface for released SSAT materials. It is not the course truth and does not establish learning evidence.

## Release Unit

One class package containing only the learner resources intentionally grouped for that class, such as a handout, homework, and class summary. Use a date-first route when the date is recorded; use a stable natural-title route with “date not recorded” when release is authorized before date confirmation.

## Learner Resource

An approved learner-facing handout, practice page, mock route, or review page containing no private answers, provenance, teacher notes, or evidence records.

## Matched Teacher Artifact

The private complete teacher version that follows the learner resource in exact order and adds answers, method application, traps, teaching notes, and provenance.

## Publication State

Whether a portal resource is unlisted, listed, released, review-visible, or archived. Publication state does not change learning evidence.

## Submission State

Whether learner work is not-started, draft, submitted, or checked. Autosave is a draft event, not a submission.

## Feedback State

The independent visibility of results, comments, explanations, and review. A checked result does not automatically expose every feedback type.

## Deployment State

Whether portal work is local, committed, pushed, built, or production-verified.

## Learning Evidence State

The private evidence record for created, prepared, assigned, taught, completed, checked, transferred, and mastered events. Portal access alone changes none of these.

## Course Session Slot

One numbered planning container for a possible class. Until date, focus, evidence target, and lifecycle are confirmed, it is not a class plan or teaching record.

## Active Assignment

A learner task with a stable assignment ID, intentional release state, known interaction mode, and confirmed current availability.

## Teacher-Checked Assignment

An assignment that saves drafts and accepts a deliberate final submission without returning correctness. Teacher review and later feedback remain separate states.

## Convenience Access Gate

A learner-facing access-word screen that reduces casual opening but does not make static files confidential. _Avoid_: Password authentication, secure login.

## Self-Study Task

One dated learner action with a stable task ID, exact due time, release state, completion state, and one course-linked purpose. A planned deadline is not proof that the task was completed or checked.

## Reading Booster Task

A Self-Study Task naming an authorized work, exact chapter or public link, due time, and reading focus. Protected text is never copied into the public portal.

## Mock Attempt

A deliberate Reading + Verbal practice submission made from a registered Middle Level source. It records answer choices and section timing but does not return an answer key on the learner surface.

## Mock Answer Sheet

The public-safe interface for a Mock Attempt. It contains section numbers, question numbers, A-E controls, timers, and submit state only; it does not contain protected questions, passages, keys, explanations, or private source paths.

## Mistake Record

A server-side record created only after a deliberate final submission when an answer is wrong or omitted. Drafts and planner checks never create Mistake Records.

## Automatic Category

Deterministic metadata attached to a Mistake Record: Reading or Verbal, Synonym or Analogy when known, and wrong or omitted. It is not a claim about the learner's thinking.

## Confirmed Cause

The controlled reason selected later by Thomas or confirmed by Lucy: `词义未知`, `关系误判`, `证据越界`, `题型判断`, `时间不足`, `粗心`, or `待确认`.

## Repair Task

A separate, source-backed follow-up assigned after a Mistake Record has been reviewed. Automatic logging does not invent or auto-publish similar questions.
