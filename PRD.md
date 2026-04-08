# Product Requirements Document: Nexo

**Version:** 1.2  
**Last Updated:** March 31, 2026  
**Status:** Implementation Complete  
**Working Directory:** `/Users/me/CODE/gh-me/bw-dupefinder/`

## 1. Executive Summary

Nexo is a security-focused, offline-first application for cleaning Bitwarden exports. Beyond simple duplicate finding, it uses a weighted scoring engine to identify record stubs, detect password conflicts, and synthesize complementary records into unified entries.

## 2. Goals & Objectives

### Primary Goals
- **Weighted Intelligence**: Move beyond exact matches to understand "Stubs" vs. "Master" records.
- **Data Synthesis**: Offer automated "Review & Merge" for complementary data (TOTP, Notes, URIs).
- **Conflict Awareness**: Prevent accidental data loss by flagging password mismatches.
- **Brand Identity**: Implement the "Burned Teal" professional palette.

### Value Proposition
The tool reduces 10,000+ records into actionable clusters, providing visual proof of divergence (≠) and one-click synthesis, ensuring users can clean their vaults with surgical precision.

## 3. Functional Requirements

### 3.1 Nexo Matching Engine
- **FR-1.1: Weighted Scoring.** Rank items by completeness, favorite status, and revision history.
- **FR-1.2: Identity Matching.** Group items by primary keys (Username/URI, Card Number, Email) while ignoring transient metadata like SSO suffixes.
- **FR-1.3: Conflict Detection.** Flag items with identical identities but different passwords as "Conflicts" (disabling auto-selection).
- **FR-1.4: Stub Detection.** Automatically mark records for deletion if they are true subsets of a more complete record.

### 3.2 Synthesis & Merging
- **FR-2.1: Review & Merge.** Detect "Complementary" records (e.g., one has TOTP, other has Notes) and offer a synthesis workflow.
- **FR-2.2: Union Logic.** Create a new record containing the union of all URIs, appended notes, and preserved security factors.
- **FR-2.3: Folder Targeting.** Place synthesized records into a specialized `[ MERGED ]` vault folder.

### 3.3 Precision UI
- **FR-3.1: Differential Highlighting.** Use wavy underlines and bolding to pinpoint exactly which field values differ in a cluster.
- **FR-3.2: Burned Teal Palette.** High-contrast, brand-aligned theme (#233F4C Anchor).
- **FR-3.3: Action Persistence.** Sticky status bar and "Back to Top" for large-scale vault navigation.
- **FR-3.4: Triage Queue.** Present clusters as a compact review queue grouped by urgency (`Needs Review`, `Merge Candidates`, `Conflicts`, `All`).
- **FR-3.5: List-Detail Review.** Show one selected cluster in a focused comparison panel while keeping the full queue visible.
- **FR-3.6: Progressive Disclosure.** Keep secondary detail, merge previews, and destructive controls behind deliberate disclosure rather than showing every field for every cluster at once.

## 4. Technical Architecture

### 4.1 Scoring Weights
- **Favorite Status**: +10 pts
- **Password History**: +5 pts
- **Completeness**: +1 pt per metadata field
- **Recency**: Tie-breaker (Newest revision wins)
- **Folder Priority**: Native folders (+20 pts) vs. Import folders.

## 5. Proposed Review Flow 2.0

### 5.1 Primary Layout
- Sticky summary bar with counts for vault items, clusters, deletions, and merge opportunities.
- Triage tabs directly beneath the summary bar to reduce the visible problem space.
- Two-pane review surface:
  - Left pane: compact cluster list with badges, urgency, and suggested action.
  - Right pane: focused detail panel for the currently selected cluster.

### 5.2 Cluster List Behavior
- Default sorting should prioritize:
  1. password conflicts
  2. merge candidates
  3. uncertain clusters
  4. safe deletion candidates
- Each row should summarize:
  - cluster title
  - record count
  - confidence or issue type
  - suggested action
  - whether records are already selected for deletion or merge

### 5.3 Detail Panel Behavior
- Show side-by-side records for the active cluster only.
- Highlight only differing fields by default.
- Collapse low-signal details until requested.
- Keep actions (`Keep Newest`, `Mark for Deletion`, `Review & Merge`) fixed near the detail header.

### 5.4 Mobile Adaptation
- Convert the two-pane layout into a queue view plus drill-in detail view.
- Preserve the selected-cluster context when returning from the detail screen.
- Keep primary actions visible without forcing the user to scroll back through the entire queue.

## 6. Acceptance Criteria (v1.2)

✅ Weighted scoring engine implemented.  
✅ Field-level divergence (≠) UI implemented.  
✅ Review & Merge synthesis modal implemented.  
✅ Burned Teal branding integrated.  
✅ Terminal-safe export script provided.  

## 7. Legal Notes

- Bitwarden® is a registered trademark of Bitwarden Inc.
- Nexo is an independent project and is not affiliated with, endorsed by, or sponsored by Bitwarden Inc.
