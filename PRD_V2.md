# Product Requirements Document: Nexo v2

**Version:** 2.1  
**Last Updated:** April 27, 2026  
**Status:** Proposed  
**Working Directory:** `/Users/me/CODE/gh-me/Nexo/`

## 1. Executive Summary

Nexo v2 is a redesign of the duplicate-review experience for Bitwarden exports. The current application successfully identifies duplicate clusters, flags conflicts, and supports merge workflows, but the review surface still asks the user to reread repeated record details and think in delete-first terms. That creates unnecessary decision fatigue and raises the risk of accidental destructive actions.

Nexo v2 replaces the current repeated full-record audit stack with a keep-first comparison ledger where every visible row maps to a real record. One row is identified as the reference and recommended keep, shared values are shown once, and the remaining rows emphasize only their differences. The merge workflow is also redesigned so one original record stays in place while selected details from other records are reviewed and merged into it through an explicit amendment preview.

## 2. Why v2 Is Needed

### 2.1 Current Pain Points
- The current rendered cluster view shows repeated full-record audits for identical or near-identical records.
- Users have to compare shared values in their heads rather than seeing shared values once and differences where they occur.
- The current destructive review model is delete-first, which increases cognitive load compared with choosing what to keep.
- A standalone summary or audit area risks being mistaken for a separate record if it is not visibly tied to a real row.
- The current merge flow synthesizes a new `[ MERGED ]` record and marks originals for deletion, which breaks the user expectation that one of the original records should remain the kept record.
- The current merge preview does not separate additions from replacements strongly enough to minimize accidental overwrites.

### 2.2 Product Opportunity
- Reduce review time by minimizing rereading.
- Lower decision fatigue by switching to keep-first resolution.
- Increase trust by making one real record survive merge operations.
- Improve safety by clearly distinguishing suggested actions, warning states, and destructive outcomes before export.

## 3. Product Goals

### 3.1 Primary Goals
- **Keep-first review:** Ask the user which record to keep instead of which records to delete.
- **One-row-one-record clarity:** Ensure every visible comparison row maps to a real record.
- **Shared-once comparison:** Show values identical across the cluster once in the reference row.
- **Difference-led scanning:** Show only the differences for non-reference rows by default.
- **Safe in-place merge:** Amend one original record in place instead of creating a synthetic merged replacement.
- **Low-fatigue decision support:** Use concise recommendation badges grounded in actual heuristics.
- **Accident prevention:** Warn and block export when a cluster is left with zero records selected to keep.

### 3.2 Secondary Goals
- Preserve the current offline-first local workflow.
- Keep the Burned Teal visual language unless a functional safety need requires deviation.
- Reuse as much of the current detection and export pipeline as is practical.

### 3.3 Non-Goals
- Replacing the underlying duplicate-detection strategy.
- Converting Nexo into a cloud-backed or multi-user product.
- Reworking Bitwarden export semantics beyond what is needed for safe in-place amendment and export.

## 4. Core UX Principles

- **Keep first, delete second.** The UI should frame resolution around what survives.
- **One row equals one record.** No summary block should look like an independent record.
- **Shared once, differences many.** Users should not reread identical data across every row.
- **Collapsed by default, informative at a glance.** The default row must still expose the information needed to make progress.
- **No truncation for name or folder.** Wrapping is allowed; clipping and ellipsis are not.
- **Explicit overwrite review.** Replacements of non-empty values require deliberate opt-in.
- **Safety over automation.** Recommendations may guide, but they must not silently commit destructive or overwrite actions.

## 5. User Scenarios

### 5.1 Resolve an Exact Duplicate Cluster
A user uploads a Bitwarden export, opens a cluster of identical credentials, sees one reference row labeled as the recommended keep, confirms that the remaining rows show no meaningful differences, and resolves the cluster without reading repeated full reports.

### 5.2 Resolve a Near-Duplicate Cluster
A user opens a cluster where one record differs by URI and notes, sees those differences summarized immediately, expands only the row that needs inspection, and decides which record to keep.

### 5.3 Resolve a Merge Candidate Cluster
A user identifies a cluster with complementary data, selects one kept record as the target to amend, selects one or more source records, reviews additions and replacements, approves only the safe changes, and commits the merge while preserving the original target record.

### 5.4 Recover from an Unsafe State
A user accidentally leaves a cluster with zero records marked to keep. The cluster displays a warning, and export or CLI script generation is blocked until the cluster is resolved.

## 6. Information Architecture

### 6.1 Cluster Structure
Each cluster should include:
- Cluster header with title, cluster-level tags, and cluster actions.
- One reference row that is also a real record row.
- Zero or more non-reference rows.
- A cluster-level warning strip when the cluster is unresolved or unsafe.
- Merge review entry point when the cluster contains amendable complementary details.

### 6.2 Row Structure
Each collapsed row must show:
- Keep control labeled `Keep`
- Full record name
- Full folder name
- Created date
- Last edited date
- Short record ID token
- Recommendation or reference state when applicable
- Difference summary
- Expand affordance
- Merge-source affordance when applicable

### 6.3 ID Presentation
The default collapsed view must show the record ID in a shortened token format:
- first 3 characters
- ellipsis
- last 4 characters

Example: `52e…aa09`

The full ID must be available on reveal in expanded details or a stable disclosure affordance.

## 7. Recommendation System

### 7.1 Reference Row Labeling
The reference row must use:
- a small static label: `Reference`
- a separate recommendation badge: `Recommended · [reason]`

The row control itself must use the label `Keep`.

### 7.2 Locked Recommendation Reasons
Recommendation reasons must map to actual selection heuristics already present in the app. The visible vocabulary is locked to:
- `◆ More Complete`
- `★ User-Starred`
- `↺ Has history`
- `↑ Newest edit`
- `⌂ Not imported from external sources`

### 7.3 Recommendation Display Rules
- Show one primary human-readable recommendation reason only.
- Optionally show at most one secondary glyph-only chip if it materially explains a tie-break.
- Do not display recommendation reasons that are not grounded in actual selection logic.
- Do not use `Contains more data` or `Better metadata` as visible recommendation reasons.
- Do not use wording such as `Best`, `Strongest`, `Auto-selected`, `Score`, or `Delete the others` in the badge area.

### 7.4 Default Recommendation Behavior
- Exact-100 and 75%+ non-conflict clusters may preselect one recommended keep.
- Review-needed and conflict clusters must remain unresolved until the user makes an explicit choice.
- Recommendation never replaces the need for visible safety warnings and reversible user control.

## 8. Review Surface Requirements

### 8.1 Comparison Model
Nexo v2 must replace the current repeated full-report stack with a keep-first reference-row plus difference-ledger model.

The comparison-state layer should derive:
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

### 8.2 Shared Values
The reference row must show a compact shared summary by default and expandable shared details on demand.

Shared values should appear once in the cluster and should not be repeated in every row unless the user explicitly expands secondary detail.

### 8.3 Difference Summaries
Collapsed difference rows should summarize changes using language like:
- `No differences`
- `1 difference: Folder`
- `2 differences: URI, Notes`

The default scan path should allow the user to identify which rows require attention without expanding every row.

### 8.4 Expanded Secondary Details
Expanded secondary detail may include:
- long URIs
- notes
- custom field details
- password-history details
- full record ID
- field-level provenance when relevant to merge review

## 9. Keep-First Resolution Model

### 9.1 User-Facing Model
The UI should ask the user what to keep.

The app may continue to derive an internal deletion set for export and script generation, but that internal model should not dictate the language of the review surface.

### 9.2 Cluster Safety State
Each cluster should be classifiable as:
- `resolved`
- `warning-zero-keep`
- `safe-multi-keep`
- `merge-review-needed`

### 9.3 Zero-Keep Warning
When a cluster has zero kept records, the UI must show the following warning copy:

`No record selected to keep. All records in this cluster are currently queued for deletion. Select at least one record to keep.`

This warning must be highly visible and must block export-related actions until the cluster is resolved.

## 10. Merge Model v2: In-Place Amendment

### 10.1 Problem with the Current Merge Model
The current merge flow creates a synthetic `[ MERGED ]` record, updates or inserts it, and marks originals for deletion. This is misaligned with the desired product behavior because the user expects one original record to survive and be amended.

### 10.2 New Merge Outcome
Each merge operation must:
- preserve one original target record in place
- amend that target with selected details from source records
- keep the target’s original identity
- queue selected source records for deletion only after the user commits reviewed changes

### 10.3 Target Selection
- Exactly one target record may be amended per merge operation.
- The default target should be the current reference or recommended keep.
- The user must be able to change the target before committing.

### 10.4 Source Selection
- The user may choose one or more source records whose unique details will be merged into the target.
- A record selected as the target cannot also be a source.

## 11. Merge Review Requirements

### 11.1 Preview Structure
Before committing, the merge review must group field changes into:
- `Additions`
- `Replacements`
- `Unchanged`

For every proposed change, the preview must show:
- current target value
- proposed value
- source record
- change type

### 11.2 Preselection Rules
- Additions are preselected by default.
- Replacements of non-empty values require explicit opt-in.
- Nothing should silently overwrite a non-empty target value.

### 11.3 Merge Action Wording
The merge entry action label shall be `Review Amendments`.

The merge commit action label inside the preview shall be `Apply to Kept Record`.

Supporting helper copy may use `Merge Into Kept Record` where a noun phrase is clearer than a button label, but the primary action labels above are the locked defaults for implementation and QA.

The wording must make it obvious that an existing record will be updated in place and that the user is reviewing proposed changes before commit.

## 12. Data and Export Behavior

### 12.1 Internal Model
The app may preserve its current delete-oriented export pipeline internally if that reduces implementation risk, but it must derive deletion state from keep selections and amended-target updates rather than presenting delete-first controls in the main review UI.

### 12.2 Post-Merge Data Updates
After a merge commit:
- `originalData.items` should reflect the amended original record
- the UI-safe `items` representation should mirror the amended original record
- the target record should not be represented as a synthetic `[ MERGED ]` item
- source records selected for merge may be queued for deletion

### 12.3 CLI and Export Summaries
CLI script generation and cleaned export summaries must describe:
- records queued for deletion
- records retained
- records amended in place

They should no longer rely on synthetic merge-record semantics.

## 13. Validation Dataset Strategy

### 13.1 Test Fixture Purpose
Nexo v2 shall include a deterministic Bitwarden-style validation fixture named `test.json` so UI review, merge behavior, export flow, and performance smoke tests can be run against a repeatable dataset rather than a single personal vault snapshot.

### 13.2 Isolation Rule
All synthetic validation records must remain isolated under a test-only namespace.

The primary folder shall be `test`.

Because the current recommendation and ranking logic includes an import-source heuristic, the fixture may also use a second isolated test-only folder named `test import` to exercise that branch without mixing validation data into non-test folders.

### 13.3 Required Scenario Families
The validation fixture must cover at least these scenario families:
- exact duplicate clusters
- exact-credential clusters with differing metadata that drive recommendation reasons
- near-duplicate clusters
- password-conflict clusters
- merge-candidate clusters with additive and replacement changes
- SSO-suffix clusters
- URL-versus-display-name divergence clusters
- card duplicate clusters
- identity duplicate clusters
- secure-note name-only duplicate clusters
- unrelated noise records for performance and false-positive smoke testing

### 13.4 Scale Target
The generated fixture must:
- contain at least 4,000 items
- be reproducible from a fixed seed
- emit a summary of scenario counts when generated
- remain valid Bitwarden-style JSON that can be loaded by both Nexo and a Bitwarden import flow

### 13.5 Validation Usage
The fixture must support:
- manual UI review of keep-first cluster resolution
- zero-keep warning validation
- merge preview validation for additions and replacements
- cleaned export validation
- CLI script generation validation
- performance smoke testing on a large vault-shaped input

## 14. Functional Requirements

### 14.1 Matching and Ranking
- **FR-1.1:** The app shall continue ranking records using completeness, favorite state, password history, recency, and import-folder bias.
- **FR-1.2:** The app shall expose recommendation reasons only from the locked visible vocabulary.
- **FR-1.3:** The displayed recommendation reason shall match the heuristic that actually selected the reference row.

### 14.2 Review Surface
- **FR-2.1:** The app shall render one real reference row and zero or more real non-reference rows per cluster.
- **FR-2.2:** The app shall show shared values once in the reference row.
- **FR-2.3:** The app shall show differences only for non-reference rows by default.
- **FR-2.4:** The app shall keep rows collapsed by default.
- **FR-2.5:** The app shall show full names and folders without truncation in the default state.
- **FR-2.6:** The app shall show the short ID token in the default state and the full ID on reveal.

### 14.3 Keep-First Resolution
- **FR-3.1:** The row control label shall be `Keep`.
- **FR-3.2:** The app shall detect and warn on zero-kept clusters.
- **FR-3.3:** Export and CLI actions shall be blocked while any cluster remains in a zero-keep warning state.

### 14.4 Merge Review and Commit
- **FR-4.1:** The app shall allow exactly one target record per merge operation.
- **FR-4.2:** The app shall allow one or more source records.
- **FR-4.3:** The merge preview shall separate additions, replacements, and unchanged values.
- **FR-4.4:** Additions shall be preselected by default.
- **FR-4.5:** Replacements of non-empty values shall require explicit opt-in.
- **FR-4.6:** Merge commit shall amend one original record in place.
- **FR-4.7:** Merge commit shall not create a synthetic `[ MERGED ]` record as the default merge outcome.

### 14.5 Documentation and Guidance
- **FR-5.1:** The repo shall include a new `PRD_V2.md` documenting the v2 direction.
- **FR-5.2:** The repo shall include workspace-level Copilot guidance reflecting the keep-first and in-place merge rules.

### 14.6 Validation Data
- **FR-6.1:** The repo shall include a deterministic generator that produces `test.json`.
- **FR-6.2:** `test.json` shall isolate validation records to the `test` namespace, including `test import` only where needed to exercise import-source logic.
- **FR-6.3:** The generated fixture shall include the required scenario families and at least 4,000 items.

## 15. Non-Functional Requirements

- The primary review surface must remain legible on a 13-inch MacBook Air.
- The default review path must minimize vertical scrolling per cluster.
- The app must remain offline-first.
- Destructive and overwrite states must be visually explicit.
- Recommendation language must remain concise and objective.

## 16. Acceptance Criteria

### 16.1 Success-Criteria Definitions
- **Resolved cluster:** A cluster with at least one record selected to keep and no blocking zero-keep warning.
- **Zero-keep warning state:** A cluster state where no records are selected to keep.
- **In-place amendment:** A merge outcome where the chosen target retains its original record ID after commit.
- **Test namespace:** Validation folders limited to `test` and `test import` so synthetic data remains easy to isolate and clean up.

### 16.2 Acceptance Criteria
- **AC-1:** Using `test.json`, the redesigned cluster view shall no longer show repeated full-record audit stacks in the default scan path.
- **AC-2:** Every visible comparison row in the default cluster view shall correspond to an actual record from the loaded vault.
- **AC-3:** The reference row shall be visibly labeled as a real record and shall not appear to be a standalone summary block.
- **AC-4:** Full names and folder labels shall never truncate in the collapsed/default state; wrapping is acceptable.
- **AC-5:** The collapsed/default row shall always show created date, last edited date, short record ID, keep state, and a diff summary.
- **AC-6:** The short record ID shall use the agreed format of first 3 characters, ellipsis, and last 4 characters.
- **AC-7:** The displayed recommendation badge reason shall match the actual reference-selection heuristic and show no more than one secondary glyph-only chip.
- **AC-8:** Any cluster in a zero-keep warning state shall immediately display the warning copy and block export-related actions until resolved.
- **AC-9:** On the `test.json` fixture, a user shall be able to identify the recommended keep, scan shared values once, inspect one diff row, reveal a full ID, and resolve the cluster without opening every row.
- **AC-10:** In a merge-candidate cluster, a user shall be able to choose one target record, choose one or more source records, review additions and replacements separately, and confirm that replacements are not preselected.
- **AC-11:** After merge commit, the chosen target record shall retain its original ID and shall be amended in place rather than replaced by a synthetic `[ MERGED ]` record.
- **AC-12:** CLI script generation and cleaned export summaries shall describe retained, deleted, and amended-in-place records without relying on synthetic merge-record semantics.
- **AC-13:** The deterministic generator shall produce a valid `test.json` fixture with at least 4,000 items and the required scenario families, and Nexo shall load it without JSON validation errors.
- **AC-14:** `PRD_V2.md` shall reflect the implemented keep-first review model, locked reason vocabulary, zero-keep warning behavior, validation-dataset strategy, and in-place merge flow.

## 17. Lessons Learned

- Repeated full-record reports increase rereading and reduce comparison speed.
- Delete-first framing creates more cognitive friction than keep-first framing.
- A summary block that does not clearly map to a real record can be misread as an extra record.
- Recommendation badges need short, objective labels tied to real heuristics.
- Synthetic merged records violate the user expectation that an original record survives.
- Merge previews must distinguish additions from replacements to avoid accidental overwrites.
- Safety warnings need to operate at the cluster level, not only at export time.

## 18. Migration Notes from v1.2

Nexo v2 supersedes the following assumptions in the current product direction:
- repeated side-by-side or stacked audit reporting as the default review path
- delete-first review framing
- synthetic `[ MERGED ]` record creation as the primary merge outcome

These changes are required to reduce decision fatigue, improve user trust, and align the product with how users actually think about preserving one canonical record.

## 19. Legal Notes

- Bitwarden® is a registered trademark of Bitwarden Inc.
- Nexo is an independent project and is not affiliated with, endorsed by, or sponsored by Bitwarden Inc.
