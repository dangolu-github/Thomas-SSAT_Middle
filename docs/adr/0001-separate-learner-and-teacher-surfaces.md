# ADR 0001: Separate learner and teacher surfaces

## Status

Accepted on 2026-08-15; implemented on 2026-08-16.

## Context

The portal may eventually include released learner materials, interactive homework, private teacher versions, response storage, feedback controls, and learner evidence. Static hosting is suitable for learner-safe pages but cannot protect answer keys, teacher notes, responses, identities, or controls.

## Decision

Keep the learner portal and private teacher system as separate surfaces.

- Public or static source contains learner-safe released content only.
- Complete teacher artifacts, answers, controls, responses, and evidence stay outside the public source.
- Matched teacher access uses a Thomas-only, Google-owner-authenticated Apps Script deployment.
- Learner drafts and final submissions use a separate version-pinned anonymous deployment from the same Thomas-only project; that learner version contains no reachable teacher route and returns no answers or correctness.
- Optional capabilities remain `not-configured` until their own private services and verification exist.

## Consequences

- Learner publication and private teacher access remain independently deployable and independently verifiable.
- Interactive features cannot be reported active until their private services exist and pass isolated testing.
- The authenticated teacher workspace may share visual tokens, but never public hosting or public payloads.

## Alternatives rejected

- Copy another learner's backend and replace visible names. Rejected because it would carry learner-specific IDs, data, secrets, state, and SAT assumptions.
- Store teacher files behind an unlinked static route or access word. Rejected because static assets remain retrievable and the protection is not confidential authentication.
