# Lessons Learned: Nexo v1 to v2

**Date:** April 27, 2026  
**Context:** Nexo began with the original [PRD.md](PRD.md), last updated March 31, 2026, and has now been redirected by [PRD_V2.md](PRD_V2.md), last updated April 27, 2026. This document captures what worked, where the product lost focus, and what should change as the code is rebuilt from the v2 product direction.

## Executive Summary

The original design was directionally strong. Nexo correctly identified a real problem: Bitwarden exports can contain duplicate, partial, imported, or conflicting records, and users need a local, privacy-preserving way to clean them safely. The project also made several durable decisions early: offline-first operation, weighted duplicate intelligence, conflict detection, visual divergence cues, and export/script handoff.

The breakdown was not primarily in the matching engine. It was in the review model. The product became better at finding and describing duplicate clusters than at helping a user decide what should survive. The user experience drifted into a delete-first audit tool: repeated full-record reports, item deletion checkboxes, "Select All" destructive actions, and synthetic merged records. That framing forced users to reason about removal rather than preservation, and it increased cognitive load exactly where the product needed to create confidence.

PRD v2 corrects that by making the core workflow keep-first, one-row-one-record, shared-once, difference-led, and merge-in-place.

## 1. What We Did Correctly In The Initial Design And Approach

We correctly chose the domain and safety posture.

- Nexo stayed focused on Bitwarden export cleanup rather than becoming a general password-manager abstraction.
- The offline-first, single-file approach matched the sensitivity of vault data.
- The product treated password conflicts as high-risk and avoided blind auto-selection for those clusters.
- The project preserved a strong privacy posture: no network dependency, no remote services, and no need to upload vault data.

We correctly invested in duplicate intelligence.

- Weighted scoring was a good direction because real vault cleanup is not solved by exact string matching alone.
- Completeness, favorite state, password history, recency, and import-folder bias were sensible heuristics.
- SSO suffix detection and URL-versus-display-name caution were good examples of domain-specific safety rules.
- The engine recognized that some records are stubs while others contain valuable unique data.

We correctly saw that differences matter more than raw records.

- Differential highlighting was the right instinct.
- Merge-candidate detection correctly acknowledged that "duplicate" does not always mean "delete one."
- Conflict detection correctly separated unsafe clusters from straightforward cleanup.

We correctly built useful escape hatches.

- Clean JSON export gave users a migration-oriented workflow.
- CLI deletion script generation recognized that users may want a safer, reviewable operational plan.
- The project documentation repeatedly warned that Bitwarden import does not replace existing records.

## 2. Where We Lost Control Of The User Experience

We lost control when the UI began reflecting the internal deletion model instead of the user's mental model.

The user wants to answer: "Which record should I trust and keep?" The v1 UI repeatedly asked: "Which records should I delete?" That inversion made the most important decision feel destructive, even when the underlying logic was trying to be safe.

Specific points of drift:

- The primary row control became a deletion checkbox instead of a `Keep` decision.
- Cluster actions included `Keep Newest` and `Select All`, but `Select All` meant select all for deletion, creating an easy zero-keep failure mode.
- Exact duplicate clusters displayed full audit reports for each copy, forcing users to reread repeated data.
- The first item in a cluster became a baseline-like row, but it was not a formal, explainable reference row tied to a clear keep recommendation.
- Merge behavior created or updated a synthetic `[ MERGED ]` record and marked originals for deletion, which conflicted with the natural expectation that one original record remains the canonical record.
- The merge preview emphasized the synthesized output more than the user's actual decision: what gets added, what gets replaced, and which original survives.

The product also lost focus by treating "more information visible" as safer. In practice, repeated full-record detail made review harder. Safety comes from clear comparison, explicit warnings, reversible controls, and blocked unsafe states, not from showing every field everywhere.

## 3. What We Should Have Done More Of

We should have done more user-task modeling before implementation.

- Define the main user decision as "choose what survives" before designing controls.
- Write workflow invariants early, such as "every visible row maps to one real record" and "zero kept records blocks export."
- Validate the default scan path on large, realistic clusters before adding secondary features.
- Separate exact duplicates, near duplicates, conflicts, and merge candidates into different decision states instead of showing them through one general card model.

We should have done more comparison-state design.

- Derive `referenceItem`, `sharedFieldSummary`, `rowDiffsByItem`, and `clusterResolutionState` as first-class data before rendering HTML.
- Treat the UI as a ledger of differences rather than a stack of record cards.
- Make recommendation reasons explainable and locked to actual heuristics.

We should have done more fixture-driven validation.

- Build a deterministic vault fixture earlier.
- Include exact duplicates, near duplicates, conflict clusters, merge candidates, SSO suffixes, import-folder cases, cards, identities, secure notes, and unrelated noise from the start.
- Use the fixture to test whether the UI reduces cognitive load, not just whether duplicate detection returns clusters.

We should have done more modularization.

- Extract matching, scoring, merge planning, action planning, and export rendering into independent logic.
- Keep DOM rendering separate from product-state transitions.
- Define an action package schema before adding multiple output paths.

## 4. What We Should Have Done Less Of

We should have done less feature accretion inside the single-page UI.

The single-file approach was good for distribution, but it encouraged implementation coupling. Over time, the same file accumulated parsing, scoring, state management, rendering, merge synthesis, export generation, script generation, theming, and interaction logic. That made it harder to preserve product intent as features were added.

We should have done less delete-oriented language.

- "Items to delete" became too central.
- "Mark for deletion" appeared at the row level.
- "Select All" was too dangerous because the selected state meant deletion.
- Merge copy said originals would be marked for deletion instead of explaining that one kept record would be amended.

We should have done less full-record rendering by default.

- Full reports are useful as expanded secondary details.
- They should not be the default review surface.
- The default should show only what helps the next decision.

We should have done less polishing before validating the decision model.

The Burned Teal visual direction, dark mode, icons, and compact chips were valuable, but visual polish could not compensate for the wrong primary workflow. The product needed a correct review model before more UI refinement.

## 5. What We Should Have Stopped Doing

We should have stopped presenting deletion as the primary user action.

Deletion is an implementation outcome. It should be derived from keep selections, not directly framed as the main review decision.

We should have stopped creating synthetic merged records as the default merge path.

Synthetic merge records break trust because they make it unclear which original identity survives. For vault cleanup, users expect one original record to remain and be amended in place.

We should have stopped repeating identical data across every record row.

Repeated full-record reports make the user perform manual diffing. Nexo's job is to remove that burden.

We should have stopped considering implementation completeness the same as product completeness.

The original PRD marked implementation complete, but the default user experience still had unresolved product questions. A feature being implemented is not the same as the workflow being safe, legible, and low-fatigue.

We should have stopped letting internal model names leak into the product language.

Concepts like "master," "delete set," "synthetic merge," and "score" are useful internally, but the user-facing vocabulary should be about reference records, kept records, differences, additions, replacements, and warnings.

## 6. What We Should Have Started Doing

We should have started with keep-first state.

- Represent every cluster as a set of keep choices.
- Derive deletion from records not kept.
- Detect zero-keep states immediately.
- Block export and script generation while any cluster is unsafe.

We should have started with an explicit comparison model.

- One real reference row per cluster.
- Shared values shown once.
- Non-reference rows showing difference summaries by default.
- Expanded details only when the user requests them.

We should have started with in-place amendment planning.

- Choose exactly one target record.
- Select one or more source records.
- Group proposed changes into additions, replacements, and unchanged values.
- Preselect safe additions.
- Require explicit opt-in for replacements of non-empty values.
- Preserve the target record ID after merge.

We should have started with deterministic validation.

- Generate `test.json` from a fixed seed.
- Keep fixture records isolated in `test` and `test import` folders.
- Use fixture scenarios as acceptance tests for both logic and UX.

We should have started documenting product invariants separately from implementation tasks.

Examples:

- Every visible comparison row must correspond to a real record.
- Recommendation labels must map to actual heuristics.
- Full names and folders must not truncate.
- Export summaries must describe retained, deleted, and amended records.
- No destructive or overwrite action should be silent.

## 7. What We Were Consistently Doing Well

We consistently treated vault data as sensitive.

- Offline-first remained a core principle.
- The app avoided remote dependencies.
- Documentation repeatedly emphasized backups and safe handling.
- Passwords, TOTP secrets, and FIDO2 data were handled carefully in the UI.

We consistently looked for safety hazards.

- Password conflicts were flagged.
- SSO suffixes were recognized as risky.
- Import-folder bias helped avoid keeping imported duplicates over native records.
- The project included warnings around Bitwarden import semantics.

We consistently valued transparency.

- Differential indicators made hidden divergence visible.
- Completeness and metadata cues helped explain why one record might be better than another.
- CLI script generation made operations inspectable instead of opaque.

We consistently maintained a clear product identity.

- Nexo had a defined visual language.
- The product stayed local, focused, and utilitarian.
- The core value proposition remained about reducing vault cleanup risk.

## 8. If We Could Do It All Over From Scratch, What Should We Have Done Differently?

We should have started from the review decision, not the detection engine.

The first prototype should have been a static or fixture-backed comparison ledger showing:

- one reference row
- shared values once
- difference summaries for each other row
- keep controls
- zero-keep warning
- amendment preview for merge candidates

Only after that review model felt right should we have connected the full matching engine.

We should have separated the product into layers earlier.

- `core`: parse, normalize, match, score, diff, recommend
- `review-state`: keep selections, warning states, merge drafts
- `action-plan`: retained records, deleted records, amended records
- `adapters`: cleaned JSON, Bash, PowerShell, future Bitwarden CLI
- `ui`: browser review workbench

We should have designed merge as an amendment workflow from day one.

The correct merge question is not "What synthetic union record should Nexo create?" It is "Which real record should survive, and which source details should be amended into it?"

We should have created the deterministic validation fixture before polishing the UI.

That fixture would have forced the product to confront scale, false positives, conflict handling, merge replacements, and scan fatigue earlier.

We should have treated the PRD as a living contract with acceptance criteria tied to observed user behavior.

The original PRD had strong feature goals, but it did not sufficiently lock down the review experience. PRD v2 is stronger because it defines behavior, language, safety states, and acceptance criteria that can be tested directly.

## Recommendations

### 1. Adopt PRD v2 As The Rewrite Contract

Do not treat PRD v2 as an enhancement list. Treat it as a correction to the core product model. Any implementation that keeps deletion-first review, repeated full-record default rendering, or synthetic merged records as the primary merge behavior should be considered out of scope.

### 2. Build The State Model Before Rebuilding The UI

Implement the comparison-state layer first:

- `referenceItem`
- `sharedFieldSummary`
- `sharedFieldDetails`
- `rowDiffsByItem`
- `diffCountByItem`
- `secondaryDetailsByItem`
- `shortRecordId`
- `recommendedReason`
- `recommendedSecondaryReasons`
- `keepStateByItem`
- `clusterResolutionState`

The UI should render this model. It should not rediscover comparison logic while building DOM.

### 3. Make Keep-First The Only Primary Review Model

Use `Keep` as the row control. Derive deletion state internally. Remove or redesign any action that can accidentally produce zero kept records without an immediate warning.

### 4. Replace Synthetic Merge With In-Place Amendment

Merge should preserve one original target record and amend it. The preview must separate additions from replacements, and replacements must require explicit opt-in.

### 5. Use The Deterministic Fixture As A Gate

The generated `test.json` fixture should become the standard validation input. A change should not be considered complete unless it works against the required scenario families and supports manual review of exact duplicates, near duplicates, conflicts, merge candidates, and zero-keep warnings.

### 6. Split Core Logic From Rendering

Even if the distributed artifact remains a single HTML file, the development structure should separate pure logic from UI rendering. This will make future browser, CLI-assisted, or TUI workflows possible without rewriting the intelligence engine.

### 7. Lock User-Facing Vocabulary

Use concise, objective language:

- `Keep`
- `Reference`
- `Recommended · [reason]`
- `Review Amendments`
- `Apply to Kept Record`
- `Additions`
- `Replacements`
- `Unchanged`

Avoid language that implies unsafe automation or unexplained ranking, such as `Best`, `Auto-selected`, `Score`, or `Delete the others`.

### 8. Add UX Regression Checks To The Definition Of Done

For every major change, verify:

- Can the user resolve a cluster without rereading identical data?
- Does every visible row map to a real record?
- Is it obvious which record survives?
- Are overwrite risks explicit?
- Is export blocked when no record is kept?
- Does the default view fit the intended 13-inch laptop review surface?

### 9. Preserve What Worked

Keep the offline-first posture, security warnings, weighted heuristics, conflict detection, import-folder awareness, and visual identity. The rewrite should not discard the successful foundation; it should redirect that foundation through a safer and clearer review model.

