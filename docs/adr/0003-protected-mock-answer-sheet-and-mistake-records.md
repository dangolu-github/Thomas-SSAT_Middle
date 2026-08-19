# ADR 0003: Protected mock answer sheet and mistake records

## Status

Accepted on 2026-08-19.

## Context

Thomas needs dated Reading + Verbal mocks and an automatic mistake log. The selected practice tests are protected third-party materials. The public learner portal uses a static convenience gate and therefore cannot protect question text, answer keys, explanations, local paths, or teacher notes.

## Decision

- Keep each protected test in its authorized private or publisher-hosted source.
- Publish only a Mock Answer Sheet with source label, schedule, Reading 1-40, Verbal 1-60, A-E controls, section timers, and a deliberate final submit button.
- Keep keys and exact source locators in the private Apps Script assignment registry.
- Return no key, correctness, score, protected prompt, or teacher note from the learner submission endpoint.
- Generate Mistake Records only after final submission. Classify section, question family, and wrong/omitted state automatically; leave cognitive cause as `待确认` until a person selects it.
- Let the learner retrieve only their own minimal mistake list by presenting the assignment/save identifiers stored in the same browser. Do not return correct answers or protected question text.
- Publish a Repair Task only after a source-backed similar-practice set exists.

## Consequences

- A learner must have lawful access to the named test outside the public site.
- The static `yang` gate never becomes the security boundary for commercial content.
- Draft autosave remains separate from submission and cannot create a checked mistake.
- The mistake list can guide Sunday review without claiming that an automatic category explains why Thomas made the error.

## Alternatives rejected

- Upload or embed the PDFs in the public repository. Rejected because the gate is not confidential access control and at least one source prohibits redistribution.
- Put answer keys in client-side JavaScript and hide them in the interface. Rejected because public assets remain readable.
- Infer cognitive error causes from the selected option. Rejected because a wrong answer does not prove why the learner chose it.
